"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Tag } from "lucide-react";
import { toast } from "sonner";

interface Offer {
    id: string;
    code: string;
    description: string;
    discountType: string;
    discountValue: number;
    maxUses: number | null;
    currentUses: number;
    isActive: boolean;
    validUntil: Date | null;
    applicablePlans: string;
    createdAt: Date;
}

export default function OffersPage() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        description: "",
        discountType: "PERCENTAGE",
        discountValue: "",
        maxUses: "",
        validUntil: "",
        applicablePlans: "MONTHLY,ANNUAL",
    });

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/offers");
            if (res.ok) {
                const data = await res.json();
                setOffers(data.offers);
            }
        } catch (error) {
            console.error("Failed to fetch offers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateOffer = async (e: React.FormEvent) => {
        e.preventDefault();
        const loadingToast = toast.loading("Creating offer...");

        try {
            const res = await fetch("/api/admin/offers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success("Offer created successfully!", { id: loadingToast });
                setShowCreateForm(false);
                setFormData({
                    code: "",
                    description: "",
                    discountType: "PERCENTAGE",
                    discountValue: "",
                    maxUses: "",
                    validUntil: "",
                    applicablePlans: "MONTHLY,ANNUAL",
                });
                fetchOffers();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to create offer", { id: loadingToast });
            }
        } catch (error) {
            toast.error("An error occurred", { id: loadingToast });
        }
    };

    return (
        <AdminLayout>
            <div className="p-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-5xl font-black text-black uppercase tracking-tighter mb-2">
                            Offers
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Promotional Codes & Discounts
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="bg-black hover:bg-slate-900 h-12 rounded-none font-black uppercase tracking-widest text-xs"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Offer
                    </Button>
                </div>

                {/* Create Form */}
                {showCreateForm && (
                    <Card className="border-2 border-black rounded-none shadow-none bg-white mb-6">
                        <CardHeader className="p-6 border-b-2 border-black bg-black text-white">
                            <CardTitle className="text-xl font-black uppercase tracking-tighter">
                                Create New Offer
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleCreateOffer} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-black block mb-2">
                                            Offer Code
                                        </label>
                                        <Input
                                            required
                                            placeholder="SAVE20"
                                            className="border-black/10 rounded-none font-medium"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-black block mb-2">
                                            Discount Type
                                        </label>
                                        <select
                                            className="w-full h-10 border-2 border-black/10 rounded-none px-4 font-bold text-sm"
                                            value={formData.discountType}
                                            onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                        >
                                            <option value="PERCENTAGE">Percentage</option>
                                            <option value="FIXED">Fixed Amount</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-black block mb-2">
                                        Description
                                    </label>
                                    <Input
                                        required
                                        placeholder="20% off on annual plans"
                                        className="border-black/10 rounded-none font-medium"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-black block mb-2">
                                            Discount Value
                                        </label>
                                        <Input
                                            required
                                            type="number"
                                            step="0.01"
                                            placeholder="20"
                                            className="border-black/10 rounded-none font-medium"
                                            value={formData.discountValue}
                                            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-black block mb-2">
                                            Max Uses (Optional)
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="100"
                                            className="border-black/10 rounded-none font-medium"
                                            value={formData.maxUses}
                                            onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-black block mb-2">
                                            Valid Until (Optional)
                                        </label>
                                        <Input
                                            type="date"
                                            className="border-black/10 rounded-none font-medium"
                                            value={formData.validUntil}
                                            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-2">
                                    <Button
                                        type="submit"
                                        className="bg-black hover:bg-slate-900 rounded-none font-black uppercase tracking-widest text-xs"
                                    >
                                        Create Offer
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowCreateForm(false)}
                                        className="border-2 border-black rounded-none font-black uppercase tracking-widest text-xs"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Offers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        <div className="col-span-full text-center text-slate-400 text-sm font-bold uppercase tracking-widest py-12">
                            Loading...
                        </div>
                    ) : offers.length === 0 ? (
                        <div className="col-span-full text-center text-slate-400 text-sm font-bold uppercase tracking-widest py-12">
                            No offers created yet
                        </div>
                    ) : (
                        offers.map((offer) => (
                            <Card key={offer.id} className="border-2 border-black rounded-none shadow-none bg-white">
                                <CardHeader className="p-6 pb-4 border-b-2 border-black">
                                    <div className="flex items-start justify-between">
                                        <Tag className="h-6 w-6 text-black" />
                                        <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-none ${offer.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                            {offer.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                    <CardTitle className="text-2xl font-black uppercase tracking-tighter mt-4">
                                        {offer.code}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <p className="text-sm text-slate-600 mb-4">{offer.description}</p>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 font-bold uppercase">Discount:</span>
                                            <span className="font-black">
                                                {offer.discountType === "PERCENTAGE" ? `${offer.discountValue}%` : `₹${offer.discountValue}`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 font-bold uppercase">Uses:</span>
                                            <span className="font-black">
                                                {offer.currentUses} / {offer.maxUses || "∞"}
                                            </span>
                                        </div>
                                        {offer.validUntil && (
                                            <div className="flex justify-between">
                                                <span className="text-slate-400 font-bold uppercase">Expires:</span>
                                                <span className="font-black">
                                                    {new Date(offer.validUntil).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
