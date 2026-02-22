"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, FileText, Trash2, Save, RotateCcw, Plus, Sparkles, Download, StickyNote } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Customer {
    id: string;
    name: string | null;
    email: string;
    plan: string;
    planVariant: string | null;
    expiresAt: Date | null;
    manualPaperCount: number;
    aiFullPaperUsage: number;
    aiQuestionUsage: number;
    extraAiFullPapers: number;
    extraAiQuestions: number;
    extraExports: number;
    notes: string | null;
    papers: Array<{
        id: string;
        examName: string;
        subject: string;
        class: string;
        createdAt: Date;
    }>;
}

export default function CustomerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        plan: "",
        planVariant: "",
        expiresAt: "",
        notes: ""
    });
    const [creditData, setCreditData] = useState({
        extraAiFullPapers: 0,
        extraAiQuestions: 0,
        extraExports: 0
    });

    useEffect(() => {
        if (params.id) {
            fetchCustomer();
        }
    }, [params.id]);

    const fetchCustomer = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/customers/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setCustomer(data.customer);
                setEditData({
                    plan: data.customer.plan,
                    planVariant: data.customer.planVariant || "",
                    expiresAt: data.customer.expiresAt
                        ? new Date(data.customer.expiresAt).toISOString().split('T')[0]
                        : "",
                    notes: data.customer.notes || ""
                });
                setCreditData({
                    extraAiFullPapers: data.customer.extraAiFullPapers || 0,
                    extraAiQuestions: data.customer.extraAiQuestions || 0,
                    extraExports: data.customer.extraExports || 0
                });
            }
        } catch (error) {
            console.error("Failed to fetch customer:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        const loadingToast = toast.loading("Updating customer...");
        try {
            const res = await fetch(`/api/admin/customers/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...editData,
                    ...creditData
                })
            });

            if (res.ok) {
                toast.success("Customer updated successfully!", { id: loadingToast });
                setIsEditing(false);
                fetchCustomer();
            } else {
                toast.error("Failed to update customer", { id: loadingToast });
            }
        } catch (error) {
            toast.error("An error occurred", { id: loadingToast });
        }
    };

    const handleResetUsage = async () => {
        if (!confirm("Reset all usage counters to 0? This will reset AI paper usage, AI question usage, and manual paper count.")) {
            return;
        }

        const loadingToast = toast.loading("Resetting usage...");
        try {
            const res = await fetch(`/api/admin/customers/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resetUsage: true
                })
            });

            if (res.ok) {
                toast.success("Usage counters reset!", { id: loadingToast });
                fetchCustomer();
            } else {
                toast.error("Failed to reset usage", { id: loadingToast });
            }
        } catch (error) {
            toast.error("An error occurred", { id: loadingToast });
        }
    };

    const handleQuickUpgrade = async (plan: string) => {
        const loadingToast = toast.loading(`Upgrading to ${plan}...`);
        try {
            // Calculate expiry date based on plan
            let expiresAt = "";
            const now = new Date();
            if (plan === "MONTHLY") {
                now.setMonth(now.getMonth() + 1);
                expiresAt = now.toISOString().split('T')[0];
            } else if (plan === "ANNUAL") {
                now.setFullYear(now.getFullYear() + 1);
                expiresAt = now.toISOString().split('T')[0];
            }

            const res = await fetch(`/api/admin/customers/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    plan,
                    planVariant: plan === "MONTHLY" || plan === "ANNUAL" ? plan : "",
                    expiresAt: expiresAt || null
                })
            });

            if (res.ok) {
                toast.success(`Upgraded to ${plan}!`, { id: loadingToast });
                fetchCustomer();
            } else {
                toast.error("Failed to upgrade", { id: loadingToast });
            }
        } catch (error) {
            toast.error("An error occurred", { id: loadingToast });
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
            return;
        }

        const loadingToast = toast.loading("Deleting customer...");
        try {
            const res = await fetch(`/api/admin/customers/${params.id}`, {
                method: "DELETE"
            });

            if (res.ok) {
                toast.success("Customer deleted!", { id: loadingToast });
                router.push("/admin/customers");
            } else {
                toast.error("Failed to delete customer", { id: loadingToast });
            }
        } catch (error) {
            toast.error("An error occurred", { id: loadingToast });
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="p-8 text-center">
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Loading...</p>
                </div>
            </AdminLayout>
        );
    }

    if (!customer) {
        return (
            <AdminLayout>
                <div className="p-8 text-center">
                    <p className="text-sm font-bold uppercase tracking-widest text-red-500">Customer not found</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/admin/customers"
                        className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-black mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-3 w-3 mr-2" />
                        Back to Customers
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-5xl font-black text-black uppercase tracking-tighter mb-2">
                                {customer.name || "Unnamed Customer"}
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                {customer.email}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleDelete}
                            className="border-2 border-red-500 text-red-500 rounded-none font-black uppercase text-xs hover:bg-red-500 hover:text-white"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Customer
                        </Button>
                    </div>
                </div>

                {/* Quick Actions */}
                <Card className="border-2 border-black rounded-none shadow-none bg-black text-white mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-wrap items-center gap-4">
                            <span className="text-xs font-black uppercase tracking-widest">Quick Upgrade:</span>
                            <Button
                                onClick={() => handleQuickUpgrade("FREE")}
                                variant="outline"
                                className="border-2 border-white text-white rounded-none font-black uppercase text-xs hover:bg-white hover:text-black bg-transparent"
                            >
                                Free
                            </Button>
                            <Button
                                onClick={() => handleQuickUpgrade("PAYG")}
                                variant="outline"
                                className="border-2 border-white text-white rounded-none font-black uppercase text-xs hover:bg-white hover:text-black bg-transparent"
                            >
                                PAYG
                            </Button>
                            <Button
                                onClick={() => handleQuickUpgrade("MONTHLY")}
                                variant="outline"
                                className="border-2 border-white text-white rounded-none font-black uppercase text-xs hover:bg-white hover:text-black bg-transparent"
                            >
                                Monthly
                            </Button>
                            <Button
                                onClick={() => handleQuickUpgrade("ANNUAL")}
                                variant="outline"
                                className="border-2 border-white text-white rounded-none font-black uppercase text-xs hover:bg-white hover:text-black bg-transparent"
                            >
                                Annual
                            </Button>
                            <div className="flex-1" />
                            <Button
                                onClick={handleResetUsage}
                                variant="outline"
                                className="border-2 border-yellow-400 text-yellow-400 rounded-none font-black uppercase text-xs hover:bg-yellow-400 hover:text-black bg-transparent"
                            >
                                <RotateCcw className="h-3 w-3 mr-2" />
                                Reset Usage
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Plan Management */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-2 border-black rounded-none shadow-none bg-white">
                            <CardHeader className="p-6 border-b-2 border-black flex flex-row items-center justify-between">
                                <CardTitle className="text-2xl font-black uppercase tracking-tighter">
                                    Plan & Credits
                                </CardTitle>
                                {!isEditing ? (
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-black hover:bg-slate-900 rounded-none font-black uppercase text-xs"
                                    >
                                        Edit Details
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleUpdate}
                                            className="bg-black hover:bg-slate-900 rounded-none font-black uppercase text-xs"
                                        >
                                            <Save className="h-3 w-3 mr-2" />
                                            Save
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditData({
                                                    plan: customer.plan,
                                                    planVariant: customer.planVariant || "",
                                                    expiresAt: customer.expiresAt
                                                        ? new Date(customer.expiresAt).toISOString().split('T')[0]
                                                        : "",
                                                    notes: customer.notes || ""
                                                });
                                            }}
                                            className="border-2 border-black rounded-none font-black uppercase text-xs"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="p-6">
                                {isEditing ? (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-black block mb-2">
                                                    Plan Type
                                                </label>
                                                <select
                                                    className="w-full h-10 border-2 border-black/10 rounded-none px-4 font-bold text-sm"
                                                    value={editData.plan}
                                                    onChange={(e) => setEditData({ ...editData, plan: e.target.value })}
                                                >
                                                    <option value="FREE">Free</option>
                                                    <option value="PAYG">Pay As You Go</option>
                                                    <option value="MONTHLY">Monthly</option>
                                                    <option value="ANNUAL">Annual</option>
                                                    <option value="ENTERPRISE">Enterprise</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-black block mb-2">
                                                    Expiry Date
                                                </label>
                                                <Input
                                                    type="date"
                                                    className="border-black/10 rounded-none font-medium"
                                                    value={editData.expiresAt}
                                                    onChange={(e) => setEditData({ ...editData, expiresAt: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="border-t-2 border-black/10 pt-6">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-black block mb-4">
                                                <Plus className="h-3 w-3 inline mr-2" />
                                                Add Extra Credits
                                            </label>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">
                                                        AI Full Papers
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        className="border-black/10 rounded-none font-bold text-center"
                                                        value={creditData.extraAiFullPapers}
                                                        onChange={(e) => setCreditData({ ...creditData, extraAiFullPapers: parseInt(e.target.value) || 0 })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">
                                                        AI Questions
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        className="border-black/10 rounded-none font-bold text-center"
                                                        value={creditData.extraAiQuestions}
                                                        onChange={(e) => setCreditData({ ...creditData, extraAiQuestions: parseInt(e.target.value) || 0 })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">
                                                        Clean Exports
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        className="border-black/10 rounded-none font-bold text-center"
                                                        value={creditData.extraExports}
                                                        onChange={(e) => setCreditData({ ...creditData, extraExports: parseInt(e.target.value) || 0 })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t-2 border-black/10 pt-6">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-black block mb-2">
                                                <StickyNote className="h-3 w-3 inline mr-2" />
                                                Notes (Payment Details, etc.)
                                            </label>
                                            <Textarea
                                                placeholder="Add any notes about this customer (payment reference, special requests, etc.)"
                                                className="border-black/10 rounded-none font-medium min-h-[100px]"
                                                value={editData.notes}
                                                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-3 border-b border-black/10">
                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Current Plan</span>
                                            <span className="px-3 py-1 text-sm font-black uppercase border-2 border-black rounded-none">
                                                {customer.plan}
                                            </span>
                                        </div>
                                        {customer.expiresAt && (
                                            <div className="flex justify-between items-center py-3 border-b border-black/10">
                                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Expires</span>
                                                <span className="font-bold">{new Date(customer.expiresAt).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center py-3 border-b border-black/10">
                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Extra AI Papers</span>
                                            <span className="font-bold">{customer.extraAiFullPapers}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 border-b border-black/10">
                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Extra AI Questions</span>
                                            <span className="font-bold">{customer.extraAiQuestions}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 border-b border-black/10">
                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Extra Exports</span>
                                            <span className="font-bold">{customer.extraExports}</span>
                                        </div>
                                        {customer.notes && (
                                            <div className="py-3">
                                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">Notes</span>
                                                <p className="text-sm text-slate-600 whitespace-pre-wrap">{customer.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Stats & Papers */}
                    <div className="space-y-6">
                        {/* Usage Stats */}
                        <Card className="border-2 border-black rounded-none shadow-none bg-white">
                            <CardHeader className="p-6 border-b-2 border-black">
                                <CardTitle className="text-xl font-black uppercase tracking-tighter">
                                    Usage Statistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-black" />
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Manual Papers</p>
                                        <p className="text-2xl font-black">{customer.manualPaperCount}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Sparkles className="h-5 w-5 text-black" />
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Papers Used</p>
                                        <p className="text-2xl font-black">{customer.aiFullPaperUsage}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Sparkles className="h-5 w-5 text-black" />
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Questions Used</p>
                                        <p className="text-2xl font-black">{customer.aiQuestionUsage}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-black" />
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Papers</p>
                                        <p className="text-2xl font-black">{customer.papers.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Papers */}
                        <Card className="border-2 border-black rounded-none shadow-none bg-white">
                            <CardHeader className="p-6 border-b-2 border-black">
                                <CardTitle className="text-xl font-black uppercase tracking-tighter">
                                    Recent Papers
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                {customer.papers.length === 0 ? (
                                    <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest py-4">
                                        No papers yet
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {customer.papers.slice(0, 5).map((paper) => (
                                            <div key={paper.id} className="p-3 border border-black/10 rounded-none">
                                                <p className="font-bold text-sm truncate">{paper.examName}</p>
                                                <p className="text-xs text-slate-500">
                                                    {paper.subject} • Class {paper.class}
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-1">
                                                    {new Date(paper.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
