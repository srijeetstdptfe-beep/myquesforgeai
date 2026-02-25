import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    });
    try {
        let contextText = '';
        let subject = '';
        let classOrCourse = '';
        let difficulty = 'medium';
        let questionCount = 10;
        let language = 'english';

        const contentType = req.headers.get('content-type') || '';

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            subject = formData.get('subject') as string || '';
            classOrCourse = formData.get('classOrCourse') as string || '';
            difficulty = formData.get('difficulty') as string || 'medium';
            questionCount = parseInt(formData.get('questionCount') as string) || 10;
            language = formData.get('language') as string || 'english';
            contextText = formData.get('contextText') as string || '';

            const files = formData.getAll('files') as File[];
            for (const file of files) {
                const buffer = Buffer.from(await file.arrayBuffer());
                if (file.type === 'application/pdf') {
                    console.log('Attempting to parse PDF:', file.name);
                    try {
                        const pdf = (await import('pdf-parse')).default;
                        const pdfData = await pdf(buffer);
                        contextText += `\n\nContent from ${file.name}:\n${pdfData.text}`;
                    } catch (pdfErr: any) {
                        console.error('PDF parsing detail error:', pdfErr);
                        throw new Error(`PDF Parser error (${file.name}): ${pdfErr.message || String(pdfErr)}`);
                    }
                } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    console.log('Attempting to parse DOCX:', file.name);
                    try {
                        const mammoth = (await import('mammoth')).default;
                        const docxData = await mammoth.extractRawText({ buffer });
                        contextText += `\n\nContent from ${file.name}:\n${docxData.value}`;
                    } catch (docxErr: any) {
                        console.error('DOCX parsing detail error:', docxErr);
                        throw new Error(`DOCX Parser error (${file.name}): ${docxErr.message || String(docxErr)}`);
                    }
                } else if (file.type === 'text/plain') {
                    contextText += `\n\nContent from ${file.name}:\n${buffer.toString('utf-8')}`;
                }
            }
        } else {
            const body = await req.json();
            contextText = body.contextText || '';
            subject = body.subject || '';
            classOrCourse = body.classOrCourse || '';
            difficulty = body.difficulty || 'medium';
            questionCount = body.questionCount || 10;
            language = body.language || 'english';
        }

        console.log('AI Generation Request:', { subject, classOrCourse, difficulty, questionCount, language, contextLength: contextText.length });

        if (!contextText || contextText.trim().length === 0) {
            return NextResponse.json({ error: 'Context text is required. Please provide text or upload a valid document.' }, { status: 400 });
        }

        // Permissions and Limits removed for Git-based architecture


        const prompt = `
      You are an expert teacher and question paper setter.
      Generate ${questionCount} questions for a ${subject} exam (Class/Course: ${classOrCourse}).
      Difficulty Level: ${difficulty}.
      Language: ${language}.

      Context Material:
      """
      ${contextText.slice(0, 30000)}
      """

      You must generate a valid JSON array of question objects. 
      The JSON schema for a question object is:
      {
        "type": "mcq-single" | "mcq-multiple" | "true-false" | "fill-blanks" | "short-answer" | "long-answer" | "match-following",
        "questionText": "string (the question stem)",
        "marks": number (suggested marks),
        "options": [ { "text": "string", "isCorrect": boolean } ] (ONLY for mcq-single/mcq-multiple),
        "matchPairs": [ { "left": "string", "right": "string" } ] (ONLY for match-following),
        "correctAnswer": "string" (for checking answer, internal use)
      }

      Requirements:
      1. Generate exactly ${questionCount} questions.
      2. Vary the question types suitable for the content (include MCQs, Short Answer, Long Answer).
      3. Questions must be based ONLY on the provided context.
      4. Return ONLY the JSON array. Do not include markdown code blocks like \`\`\`json. Just the raw JSON.
    `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a JSON-only response bot. You must return strictly a JSON array of questions. No other text.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            model: 'llama-3.3-70b-versatile',

            temperature: 0.3,
            stream: false,
        });

        const content = chatCompletion.choices[0]?.message?.content || '[]';
        console.log('Groq Raw Response:', content);

        // Clean up potential markdown code blocks if the model ignores the instruction
        const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();

        let questions = [];
        try {
            questions = JSON.parse(cleanContent);
        } catch (e) {
            console.error('Failed to parse Groq response:', content);
            return NextResponse.json({ error: 'Failed to generate valid JSON' }, { status: 500 });
        }

        return NextResponse.json({ questions });
    } catch (error: any) {
        const message = error.message || String(error);
        console.error('Final generating questions error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
