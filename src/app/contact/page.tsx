"use client";

import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send to an API
        alert("Message sent! We'll get back to you shortly.");
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        Contact Support
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Have questions or need help? Our team is here to support you.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Contact Methods */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="border-slate-200">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Email Us</h3>
                                        <p className="text-sm text-slate-500">Fast response within 24h</p>
                                    </div>
                                </div>
                                <p className="font-medium text-slate-900">support@papercraft.com</p>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Call Us</h3>
                                        <p className="text-sm text-slate-500">Mon-Fri, 9am - 6pm</p>
                                    </div>
                                </div>
                                <p className="font-medium text-slate-900">+91 98765 43210</p>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Office</h3>
                                        <p className="text-sm text-slate-500">Visit our headquarters</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">
                                    123 Tech Park, HSR Layout<br />
                                    Bangalore, Karnataka 560102<br />
                                    India
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-2">
                        <Card className="border-slate-200 shadow-xl shadow-slate-200/50">
                            <CardContent className="p-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <MessageSquare className="h-6 w-6 text-indigo-600" />
                                    <h2 className="text-2xl font-bold text-slate-900">Send us a message</h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="John Doe"
                                                className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="john@example.com"
                                                className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Subject</label>
                                        <select
                                            className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
                                        >
                                            <option>General Inquiry</option>
                                            <option>Technical Support</option>
                                            <option>Billing & Subscription</option>
                                            <option>Feature Request</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Message</label>
                                        <textarea
                                            required
                                            rows={5}
                                            placeholder="How can we help you?"
                                            className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                                        ></textarea>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-lg font-bold shadow-lg shadow-indigo-200"
                                    >
                                        <Send className="h-5 w-5 mr-2" />
                                        Send Message
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="mt-8 flex items-center justify-center gap-8 text-slate-400">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-medium">Avg. response: 2 hours</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                <span className="text-sm font-medium">SSL Encrypted support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Shield(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
    );
}
