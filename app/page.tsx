"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Command,
  Zap,
  BarChart3,
  Globe,
  Sparkles,
  Users,
  Target,
  Cpu,
  Layers,
  ShieldCheck,
  TrendingUp,
  LineChart,
  Megaphone
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#05090E] font-satoshi overflow-x-hidden selection:bg-[#1F57F5]/20 selection:text-[#1F57F5]">

      {/* --- Navigation --- */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm py-4" : "bg-transparent py-6"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#05090E] rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/10">
              <Command className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#05090E]">
              Growzzy<span className="text-[#1F57F5]">OS</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["Intelligence", "Creative Studio", "Enterprise", "Pricing"].map((item) => (
              <Link key={item} href="#" className="text-[14px] font-bold text-[#5E6B7A] hover:text-[#05090E] transition-colors">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth" className="hidden md:block text-[14px] font-bold text-[#05090E] hover:text-[#1F57F5] transition-colors px-4 py-2 hover:bg-gray-100 rounded-full">
              Sign In
            </Link>
            <Link href="/auth" className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#05090E] text-white text-[14px] font-bold shadow-xl shadow-black/5 hover:bg-[#1F57F5] transition-all duration-300 hover:-translate-y-0.5">
              Get Started
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* --- Hero Section --- */}
        <section className="relative pt-40 pb-32 lg:pt-52 lg:pb-40 overflow-hidden">
          {/* Luminous Gradient Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[1000px] bg-[radial-gradient(circle_at_top,_#FFFFFF_0%,_#F1F5F9_50%,_#F8FAFC_100%)] opacity-100" />
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[100px]" />
            {/* Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(5,9,14,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(5,9,14,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 text-center space-y-12 relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="flex h-2 w-2 rounded-full bg-[#1F57F5] animate-pulse"></span>
              <span className="text-[12px] font-bold text-[#05090E] tracking-wide uppercase">Neural Marketing Protocol v2.0</span>
            </div>

            {/* Headline */}
            <div className="space-y-6 max-w-5xl mx-auto">
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-[#05090E] leading-[0.95] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                Orchestrate Growth <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1F57F5] to-[#2BAFF2]">at Hyperspeed.</span>
              </h1>
              <p className="text-xl md:text-2xl text-[#5E6B7A] leading-relaxed max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 font-medium tracking-tight">
                The first AI-native Operating System for performance marketing.
                Unify ads, generate high-converting creative, and predict revenue with neural precision.
              </p>
            </div>

            {/* Hero CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Link href="/auth" className="h-14 px-8 rounded-full bg-[#05090E] text-white font-bold text-[15px] flex items-center gap-2 hover:bg-[#1F57F5] hover:scale-105 transition-all shadow-xl shadow-[#05090E]/10">
                Deploy Environment <Zap className="w-4 h-4 fill-current" />
              </Link>
              <Link href="#" className="h-14 px-8 rounded-full bg-white text-[#05090E] border border-gray-200 font-bold text-[15px] flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm hover:border-gray-300">
                View Live Demo
              </Link>
            </div>

            {/* Floating Glass Cards */}
            <div className="hidden lg:block absolute top-[25%] left-10 animate-float-slow">
              <div className="glass-card p-4 flex items-center gap-4 w-72 rotate-[-6deg] bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#1F57F5]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">AI Creative Score</p>
                  <p className="text-2xl font-bold text-[#05090E]">98/100</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block absolute top-[35%] right-10 animate-float-delayed">
              <div className="glass-card p-4 flex items-center gap-4 w-80 rotate-[3deg] bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">ROAS Projection</p>
                  <p className="text-2xl font-bold text-[#05090E]">5.2x <span className="text-sm text-emerald-500 font-medium">+14%</span></p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- Trusted Logos --- */}
        <section className="py-10 border-y border-gray-100 bg-white/50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.2em] mb-8">Powering Next-Gen Brands</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-20 items-center opacity-40 hover:opacity-100 transition-opacity duration-500 grayscale">
              {/* Minimalist Logo Placeholders - Replaced icons with text for robust rendering */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-black rounded-full" />
                <span className="text-xl font-bold text-[#05090E] tracking-tight">Vercel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded-lg transform rotate-12" />
                <span className="text-xl font-bold text-[#05090E] tracking-tight font-serif">Stripe</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-black rounded-none" />
                <span className="text-xl font-bold text-[#05090E] tracking-tight font-mono">Uber</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-600 rounded-full" />
                <span className="text-xl font-bold text-[#05090E] tracking-tight">Loom</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- Features Grid --- */}
        <section className="py-32 relative bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-[#05090E] tracking-tight">
                Complete Command Over <br /> Your <span className="text-[#1F57F5]">Digital Empire</span>
              </h2>
              <p className="text-lg text-[#5E6B7A]">Replacing fragmented tools with a unified intelligence layer.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group bg-[#F8FAFC] rounded-[32px] p-8 border border-white shadow-sm hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#1F57F5] shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  <Cpu className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#05090E] mb-3">Neural Intelligence</h3>
                <p className="text-[#5E6B7A] leading-relaxed">
                  Our proprietary AI model analyzes cross-platform data to predict performance drift before it happens.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-[#F8FAFC] rounded-[32px] p-8 border border-white shadow-sm hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#2BAFF2] shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  <Layers className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#05090E] mb-3">Unified Exhaust</h3>
                <p className="text-[#5E6B7A] leading-relaxed">
                  Sync Meta, Google, and LinkedIn ads into a single command center. Stop tab-switching forever.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-[#F8FAFC] rounded-[32px] p-8 border border-white shadow-sm hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#f59e0b] shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#05090E] mb-3">Precision Targeting</h3>
                <p className="text-[#5E6B7A] leading-relaxed">
                  AI-generated audience segments that update in real-time based on high-value conversion signals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Product Demo Section --- */}
        <section className="py-20 px-6 bg-[#05090E] text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-bold uppercase tracking-wider">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1F57F5] animate-pulse" /> Live System
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  <span className="text-[#1F57F5]">Autonomous</span> Campaign Management
                </h2>
              </div>
              <div className="max-w-md text-gray-400 font-medium">
                Watch the Neural Copilot detect a ROAS drop and automatically reallocate budget to high-performing creatives.
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="relative rounded-2xl border border-white/10 bg-[#0F172A] shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1F57F5]/10 to-transparent" />
              <div className="p-8 grid grid-cols-12 gap-6 h-full opacity-90">
                {/* Sidebar Mock */}
                <div className="col-span-2 border-r border-white/5 space-y-4 hidden md:block">
                  <div className="w-8 h-8 bg-[#1F57F5] rounded-lg mb-8" />
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-8 bg-white/5 rounded-lg" />)}
                </div>
                {/* Content */}
                <div className="col-span-12 md:col-span-10 space-y-6">
                  <div className="flex justify-between">
                    <div className="w-48 h-8 bg-white/5 rounded-lg" />
                    <div className="w-24 h-8 bg-[#1F57F5] rounded-lg" />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl border border-white/5" />)}
                  </div>
                  <div className="h-64 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden flex items-end pb-0 px-4 gap-2">
                    {/* Fake Chart */}
                    {[30, 45, 32, 50, 60, 55, 70, 65, 80, 75, 90, 85].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-[#1F57F5]/50 to-[#2BAFF2]/80 rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating notification */}
              <div className="absolute bottom-8 right-8 bg-[#1F57F5] p-4 rounded-xl shadow-lg border border-white/20 flex gap-4 max-w-sm animate-bounce-slow">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-white uppercase tracking-wider mb-1">Auto-Optimization</p>
                  <p className="text-sm text-white/90">Budget reallocated to "Campaign Alpha" (+24% ROAS predicted)</p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* --- Bottom CTA --- */}
        <section className="py-32 px-6 bg-white relative">
          <div className="max-w-5xl mx-auto text-center space-y-10">
            <h2 className="text-5xl md:text-7xl font-bold text-[#05090E] tracking-tighter">
              Ready to <span className="text-[#1F57F5]">Scale?</span>
            </h2>
            <p className="text-xl text-[#5E6B7A] max-w-2xl mx-auto">
              Join the elite marketers using GrowzzyOS to dominate their sector.
              Initialize your node today.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/auth" className="h-14 px-10 rounded-full bg-[#05090E] text-white font-bold text-[16px] flex items-center gap-2 hover:bg-[#1F57F5] hover:scale-110 transition-all shadow-2xl">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-12 font-satoshi">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 mb-20">
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#05090E] rounded-lg flex items-center justify-center text-white">
                <Command className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-[#05090E]">Growzzy<span className="text-[#1F57F5]">OS</span></span>
            </div>
            <p className="text-[#5E6B7A] text-sm leading-relaxed max-w-xs font-medium">
              The operating system for modern growth teams. Automated, intelligent, and designed for scale.
            </p>
          </div>

          {[
            { header: "Platform", links: ["Intelligence", "Creative Studio", "Automations", "Integrations"] },
            { header: "Company", links: ["Manifesto", "Careers", "Security", "Contact"] },
            { header: "Resources", links: ["Documentation", "API Reference", "System Status", "Changelog"] },
          ].map((col, i) => (
            <div key={i} className="space-y-4">
              <h4 className="text-[13px] font-bold text-[#05090E] uppercase tracking-wider">{col.header}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-[#5E6B7A] hover:text-[#1F57F5] font-medium transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-gray-50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
          <p>© 2026 Growzzy Inc. All Systems Nominal.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-[#05090E] transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-[#05090E] transition-colors">Privacy Protocol</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
