import { NextResponse } from 'next/server';
import { getCollectionData } from '@/lib/content';
import fs from 'fs';
import path from 'path';

const CONTENT_PATH = path.join(process.cwd(), 'src/content/papers');

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { examName, subject, class: className, data } = body;

        if (!examName || !subject || !className || !data) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Ensure directory exists
        if (!fs.existsSync(CONTENT_PATH)) {
            fs.mkdirSync(CONTENT_PATH, { recursive: true });
        }

        // Generate slug: {{year}}-{{subject}}-{{class}}
        const year = data.metadata?.year || new Date().getFullYear();
        const slug = `${year}-${subject}-${className}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const filePath = path.join(CONTENT_PATH, `${slug}.json`);

        const paperToSave = {
            examName,
            subject,
            class: className,
            year: Number(year),
            language: data.metadata?.language || 'english',
            duration: data.metadata?.duration || '',
            totalMarks: data.metadata?.totalMarks || 0,
            data: data,
            createdAt: new Date().toISOString()
        };

        fs.writeFileSync(filePath, JSON.stringify(paperToSave, null, 2));

        return NextResponse.json({
            success: true,
            message: "Paper saved to local workspace",
            slug
        });
    } catch (error) {
        console.error('Error saving paper:', error);
        return NextResponse.json({ error: 'Failed to save paper' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const subject = searchParams.get('subject');
        const className = searchParams.get('class');

        let papers = getCollectionData<any>('papers');

        if (subject) {
            papers = papers.filter(p => p.subject === subject);
        }
        if (className) {
            papers = papers.filter(p => p.class === className);
        }

        // Sort by createdAt descending
        papers.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });

        return NextResponse.json(papers);
    } catch (error) {
        console.error('Error fetching papers:', error);
        return NextResponse.json({ error: 'Failed to fetch papers' }, { status: 500 });
    }
}
