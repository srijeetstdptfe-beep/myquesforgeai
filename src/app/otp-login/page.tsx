"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OTPInput } from "@/components/auth/OTPInput";
import { Mail, ArrowLeft, Timer, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function OTPLoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<"email" | "otp">("email");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [canResend, setCanResend] = useState(false);

    // Countdown timer
    useEffect(() => {
        if (step === "otp" && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        toast.error("OTP expired. Please request a new one.");
                        setStep("email");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [step, timeLeft]);

    // Enable resend after 60 seconds
    useEffect(() => {
        if (step === "otp") {
            const timer = setTimeout(() => setCanResend(true), 60000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const loadingToast = toast.loading("Sending OTP to your email...");

        try {
            const res = await fetch("/api/auth/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Failed to send OTP", { id: loadingToast });
                return;
            }

            toast.success("OTP sent! Check your email.", { id: loadingToast });
            setStep("otp");
            setTimeLeft(300);
            setCanResend(false);
        } catch (error) {
            toast.error("An error occurred. Please try again.", { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (otp: string) => {
        setIsLoading(true);
        const loadingToast = toast.loading("Verifying OTP...");

        try {
            const res = await fetch("/api/auth/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: otp })
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Invalid OTP", { id: loadingToast });
                setIsLoading(false);
                return;
            }

            // OTP verified successfully, now create session with actual user data
            const result = await signIn("credentials", {
                email: data.user.email,
                // For OTP-verified users, we bypass password check
                password: `OTP_VERIFIED_${data.user.id}`,
                callbackUrl: "/dashboard",
                redirect: true
            });

            toast.success("Login successful!", { id: loadingToast });
        } catch (error) {
            console.error("OTP verification error:", error);
            toast.error("An error occurred. Please try again.", { id: loadingToast });
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setCanResend(false);
        setTimeLeft(300);

        const loadingToast = toast.loading("Resending OTP...");

        try {
            const res = await fetch("/api/auth/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Failed to resend OTP", { id: loadingToast });
                setCanResend(true);
                return;
            }

            toast.success("New OTP sent!", { id: loadingToast });
        } catch (error) {
            toast.error("An error occurred", { id: loadingToast });
            setCanResend(true);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 selection:bg-black selection:text-white">
            <div className="w-full max-w-md">
                {/* Back to Login */}
                <Link
                    href="/login"
                    className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-black mb-8 transition-colors"
                >
                    <ArrowLeft className="h-3 w-3 mr-2" />
                    Back to Password Login
                </Link>

                <Card className="border-2 border-black rounded-none shadow-2xl bg-white">
                    <CardHeader className="p-10 pb-6 text-center bg-black text-white">
                        <CardTitle className="text-4xl font-black uppercase tracking-tighter mb-2">
                            {step === "email" ? "Login with OTP" : "Enter Code"}
                        </CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            {step === "email" ? "Passwordless Authentication" : "Check Your Email"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-10 pt-8">
                        {step === "email" ? (
                            <form onSubmit={handleSendOTP} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-black">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            className="pl-12 h-12 border-black/10 rounded-none focus-visible:ring-black font-medium"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="border-l-4 border-black bg-slate-50 p-4">
                                    <p className="text-xs font-bold text-slate-600 leading-relaxed">
                                        We'll send a 6-digit code to your email. Enter it to login instantly - no password needed!
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-black hover:bg-slate-900 h-14 rounded-none font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-black/10"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        "Send OTP"
                                    )}
                                </Button>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="text-center space-y-2">
                                    <p className="text-sm font-semibold text-slate-600">
                                        We sent a 6-digit code to:
                                    </p>
                                    <p className="text-base font-black text-black">{email}</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-black block text-center">
                                        Enter OTP Code
                                    </label>
                                    <OTPInput
                                        length={6}
                                        onComplete={handleVerifyOTP}
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Timer */}
                                <div className="flex items-center justify-center gap-2 text-sm">
                                    <Timer className="h-4 w-4 text-slate-400" />
                                    <span className="font-mono font-bold text-slate-600">
                                        {formatTime(timeLeft)}
                                    </span>
                                </div>

                                {/* Resend */}
                                <div className="text-center">
                                    <p className="text-xs text-slate-500 mb-2">Didn't receive the code?</p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleResend}
                                        disabled={!canResend || isLoading}
                                        className="border-2 border-black rounded-none font-black uppercase text-xs disabled:opacity-50"
                                    >
                                        Resend OTP
                                    </Button>
                                </div>

                                {/* Change Email */}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setStep("email")}
                                    className="w-full font-bold uppercase text-xs"
                                    disabled={isLoading}
                                >
                                    Change Email
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
