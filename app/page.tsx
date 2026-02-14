"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Globe,
  Zap,
  ShieldCheck,
  BarChart3,
  Sparkles,
  Command,
  CreditCard,
  Layers,
  MoveRight
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white text-[#05090E] font-satoshi overflow-x-hidden selection:bg-[#1F57F5]/20 selection:text-[#1F57F5]">

      {/* --- Navigation --- */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-md border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-4" : "bg-transparent py-6"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1F57F5] to-[#2BAFF2] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Command className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#05090E]">
              Growzzy<span className="text-[#1F57F5]">OS</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["Intelligence", "Solutions", "Enterprise", "Pricing"].map((item) => (
              <Link key={item} href="#" className="text-[14px] font-medium text-[#5E6B7A] hover:text-[#1F57F5] transition-colors">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth" className="hidden md:block text-[14px] font-medium text-[#05090E] hover:text-[#1F57F5] transition-colors">
              Log in
            </Link>
            <Link href="/auth" className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#1F57F5] to-[#2BAFF2] text-white text-[14px] font-medium shadow-[0_10px_20px_rgba(31,87,245,0.3)] hover:shadow-[0_15px_30px_rgba(31,87,245,0.4)] hover:-translate-y-0.5 transition-all duration-300">
              Get Started
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* --- Hero Section --- */}
        <section className="relative pt-40 pb-32 lg:pt-52 lg:pb-40 overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[1000px] -z-10 pointer-events-none">
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-white to-transparent blur-[120px]" />
            <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-blue-200/20 rounded-full blur-[100px]" />
            <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-cyan-100/30 rounded-full blur-[80px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 text-center space-y-10 relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-blue-100 backdrop-blur-md shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="flex h-2 w-2 rounded-full bg-[#1F57F5]"></span>
              <span className="text-[13px] font-medium text-[#1F57F5]">New Intelligence Protocol v4.0</span>
            </div>

            {/* Headline */}
            <div className="space-y-6 max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#05090E] leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                The Operating System for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1F57F5] to-[#2BAFF2]">Modern Growth.</span>
              </h1>
              <p className="text-lg md:text-xl text-[#5E6B7A] leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                Unify your marketing stack with a premium orchestration layer. Designed for high-velocity teams who demand precision and neural intelligence.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Link href="/auth" className="h-12 px-8 rounded-full bg-gradient-to-r from-[#1F57F5] to-[#2BAFF2] text-white font-semibold shadow-[0_10px_30px_rgba(31,87,245,0.3)] hover:shadow-[0_15px_40px_rgba(31,87,245,0.4)] hover:-translate-y-1 transition-all flex items-center gap-2">
                Deploy Protocol <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="h-12 px-8 rounded-full bg-white border border-gray-200 text-[#05090E] font-medium shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2">
                <Play className="w-4 h-4 fill-current text-[#1F57F5]" /> View Demo
              </button>
            </div>

            {/* Floating Glass Dashboard Preview */}
            <div className="mt-20 relative max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-[40px] blur-2xl -z-10" />
              <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[24px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] p-3 md:p-4 overflow-hidden">
                <div className="bg-white rounded-[16px] border border-gray-100 overflow-hidden shadow-inner relative aspect-[16/9]">
                  {/* Mock UI Header */}
                  <div className="h-14 border-b border-gray-100 flex items-center px-6 justify-between bg-white/80">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <div className="h-2 w-32 bg-gray-100 rounded-full" />
                  </div>
                  {/* Mock UI Body */}
                  <div className="p-8 grid grid-cols-12 gap-8 bg-[#F8FAFC]/50 h-full">
                    <div className="col-span-3 space-y-4">
                      <div className="h-24 bg-white rounded-xl border border-gray-100 shadow-sm" />
                      <div className="h-24 bg-white rounded-xl border border-gray-100 shadow-sm" />
                      <div className="h-full bg-white rounded-xl border border-gray-100 shadow-sm opacity-50" />
                    </div>
                    <div className="col-span-9 space-y-6">
                      <div className="flex justify-between items-end">
                        <div className="space-y-2">
                          <div className="h-8 w-64 bg-[#05090E] rounded-lg" />
                          <div className="h-4 w-40 bg-gray-200 rounded-lg" />
                        </div>
                        <div className="h-10 w-32 bg-[#1F57F5]/10 rounded-lg" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-32 bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-2">
                          <div className="h-8 w-8 rounded-lg bg-blue-50" />
                          <div className="h-4 w-16 bg-gray-100 rounded" />
                          <div className="h-6 w-24 bg-[#05090E] rounded" />
                        </div>
                        <div className="h-32 bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-2">
                          <div className="h-8 w-8 rounded-lg bg-emerald-50" />
                          <div className="h-4 w-16 bg-gray-100 rounded" />
                          <div className="h-6 w-24 bg-[#05090E] rounded" />
                        </div>
                        <div className="h-32 bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-2">
                          <div className="h-8 w-8 rounded-lg bg-amber-50" />
                          <div className="h-4 w-16 bg-gray-100 rounded" />
                          <div className="h-6 w-24 bg-[#05090E] rounded" />
                        </div>
                      </div>
                      <div className="h-64 bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-end gap-2">
                        {[40, 65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                          <div key={i} className="flex-1 bg-blue-50 rounded-t-sm hover:bg-blue-100 transition-colors relative group">
                            <div style={{ height: `${h}%` }} className="absolute bottom-0 left-0 w-full bg-[#1F57F5] rounded-t-sm opacity-80 group-hover:opacity-100 transition-all" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Floating Card Overlay */}
                  <div className="absolute bottom-12 right-12 w-64 p-4 bg-white/90 backdrop-blur-md border border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.1)] rounded-2xl animate-bounce-slow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-[#05090E]">Optimization Complete</p>
                        <p className="text-[10px] text-gray-500">Just now</p>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[92%]" />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-medium">
                      <span className="text-gray-500">Efficiency</span>
                      <span className="text-[#05090E]">+24.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Features Grid (Glassmorphism) --- */}
        <section className="py-32 relative">
          <div className="max-w-7xl mx-auto px-6 space-y-20">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="text-[#1F57F5] font-semibold tracking-wider uppercase text-sm">System Capabilities</span>
              <h2 className="text-4xl font-bold text-[#05090E]">Engineered for <br /> <span className="text-[#1F57F5]">Precision Scale.</span></h2>
              <p className="text-[#5E6B7A] text-lg">Every component is meticulously crafted to reduce friction and maximize yield.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Unified Sync", desc: "Real-time bi-directional data streams across all major ad networks.", icon: Globe },
                { title: "Neural Analytics", desc: "Predictive modeling that identifies ROAS decay before it happens.", icon: BarChart3 },
                { title: "Smart Contracts", desc: "Automated budget allocation based on performance thresholds.", icon: Layers },
                { title: "Asset Generation", desc: "AI-synthesized creative variations deployed in milliseconds.", icon: Sparkles },
                { title: "Secure Vault", desc: "SOC2 Type II certified infrastructure with end-to-end encryption.", icon: ShieldCheck },
                { title: "Instant Settlements", desc: "Reduce cash drag with automated campaign financing protocols.", icon: CreditCard },
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-[24px] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(31,87,245,0.08)] hover:border-blue-100 transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-50/50 rounded-2xl flex items-center justify-center text-[#1F57F5] mb-6 group-hover:bg-[#1F57F5] group-hover:text-white transition-colors duration-300">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#05090E] mb-3">{feature.title}</h3>
                  <p className="text-[#5E6B7A] leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Trust / Proof --- */}
        <section className="py-24 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
            <p className="text-sm font-semibold text-[#94A3B8] uppercase tracking-widest">Trusted by Next-Gen Enterprise Teams</p>
            <div className="flex flex-wrap justify-center gap-12 lg:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 w-32 bg-[#05090E] rounded opacity-20" />
              ))}
            </div>
          </div>
        </section>

        {/* --- Large CTA --- */}
        <section className="py-32 relative overflow-hidden bg-[#05090E] text-white">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[#1F57F5]/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#00DDFF]/10 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-10">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
              Ready to Upgrade <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1F57F5] to-[#2BAFF2]">Your Intelligence?</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/auth" className="h-14 px-10 rounded-full bg-gradient-to-r from-[#1F57F5] to-[#2BAFF2] text-white font-semibold text-lg shadow-[0_20px_50px_rgba(31,87,245,0.4)] hover:shadow-[0_10px_30px_rgba(31,87,245,0.5)] hover:-translate-y-1 transition-all flex items-center gap-3">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="h-14 px-10 rounded-full border border-white/20 hover:bg-white/10 transition-all font-medium text-lg">
                Contact Sales
              </button>
            </div>
            <p className="text-white/40 text-sm">No credit card required for sandbox environment.</p>
          </div>
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 mb-20">
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#05090E] rounded-lg flex items-center justify-center text-white">
                <Command className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-[#05090E]">GrowzzyOS</span>
            </div>
            <p className="text-[#5E6B7A] text-sm leading-relaxed max-w-xs">
              The financial operating system for modern marketing teams.
              Merging intelligence, automation, and scale into one glass pane.
            </p>
          </div>

          {[
            { header: "Platform", links: ["Intelligence", "Automations", "Reporting", "Creative Studio"] },
            { header: "Company", links: ["About", "Careers", "Blog", "Press"] },
            { header: "Resources", links: ["Documentation", "API Reference", "Status", "Support"] },
            { header: "Legal", links: ["Privacy", "Terms", "Security", "DPA"] },
          ].map((col, i) => (
            <div key={i} className="space-y-4">
              <h4 className="text-sm font-bold text-[#05090E]">{col.header}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-[#5E6B7A] hover:text-[#1F57F5] transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-gray-50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#94A3B8]">
          <p>© 2024 Growzzy Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-[#05090E]">Twitter</Link>
            <Link href="#" className="hover:text-[#05090E]">LinkedIn</Link>
            <Link href="#" className="hover:text-[#05090E]">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
