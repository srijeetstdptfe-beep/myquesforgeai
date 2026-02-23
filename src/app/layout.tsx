import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { VisualEditsMessenger } from "orchids-visual-edits";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://quesforgeai-in.netlify.app"),
  title: {
    default: "PaperCraft - Professional Question Paper Builder for Educators",
    template: "%s | PaperCraft"
  },
  description: "Advanced visual question paper builder for educators. Create exam-ready papers with AI-assisted generation, drag-and-drop manual design, and multi-language support (Hindi, Marathi, English).",
  keywords: ["Question Paper Builder", "Exam Paper Creator", "AI Question Generator", "Marathi Question Paper", "Hindi Exam Software", "Educational Assessment Tools"],
  openGraph: {
    title: "PaperCraft - Question Paper Builder",
    description: "Visual question paper builder for educators. Create exam-ready papers with AI assistance.",
    url: "https://quesforgeai-in.netlify.app",
    siteName: "PaperCraft",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PaperCraft - Question Paper Builder",
    description: "Visual question paper builder for educators. Create exam-ready papers with AI assistance.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "YOUR_GSC_CODE_HERE", // Replace with your actual verification code
  }
};

import { SoftareApplicationSchema, OrganizationSchema } from "@/components/SEO/StructuredData";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="https://identity.netlify.com/v1/netlify-identity-widget.js" strategy="beforeInteractive" />
        <Script id="netlify-identity-redirect">
          {`
            if (window.netlifyIdentity) {
              window.netlifyIdentity.on("init", user => {
                if (!user) {
                  window.netlifyIdentity.on("login", () => {
                    document.location.href = "/admin/";
                  });
                }
              });
            }
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SoftareApplicationSchema />
        <OrganizationSchema />
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
          <VisualEditsMessenger />
        </AuthProvider>
      </body>
    </html>
  );
}
