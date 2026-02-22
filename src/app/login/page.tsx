"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { FileText, Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const loadingToast = toast.loading("Signing you in...");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error("Invalid email or password. Please check your credentials and try again.", { id: loadingToast });
            } else {
                toast.success("Welcome back!", { id: loadingToast });
                router.push("/dashboard");
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
            <Link href="/" className="flex items-center gap-3 mb-12 group transition-all">
                <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center group-hover:bg-slate-900">
                    <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                    <span className="text-2xl font-black text-black tracking-tighter uppercase leading-none block">PaperCraft</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Institutional Access</span>
                </div>
            </Link>

            <Card className="w-full max-w-md shadow-2xl border-2 border-black rounded-none bg-white">
                <CardHeader className="p-10 pb-6 text-center">
                    <CardTitle className="text-4xl font-black text-black uppercase tracking-tighter mb-2">Login.</CardTitle>
                    <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Enter your credentials to continue
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-10 pt-0">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-black">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                                <Input
                                    type="email"
                                    placeholder="professor@university.edu"
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
                        <Button type="submit" className="w-full bg-black hover:bg-slate-900 h-14 rounded-none font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-black/10" disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authorize"}
                            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>

                        {/* Or Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t-2 border-black/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-4 text-slate-400 font-black tracking-widest">Or</span>
                            </div>
                        </div>

                        {/* OTP Login */}
                        <Link href="/otp-login" className="block">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full border-2 border-black rounded-none font-black uppercase tracking-widest text-xs h-12 hover:bg-slate-50"
                            >
                                <Mail className="h-4 w-4 mr-2" />
                                Login with OTP
                            </Button>
                        </Link>
                    </form>
                </CardContent>
                <CardFooter className="p-10 pt-0 flex flex-col space-y-6">
                    <div className="w-full h-px bg-black/5" />
                    <div className="text-[10px] font-black uppercase tracking-widest text-center text-slate-400">
                        New to PaperCraft?{" "}
                        <Link href="/register" className="text-black hover:underline">
                            Establish Account
                        </Link>
                    </div>
                </CardFooter>
            </Card>

            <p className="mt-12 text-[10px] font-bold text-slate-400 text-center max-w-xs uppercase tracking-widest leading-relaxed">
                Secured by RSA-4096. <br /> Private Educational Infrastructure.
            </p>
        </div>
    );
}
