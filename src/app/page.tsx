"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  Languages,
  Layout,
  Download,
  ShieldCheck,
  Zap,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Library,
  PenTool,
  Scroll
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const floatingElement = (delay: number) => ({
  animate: {
    y: [0, -15, 0],
    rotate: [0, 5, -5, 0],
  },
  transition: {
    duration: 6,
    repeat: Infinity,
    delay: delay,
    ease: "easeInOut" as const
  }
});

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden selection:bg-black selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-black tracking-tighter">PaperCraft</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-semibold text-slate-500 hover:text-black transition-colors uppercase tracking-widest">Features</Link>
          <Link href="/pricing" className="text-sm font-semibold text-slate-500 hover:text-black transition-colors uppercase tracking-widest">Pricing</Link>
          <Link href="/contact" className="text-sm font-semibold text-slate-500 hover:text-black transition-colors uppercase tracking-widest">Support</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-black hover:opacity-70 transition-opacity">Login</Link>
          <Button asChild className="bg-black hover:bg-slate-800 text-white rounded-md px-6 font-bold">
            <Link href="/register">Join Platform</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Bookish Floating Elements Background */}
        <div className="absolute inset-0 -z-10 pointer-events-none opacity-[0.03]">
          <motion.div {...floatingElement(0)} className="absolute top-40 left-[10%]"><Library size={120} /></motion.div>
          <motion.div {...floatingElement(1)} className="absolute top-20 right-[15%]"><BookOpen size={100} /></motion.div>
          <motion.div {...floatingElement(2)} className="absolute bottom-40 left-[20%]"><PenTool size={80} /></motion.div>
          <motion.div {...floatingElement(3)} className="absolute bottom-20 right-[10%]"><Scroll size={140} /></motion.div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,black_0%,transparent_70%)] opacity-[0.02]" />
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm border border-black/10 text-black text-[10px] font-black uppercase tracking-[0.2em] mb-12"
          >
            <Sparkles className="h-3 w-3" />
            AI-Enhanced Pedagogy
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-[9rem] font-black text-black leading-[0.9] mb-12 tracking-tighter"
          >
            EDITORIAL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-black to-slate-400">PRECISION.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-16 font-medium"
          >
            The premium visual builder for educators. Create authentic, multi-language exam papers with the speed of AI and the feel of traditional publishing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24"
          >
            <Button asChild size="lg" className="h-16 px-10 text-lg bg-black hover:bg-slate-900 text-white rounded-none border border-black group transition-all">
              <Link href="/register" className="flex items-center gap-3">
                Get Started Free
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-16 px-10 text-lg border-black/10 text-black rounded-none hover:bg-black hover:text-white transition-all">
              <Link href="/dashboard">Access Dashboard</Link>
            </Button>
          </motion.div>

          {/* Paper Stack UI Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="absolute -inset-10 bg-black/5 blur-[100px] -z-10" />

            {/* Layered Paper Effect */}
            <div className="relative">
              <div className="absolute top-4 left-4 w-full h-full bg-slate-100 border border-black/5 -z-20 rotate-1 shadow-sm" />
              <div className="absolute top-2 left-2 w-full h-full bg-slate-50 border border-black/5 -z-10 rotate-[-1deg] shadow-sm" />

              <div className="bg-white border border-black/10 shadow-2xl overflow-hidden aspect-[16/10] flex flex-col">
                <div className="h-14 border-b border-black/5 bg-slate-50 flex items-center px-6 justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-black/20" />
                    <div className="text-[10px] font-black text-black tracking-widest uppercase">PaperCraft Visual Editor</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full border border-black/10" />
                    <div className="w-2 h-2 rounded-full border border-black/10" />
                  </div>
                </div>
                <div className="flex-1 p-10 bg-white grid grid-cols-12 gap-10">
                  <div className="col-span-3 border-r border-black/5 space-y-6">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`h-2 bg-slate-100 rounded-full ${i === 2 ? 'w-full' : 'w-2/3'}`} />
                    ))}
                  </div>
                  <div className="col-span-9 space-y-12">
                    <div className="space-y-4">
                      <div className="w-1/3 h-4 bg-black rounded-sm" />
                      <div className="w-full h-2 bg-slate-100 rounded-full" />
                      <div className="w-2/3 h-2 bg-slate-100 rounded-full" />
                    </div>
                    <div className="p-8 border-2 border-dashed border-black/5 bg-slate-50/50 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3 flex-1">
                          <div className="w-3/4 h-3 bg-black/10 rounded-full" />
                          <div className="w-1/2 h-2 bg-slate-200 rounded-full" />
                        </div>
                        <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-[10px] text-white font-bold">10</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-10 border border-black/10 bg-white" />
                        <div className="h-10 border border-black/10 bg-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grid Features */}
      <section id="features" className="py-32 px-6 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24 border-b border-white/10 pb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[0.9] tracking-tighter uppercase">Academic <br /> Standards.</h2>
              <p className="text-xl text-slate-400 font-medium">Built with the rigor required for formal examinations. No compromises on quality or structure.</p>
            </div>
            <Link href="/register" className="text-white text-sm font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity">
              Start Building Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-y-20 gap-x-12"
          >
            {[
              {
                icon: <Layout className="h-6 w-6" />,
                title: "Visual Drafting",
                desc: "Every margin, every font size, precisely where it belongs on the A4 canvas."
              },
              {
                icon: <Sparkles className="h-6 w-6" />,
                title: "AI Synthesis",
                desc: "Questions generated from core subject matter expertise and Bloom's Taxonomy."
              },
              {
                icon: <Languages className="h-6 w-6" />,
                title: "Vernacular Support",
                desc: "Seamlessly handle 22 Indian languages with high-fidelity Unicode rendering."
              },
              {
                icon: <Download className="h-6 w-6" />,
                title: "Print Optimized",
                desc: "Export to industry-standard PDF formats. Zero layout shifting, guaranteed."
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: "Instant Fulfillment",
                desc: "Immediate delivery of license keys and extra credits upon transaction completion."
              },
              {
                icon: <ShieldCheck className="h-6 w-6" />,
                title: "Secure Vault",
                desc: "Your data is private. Your papers are protected with industry-standard encryption."
              }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeIn} className="group">
                <div className="mb-6 opacity-40 group-hover:opacity-100 transition-opacity">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Monochrome CTA */}
      <section className="py-40 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto border-2 border-black p-12 md:p-24 text-center relative overflow-hidden group bg-white"
        >
          <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] z-0" />
          <h2 className="text-4xl md:text-7xl font-black mb-8 leading-none tracking-tighter group-hover:text-white transition-colors duration-500 relative z-10">
            CRAFT YOUR NEXT <br /> EXAMINATION.
          </h2>
          <p className="text-xl text-slate-500 mb-12 max-w-xl mx-auto font-medium group-hover:text-slate-300 transition-colors duration-500 relative z-10">
            Professional, secure, and infinitely scalable. Joins 5,000+ educators streamlining their paper creation.
          </p>
          <div className="relative z-10">
            <Button asChild size="lg" className="h-16 px-12 text-xl bg-black text-white hover:bg-slate-900 rounded-none font-bold group-hover:bg-white group-hover:text-black transition-all">
              <Link href="/register">Join the Platform</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
