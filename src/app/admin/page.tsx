"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatsCard } from "@/components/admin/StatsCard";
import { Users, FileText, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stats {
    totalCustomers: number;
    activeSubscriptions: number;
    totalPapers: number;
    aiPapersGenerated: number;
}

interface RecentCustomer {
    id: string;
    name: string | null;
    email: string;
    plan: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        totalCustomers: 0,
        activeSubscriptions: 0,
        totalPapers: 0,
        aiPapersGenerated: 0,
    });
    const [recentCustomers, setRecentCustomers] = useState<RecentCustomer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        fetchRecentCustomers();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/stats");
            if (res.ok) {
                const data = await res.json();
                setStats({
                    totalCustomers: data.totalCustomers || 0,
                    activeSubscriptions: data.activeSubscriptions || 0,
                    totalPapers: data.totalPapers || 0,
                    aiPapersGenerated: data.aiPapersGenerated || 0,
                });
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        }
    };

    const fetchRecentCustomers = async () => {
        try {
            const res = await fetch("/api/admin/customers?limit=5");
            if (res.ok) {
                const data = await res.json();
                setRecentCustomers(data.customers || []);
            }
        } catch (error) {
            console.error("Failed to fetch customers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-5xl font-black text-black uppercase tracking-tighter mb-2">
                        Dashboard
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Creator Panel Overview
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Total Customers"
                        value={stats.totalCustomers}
                        subtitle="Registered users"
                        icon={<Users className="h-5 w-5 text-white" />}
                    />
                    <StatsCard
                        title="Active Plans"
                        value={stats.activeSubscriptions}
                        subtitle="Paid subscriptions"
                        icon={<TrendingUp className="h-5 w-5 text-white" />}
                    />
                    <StatsCard
                        title="Total Papers"
                        value={stats.totalPapers}
                        subtitle="Papers created"
                        icon={<FileText className="h-5 w-5 text-white" />}
                    />
                    <StatsCard
                        title="AI Generated"
                        value={stats.aiPapersGenerated}
                        subtitle="AI papers created"
                        icon={<Sparkles className="h-5 w-5 text-white" />}
                    />
                </div>

                {/* Recent Customers */}
                <Card className="border-2 border-black rounded-none shadow-none bg-white">
                    <CardHeader className="p-6 border-b-2 border-black">
                        <CardTitle className="text-2xl font-black uppercase tracking-tighter">
                            Recent Customers
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-6 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                                Loading...
                            </div>
                        ) : recentCustomers.length === 0 ? (
                            <div className="p-6 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                                No customers yet
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="border-b-2 border-black">
                                    <tr className="bg-slate-50">
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.2em]">
                                            Customer
                                        </th>
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.2em]">
                                            Plan
                                        </th>
                                        <th className="text-right p-4 text-[10px] font-black uppercase tracking-[0.2em]">
                                            Joined
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentCustomers.map((customer, index) => (
                                        <tr
                                            key={customer.id}
                                            className={`cursor-pointer hover:bg-slate-50 transition-colors ${index !== recentCustomers.length - 1 ? "border-b border-black/10" : ""}`}
                                            onClick={() => window.location.href = `/admin/customers/${customer.id}`}
                                        >
                                            <td className="p-4">
                                                <div className="font-semibold text-sm">{customer.name || "N/A"}</div>
                                                <div className="text-xs text-slate-500">{customer.email}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-block px-2 py-1 text-[10px] font-black uppercase tracking-widest border border-black rounded-none">
                                                    {customer.plan}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right text-xs text-slate-500">
                                                {new Date(customer.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
