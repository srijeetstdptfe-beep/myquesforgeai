import { NextResponse } from 'next/server';
import { getCollectionData } from '@/lib/content';

export async function POST(req: Request) {
    // In DecapCMS/Git-based architecture, user-generated content (like saving a paper) 
    // is usually handled differently if it needs to persist to Git. 
    // For now, we will return a 501 or a success message if it's just for session-based export.
    return NextResponse.json({ message: "Paper saving is now managed via DecapCMS." }, { status: 501 });
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
        papers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json(papers);
    } catch (error) {
        console.error('Error fetching papers:', error);
        return NextResponse.json({ error: 'Failed to fetch papers' }, { status: 500 });
    }
}
