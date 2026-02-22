import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    // In the Git-based version, we allow exports without tracking/limits
    return NextResponse.json({ allowed: true, deducted: false });
}
