"use client";

import Link from 'next/link';
import { FileText, Github, Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Footer() {
    const currentYear = new Date().getFullYear();
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletterEmail.trim()) {
            toast.error("Please enter your email address");
            return;
        }

        setIsSubmitting(true);
        const loadingToast = toast.loading("Subscribing to newsletter...");

        try {
            const response = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: newsletterEmail }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Successfully subscribed to newsletter!", { id: loadingToast });
                setNewsletterEmail(''); // Clear the input
            } else {
                toast.error(data.error || "Failed to subscribe", { id: loadingToast });
            }
        } catch (error) {
            toast.error("An error occurred. Please try again later.", { id: loadingToast });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className="bg-white border-t border-black/5 pt-24 pb-12 selection:bg-black selection:text-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-8 group transition-all">
                            <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center group-hover:bg-slate-900">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-black text-black tracking-tighter uppercase leading-none block">PaperCraft</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Editorial Suite</span>
                            </div>
                        </Link>
                        <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8 uppercase tracking-wider">
                            Advanced assessment infrastructure for institutional precision. Redefining academic standards through AI.
                        </p>
                        <div className="flex items-center gap-3">
                            <a href="#" className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-black hover:bg-slate-100 transition-all">
                                <Github className="h-4 w-4" />
                            </a>
                            <a href="mailto:support@papercraft.com" className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-black hover:bg-slate-100 transition-all">
                                <Mail className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black text-black uppercase tracking-[0.2em] mb-8">Platform</h4>
                        <ul className="space-y-4">
                            <li><Link href="/pricing" className="text-slate-400 hover:text-black text-[10px] font-black uppercase tracking-widest transition-colors">Pricing</Link></li>
                            <li><Link href="/dashboard" className="text-slate-400 hover:text-black text-[10px] font-black uppercase tracking-widest transition-colors">Workspace</Link></li>
                            <li><Link href="/builder" className="text-slate-400 hover:text-black text-[10px] font-black uppercase tracking-widest transition-colors">Engine</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black text-black uppercase tracking-[0.2em] mb-8">Governance</h4>
                        <ul className="space-y-4">
                            <li><Link href="/privacy-policy" className="text-slate-400 hover:text-black text-[10px] font-black uppercase tracking-widest transition-colors">Privacy</Link></li>
                            <li><Link href="/terms" className="text-slate-400 hover:text-black text-[10px] font-black uppercase tracking-widest transition-colors">Terms</Link></li>
                            <li><Link href="/refund-policy" className="text-slate-400 hover:text-black text-[10px] font-black uppercase tracking-widest transition-colors">Refunds</Link></li>
                            <li><Link href="/shipping-policy" className="text-slate-400 hover:text-black text-[10px] font-black uppercase tracking-widest transition-colors">Logistics</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black text-black uppercase tracking-[0.2em] mb-8">Liaison</h4>
                        <ul className="space-y-4 mb-6">
                            <li className="flex items-start gap-3">
                                <Mail className="h-4 w-4 text-black/20 shrink-0" />
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">support@papercraft.com</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="h-4 w-4 text-black/20 shrink-0" />
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">+91 98765 43210</span>
                            </li>
                        </ul>
                        <div className="pt-4 border-t border-black/5">
                            <p className="text-[10px] font-black text-black uppercase tracking-[0.2em] mb-4">Newsletter</p>
                            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    className="h-10 border-black/10 rounded-none focus-visible:ring-black font-medium text-sm"
                                    disabled={isSubmitting}
                                />
                                <Button
                                    type="submit"
                                    className="w-full bg-black hover:bg-slate-900 h-10 rounded-none font-black uppercase tracking-widest text-[10px] transition-all"
                                    disabled={isSubmitting}
                                >
                                    Subscribe
                                </Button>
                            </form>
                        </div>
                        <div className="pt-6">
                            <Link href="/contact" className="inline-flex items-center px-4 py-2 border border-black text-[10px] font-black text-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                                Direct Inquiry &rarr;
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-black/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        © {currentYear} PaperCraft. Institutional Rigor Guaranteed.
                    </p>
                    <div className="flex items-center gap-8">
                        <span className="text-black/20 text-[10px] uppercase tracking-[0.3em] font-black">Encrypted RSA-4096</span>
                        <span className="text-black/20 text-[10px] uppercase tracking-[0.3em] font-black">Razorpay Secure</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
