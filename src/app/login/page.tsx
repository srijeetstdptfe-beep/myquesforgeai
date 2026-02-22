"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { FileText, Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLoginClick = () => {
        if (typeof window !== 'undefined' && (window as any).netlifyIdentity) {
            (window as any).netlifyIdentity.open("login");

            // Listen for login and redirect to dashboard
            (window as any).netlifyIdentity.on("login", () => {
                router.push("/dashboard");
                (window as any).netlifyIdentity.close();
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-black selection:text-white">
            <Card className="max-w-md w-full border-2 border-black rounded-none shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)] bg-white overflow-hidden">
                <CardHeader className="p-10 pb-0 text-center">
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 rounded-xl bg-black flex items-center justify-center rotate-[-5deg]">
                            <FileText className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-4xl font-black text-black tracking-tighter uppercase mb-2">
                        Member Portal
                    </CardTitle>
                    <CardDescription className="font-medium text-slate-500">
                        Access the institutional assessment suite
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-10 pt-12">
                    <div className="space-y-6">
                        <Button
                            onClick={handleLoginClick}
                            className="w-full bg-black hover:bg-slate-900 border-2 border-black text-white h-14 rounded-none font-black uppercase tracking-widest text-sm transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                            disabled={isLoading}
                        >
                            Open Access Terminal
                        </Button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-black/5" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest bg-white px-4 text-slate-300">
                                Institutional Verification
                            </div>
                        </div>

                        <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                            Access is strictly restricted to <br /> approved educational partners
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="p-10 pt-0 flex flex-col space-y-6">
                    <div className="w-full h-px bg-black/5" />
                    <Link href="/contact" className="text-[10px] font-black uppercase tracking-widest text-center text-slate-400 hover:text-black transition-colors">
                        Request Institutional Credentials →
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
