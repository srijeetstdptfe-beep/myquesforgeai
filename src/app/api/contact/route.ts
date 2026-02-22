import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        // Basic validation
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        console.log(`📩 Received contact form submission from ${email}`);

        const result = await sendContactEmail({
            name,
            email,
            subject,
            message,
        });

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: "Message sent successfully",
            });
        } else {
            return NextResponse.json(
                { error: "Failed to send email. Please try again later." },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("❌ API ERROR (contact):", error);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
