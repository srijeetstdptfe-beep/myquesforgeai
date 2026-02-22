import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPlanLimits } from "@/lib/pricing";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const limits = getPlanLimits(user.plan);

        // PAYG users need manual credits added by admin
        if (user.plan === 'PAYG') {
            // Check if user has extra export credits
            if ((user as any).extraExports > 0) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { extraExports: { decrement: 1 } } as any
                });
                return NextResponse.json({ allowed: true, deducted: true });
            }
            return NextResponse.json({ error: 'No export credits available. Contact support to purchase more.' }, { status: 403 });
        }

        // Standard Logic (Free/Subscription/Extra)
        // If plan has exports included, no deduction needed
        if (limits.exports) {
            return NextResponse.json({ allowed: true, deducted: false });
        }

        // If plan does not include exports check extras
        if ((user as any).extraExports > 0) {
            await prisma.user.update({
                where: { id: user.id },
                data: { extraExports: { decrement: 1 } } as any
            });
            return NextResponse.json({ allowed: true, deducted: true });
        }

        return NextResponse.json({ error: 'No export credits available' }, { status: 403 });

    } catch (error) {
        console.error('Error tracking export:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
