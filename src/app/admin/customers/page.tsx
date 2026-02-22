"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Customer {
    id: string;
    name: string | null;
    email: string;
    plan: string;
    planVariant: string | null;
    expiresAt: Date | null;
    _count: {
        papers: number;
    };
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [search, setSearch] = useState("");
    const [planFilter, setPlanFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, [search, planFilter, page]);

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                search,
                plan: planFilter,
                page: page.toString(),
            });

            const res = await fetch(`/api/admin/customers?${params}`);
            if (res.ok) {
                const data = await res.json();
                setCustomers(data.customers);
                setTotalPages(data.pagination.totalPages);
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
                        Customers
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Customer Management & Analytics
                    </p>
                </div>

                {/* Filters */}
                <Card className="border-2 border-black rounded-none shadow-none bg-white mb-6">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search by email or name..."
                                    className="pl-10 h-10 border-black/10 rounded-none focus-visible:ring-black font-medium"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                />
                            </div>

                            {/* Plan Filter */}
                            <select
                                className="h-10 border-2 border-black/10 rounded-none px-4 font-black text-xs uppercase tracking-widest"
                                value={planFilter}
                                onChange={(e) => {
                                    setPlanFilter(e.target.value);
                                    setPage(1);
                                }}
                            >
                                <option value="ALL">All Plans</option>
                                <option value="FREE">Free</option>
                                <option value="PAYG">PAYG</option>
                                <option value="MONTHLY">Monthly</option>
                                <option value="ANNUAL">Annual</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Customers Table */}
                <Card className="border-2 border-black rounded-none shadow-none bg-white">
                    <CardHeader className="p-6 border-b-2 border-black">
                        <CardTitle className="text-2xl font-black uppercase tracking-tighter">
                            Customer List
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-6 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                                Loading...
                            </div>
                        ) : customers.length === 0 ? (
                            <div className="p-6 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                                No customers found
                            </div>
                        ) : (
                            <>
                                <table className="w-full">
                                    <thead className="border-b-2 border-black">
                                        <tr className="bg-slate-50">
                                            <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.2em]">
                                                Customer
                                            </th>
                                            <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.2em]">
                                                Plan
                                            </th>
                                            <th className="text-center p-4 text-[10px] font-black uppercase tracking-[0.2em]">
                                                Papers
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customers.map((customer, index) => (
                                            <tr
                                                key={customer.id}
                                                className={`cursor-pointer hover:bg-slate-50 transition-colors ${index !== customers.length - 1 ? "border-b border-black/10" : ""}`}
                                                onClick={() => window.location.href = `/admin/customers/${customer.id}`}
                                            >
                                                <td className="p-4">
                                                    <div className="font-semibold text-sm">{customer.name || "N/A"}</div>
                                                    <div className="text-xs text-slate-500">{customer.email}</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="inline-block px-2 py-1 text-[10px] font-black uppercase tracking-widest border border-black rounded-none">
                                                        {customer.plan}
                                                        {customer.planVariant && ` - ${customer.planVariant}`}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center font-bold">
                                                    {customer._count.papers}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                <div className="p-6 border-t-2 border-black flex items-center justify-between">
                                    <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                        Page {page} of {totalPages}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-2 border-black rounded-none font-black uppercase text-xs"
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-2 border-black rounded-none font-black uppercase text-xs"
                                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
