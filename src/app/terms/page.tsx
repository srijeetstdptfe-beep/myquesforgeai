"use client";

import { FileText, UserCheck, Gavel, Scale } from "lucide-react";

export default function TermsPage() {
    const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-slate-50 border-b border-slate-100 py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-6">
                        <Gavel className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        Terms & Conditions
                    </h1>
                    <p className="text-lg text-slate-500">
                        Last updated: {lastUpdated}
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-20">
                <div className="prose prose-slate max-w-none">
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                            <UserCheck className="h-6 w-6 text-indigo-600" />
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            By accessing and using PaperCraft, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                            <FileText className="h-6 w-6 text-indigo-600" />
                            2. Description of Service
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            PaperCraft provides a web-based platform for educators to create question papers. This includes visual design tools, AI-assisted question generation, and export functionalities. Services are provided on a "Pay-as-you-go" or "Subscription" basis.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Responsibilities</h2>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                            <li>You agree to use the service for lawful educational purposes only.</li>
                            <li>You must not use the AI generation tools to create harmful, biased, or copyrighted content without authorization.</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                            <Scale className="h-6 w-6 text-indigo-600" />
                            4. Intellectual Property
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            The PaperCraft platform, its software, and design are the property of PaperCraft. Users retain ownership of the specific question papers they create, but we do not guarantee exclusive rights to AI-generated questions which may be similar across different users.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Limitation of Liability</h2>
                        <p className="text-slate-600 leading-relaxed">
                            PaperCraft shall not be liable for any errors in the generated content. Educators are expected to review all questions and papers for academic accuracy and exam standards before use.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Changes to Terms</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We reserve the right to modify these terms at any time. We will notify users of any significant changes via email or through the platform interface.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
