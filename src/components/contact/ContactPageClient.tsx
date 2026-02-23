"use client";

import { Mail, Phone, MapPin, MessageSquare, Clock, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ContactPageClient() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Message sent! We'll get back to you shortly.");
                setFormData({
                    name: "",
                    email: "",
                    subject: "General Inquiry",
                    message: ""
                });
            } else {
                toast.error(data.error || "Failed to send message. Please try again.");
            }
        } catch (error) {
            console.error("Contact form error:", error);
            toast.error("An unexpected error occurred. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white selection:bg-black selection:text-white">
            <div className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-20 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm border border-black/10 text-black text-[10px] font-black uppercase tracking-[0.2em] mb-8"
                        >
                            <MessageSquare className="h-3 w-3" />
                            Support Center
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-black text-black leading-none mb-6 tracking-tighter uppercase">
                            GET IN <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-black to-slate-400">TOUCH.</span>
                        </h1>
                        <p className="text-lg text-slate-500 max-w-xl font-medium leading-relaxed">
                            Have technical questions or need custom arrangements? Our team is ready to assist your educational mission.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Info Column */}
                        <div className="lg:col-span-4 space-y-4">
                            <ContactItem
                                icon={<Mail className="h-5 w-5" />}
                                title="EMAIL US"
                                value="spwebsmiths@gmail.com"
                                desc="Direct support for technical issues"
                            />
                            <ContactItem
                                icon={<Phone className="h-5 w-5" />}
                                title="CALL US"
                                value="+91 8208593432"
                                desc="Mon-Fri, 9am - 6pm IST"
                            />
                            <ContactItem
                                icon={<MapPin className="h-5 w-5" />}
                                title="OFFICE"
                                value="Vishrambag, Sangli- 416410, India"
                                desc="Regional Headquarters"
                            />

                            <div className="p-8 border-2 border-dashed border-black/10 bg-slate-50 mt-8 space-y-4">
                                <div className="flex items-center gap-3 text-black">
                                    <Clock className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Typical response: 2 hours</span>
                                </div>
                                <div className="flex items-center gap-3 text-black">
                                    <Shield className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Secure SSL Encrypted Channel</span>
                                </div>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="lg:col-span-8">
                            <div className="relative group">
                                <div className="absolute top-4 left-4 w-full h-full bg-slate-100 border-2 border-black -z-10 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
                                <div className="p-8 md:p-12 bg-white border-2 border-black shadow-none relative z-10">
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-black uppercase tracking-[0.2em]">Full Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="e.g. Dr. John Smith"
                                                    className="w-full h-14 px-5 border-2 border-black rounded-none focus:outline-none focus:bg-black focus:text-white transition-all placeholder:text-slate-300 font-bold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-black uppercase tracking-[0.2em]">Email Address</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="john@institution.edu"
                                                    className="w-full h-14 px-5 border-2 border-black rounded-none focus:outline-none focus:bg-black focus:text-white transition-all placeholder:text-slate-300 font-bold"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-black uppercase tracking-[0.2em]">Subject</label>
                                            <select
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full h-14 px-5 border-2 border-black rounded-none focus:outline-none bg-white font-bold cursor-pointer"
                                            >
                                                <option>General Inquiry</option>
                                                <option>Technical Support</option>
                                                <option>Billing & Subscription</option>
                                                <option>Institutional Licensing</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-black uppercase tracking-[0.2em]">Message Content</label>
                                            <textarea
                                                required
                                                rows={6}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                placeholder="Describe your request in detail..."
                                                className="w-full p-5 border-2 border-black rounded-none focus:outline-none focus:bg-black focus:text-white transition-all placeholder:text-slate-300 font-bold resize-none"
                                            ></textarea>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full h-20 bg-black text-white hover:bg-slate-800 rounded-none text-xl font-black uppercase tracking-widest disabled:opacity-50 group flex items-center justify-center gap-4 border-2 border-black active:translate-x-1 active:translate-y-1 transition-all"
                                        >
                                            {isSubmitting ? "TRANSMITTING..." : "SEND MESSAGE"}
                                            <ChevronRight className={`h-6 w-6 transition-transform ${isSubmitting ? 'hidden' : 'group-hover:translate-x-2'}`} />
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="py-20 border-t border-black/5">
                <div className="max-w-7xl mx-auto px-6 text-center italic text-slate-400 font-medium text-sm">
                    &copy; {new Date().getFullYear()} PaperCraft Editorial Systems. Built for high-fidelity pedagogy.
                </div>
            </div>
        </div>
    );
}

function ContactItem({ icon, title, value, desc }: { icon: React.ReactNode, title: string, value: string, desc: string }) {
    return (
        <div className="p-8 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors group relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                {icon}
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-slate-400 group-hover:text-slate-500">
                {title}
            </h3>
            <p className="text-xl font-black leading-tight mb-2 uppercase tracking-tighter">
                {value}
            </p>
            <p className="text-xs font-medium text-slate-500 group-hover:text-slate-400">
                {desc}
            </p>
        </div>
    );
}
