export function isAdmin(userRole?: string | null): boolean {
    return userRole === "ADMIN";
}

export function requireAdmin(userRole?: string | null): void {
    if (!isAdmin(userRole)) {
        throw new Error("Unauthorized: Admin access required");
    }
}

export function getActiveSubscriptions(users: Array<{ plan: string; expiresAt: Date | null }>) {
    const now = new Date();
    return users.filter(u =>
        (u.plan === "MONTHLY" || u.plan === "ANNUAL") &&
        (!u.expiresAt || u.expiresAt > now)
    ).length;
}
