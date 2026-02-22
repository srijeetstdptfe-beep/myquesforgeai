import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        // Validate email
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
        }

        // Check if email is already subscribed
        const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
            where: { email }
        });

        if (existingSubscriber) {
            if (existingSubscriber.subscribed) {
                return NextResponse.json({ error: "This email is already subscribed to our newsletter" }, { status: 400 });
            } else {
                // Re-subscribe if previously unsubscribed
                await prisma.newsletterSubscriber.update({
                    where: { email },
                    data: { subscribed: true }
                });
                return NextResponse.json({ message: "Successfully resubscribed to newsletter!" }, { status: 200 });
            }
        }

        // Create new subscriber
        await prisma.newsletterSubscriber.create({
            data: {
                email,
                subscribed: true
            }
        });

        return NextResponse.json({ message: "Successfully subscribed to newsletter!" }, { status: 201 });
    } catch (error) {
        console.error("Newsletter subscription error:", error);
        return NextResponse.json({ error: "Failed to subscribe. Please try again later." }, { status: 500 });
    }
}
