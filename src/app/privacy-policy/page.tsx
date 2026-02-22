"use client";

import { Shield, Lock, Eye, FileLock } from "lucide-react";

export default function PrivacyPolicyPage() {
    const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="bg-slate-50 border-b border-slate-100 py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-6">
                        <Shield className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-slate-500">
                        Last updated: {lastUpdated}
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-6 py-20">
                <div className="prose prose-slate max-w-none">
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                            <Eye className="h-6 w-6 text-indigo-600" />
                            1. Information We Collect
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            When you use PaperCraft, we collect information that you provide to us directly:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li><strong>Account Information:</strong> Name, email address, school/institution name, and password.</li>
                            <li><strong>Payment Information:</strong> We process payments through Razorpay. We do not store your credit/debit card details on our servers.</li>
                            <li><strong>Usage Data:</strong> Information about the question papers you create, subjects you focus on, and how you interact with our tools.</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                            <Lock className="h-6 w-6 text-indigo-600" />
                            2. How We Use Your Information
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            We use the collected information to:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-4">
                            <li>Provide and maintain our question paper building services.</li>
                            <li>Process your subscriptions and paper credit purchases.</li>
                            <li>Send you technical notices, updates, and support messages.</li>
                            <li>Improve our AI generation models and platform efficiency.</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                            <FileLock className="h-6 w-6 text-indigo-600" />
                            3. Data Security
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            We implement industry-standard security measures to protect your data. This includes SSL encryption for all data transmission and secure password hashing. However, no method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Sharing of Information</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We do not sell your personal information. We only share data with service providers (like Razorpay for payments or SendGrid/Nodemailer for emails) as necessary to perform their services for us.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Contact Information</h2>
                        <p className="text-slate-600 leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at:
                            <br /><br />
                            <strong>Email:</strong> support@papercraft.com
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
