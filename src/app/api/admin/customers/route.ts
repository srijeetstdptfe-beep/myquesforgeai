import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-helpers";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !isAdmin((session.user as any)?.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const planFilter = searchParams.get("plan") || "";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (planFilter && planFilter !== "ALL" && planFilter !== "") {
            where.plan = planFilter;
        }

        // Fetch customers
        const [customers, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    plan: true,
                    planVariant: true,
                    expiresAt: true,
                    manualPaperCount: true,
                    aiFullPaperUsage: true,
                    notes: true,
                    createdAt: true,
                    _count: {
                        select: {
                            papers: true
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: { id: "desc" }
            }),
            prisma.user.count({ where })
        ]);

        return NextResponse.json({
            customers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Customers fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
    }
}
