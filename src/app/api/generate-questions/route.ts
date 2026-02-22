
import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canUseAI, getPlanLimits } from "@/lib/pricing";

export async function POST(req: Request) {
    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    });
    try {
        const { contextText, subject, classOrCourse, difficulty, questionCount, language } = await req.json();

        if (!contextText) {
            return NextResponse.json({ error: 'Context text is required' }, { status: 400 });
        }

        // Check Permissions
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email! } });
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // Cast user to any for new fields
        const userForCheck = { ...user, plan: user.plan } as any;

        if (!canUseAI(userForCheck, 'QUESTION')) {
            return NextResponse.json({ error: 'Upgrade plan to use AI generation' }, { status: 403 });
        }

        // Usage & Limits Logic
        const limits = getPlanLimits(user.plan);
        const usage = (user as any).aiQuestionUsage || 0;
        const limit = limits.aiQuestions;

        if (user.plan === 'PAYG') {
            // PAYG: Use extra credits (added manually by admin)
            if ((user as any).extraAiQuestions > 0) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        extraAiQuestions: { decrement: 1 },
                        aiQuestionUsage: { increment: 1 }
                    }
                });
            } else {
                return NextResponse.json({ error: 'No AI credits available. Contact support to purchase more.' }, { status: 403 });
            }
        } else {
            // Subscription / Free Logic
            if (usage < limit) {
                await prisma.user.update({ where: { id: user.id }, data: { aiQuestionUsage: { increment: 1 } } });
            } else if ((user as any).extraAiQuestions > 0) {
                await prisma.user.update({ where: { id: user.id }, data: { extraAiQuestions: { decrement: 1 } } });
            } else {
                return NextResponse.json({ error: 'Limit reached. Upgrade or contact support for top-up.' }, { status: 403 });
            }
        }


        const prompt = `
      You are an expert teacher and question paper setter.
      Generate ${questionCount} questions for a ${subject} exam (Class/Course: ${classOrCourse}).
      Difficulty Level: ${difficulty}.
      Language: ${language}.

      Context Material:
      """
      ${contextText.slice(0, 8000)}
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
    } catch (error) {
        console.error('Error generating questions:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
