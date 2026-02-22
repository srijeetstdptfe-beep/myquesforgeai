import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const logPath = path.join(process.cwd(), "debug_auth.log");
const log = (msg: string) => fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);

export const authOptions: NextAuthOptions = {
    // adapter: PrismaAdapter(prisma),
    debug: true,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                log(`Authorize called with: ${credentials?.email}`);
                if (!credentials?.email || !credentials?.password) {
                    log("Missing credentials");
                    throw new Error("Invalid credentials");
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email }
                    });

                    log(`User lookup result: ${user ? "Found" : "Not Found"}`);

                    if (!user || !user.password) {
                        log("User not found or no password");
                        throw new Error("User not found");
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    log(`Password validation result: ${isPasswordValid}`);

                    // Check if this is an OTP-verified login (password starts with OTP_VERIFIED_)
                    const isOTPLogin = credentials?.password?.startsWith("OTP_VERIFIED_");

                    if (!isOTPLogin) {
                        // Normal password login - verify password
                        const isPasswordValid = await bcrypt.compare(credentials.password, user.password!);

                        if (!isPasswordValid) {
                            log("Password mismatch");
                            throw new Error("Invalid password");
                        }
                    } else {
                        // OTP login - verify the user ID matches
                        const otpUserId = credentials.password.replace("OTP_VERIFIED_", "");
                        if (otpUserId !== user.id) {
                            log("OTP user ID mismatch");
                            throw new Error("Invalid OTP verification");
                        }
                        log("OTP-verified login successful");
                    }


                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: (user as any).role ?? "USER",
                        plan: user.plan,
                        manualPaperCount: (user as any).manualPaperCount ?? 0,
                        aiFullPaperUsage: (user as any).aiFullPaperUsage ?? 0,
                        aiQuestionUsage: (user as any).aiQuestionUsage ?? 0,
                        extraAiFullPapers: (user as any).extraAiFullPapers ?? 0,
                        extraAiQuestions: (user as any).extraAiQuestions ?? 0,
                        extraExports: (user as any).extraExports ?? 0,
                        planVariant: (user as any).planVariant,
                        billingCycleStart: (user as any).billingCycleStart,
                    };
                } catch (error: any) {
                    log(`CRASH in authorize: ${error.message}\n${error.stack}`);
                    console.error("[AUTH DEBUG] Error in authorize:", error);
                    throw error;
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).plan = token.plan;
                (session.user as any).manualPaperCount = token.manualPaperCount;
                (session.user as any).aiFullPaperUsage = token.aiFullPaperUsage;
                (session.user as any).aiQuestionUsage = token.aiQuestionUsage;
                (session.user as any).extraAiFullPapers = token.extraAiFullPapers;
                (session.user as any).extraAiQuestions = token.extraAiQuestions;
                (session.user as any).extraExports = token.extraExports;
                (session.user as any).planVariant = token.planVariant;
                (session.user as any).billingCycleStart = token.billingCycleStart;
            }
            return session;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                log(`JWT Callback: User found, setting token.id and plan. UserID: ${user.id}`);
                token.id = user.id;
                token.role = (user as any).role ?? "USER";
                token.plan = (user as any).plan;
                token.manualPaperCount = (user as any).manualPaperCount;
                token.aiFullPaperUsage = (user as any).aiFullPaperUsage;
                token.aiQuestionUsage = (user as any).aiQuestionUsage;
                token.extraAiFullPapers = (user as any).extraAiFullPapers;
                token.extraAiQuestions = (user as any).extraAiQuestions;
                token.extraExports = (user as any).extraExports;
                token.planVariant = (user as any).planVariant;
                token.billingCycleStart = (user as any).billingCycleStart;
            }
            if (trigger === "update" && session?.plan) {
                log(`JWT Callback: Update triggered with plan: ${session.plan}`);
                token.plan = session.plan;
            }
            return token;
        }
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
