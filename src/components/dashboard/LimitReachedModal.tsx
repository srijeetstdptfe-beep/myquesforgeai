import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Crown, ChevronRight, MessageCircle } from "lucide-react";
import Link from "next/link";

interface LimitReachedModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBuyCredit?: () => void; // Deprecated - unused
    isProcessing?: boolean;
}

export function LimitReachedModal({ isOpen, onClose }: LimitReachedModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg border-2 border-black rounded-none p-0 overflow-hidden">
                <div className="bg-black text-white p-8 pb-10">
                    <div className="w-12 h-12 rounded-lg border border-white/20 flex items-center justify-center mb-6">
                        <Shield className="h-6 w-6 text-white" />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black uppercase tracking-tighter">
                            Limit Reached.
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                            Free plan allows 3 papers
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8">
                    <p className="text-sm text-slate-500 font-medium mb-8">
                        Upgrade your plan to unlock unlimited paper creation, AI assistance, and clean exports. Contact us to get started!
                    </p>

                    <div className="space-y-3">
                        {/* PAYG Option */}
                        <Link href="/pricing#contact" className="block">
                            <div className="w-full p-4 border-2 border-slate-100 hover:border-black flex items-center justify-between group transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-100 group-hover:bg-black transition-colors">
                                        <Zap className="h-5 w-5 text-black group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <p className="font-black text-black uppercase tracking-tight text-sm">Pay As You Go</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Usage based • No commitment</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>

                        {/* Monthly Option */}
                        <Link href="/pricing#contact" className="block">
                            <div className="w-full p-4 border-2 border-black bg-black text-white flex items-center justify-between group hover:bg-slate-900 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white">
                                        <Crown className="h-5 w-5 text-black" />
                                    </div>
                                    <div>
                                        <p className="font-black uppercase tracking-tight text-sm">Monthly</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">₹699/mo • 8 AI Papers</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black uppercase tracking-widest px-2 py-0.5 bg-white text-black">Popular</span>
                                    <ChevronRight className="h-5 w-5 text-white/50 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>

                        {/* Annual Option */}
                        <Link href="/pricing#contact" className="block">
                            <div className="w-full p-4 border-2 border-slate-100 hover:border-black flex items-center justify-between group transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-100 group-hover:bg-black transition-colors">
                                        <Crown className="h-5 w-5 text-black group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <p className="font-black text-black uppercase tracking-tight text-sm">Annual</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">₹5,999/yr • Save 29%</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>

                        {/* Contact directly */}
                        <a href="https://wa.me/919545214074" target="_blank" rel="noopener noreferrer" className="block">
                            <div className="w-full p-4 border-2 border-green-500 hover:bg-green-50 flex items-center justify-between group transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-green-500">
                                        <MessageCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-black text-black uppercase tracking-tight text-sm">WhatsApp Us</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Quick response • Instant setup</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-green-500 group-hover:translate-x-1 transition-all" />
                            </div>
                        </a>
                    </div>

                    <Button
                        variant="ghost"
                        className="w-full mt-6 h-12 text-slate-400 hover:text-black hover:bg-transparent font-bold uppercase tracking-widest text-xs"
                        onClick={onClose}
                    >
                        Maybe Later
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
