import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { code, plan } = await req.json();

        if (!code || !plan) {
            return NextResponse.json({ error: "Code and plan are required" }, { status: 400 });
        }

        // Find the offer
        const offer = await prisma.offer.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!offer) {
            return NextResponse.json({ error: "Invalid offer code" }, { status: 404 });
        }

        // Check if offer is active
        if (!offer.isActive) {
            return NextResponse.json({ error: "This offer is no longer active" }, { status: 400 });
        }

        // Check expiry
        if (offer.validUntil && new Date() > offer.validUntil) {
            return NextResponse.json({ error: "This offer has expired" }, { status: 400 });
        }

        // Check usage limit
        if (offer.maxUses && offer.currentUses >= offer.maxUses) {
            return NextResponse.json({ error: "This offer has reached its usage limit" }, { status: 400 });
        }

        // Check if plan is applicable
        const applicablePlans = JSON.parse(offer.applicablePlans) as string[];
        if (!applicablePlans.includes(plan.toUpperCase())) {
            return NextResponse.json({
                error: `This offer is not valid for ${plan} plan`
            }, { status: 400 });
        }

        // Calculate discount (percentage only)
        const planPrices: Record<string, number> = {
            MONTHLY: 699,
            ANNUAL: 5999,
        };

        const originalPrice = planPrices[plan.toUpperCase()] || 0;
        if (originalPrice === 0) {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }

        // Check minimum amount
        if (offer.minAmount && originalPrice < offer.minAmount / 100) {
            return NextResponse.json({
                error: `Minimum order value of ₹${offer.minAmount / 100} required`
            }, { status: 400 });
        }

        const discountPercent = offer.discountValue;
        const discountAmount = Math.round((originalPrice * discountPercent) / 100);
        const finalPrice = originalPrice - discountAmount;

        return NextResponse.json({
            valid: true,
            code: offer.code,
            description: offer.description,
            discountPercent,
            discountAmount,
            originalPrice,
            finalPrice
        });

    } catch (error) {
        console.error("Offer validation error:", error);
        return NextResponse.json({ error: "Failed to validate offer" }, { status: 500 });
    }
}
