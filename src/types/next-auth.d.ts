import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            plan: string;
            // Usage
            manualPaperCount: number;
            aiFullPaperUsage: number;
            aiQuestionUsage: number;
            // Extra Credits
            extraAiFullPapers: number;
            extraAiQuestions: number;
            extraExports: number;
            // Plan Details
            planVariant?: string | null;
            billingCycleStart?: Date | string | null;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        plan: string;
        // Usage
        manualPaperCount: number;
        aiFullPaperUsage: number;
        aiQuestionUsage: number;
        // Extra Credits
        extraAiFullPapers: number;
        extraAiQuestions: number;
        extraExports: number;
        // Plan Details
        planVariant?: string | null;
        billingCycleStart?: Date | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        plan: string;
        // Usage
        manualPaperCount: number;
        aiFullPaperUsage: number;
        aiQuestionUsage: number;
        // Extra Credits
        extraAiFullPapers: number;
        extraAiQuestions: number;
        extraExports: number;
        // Plan Details
        planVariant?: string | null;
        billingCycleStart?: Date | string | null;
    }
}
