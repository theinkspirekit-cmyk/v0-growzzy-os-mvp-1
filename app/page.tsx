"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Play,
  Star,
  ChevronDown,
  BarChart3,
  Zap,
  Target,
  TrendingUp,
  Sparkles,
  Bot,
  Wand2,
  PieChart,
  LineChart,
  Check,
  Menu,
  X,
  ArrowUpRight,
  Layers,
  Shield,
  Clock,
  RefreshCw,
  Globe,
  Command,
  ShieldCheck,
  Activity,
  Cpu,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const integrations = [
    { name: "Meta Ads", icon: Globe, color: "#1F57F5", desc: "Performance Scaling" },
    { name: "Google Ads", icon: Globe, color: "#1F57F5", desc: "Search Intelligence" },
    { name: "LinkedIn", icon: Globe, color: "#1F57F5", desc: "B2B Architecture" },
    { name: "Shopify", icon: Globe, color: "#1F57F5", desc: "Ecom Synchronicity" },
  ]

  const features = [
    {
      icon: BarChart3,
      title: "Unified Analytics",
      description: "Real-time metrics across all protocols unified in a single high-fidelity commander view.",
      gradient: "from-[#1F57F5]/10 to-[#00DDFF]/10",
    },
    {
      icon: Cpu,
      title: "Neural Co-Pilot",
      description: "Advanced cognitive recommendations and autonomous campaign balancing powered by OS core.",
      gradient: "from-[#1F57F5]/10 to-[#2BAFF2]/10",
    },
    {
      icon: Wand2,
      title: "Ad Generator",
      description: "Synthesize high-converting ad creatives automatically with neural engineering assistance.",
      gradient: "from-[#00DDFF]/10 to-[#1F57F5]/10",
    },
    {
      icon: Target,
      title: "Smart Targeting",
      description: "Precision-engineered audience segments for maximum yield and operational efficiency.",
      gradient: "from-[#1F57F5]/10 to-[#2BAFF2]/10",
    },
    {
      icon: Zap,
      title: "Orchestration",
      description: "Automate complex marketing workflows and scale your multi-channel deployment on autopilot.",
      gradient: "from-[#00DDFF]/10 to-[#1F57F5]/10",
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Security",
      description: "Military-grade data encryption and SOC2 compliant infrastructure for mission-critical operations.",
      gradient: "from-[#1F57F5]/10 to-[#05090E]/10",
    },
  ]

  const featureTabs = [
    { title: "Command Hub", icon: LayoutTable, description: "Unified metrics from all your marketing channels in real-time." },
    { title: "AI Insights", icon: Sparkles, description: "Smart recommendations to optimize your campaign performance." },
    { title: "Ad Architect", icon: Wand2, description: "Create stunning ad creatives with AI in seconds." },
    { title: "Automations", icon: Zap, description: "Set up intelligent workflows that run on autopilot." },
  ]

  const stats = [
    { value: "500+", label: "Enterprise Nodes" },
    { value: "3.2x", label: "Avg. Yield Increase" },
    { value: "85%", label: "Time Optimized" },
    { value: "99.9%", label: "Uptime SLA" },
  ]

  const pricingPlans = [
    {
      name: "Tactical",
      price: "$99",
      period: "/mo",
      description: "Perfect for scaling teams",
      features: ["3 Platform Bridges", "Basic Analytics", "Neural Insights", "Standard Support"],
      cta: "Initialize Node",
      highlighted: false,
    },
    {
      name: "Commander",
      price: "$249",
      period: "/mo",
      description: "For high-velocity operations",
      features: ["Unlimited Bridges", "Advanced Intelligence", "Asset Synthesizer", "Priority Execution", "API Access"],
      cta: "Establish Command",
      highlighted: true,
    },
    {
      name: "Monolith",
      price: "Custom",
      period: "",
      description: "Global enterprise matrix",
      features: ["Unlimited Everything", "Custom AI Models", "Full White-label", "SLA Guarantees", "Dedicated Architect"],
      cta: "Contact Ops",
      highlighted: false,
    },
  ]

  return (
    <div className="min-h-screen bg-white text-[#05090E] font-satoshi selection:bg-[#1F57F5]/10 selection:text-[#1F57F5]">
      {/* Superior Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-2xl border-b border-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#05090E] rounded-xl flex items-center justify-center text-[#1F57F5] transition-transform group-hover:scale-110 duration-300 shadow-lg shadow-black/10">
              <Command className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tighter">
              GROWZZY <span className="text-[#1F57F5]">OS</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-12 text-[12px] font-bold uppercase tracking-widest text-[#64748B]">
            {["Features", "Enterprise", "Pricing", "Support"].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#1F57F5] transition-colors">{item}</Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <Link href="/auth" className="text-[12px] font-bold uppercase tracking-widest text-[#64748B] hover:text-[#05090E] transition-colors px-4">Login</Link>
            <Link href="/auth">
              <button className="h-12 px-8 bg-[#1F57F5] text-white text-[12px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-[#1F57F5]/30 hover:bg-[#1A4AD1] transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-3">
                Initialize OS <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Cinematic Hero */}
        <section className="relative pt-44 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#1F57F5]/5 to-transparent blur-3xl rounded-full" />

          <div className="max-w-7xl mx-auto px-8 relative z-10 text-center space-y-12">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#F8FAFC] border border-[#F1F5F9] rounded-full shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="w-2 h-2 rounded-full bg-[#1F57F5] animate-pulse" />
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Neural Marketing Infrastructure v4.2</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-[#05090E] max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                Every channel. <br /> <span className="text-[#1F57F5]">One Intelligence OS.</span>
              </h1>
              <p className="text-xl md:text-2xl text-[#64748B] font-medium max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                Unify Meta, Google, LinkedIn & Shopify. Engineer high-fidelity campaigns with autonomous neural orchestration.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
              <Link href="/auth">
                <button className="h-16 px-12 bg-[#05090E] text-white text-[14px] font-bold uppercase tracking-[0.3em] rounded-2xl shadow-2xl hover:bg-[#1F57F5] transition-all hover:-translate-y-1 flex items-center gap-4 group">
                  Deploy Your Matrix
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
              <button className="h-16 px-10 bg-white border-2 border-[#F1F5F9] text-[#05090E] text-[14px] font-bold uppercase tracking-[0.3em] rounded-2xl hover:border-[#1F57F5] transition-all flex items-center gap-4">
                <div className="w-10 h-10 bg-[#F8FAFC] rounded-xl flex items-center justify-center text-[#1F57F5] group-hover:bg-[#1F57F5] group-hover:text-white transition-colors">
                  <Play className="w-4 h-4 fill-[#1F57F5]" />
                </div>
                System Analysis
              </button>
            </div>

            {/* Trusted Networks */}
            <div className="pt-20 space-y-8 opacity-40">
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#64748B]">Bridging Global Networks</p>
              <div className="flex flex-wrap justify-center items-center gap-16 grayscale opacity-80">
                {["META", "GOOGLE", "LINKEDIN", "SHOPIFY", "TIKTOK"].map(n => (
                  <span key={n} className="text-2xl font-black tracking-widest">{n}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Staging Area */}
        <section className="py-20 relative bg-[#F8FAFC]/50 overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-8 relative">
            <div className="relative p-1 bg-gradient-to-tr from-[#1F57F5]/20 to-[#00DDFF]/20 rounded-[4rem] shadow-2xl animate-in fade-in slide-in-from-bottom-24 duration-1000 delay-700">
              <div className="bg-white rounded-[3.8rem] overflow-hidden border-8 border-white shadow-inner relative group">
                {/* Simulated OS UI Interface */}
                <div className="w-full aspect-[16/10] bg-[#F1F5F9] flex overflow-hidden">
                  <div className="w-[280px] bg-white border-r border-[#F1F5F9] p-8 hidden md:block">
                    <div className="w-10 h-10 bg-[#05090E] rounded-xl mb-12 shadow-lg" />
                    <div className="space-y-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className={cn("h-10 rounded-xl", i === 0 ? "bg-[#1F57F5]" : "bg-[#F8FAFC]")} />
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 p-12 bg-white space-y-12">
                    <div className="flex justify-between items-center px-4">
                      <div className="space-y-2">
                        <div className="h-8 w-64 bg-[#F8FAFC] rounded-xl" />
                        <div className="h-4 w-32 bg-[#F8FAFC] rounded-lg" />
                      </div>
                      <div className="w-40 h-12 bg-[#1F57F5]/10 rounded-2xl" />
                    </div>
                    <div className="grid grid-cols-4 gap-8">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-44 bg-[#F8FAFC] rounded-[2.5rem] border-2 border-[#F1F5F9]" />
                      ))}
                    </div>
                    <div className="flex gap-12 pt-10">
                      <div className="flex-1 h-96 bg-[#F8FAFC] rounded-[3rem] border-2 border-[#F1F5F9]" />
                      <div className="w-[380px] h-96 bg-[#05090E] rounded-[3rem] p-10 space-y-8">
                        <div className="h-6 w-32 bg-white/10 rounded-full" />
                        <div className="h-20 w-full bg-white/5 rounded-2xl" />
                        <div className="h-16 w-full bg-[#1F57F5] rounded-xl" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Absolute Hotspots for Context */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="relative">
                    <div className="absolute top-[-200px] right-[-400px] w-64 p-8 bg-white rounded-[2rem] shadow-2xl border border-[#F1F5F9] animate-bounce duration-[4s]">
                      <Zap className="w-8 h-8 text-[#00DDFF] mb-4" />
                      <p className="text-[12px] font-bold uppercase tracking-widest text-[#64748B]">Real-time Sync</p>
                      <p className="text-[18px] font-bold text-[#05090E]">99.9% Latency Accuracy</p>
                    </div>
                    <div className="absolute bottom-[-100px] left-[-400px] w-64 p-8 bg-[#05090E] rounded-[2.5rem] shadow-2xl animate-float duration-[5s]">
                      <Sparkles className="w-8 h-8 text-[#1F57F5] mb-4" />
                      <p className="text-[12px] font-bold uppercase tracking-widest text-white/40">Neural Analysis</p>
                      <p className="text-[18px] font-bold text-white">+14.2% Yield Opportunity</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Stats Matrix */}
        <section className="py-32 bg-white border-y border-[#F1F5F9]">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 lg:grid-cols-4 gap-16">
            {stats.map((s, i) => (
              <div key={i} className="text-center space-y-4 group">
                <div className="text-6xl font-bold tracking-tighter text-[#05090E] group-hover:text-[#1F57F5] transition-colors duration-500 leading-none">{s.value}</div>
                <div className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.4em]">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Core Capabilities */}
        <section id="features" className="py-44 bg-white relative">
          <div className="max-w-7xl mx-auto px-8 space-y-32">
            <div className="flex flex-col md:flex-row justify-between items-end gap-12">
              <div className="max-w-2xl space-y-8">
                <span className="text-[12px] font-bold text-[#1F57F5] uppercase tracking-[0.5em]">System Capabilities</span>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#05090E] leading-[0.9]">
                  Engineered for <br /> <span className="text-[#1F57F5]">Unified Performance.</span>
                </h2>
              </div>
              <p className="text-xl text-[#64748B] font-medium max-w-[340px] leading-relaxed pb-4">
                The first enterprise OS that unifies neural intelligence with multi-channel deployment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {features.map((f, i) => (
                <div key={i} className="bg-white p-12 rounded-[3.5rem] border-2 border-[#F1F5F9] hover:border-[#1F57F5] transition-all duration-500 group shadow-sm hover:shadow-2xl">
                  <div className={cn("w-20 h-20 bg-gradient-to-tr rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform", f.gradient)}>
                    <f.icon className="w-10 h-10 text-[#05090E] group-hover:text-[#1F57F5] transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#05090E] mb-4 group-hover:text-[#1F57F5] transition-colors">{f.title}</h3>
                  <p className="text-[16px] text-[#64748B] font-medium leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tactical Pricing Matrix */}
        <section id="pricing" className="py-44 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-8 space-y-24">
            <div className="text-center space-y-6">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#05090E]">Transparent <span className="text-[#1F57F5]">Scaling.</span></h2>
              <p className="text-xl text-[#64748B] font-medium max-w-xl mx-auto leading-relaxed">Choose the command level that matches your theater of operations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {pricingPlans.map((p, i) => (
                <div key={i} className={cn(
                  "p-12 rounded-[3.5rem] border-2 transition-all duration-500 flex flex-col justify-between min-h-[640px]",
                  p.highlighted
                    ? "bg-[#05090E] border-[#05090E] text-white shadow-2xl scale-[1.05]"
                    : "bg-white border-[#F1F5F9] text-[#05090E] hover:border-[#1F57F5]"
                )}>
                  <div className="space-y-12">
                    <div className="space-y-2">
                      <h3 className="text-[20px] font-bold uppercase tracking-widest">{p.name}</h3>
                      <p className={cn("text-[14px] font-medium opacity-60", p.highlighted ? "text-white" : "text-[#64748B]")}>{p.description}</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-bold tracking-tighter">{p.price}</span>
                      <span className="text-lg font-bold opacity-40">{p.period}</span>
                    </div>
                    <ul className="space-y-6">
                      {p.features.map(f => (
                        <li key={f} className="flex items-center gap-4 text-[14px] font-bold">
                          <Check className={cn("w-5 h-5", p.highlighted ? "text-[#00DDFF]" : "text-[#1F57F5]")} />
                          <span className="opacity-80">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className={cn(
                    "w-full h-16 rounded-2xl text-[12px] font-bold uppercase tracking-[0.3em] transition-all active:scale-95 shadow-xl",
                    p.highlighted
                      ? "bg-[#1F57F5] text-white shadow-[#1F57F5]/30"
                      : "bg-[#05090E] text-white hover:bg-[#1F57F5] shadow-black/10"
                  )}>
                    {p.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Global CTA */}
        <section className="py-44 bg-white overflow-hidden relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-full bg-[#1F57F5]/5 rounded-full blur-3xl opacity-50" />
          <div className="max-w-7xl mx-auto px-8 relative z-10 text-center space-y-16">
            <h2 className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.85] text-[#05090E]">
              Scale Your <br /> <span className="text-[#1F57F5]">Unified Force.</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link href="/auth">
                <button className="h-20 px-16 bg-[#05090E] text-white text-[16px] font-bold uppercase tracking-[0.4em] rounded-[1.5rem] shadow-2xl hover:bg-[#1F57F5] transition-all hover:-translate-y-2 active:scale-95">
                  Deploy GROWZZY OS
                </button>
              </Link>
              <button className="h-20 px-12 bg-white border-4 border-[#F1F5F9] text-[#05090E] text-[16px] font-bold uppercase tracking-[0.4em] rounded-[1.5rem] hover:border-[#1F57F5] transition-all">
                Global Briefing
              </button>
            </div>
            <div className="pt-20 flex items-center justify-center gap-12 opacity-30">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6" />
                <span className="text-[12px] font-bold uppercase tracking-widest">SOC2 TYPE II Certified</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6" />
                <span className="text-[12px] font-bold uppercase tracking-widest">GDPR COMPLIANT ARCHITECTURE</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="py-20 border-t border-[#F1F5F9] bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="space-y-8">
            <div className="flex items-center gap-3 text-[#05090E]">
              <Command className="w-8 h-8" />
              <span className="text-xl font-bold tracking-tight">GROWZZY OS</span>
            </div>
            <p className="text-[14px] text-[#64748B] font-medium leading-relaxed">
              Unified marketing operations for high-velocity enterprise teams. Cognitive orchestration at scale.
            </p>
          </div>
          {[
            { title: "Protocol", links: ["Features", "Intelligence", "Security", "Scale"] },
            { title: "Network", links: ["Google Sync", "Meta Matrix", "LinkedIn Hub", "Shopify Bridge"] },
            { title: "Company", links: ["About", "Enterprise", "Status", "Privacy"] },
          ].map(g => (
            <div key={g.title} className="space-y-8">
              <h4 className="text-[12px] font-bold text-[#05090E] uppercase tracking-widest">{g.title}</h4>
              <ul className="space-y-4">
                {g.links.map(l => (
                  <li key={l}><Link href="#" className="text-[14px] text-[#64748B] font-medium hover:text-[#1F57F5] transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-8 pt-20 mt-20 border-t border-[#F1F5F9] flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[12px] font-bold text-[#A3A3A3] uppercase tracking-widest">© 2024 GROWZZY OS ARCHITECTURE. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-12 text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">
            <Link href="#" className="hover:text-[#05090E]">Terms of Service</Link>
            <Link href="#" className="hover:text-[#05090E]">Privacy Protocol</Link>
            <Link href="#" className="hover:text-[#05090E]">System Status</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function LayoutTable(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="M3 9h18" />
    </svg>
  )
}
