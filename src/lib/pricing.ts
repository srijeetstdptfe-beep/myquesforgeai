// import { Session } from "next-auth";

interface UserStub {
    id: string;
    email: string;
    name?: string;
    plan: string;
    manualPaperCount: number;
    aiFullPaperUsage: number;
    aiQuestionUsage: number;
    extraAiFullPapers: number;
    extraAiQuestions: number;
    extraExports: number;
}

export const PLAN_LIMITS = {
    FREE: {
        manualPapers: 3,
        aiFullPapers: 0,
        aiQuestions: 0,
        exports: false, // Watermark only or blocked
        canUseAI: false,
    },
    PAYG: {
        manualPapers: 999999, // Unlimited manual
        aiFullPapers: 0, // Pay per use logic (uses extras)
        aiQuestions: 0,
        exports: true, // Pay per use
        canUseAI: true,
    },
    MONTHLY: {
        manualPapers: 999999,
        aiFullPapers: 8,
        aiQuestions: 200,
        exports: true,
        canUseAI: true,
    },
    ANNUAL: {
        manualPapers: 999999,
        aiFullPapers: 100, // per year
        aiQuestions: 3000,
        exports: true,
        canUseAI: true,
    },
    ENTERPRISE: {
        manualPapers: 999999,
        aiFullPapers: 999999, // Custom
        aiQuestions: 999999,
        exports: true,
        canUseAI: true,
    }
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

export function getPlanLimits(plan: string) {
    const normalizedPlan = (plan || "FREE").toUpperCase();
    // Handle UNSET as FREE
    if (normalizedPlan === "UNSET") return PLAN_LIMITS.FREE;
    return PLAN_LIMITS[normalizedPlan as PlanType] || PLAN_LIMITS.FREE;
}

export function canCreateManualPaper(user: UserStub | null) {
    if (!user) return false;
    const limits = getPlanLimits(user.plan);

    if (limits.manualPapers >= 999999) return true;

    // For free plan, check usage
    // We use paperCount or manualPaperCount. 
    // If we rely on manualPaperCount being accurate:
    return user.manualPaperCount < limits.manualPapers;
}

export function getAvailableAICredits(user: UserStub | null, type: 'FULL_PAPER' | 'QUESTION') {
    if (!user) return 0;
    const limits = getPlanLimits(user.plan);

    if (type === 'FULL_PAPER') {
        const planCredits = Math.max(0, limits.aiFullPapers - user.aiFullPaperUsage);
        return planCredits + user.extraAiFullPapers;
    } else {
        const planCredits = Math.max(0, limits.aiQuestions - user.aiQuestionUsage);
        return planCredits + user.extraAiQuestions;
    }
}

export function canUseAI(user: UserStub | null, type: 'FULL_PAPER' | 'QUESTION' = 'FULL_PAPER') {
    if (!user) return false;
    const limits = getPlanLimits(user.plan);
    if (!limits.canUseAI && user.plan !== 'PAYG') return false; // PAYG can always use if they have credits? Or logic handles it?

    // Check available credits
    const available = getAvailableAICredits(user, type);
    return available > 0;
}

export function canExport(user: Session["user"] | null) {
    if (!user) return false;
    const limits = getPlanLimits(user.plan);

    if (limits.exports) return true;

    // If exports are not included (FREE), check if they have extra credits? 
    // User spec: "Export (or watermark only)" for Free. "Export: ₹39" for PAYG.
    // We'll assume extraExports covers PAYG export credits.
    return user.extraExports > 0;
}
