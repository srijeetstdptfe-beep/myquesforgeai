"use client";

import { useState, useRef, KeyboardEvent, ClipboardEvent } from "react";
import { Input } from "@/components/ui/input";

interface OTPInputProps {
    length?: number;
    onComplete: (otp: string) => void;
    disabled?: boolean;
}

export function OTPInput({ length = 6, onComplete, disabled = false }: OTPInputProps) {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (disabled) return;

        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Call onComplete when all digits are filled
        if (newOtp.every(digit => digit !== "") && value) {
            onComplete(newOtp.join(""));
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;

        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        if (disabled) return;

        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, length);

        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split("").forEach((digit, index) => {
            if (index < length) {
                newOtp[index] = digit;
            }
        });

        setOtp(newOtp);

        // Focus last filled input or first empty
        const lastIndex = Math.min(pastedData.length, length) - 1;
        inputRefs.current[lastIndex]?.focus();

        // Call onComplete if all digits filled
        if (newOtp.every(digit => digit !== "")) {
            onComplete(newOtp.join(""));
        }
    };

    return (
        <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
                <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className="w-14 h-16 text-center text-2xl font-black border-2 border-black rounded-none focus-visible:ring-black focus-visible:ring-offset-0 disabled:opacity-50"
                    autoFocus={index === 0}
                />
            ))}
        </div>
    );
}
