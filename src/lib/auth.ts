import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    debug: true,
    providers: [],
    callbacks: {
        async session({ session }) {
            return session;
        },
        async jwt({ token }) {
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
