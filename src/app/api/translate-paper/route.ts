
import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    });
    try {
        const { sections, targetLanguage } = await req.json();

        if (!sections || !targetLanguage) {
            return NextResponse.json({ error: 'Sections and target language are required' }, { status: 400 });
        }

        const prompt = `
      You are an expert translator specializing in educational content and exam papers.
      Translate the following question paper sections into ${targetLanguage}.
      
      CRITICAL REQUIREMENTS:
      1. DO NOT change the meaning, marks, or structure of the questions.
      2. Translate everything: question text, options (for MCQs), and match pairs (for match-following).
      3. Maintain the same JSON structure as provided.
      4. Ensure technical terms are translated accurately or kept in English if that's more common in ${targetLanguage} education contexts.
      5. Return ONLY a JSON array of the translated sections. No markdown, no commentary.

      Input Sections (JSON):
      ${JSON.stringify(sections)}
    `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a translation engine that strictly outputs JSON. You translate question paper data structures while preserving their schema.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.2,
            response_format: { type: 'json_object' },
        });

        const content = chatCompletion.choices[0]?.message?.content || '{}';

        // The response might be wrapped in an object depending on model behavior, 
        // but we expect the array or an object containing the array.
        let responseData = JSON.parse(content);

        // Handle cases where model wraps the array in a key like "sections"
        const translatedSections = Array.isArray(responseData) ? responseData : (responseData.sections || responseData.data || []);

        if (!Array.isArray(translatedSections) || translatedSections.length === 0) {
            throw new Error('Invalid translation output structure');
        }

        return NextResponse.json({ sections: translatedSections });
    } catch (error) {
        console.error('Error in AI Translation:', error);
        return NextResponse.json({ error: 'Failed to translate paper content' }, { status: 500 });
    }
}
