import type { Metadata } from "next";
import PricingPageClient from "@/components/pricing/PricingPageClient";

export const metadata: Metadata = {
    title: "Pricing & Licensing",
    description: "Affordable AI-powered question paper generation. Choose between flexible PAYG credits or powerful monthly/annual subscriptions for your institution.",
    alternates: {
        canonical: "/pricing",
    }
};

export default function Page() {
    return <PricingPageClient />;
}
