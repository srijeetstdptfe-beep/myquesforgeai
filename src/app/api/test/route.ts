import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        time: new Date().toISOString(),
        env: {
            NODE_ENV: process.env.NODE_ENV,
            NETLIFY: process.env.NETLIFY || 'none'
        }
    });
}
