import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-helpers";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !isAdmin((session.user as any)?.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const customer = await prisma.user.findUnique({
            where: { id: params.id },
            include: {
                papers: {
                    orderBy: { createdAt: "desc" },
                    take: 10,
                    select: {
                        id: true,
                        examName: true,
                        subject: true,
                        class: true,
                        createdAt: true
                    }
                },
                _count: {
                    select: {
                        papers: true
                    }
                }
            }
        });

        if (!customer) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }

        return NextResponse.json({ customer });
    } catch (error) {
        console.error("Customer fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !isAdmin((session.user as any)?.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            plan,
            planVariant,
            expiresAt,
            notes,
            extraAiFullPapers,
            extraAiQuestions,
            extraExports,
            resetUsage
        } = body;

        // Handle usage reset
        if (resetUsage) {
            const customer = await prisma.user.update({
                where: { id: params.id },
                data: {
                    manualPaperCount: 0,
                    aiFullPaperUsage: 0,
                    aiQuestionUsage: 0
                }
            });

            await prisma.auditLog.create({
                data: {
                    adminEmail: (session.user as any)?.email || "unknown",
                    action: "RESET_CUSTOMER_USAGE",
                    targetId: params.id,
                    details: "Reset all usage counters to 0",
                    timestamp: new Date()
                }
            });

            return NextResponse.json({ customer });
        }

        // Build update data
        const updateData: any = {};

        if (plan !== undefined) updateData.plan = plan;
        if (planVariant !== undefined) updateData.planVariant = planVariant || null;
        if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
        if (notes !== undefined) updateData.notes = notes || null;
        if (extraAiFullPapers !== undefined) updateData.extraAiFullPapers = extraAiFullPapers;
        if (extraAiQuestions !== undefined) updateData.extraAiQuestions = extraAiQuestions;
        if (extraExports !== undefined) updateData.extraExports = extraExports;

        const customer = await prisma.user.update({
            where: { id: params.id },
            data: updateData
        });

        // Create audit log
        const changes = [];
        if (plan) changes.push(`plan: ${plan}`);
        if (expiresAt !== undefined) changes.push(`expires: ${expiresAt || "never"}`);
        if (extraAiFullPapers !== undefined) changes.push(`extraAiPapers: ${extraAiFullPapers}`);
        if (extraAiQuestions !== undefined) changes.push(`extraAiQuestions: ${extraAiQuestions}`);
        if (extraExports !== undefined) changes.push(`extraExports: ${extraExports}`);
        if (notes !== undefined) changes.push("notes updated");

        await prisma.auditLog.create({
            data: {
                adminEmail: (session.user as any)?.email || "unknown",
                action: "UPDATE_CUSTOMER",
                targetId: params.id,
                details: changes.join(", ") || "Customer updated",
                timestamp: new Date()
            }
        });

        return NextResponse.json({ customer });
    } catch (error) {
        console.error("Customer update error:", error);
        return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !isAdmin((session.user as any)?.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.user.delete({
            where: { id: params.id }
        });

        // Create audit log
        await prisma.auditLog.create({
            data: {
                adminEmail: (session.user as any)?.email || "unknown",
                action: "DELETE_CUSTOMER",
                targetId: params.id,
                details: "Customer deleted",
                timestamp: new Date()
            }
        });

        return NextResponse.json({ message: "Customer deleted" });
    } catch (error) {
        console.error("Customer delete error:", error);
        return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
    }
}
