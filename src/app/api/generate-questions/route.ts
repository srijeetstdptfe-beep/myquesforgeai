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
                    console.log('Attempting to parse PDF with pdf2json:', file.name);
                    try {
                        const PDFParser = (await import('pdf2json')).default;
                        const pdfParser = new (PDFParser as any)(null, 1); // 1 = text only

                        const pdfText = await new Promise<string>((resolve, reject) => {
                            pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
                            pdfParser.on("pdfParser_dataReady", () => {
                                resolve((pdfParser as any).getRawTextContent());
                            });
                            pdfParser.parseBuffer(buffer);
                        });

                        contextText += `\n\nContent from ${file.name}:\n${pdfText}`;
                    } catch (pdfErr: any) {
                        console.error('PDF parsing detail error (pdf2json):', pdfErr);
                        // Fallback to pdf-parse if pdf2json fails
                        try {
                            const pdf = (await import('pdf-parse')).default;
                            const pdfData = await pdf(buffer);
                            contextText += `\n\nContent from ${file.name}:\n${pdfData.text}`;
                        } catch (fallbackErr) {
                            throw new Error(`PDF Parser error (${file.name}): ${pdfErr.message || String(pdfErr)}`);
                        }
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

        // SUPER AGGRESSIVE SCRIPT FILTER: Sentence-level validation
        const sanitizeScript = (text: string) => {
            // Split by lines or double spaces to get meaningful segments
            const segments = text.split(/\r?\n|\s{3,}/);

            return segments.map(segment => {
                // Remove obvious non-whitelist chars first
                const whitelistRegex = /[a-zA-Z0-9\s\u0900-\u097F.,?!:()\[\]\-]/g;
                const matches = segment.match(whitelistRegex) || [];
                const cleaned = matches.join('').trim();

                if (cleaned.length < 5) return ""; // Ignore tiny fragments

                // VALIDATION: Does this segment have actual Hindi or English words?
                // Garbage often looks like lone letters "G M 8 6" or symbols.
                const hasHindi = /[\u0900-\u097F]/.test(cleaned);
                const englishWords = cleaned.match(/[a-zA-Z]{3,}/g) || []; // English words at least 3 chars long
                const numbers = cleaned.match(/[0-9]+/g) || [];

                // If it has Hindi, it's likely part of the real content
                if (hasHindi) return cleaned;

                // If it has multi-character English words, it might be the header/footer/technical terms
                if (englishWords.length > 0) return cleaned;

                // If it's just numbers and lone letters like "8 G M 6", it's garbage
                return "";
            }).filter(s => s.length > 0).join('\n');
        };

        const sanitizedContext = sanitizeScript(contextText);

        console.log('AI Generation Request:', {
            subject,
            classOrCourse,
            difficulty,
            questionCount,
            language,
            originalLength: contextText.length,
            sanitizedLength: sanitizedContext.length
        });

        if (!sanitizedContext || sanitizedContext.trim().length < 50) {
            // If the filter was too aggressive or the PDF is truly unreadable
            return NextResponse.json({
                error: 'The PDF reading failed. Most of the document appears to be symbols or unreadable characters.',
                detail: 'This usually happens with scanned PDFs or non-standard fonts. Try copying the text manually into the "Context Text" box.'
            }, { status: 400 });
        }

        const prompt = `
      You are an expert teacher. Generate ${questionCount} questions for a ${subject} exam.
      Language: ${language}.
      Class: ${classOrCourse}.

      CONTEXT (CLEANED OF GARBAGE):
      """
      ${sanitizedContext.substring(0, 20000)}
      """

      INSTRUCTIONS:
      1. Generate exactly ${questionCount} questions in ${language}.
      2. If language is Hindi, use proper Devanagari script ONLY.
      3. CRITICAL: Your source text has garbage symbols. I have tried to clean them, but some might remain.
      4. DO NOT include any symbols like "@", "*", "+", "$", "#", ">" in your questions.
      5. If a sentence in the context doesn't make sense, IGNORE it. Do not attempt to guess or echo symbols.
      6. Return ONLY a raw JSON array. No markdown code blocks.
    `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are a strict JSON-only AI. 
                    NEVER output symbols like "@", "*", "$", "%" in generated questions. 
                    If you see symbols in the context, they are ENCODING ERRORS. Ignore them completely.
                    Return strictly a JSON array of questions.`,
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.1, // Lower temperature for more consistency
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
            return NextResponse.json({ error: 'Failed to generate valid JSON paper' }, { status: 500 });
        }

        // Diagnostic info for the user
        const debugSample = sanitizedContext.length > 2000 ? sanitizedContext.substring(0, 2000) + '...' : sanitizedContext;

        return NextResponse.json({ questions, debugExtractedText: debugSample });
    } catch (error: any) {
        const message = error.message || String(error);
        console.error('Final generating questions error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
