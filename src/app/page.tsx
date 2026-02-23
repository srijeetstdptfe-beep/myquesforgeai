import type { Metadata } from "next";
import LandingPageClient from "@/components/home/LandingPageClient";

export const metadata: Metadata = {
  title: "PaperCraft - The Best AI Question Paper Builder for Educators",
  description: "Crate professional, board-standard question papers in minutes. Support for State Boards, CBSE, and ICSE with Hindi and Marathi support. Experience the power of AI-enhanced pedagogy.",
  alternates: {
    canonical: "/",
  }
};

export default function Page() {
  return <LandingPageClient />;
}
