import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const plan = (token as any)?.plan;
        const role = (token as any)?.role;

        // Admin route protection
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
        if (isAdminRoute) {
            // Admin login page is public
            if (req.nextUrl.pathname === "/admin/login") {
                return NextResponse.next();
            }
            // Check if user is admin
            if (role !== "ADMIN") {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
            return NextResponse.next();
        }

        // Define paths that are exempt from the plan check
        const isPricingPage = req.nextUrl.pathname === "/pricing";
        const isCheckoutPage = req.nextUrl.pathname === "/checkout";
        const isSuccessPage = req.nextUrl.pathname === "/success";
        const isApiPage = req.nextUrl.pathname.startsWith("/api");

        // If user is logged in but hasn't selected a plan, redirect to pricing
        if (token && plan === "UNSET" && !isPricingPage && !isCheckoutPage && !isSuccessPage && !isApiPage) {
            return NextResponse.redirect(new URL("/pricing", req.url));
        }

        // If user is logged in and visits root, redirect to dashboard
        if (token && req.nextUrl.pathname === "/") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/builder/:path*",
        "/create-with-ai/:path*",
        "/profile/:path*",
        "/checkout",
        "/success",
        "/admin/:path*", // Admin routes
    ],
};
