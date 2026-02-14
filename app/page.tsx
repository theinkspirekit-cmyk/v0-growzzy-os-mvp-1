"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Play,
  BarChart3,
  Zap,
  Target,
  Sparkles,
  Command,
  ShieldCheck,
  Globe,
  Activity,
  Cpu,
  Layers,
  Check,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#05090E] font-satoshi selection:bg-[#1F57F5]/10 selection:text-[#1F57F5]">

      {/* Premium Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6",
        isScrolled ? "py-4" : "py-8"
      )}>
        <div className={cn(
          "max-w-7xl mx-auto h-20 px-8 flex items-center justify-between rounded-[24px] transition-all duration-500",
          isScrolled ? "glass shadow-xl" : "bg-transparent"
        )}>
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-[#05090E] rounded-2xl flex items-center justify-center text-[#1F57F5] shadow-lg group-hover:scale-110 transition-transform duration-500">
              <Command className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter">
              GROWZZY<span className="text-[#1F57F5]">OS</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-12 text-[12px] font-bold uppercase tracking-[0.3em] text-[#64748B]">
            {["System", "Architecture", "Nodes", "Protocols"].map((item) => (
              <Link key={item} href="#" className="hover:text-[#1F57F5] transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#1F57F5] transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-8">
            <Link href="/auth" className="text-[12px] font-bold uppercase tracking-[0.3em] text-[#64748B] hover:text-[#05090E] transition-colors">Login</Link>
            <Link href="/auth" className="btn-premium px-6 h-12 text-[11px]">
              Deploy Hub <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Luminous Hero Section */}
        <section className="relative pt-60 pb-40 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] pointer-events-none">
            <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1400px] h-[800px] bg-gradient-to-b from-[#1F57F5]/10 via-[#2BAFF2]/5 to-transparent blur-[120px] rounded-full" />
            <div className="absolute top-0 left-0 w-full h-full grid-pattern opacity-40" />
            <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-[#00DDFF]/10 blur-[100px] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto px-8 relative z-10 text-center space-y-16">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/50 backdrop-blur-md border border-white/50 rounded-full shadow-premium animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1F57F5] animate-pulse" />
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.4em]">Unified Marketing Operating System v4.5</span>
            </div>

            <div className="space-y-8">
              <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.85] text-[#05090E] max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                The New Standard <br />
                <span className="text-[#1F57F5] text-glow italic">of Intelligence.</span>
              </h1>
              <p className="text-xl md:text-2xl text-[#64748B] font-medium max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                A premium orchestration platform for high-velocity marketing teams. Unify your entire channel matrix with neural engineering.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
              <Link href="/auth" className="btn-premium h-20 px-16 text-[15px]">
                Initialize OS Now
                <ArrowRight className="w-6 h-6" />
              </Link>
              <button className="btn-secondary-premium h-20 px-12 text-[15px] glass">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1F57F5] shadow-sm">
                  <Play className="w-4 h-4 fill-[#1F57F5]" />
                </div>
                Analysis Briefing
              </button>
            </div>

            {/* Dashboard Mockup */}
            <div className="pt-32 animate-in fade-in slide-in-from-bottom-24 duration-1000 delay-700">
              <div className="relative mx-auto max-w-6xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1F57F5]/20 to-[#00DDFF]/10 blur-[100px] opacity-30" />
                <div className="relative p-2 glass rounded-[40px] shadow-lifted">
                  <div className="bg-white rounded-[32px] overflow-hidden border border-[#EEF2F7] aspect-[16/9] shadow-inner flex">
                    <div className="w-72 border-r border-[#EEF2F7] p-10 space-y-8 bg-[#F7FAFC]/50">
                      <div className="w-10 h-10 bg-[#05090E] rounded-xl" />
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className={cn("h-10 rounded-xl", i === 1 ? "bg-[#1F57F5]/10 w-full" : "bg-[#EEF2F7] w-3/4")} />
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 p-12 space-y-12">
                      <div className="flex justify-between items-end">
                        <div className="space-y-3 text-left">
                          <div className="h-4 w-32 bg-[#EEF2F7] rounded-full" />
                          <div className="h-10 w-64 bg-[#05090E] rounded-2xl" />
                        </div>
                        <div className="h-14 w-44 btn-premium opacity-10 rounded-2xl" />
                      </div>
                      <div className="grid grid-cols-3 gap-8 text-left">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-40 card-premium p-8 space-y-4">
                            <div className="w-10 h-10 bg-[#EEF2F7] rounded-lg" />
                            <div className="h-8 w-24 bg-[#05090E] rounded-lg" />
                          </div>
                        ))}
                      </div>
                      <div className="h-64 card-premium bg-gradient-to-br from-white to-[#F7FAFC] border-dashed border-2 border-[#E2E8F0]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Services Grid */}
        <section className="py-44 relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 space-y-32">
            <div className="text-center space-y-8">
              <span className="text-[12px] font-bold text-[#1F57F5] uppercase tracking-[0.6em]">System Architecture</span>
              <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9]">Architected for <br /> <span className="text-[#1F57F5]">Precision.</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[
                { title: "Multichannel Sync", desc: "Unified API orchestration across Meta, Google, & LinkedIn protocols.", icon: Globe },
                { title: "Neural Analytics", desc: "Advanced predictive yield modeling for high-fidelity performance.", icon: Activity },
                { title: "Asset Synthesis", desc: "Autonomous ad generation engine for unlimited creative velocity.", icon: Sparkles },
                { title: "Target Precision", desc: "Military-grade audience segmenting for maximum conversion.", icon: Target },
                { title: "Cloud Automation", desc: "Seamless workflow deployment on a zero-latency global fabric.", icon: Zap },
                { title: "Secure Matrix", desc: "SOC2 Type II compliant infrastructure for enterprise security.", icon: ShieldCheck },
              ].map((s, i) => (
                <div key={i} className="card-premium p-12 group">
                  <div className="w-16 h-16 bg-[#EEF2F7] rounded-2xl flex items-center justify-center text-[#05090E] group-hover:bg-[#1F57F5] group-hover:text-white transition-all duration-500 mb-8 border border-[#E2E8F0]">
                    <s.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
                  <p className="text-[#64748B] font-medium leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Global CTA Section */}
        <section className="py-60 relative overflow-hidden bg-[#05090E]">
          <div className="absolute inset-0">
            <div className="absolute top-[20%] left-[20%] w-[600px] h-[600px] bg-[#1F57F5]/10 blur-[150px] rounded-full" />
            <div className="absolute bottom-[20%] right-[20%] w-[600px] h-[600px] bg-[#00DDFF]/10 blur-[150px] rounded-full" />
            <div className="absolute inset-0 grid-pattern opacity-10" />
          </div>
          <div className="max-w-7xl mx-auto px-8 relative z-10 text-center space-y-20">
            <h2 className="text-7xl md:text-[140px] font-black text-white leading-[0.8] tracking-tighter">
              Scale Your <br />
              <span className="text-[#1F57F5] italic text-glow">Intelligence.</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link href="/auth" className="btn-premium h-20 px-20 text-[16px] shadow-2xl shadow-[#1F57F5]/40">
                Deploy Growzzy OS
              </Link>
              <button className="h-20 px-12 border-2 border-white/10 text-white rounded-[14px] font-bold text-[16px] uppercase tracking-[0.4em] hover:bg-white/5 transition-all">
                Global Briefing
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Premium Footer */}
      <footer className="py-32 border-t border-[#EEF2F7] bg-white">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="space-y-10">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#05090E] rounded-xl flex items-center justify-center text-[#1F57F5]">
                <Command className="w-6 h-6" />
              </div>
              <span className="text-xl font-black tracking-tighter">GROWZZY OS</span>
            </Link>
            <p className="text-[#64748B] font-medium leading-relaxed">
              The world's most advanced marketing orchestration matrix. Designed for high-velocity enterprise teams.
            </p>
          </div>
          {[
            { title: "Architecture", links: ["Intelligence", "Protocols", "Security", "Scale"] },
            { title: "Network", links: ["Meta Hub", "Google Sync", "LinkedIn Matrix", "Shopify Node"] },
            { title: "Company", links: ["About Hub", "Enterprise Ops", "System Status", "Privacy"] },
          ].map(g => (
            <div key={g.title} className="space-y-10 text-left">
              <h4 className="text-[12px] font-black text-[#05090E] uppercase tracking-[0.4em]">{g.title}</h4>
              <ul className="space-y-4">
                {g.links.map(l => (
                  <li key={l}><Link href="#" className="text-[14px] text-[#64748B] font-medium hover:text-[#1F57F5] transition-colors flex items-center gap-2 group">
                    <ChevronRight className="w-3 h-3 text-[#1F57F5] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    {l}
                  </Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-8 pt-20 mt-20 border-t border-[#EEF2F7] flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-[0.3em]">© 2024 GROWZZY OS ARCHITECTURE. GLOBAL AUTHORIZATION GRANTED.</p>
          <div className="flex gap-12 text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.3em]">
            <Link href="#" className="hover:text-[#05090E]">Terms of Ops</Link>
            <Link href="#" className="hover:text-[#05090E]">Privacy Link</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
