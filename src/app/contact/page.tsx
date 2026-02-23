import type { Metadata } from "next";
import ContactPageClient from "@/components/contact/ContactPageClient";

export const metadata: Metadata = {
    title: "Support & Institutional Inquiry",
    description: "Get in touch with the PaperCraft support team. Inquire about institutional licensing, technical support, or custom assessment requirements for your educational organization.",
    alternates: {
        canonical: "/contact",
    }
};

export default function Page() {
    return <ContactPageClient />;
}
