"use client";

import { RotateCcw, CreditCard, Ban, HelpingHand } from "lucide-react";

export default function RefundPolicyPage() {
    const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-slate-50 border-b border-slate-100 py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-6">
                        <RotateCcw className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        Cancellations & Refunds
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
                            <CreditCard className="h-6 w-6 text-indigo-600" />
                            1. Refund Eligibility
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            Since PaperCraft provides digital goods (software licenses and credits) that are delivered instantly:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li><strong>Pro Subscriptions:</strong> You are eligible for a full refund within 7 days of purchase if you have not created more than 2 papers.</li>
                            <li><strong>Paper Credits:</strong> Unused credits are eligible for refund within 7 days. Once a credit is consumed (by saving a paper beyond the free limit), it is no longer refundable.</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                            <Ban className="h-6 w-6 text-indigo-600" />
                            2. Cancellation Policy
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            You may cancel your Pro subscription at any time. Upon cancellation, your account will remain "Pro" until the end of the current billing cycle. No further charges will be made.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                            <HelpingHand className="h-6 w-6 text-indigo-600" />
                            3. Processing Refunds
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            Refunds are processed back to the original payment method through Razorpay. It typically takes 5-7 working days for the amount to reflect in your account.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. How to Request a Refund</h2>
                        <p className="text-slate-600 leading-relaxed">
                            To request a refund, please email us at <strong>support@papercraft.com</strong> with your registered email and payment ID.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
