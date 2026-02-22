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

        const offers = await prisma.offer.findMany({
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ offers });
    } catch (error) {
        console.error("Offers fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !isAdmin((session.user as any)?.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { code, description, discountType, discountValue, maxUses, validUntil, applicablePlans } = body;

        // Check if code already exists
        const existing = await prisma.offer.findUnique({
            where: { code }
        });

        if (existing) {
            return NextResponse.json({ error: "Offer code already exists" }, { status: 400 });
        }

        const offer = await prisma.offer.create({
            data: {
                code,
                description,
                discountType,
                discountValue: parseFloat(discountValue),
                maxUses: maxUses ? parseInt(maxUses) : null,
                validUntil: validUntil ? new Date(validUntil) : null,
                applicablePlans
            }
        });

        return NextResponse.json({ offer }, { status: 201 });
    } catch (error) {
        console.error("Offer create error:", error);
        return NextResponse.json({ error: "Failed to create offer" }, { status: 500 });
    }
}
