"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Lock, Mail, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const loadingToast = toast.loading("Verifying admin credentials...");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error("Invalid credentials or insufficient permissions", { id: loadingToast });
            } else {
                toast.success("Admin access granted", { id: loadingToast });
                router.push("/admin");
                router.refresh();
            }
        } catch (error) {
            toast.error("An error occurred during login", { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 selection:bg-black selection:text-white">
            <div className="flex items-center gap-3 mb-12">
                <div className="w-12 h-12 rounded-none bg-black flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                    <span className="text-2xl font-black text-black tracking-tighter uppercase leading-none block">Admin Portal</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Restricted Access</span>
                </div>
            </div>

            <Card className="w-full max-w-md shadow-2xl border-2 border-black rounded-none bg-white">
                <CardHeader className="p-10 pb-6 text-center bg-black text-white">
                    <CardTitle className="text-4xl font-black uppercase tracking-tighter mb-2">System Access</CardTitle>
                    <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Administrative Authentication Required
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-10 pt-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-black">Admin Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                                <Input
                                    type="email"
                                    placeholder="admin@papercraft.com"
                                    className="pl-12 h-12 border-black/10 rounded-none focus-visible:ring-black font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-black">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-12 h-12 border-black/10 rounded-none focus-visible:ring-black font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-black hover:bg-slate-900 h-14 rounded-none font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-black/10"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authenticate"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <p className="mt-12 text-[10px] font-bold text-slate-400 text-center max-w-xs uppercase tracking-widest leading-relaxed">
                Unauthorized access prohibited. All activities are logged and monitored.
            </p>
        </div>
    );
}
