import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOTP, sendOTPEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        // Validate email
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
        }

        // Rate limiting: Check recent OTPs (max 3 in 15 minutes)
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const recentOTPs = await prisma.emailOTP.count({
            where: {
                email: email.toLowerCase(),
                createdAt: {
                    gte: fifteenMinutesAgo
                }
            }
        });

        if (recentOTPs >= 3) {
            return NextResponse.json(
                { error: "Too many OTP requests. Please wait 15 minutes before trying again." },
                { status: 429 }
            );
        }

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Store OTP in database
        await prisma.emailOTP.create({
            data: {
                email: email.toLowerCase(),
                code: otp,
                expiresAt
            }
        });

        // Send email
        const result = await sendOTPEmail(email, otp);

        if (!result.success) {
            return NextResponse.json(
                { error: "Failed to send OTP email. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "OTP sent successfully",
            expiresIn: 300 // 5 minutes in seconds
        });

    } catch (error) {
        console.error("Send OTP error:", error);
        return NextResponse.json(
            { error: "Failed to send OTP" },
            { status: 500 }
        );
    }
}
