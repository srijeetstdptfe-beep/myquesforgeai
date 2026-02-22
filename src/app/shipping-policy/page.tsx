"use client";

import { Send, Globe, Mail, Clock } from "lucide-react";

export default function ShippingPolicyPage() {
    const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-slate-50 border-b border-slate-100 py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-6">
                        <Send className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        Shipping & Delivery
                    </h1>
                    <p className="text-lg text-slate-500">
                        Last updated: {lastUpdated}
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-20">
                <div className="prose prose-slate max-w-none">
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <Globe className="h-6 w-6 text-indigo-600" />
                            <h2 className="text-2xl font-bold text-slate-900 m-0">Digital Delivery</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            PaperCraft provides **Digital Services** only. We do not ship physical products. All subscriptions, license keys, and paper credits are delivered electronically.
                        </p>
                    </section>

                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock className="h-6 w-6 text-indigo-600" />
                            <h2 className="text-2xl font-bold text-slate-900 m-0">Delivery Timeline</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            Access to the platform and fulfillment of credits happens **instantly** (within 60 seconds) after successful payment verification by our payment gateway (Razorpay).
                        </p>
                    </section>

                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <Mail className="h-6 w-6 text-indigo-600" />
                            <h2 className="text-2xl font-bold text-slate-900 m-0">Email Confirmation</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            Pro users will receive their license key and payment receipt via email immediately after purchase. If you do not receive an email within 10 minutes, please check your spam folder or contact our support.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Questions?</h2>
                        <p className="text-slate-600 leading-relaxed">
                            For any delivery-related issues, please contact us at <strong>support@papercraft.com</strong>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
