"use client";

import { Check, Sparkles, Zap, Shield, Globe, FileDown, Lock as LockIcon, X, MessageCircle, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-white py-24 px-6 selection:bg-black selection:text-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm border border-black/10 text-black text-[10px] font-black uppercase tracking-[0.2em] mb-10">
                        <Shield className="h-3 w-3" />
                        Commercial Licensing
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-black mb-8 tracking-tighter uppercase leading-[0.9]">
                        Choose Your <br /> Capability Level.
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
                        Professional tooling for institutional rigor. Scale your examination infrastructure.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">

                    {/* FREE PLAN */}
                    <Card className="relative overflow-hidden border-2 border-slate-100 shadow-none hover:border-black transition-all rounded-none bg-white flex flex-col">
                        <CardHeader className="p-8 pb-6">
                            <CardTitle className="text-3xl font-black uppercase tracking-tighter text-black">Free</CardTitle>
                            <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Trial & Onboarding</CardDescription>
                            <div className="mt-8 flex items-baseline">
                                <span className="text-5xl font-black text-black tracking-tighter uppercase">₹0</span>
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 flex-grow">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-4 text-slate-800"><Check className="h-4 w-4 text-black mt-0.5 shrink-0" /><span className="text-sm font-bold uppercase tracking-tight">3 Saved Papers</span></li>
                                <li className="flex items-start gap-4 text-slate-800"><Check className="h-4 w-4 text-black mt-0.5 shrink-0" /><span className="text-sm font-bold uppercase tracking-tight">Manual Creation</span></li>
                                <li className="flex items-start gap-4 text-slate-800"><Check className="h-4 w-4 text-black mt-0.5 shrink-0" /><span className="text-sm font-bold uppercase tracking-tight">Live Preview</span></li>
                                <li className="flex items-start gap-4 text-slate-300"><X className="h-4 w-4 text-slate-300 mt-0.5 shrink-0" /><span className="text-sm font-bold uppercase tracking-tight">No AI Features</span></li>
                                <li className="flex items-start gap-4 text-slate-300"><X className="h-4 w-4 text-slate-300 mt-0.5 shrink-0" /><span className="text-sm font-bold uppercase tracking-tight">Watermarked Export</span></li>
                            </ul>
                        </CardContent>
                        <CardFooter className="p-8 pt-0 mt-10">
                            <Button asChild className="w-full h-14 bg-white hover:bg-slate-50 border-2 border-black text-black rounded-none font-black uppercase tracking-widest text-xs transition-all">
                                <Link href="/register">Start Free</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* PAYG PLAN */}
                    <Card className="relative overflow-hidden border-2 border-slate-100 shadow-none hover:border-black transition-all rounded-none bg-white flex flex-col">
                        <CardHeader className="p-8 pb-6">
                            <CardTitle className="text-3xl font-black uppercase tracking-tighter text-black">PAYG</CardTitle>
                            <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">No Subscription</CardDescription>
                            <div className="mt-8 flex flex-col items-start gap-1">
                                <span className="text-3xl font-black text-black tracking-tighter uppercase">Usage Based</span>
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">No expiration</span>
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 flex-grow">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-4 text-slate-800"><Check className="h-4 w-4 text-black mt-0.5 shrink-0" /><span className="text-sm font-bold uppercase tracking-tight">Manual: Free</span></li>
                                <li className="flex items-start gap-4 text-slate-800"><Zap className="h-4 w-4 text-black mt-0.5 shrink-0" /><span className="text-sm font-bold uppercase tracking-tight">AI Full: ₹149</span></li>
                                <li className="flex items-start gap-4 text-slate-800"><Zap className="h-4 w-4 text-black mt-0.5 shrink-0" /><span className="text-sm font-bold uppercase tracking-tight">AI Batch: ₹79</span></li>
                                <li className="flex items-start gap-4 text-slate-800"><Check className="h-4 w-4 text-black mt-0.5 shrink-0" /><span className="text-sm font-bold uppercase tracking-tight">Clean Export: ₹39</span></li>
                            </ul>
                        </CardContent>
                        <CardFooter className="p-8 pt-0 mt-10">
                            <Button asChild className="w-full h-14 bg-black hover:bg-slate-900 border-2 border-black text-white rounded-none font-black uppercase tracking-widest text-xs transition-all">
                                <Link href="#contact">Contact Us</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* MONTHLY PLAN */}
                    <Card className="relative overflow-hidden border-2 border-black shadow-2xl bg-white rounded-none flex flex-col z-10 scale-105 md:scale-100 lg:scale-105">
                        <div className="absolute top-0 right-0 p-0">
                            <div className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1">Popular</div>
                        </div>
                        <CardHeader className="p-8 pb-6">
                            <CardTitle className="text-3xl font-black uppercase tracking-tighter text-black">Monthly</CardTitle>
                            <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Educator / Small Institute</CardDescription>
                            <div className="mt-8 flex items-baseline">
                                <span className="text-5xl font-black text-black tracking-tighter uppercase">₹699</span>
                                <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-3">/mo</span>
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 flex-grow">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-4 text-slate-800"><Check className="h-4 w-4 text-black mt-0.5 shrink-0" /><span className="text-sm font-bold uppercase tracking-tight">Unlimited Manual</span></li>
                                <li className="flex items-start gap-4 text-slate-800"><Check className="h-4 w-4 text-black mt-0.5 shrink-0" /><span className="text-sm font-bold uppercase tracking-tight">8 AI Papers/mo</span></li>
                                <li className="flex items-start gap-4 text-slate-800"><Check className="h-4 w-4 text-black mt-0.5 shrink-0" /><span className="text-sm font-bold uppercase tracking-tight">200 AI Questions/mo</span></li>
                                <li className="flex items-start gap-4 text-slate-800"><Check className="h-4 w-4 text-black mt-0.5 shrink-0" /><span className="text-sm font-bold uppercase tracking-tight">Clean PDF & DOCX</span></li>
                                <li className="flex items-start gap-4 text-slate-800"><Check className="h-4 w-4 text-black mt-0.5 shrink-0" /><span className="text-sm font-bold uppercase tracking-tight">Institute Branding</span></li>
                            </ul>
                        </CardContent>
                        <CardFooter className="p-8 pt-0 mt-10">
                            <Button asChild className="w-full h-14 bg-black hover:bg-slate-900 border-2 border-black text-white rounded-none font-black uppercase tracking-widest text-xs transition-all hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <Link href="#contact">Contact Us</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* ANNUAL PLAN */}
                    <Card className="relative overflow-hidden border-2 border-slate-100 shadow-none hover:border-black transition-all rounded-none bg-white flex flex-col">
                        <CardHeader className="p-8 pb-6">
                            <CardTitle className="text-3xl font-black uppercase tracking-tighter text-black">Annual</CardTitle>
                            <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Best Value</CardDescription>
                            <div className="mt-8 flex items-baseline">
                                <span className="text-5xl font-black text-black tracking-tighter uppercase">₹5,999</span>
                                <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-3">/yr</span>
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 flex-grow">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-4 text-slate-800"><Check className="h-4 w-4 text-black mt-0.5 shrink-0" /><span className="text-sm font-bold uppercase tracking-tight">Everything in Monthly</span></li>
                                <li className="flex items-start gap-4 text-slate-800"><Sparkles className="h-4 w-4 text-black mt-0.5 shrink-0" /><span className="text-sm font-bold uppercase tracking-tight">100 AI Papers/yr</span></li>
                                <li className="flex items-start gap-4 text-slate-800"><Sparkles className="h-4 w-4 text-black mt-0.5 shrink-0" /><span className="text-sm font-bold uppercase tracking-tight">3000 AI Questions/yr</span></li>
                                <li className="flex items-start gap-4 text-slate-800"><Check className="h-4 w-4 text-black mt-0.5 shrink-0" /><span className="text-sm font-bold uppercase tracking-tight">Priority Support</span></li>
                            </ul>
                        </CardContent>
                        <CardFooter className="p-8 pt-0 mt-10">
                            <Button asChild className="w-full h-14 bg-white hover:bg-slate-50 border-2 border-black text-black rounded-none font-black uppercase tracking-widest text-xs transition-all">
                                <Link href="#contact">Contact Us</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                </div>

                {/* Contact Section */}
                <div id="contact" className="mt-24 border-2 border-black p-12 text-center">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-6">Get Started Today</h2>
                    <p className="text-slate-500 mb-10 max-w-xl mx-auto font-medium">
                        Contact us to upgrade your plan. We&apos;ll set up your account within 24 hours of payment confirmation.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        <a href="https://wa.me/919545214074" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 p-6 border border-black/10 hover:border-black transition-colors group">
                            <div className="w-12 h-12 bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                                <MessageCircle className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest">WhatsApp</span>
                            <span className="text-sm text-slate-500">+91 82085 93432</span>
                        </a>
                        <a href="mailto:spwebsmiths@gmail.com" className="flex flex-col items-center gap-3 p-6 border border-black/10 hover:border-black transition-colors group">
                            <div className="w-12 h-12 bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Mail className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest">Email</span>
                            <span className="text-sm text-slate-500">spwebsmiths@gmail.com</span>
                        </a>
                        <a href="tel:+919545214074" className="flex flex-col items-center gap-3 p-6 border border-black/10 hover:border-black transition-colors group">
                            <div className="w-12 h-12 bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Phone className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest">Call</span>
                            <span className="text-sm text-slate-500">+91 82085 93432</span>
                        </a>
                    </div>
                </div>

                {/* Enterprise Section */}
                <div className="mt-24 border-t border-black/5 pt-20 text-center">
                    <div className="inline-flex items-center justify-center p-4 border border-slate-200 rounded-none bg-slate-50 mb-8">
                        <Shield className="h-5 w-5 text-black/50 mr-3" />
                        <span className="text-sm font-black uppercase tracking-widest text-black">Need Enterprise Customization?</span>
                    </div>
                    <p className="text-slate-500 mb-8 max-w-xl mx-auto font-medium">For colleges and large coaching networks requiring multiple faculty accounts, shared libraries, and SLA support.</p>
                    <Button asChild variant="ghost" className="text-black font-black uppercase tracking-widest text-xs hover:bg-transparent hover:underline hover:text-black rounded-none">
                        <Link href="mailto:spwebsmiths@gmail.com">Contact Sales &rarr;</Link>
                    </Button>
                </div>

                {/* Footer Badges */}
                <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-16 text-left border-t border-black/5 pt-20">
                    <div className="space-y-4">
                        <div className="w-10 h-10 rounded-none bg-slate-50 flex items-center justify-center">
                            <LockIcon className="h-5 w-5 text-black/30" />
                        </div>
                        <h3 className="font-black text-black uppercase tracking-tighter">Academic Integrity</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Papers are stored in encrypted vaults. Zero-knowledge architecture ensures total privacy.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-10 h-10 rounded-none bg-slate-50 flex items-center justify-center">
                            <Globe className="h-5 w-5 text-black/30" />
                        </div>
                        <h3 className="font-black text-black uppercase tracking-tighter">Vernacular Speed</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Integrated AI translation for 22 Indian languages. Break language barriers instantly.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-10 h-10 rounded-none bg-slate-50 flex items-center justify-center">
                            <FileDown className="h-5 w-5 text-black/30" />
                        </div>
                        <h3 className="font-black text-black uppercase tracking-tighter">Press Ready</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">PDF exports optimized for high-volume commercial printing. Precision layout guaranteed.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
