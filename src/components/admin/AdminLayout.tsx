"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Tag, LogOut, FileText } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
    children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const navigation = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Customers", href: "/admin/customers", icon: Users },
        { name: "Offers", href: "/admin/offers", icon: Tag },
    ];

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/admin/login" });
    };

    return (
        <div className="min-h-screen bg-white flex selection:bg-black selection:text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r-2 border-black bg-white flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b-2 border-black">
                    <h1 className="text-2xl font-black uppercase tracking-tighter">Creator Panel</h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                        Customer Management
                    </p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-none font-black uppercase text-xs tracking-widest transition-all ${isActive
                                    ? "bg-black text-white"
                                    : "text-black hover:bg-slate-100"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t-2 border-black">
                    <div className="mb-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Logged in as
                        </p>
                        <p className="text-sm font-bold text-black truncate mt-1">
                            {session?.user?.email}
                        </p>
                    </div>
                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full border-2 border-black rounded-none font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all"
                    >
                        <LogOut className="h-3 w-3 mr-2" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
