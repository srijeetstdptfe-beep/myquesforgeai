import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: ReactNode;
}

export function StatsCard({ title, value, subtitle, icon }: StatsCardProps) {
    return (
        <Card className="border-2 border-black rounded-none shadow-none bg-white">
            <CardHeader className="p-6 pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {title}
                    </CardTitle>
                    <div className="w-10 h-10 rounded-none bg-black flex items-center justify-center">
                        {icon}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <p className="text-4xl font-black text-black tracking-tighter">{value}</p>
                {subtitle && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">
                        {subtitle}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
