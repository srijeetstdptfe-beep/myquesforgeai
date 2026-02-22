import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Update offer (admin only)
export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any)?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { isActive } = await req.json();

        const offer = await prisma.offer.update({
            where: { id: params.id },
            data: { isActive }
        });

        // Log to audit
        await prisma.auditLog.create({
            data: {
                adminEmail: session.user.email!,
                action: "UPDATE_OFFER",
                targetId: offer.id,
                details: `${isActive ? "Activated" : "Deactivated"} offer ${offer.code}`
            }
        });

        return NextResponse.json(offer);
    } catch (error) {
        console.error("Update offer error:", error);
        return NextResponse.json({ error: "Failed to update offer" }, { status: 500 });
    }
}
