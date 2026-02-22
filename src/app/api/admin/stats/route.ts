import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-helpers";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !isAdmin((session.user as any)?.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get total customers
        const totalCustomers = await prisma.user.count();

        // Get active subscriptions (MONTHLY or ANNUAL with valid expiresAt)
        const now = new Date();
        const activeSubscriptions = await prisma.user.count({
            where: {
                plan: {
                    in: ["MONTHLY", "ANNUAL", "ENTERPRISE"]
                },
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: now } }
                ]
            }
        });

        // Get total papers created
        const totalPapers = await prisma.savedPaper.count();

        // Get AI papers generated (sum of aiFullPaperUsage across all users)
        const aiStats = await prisma.user.aggregate({
            _sum: {
                aiFullPaperUsage: true
            }
        });
        const aiPapersGenerated = aiStats._sum.aiFullPaperUsage || 0;

        return NextResponse.json({
            totalCustomers,
            activeSubscriptions,
            totalPapers,
            aiPapersGenerated
        });
    } catch (error) {
        console.error("Stats fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
