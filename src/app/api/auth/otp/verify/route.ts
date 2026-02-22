import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signIn } from "next-auth/react";

export async function POST(req: Request) {
    try {
        const { email, code } = await req.json();

        // Validate inputs
        if (!email || !code) {
            return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
        }

        if (code.length !== 6 || !/^\d{6}$/.test(code)) {
            return NextResponse.json({ error: "Invalid OTP format" }, { status: 400 });
        }

        // Find OTP
        const otpRecord = await prisma.emailOTP.findFirst({
            where: {
                email: email.toLowerCase(),
                code: code,
                verified: false
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!otpRecord) {
            return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
        }

        // Check expiration
        if (new Date() > otpRecord.expiresAt) {
            await prisma.emailOTP.delete({ where: { id: otpRecord.id } });
            return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
        }

        // Check attempts
        if (otpRecord.attempts >= 3) {
            await prisma.emailOTP.delete({ where: { id: otpRecord.id } });
            return NextResponse.json(
                { error: "Too many failed attempts. Please request a new OTP." },
                { status: 400 }
            );
        }

        // Mark as verified and delete
        await prisma.emailOTP.update({
            where: { id: otpRecord.id },
            data: { verified: true }
        });

        // Find or create user
        let user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            // Create new user with OTP login
            user = await prisma.user.create({
                data: {
                    email: email.toLowerCase(),
                    name: email.split('@')[0], // Use email prefix as name
                    plan: "UNSET",
                    role: "USER"
                }
            });
        }

        // Delete the used OTP
        await prisma.emailOTP.delete({ where: { id: otpRecord.id } });

        // Return user data for client-side session creation
        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error("Verify OTP error:", error);

        // Increment attempts on error
        const { email, code } = await req.json().catch(() => ({}));
        if (email && code) {
            await prisma.emailOTP.updateMany({
                where: {
                    email: email.toLowerCase(),
                    code: code,
                    verified: false
                },
                data: {
                    attempts: {
                        increment: 1
                    }
                }
            });
        }

        return NextResponse.json(
            { error: "Failed to verify OTP" },
            { status: 500 }
        );
    }
}
