"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  Command,
  CreditCard,
  ShieldCheck,
  Zap,
  BarChart3,
  Layers,
  Globe,
  Sparkles,
  Users,
  Play
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
            {["Products", "Solutions", "Enterprise", "Pricing"].map((item) => (
              <Link key={item} href="#" className="text-[15px] font-medium text-[#5E6B7A] hover:text-[#1F57F5] transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1F57F5] transition-all group-hover:w-full opacity-0 group-hover:opacity-100"></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth" className="hidden md:block text-[15px] font-medium text-[#05090E] hover:text-[#1F57F5] transition-colors">
              Log in
            </Link>
            <Link href="/auth" className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#1F57F5] to-[#2BAFF2] text-white text-[15px] font-semibold shadow-[0_10px_20px_rgba(31,87,245,0.3)] hover:shadow-[0_15px_30px_rgba(31,87,245,0.4)] hover:-translate-y-0.5 transition-all duration-300">
              Get Started
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* --- Hero Section --- */}
        <section className="relative pt-40 pb-32 lg:pt-52 lg:pb-60 overflow-hidden">
          {/* Luminous Gradient Background */}
          <div className="absolute inset-0 -z-10 bg-[#FFFFFF]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[1000px] bg-[radial-gradient(circle_at_top,_#e0f2fe_0%,_#ffffff_60%)] opacity-80" />
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px]" />
            <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-cyan-50/60 rounded-full blur-[80px]" />
            {/* Subtle Tech Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(31,87,245,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(31,87,245,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 text-center space-y-10 relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-blue-100 backdrop-blur-md shadow-[0_2px_10px_rgba(31,87,245,0.08)] animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="flex h-2 w-2 rounded-full bg-[#1F57F5] animate-pulse"></span>
              <span className="text-[13px] font-semibold text-[#1F57F5] tracking-wide uppercase">New Intelligence Protocol v4.0</span>
            </div>

            {/* Headline */}
            <div className="space-y-6 max-w-5xl mx-auto">
              <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold tracking-tight text-[#05090E] leading-[1.05] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                Make Your Business Growth <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1F57F5] to-[#2BAFF2]">Fast and Secure</span> with Growzzy
              </h1>
              <p className="text-lg md:text-xl text-[#5E6B7A] leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 font-medium">
                Unify your marketing stack with a premium orchestration layer. Designed for high-velocity teams who demand precision and neural intelligence.
              </p>
            </div>

            {/* Email Input CTA */}
            <div className="max-w-md mx-auto relative animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative flex items-center bg-white rounded-full p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-6 py-3 bg-transparent outline-none text-gray-700 placeholder:text-gray-400 font-medium rounded-full"
                  />
                  <button className="bg-[#05090E] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#1F57F5] transition-colors shadow-lg flex items-center gap-2">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-center mt-3 text-gray-400 font-medium flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> 14-day free trial, no credit card required.
              </p>
            </div>

            {/* Floating Glass Cards Visualization */}
            <div className="hidden lg:block absolute top-[20%] left-0 animate-float-slow">
              <div className="glass-card p-4 flex items-center gap-4 w-64 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#1F57F5]">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Monthly Revenue</p>
                  <p className="text-lg font-bold text-[#05090E]">$124,500.00</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block absolute top-[30%] right-0 animate-float-delayed">
              <div className="glass-card p-4 flex items-center gap-4 w-72 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-gray-500 font-medium">Campaign ROAS</p>
                    <span className="text-xs font-bold text-emerald-600">+12%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[75%]" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- Trusted Logos --- */}
        <section className="py-12 bg-white border-b border-gray-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-bold text-[#94A3B8] mb-8">Trusted By More Than <span className="text-[#1F57F5]">+10,000</span> Users</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Replaced with generic text logos for clarity if icons missing, using font styles to mimic logos */}
              <span className="text-xl font-bold font-sans text-gray-400 flex items-center gap-2"><div className="w-6 h-6 bg-blue-500 rounded-md" /> PayPal</span>
              <span className="text-xl font-bold font-serif text-gray-400 flex items-center gap-2"><div className="w-6 h-6 bg-black rounded-md" /> Notion</span>
              <span className="text-xl font-bold font-mono text-gray-400 flex items-center gap-2"><div className="w-6 h-6 bg-purple-500 rounded-md" /> Slack</span>
              <span className="text-xl font-bold font-sans text-gray-400 flex items-center gap-2"><div className="w-6 h-6 bg-pink-500 rounded-md" /> Loom</span>
              <span className="text-xl font-bold font-sans text-gray-400 flex items-center gap-2"><div className="w-6 h-6 bg-orange-500 rounded-md" /> monday</span>
            </div>
          </div>
        </section>

        {/* --- Feature Section 1 (Cards) --- */}
        <section className="py-32 relative bg-[#F7FAFC]">
          <div className="max-w-7xl mx-auto px-6 text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#05090E] mb-6">
              Get The Most Powerful and <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1F57F5] to-[#2BAFF2]">Easy to Use</span> Growth Software
            </h2>
            {/* Quick Filter Pills */}
            <div className="inline-flex bg-white p-1.5 rounded-full shadow-sm border border-gray-200 gap-1">
              {['Start-ups', 'Freelancers', 'Enterprise'].map((tab, i) => (
                <button key={tab} className={cn("px-6 py-2 rounded-full text-sm font-medium transition-all", i === 1 ? "bg-[#1F57F5] text-white shadow-md" : "text-gray-500 hover:bg-gray-50")}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
            {/* Card 1 */}
            <div className="bg-white rounded-[24px] p-8 border border-white shadow-[0_20px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-500">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1F57F5] mb-6">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#05090E] mb-3">Start-ups</h3>
              <p className="text-[#5E6B7A] mb-8 leading-relaxed">Create and track professional customer invoices and manage inventory for ensuring payments easily.</p>
              <div className="bg-[#F8FAFC] rounded-xl p-4 border border-gray-100 group-hover:bg-white group-hover:shadow-lg transition-all duration-500">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">JD</div>
                  <div>
                    <p className="text-xs font-bold">John Doe</p>
                    <p className="text-[10px] text-gray-400">CEO, TechStart</p>
                  </div>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full mt-2"><div className="h-full w-[60%] bg-[#1F57F5] rounded-full" /></div>
              </div>
            </div>

            {/* Card 2 (Blue Emphasis) */}
            <div className="bg-gradient-to-br from-[#1F57F5] to-[#2BAFF2] rounded-[24px] p-8 text-white shadow-[0_20px_40px_rgba(31,87,245,0.25)] relative overflow-hidden group transform md:translate-y-12">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Freelancers</h3>
              <p className="text-blue-50 mb-8 leading-relaxed">Manage payments, generate comprehensive invoices and track all tax metrics effortlessly.</p>

              {/* Floating Mini Card */}
              <div className="glass-card bg-white/10 border-white/20 p-4 rounded-xl backdrop-blur-md">
                <div className="flex justify-between items-center text-sm font-medium mb-1">
                  <span>Total Earnings</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded text-xs">Weekly</span>
                </div>
                <p className="text-2xl font-bold text-white">$4,250.00</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Feature Section 2 (Center Graphic) --- */}
        <section className="py-32 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 text-center space-y-16">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
                Rewards System
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#05090E]">
                Rewards That are Endlessly <br />
                <span className="text-[#1F57F5]">Rewarding</span> For Every Transaction
              </h2>
              <p className="mt-4 text-[#5E6B7A] max-w-2xl mx-auto">Earn scratch cards and other rewards for every payment. Transfer assurances straight to your bank account.</p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              {/* Center Card */}
              <div className="bg-white rounded-[24px] shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-gray-100 p-8 md:p-12 relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                      <CreditCard className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-gray-900">Invoice From Paypal</h3>
                      <p className="text-sm text-gray-500">Processing...</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">$350.00</p>
                    <p className="text-xs text-gray-400">Oct 24, 2026</p>
                  </div>
                </div>
                <div className="h-14 bg-gray-50 rounded-xl w-full border border-gray-100 mb-4 px-4 flex items-center text-gray-400 text-sm">
                  XXXX-XXXX-XXXX-4252
                </div>
                <button className="w-full bg-[#1F57F5] text-white h-12 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-[#1640D6] transition-all">
                  Pay Invoice Now
                </button>
              </div>

              {/* Decorative Elements behind */}
              <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-100/50 rounded-full blur-3xl -z-10" />
              <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </section>

        {/* --- Secure Logic (Tree) --- */}
        <section className="py-24 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
            <h2 className="text-4xl font-bold text-[#05090E]">Keep Your Money Secure <span className="text-[#1F57F5]">Always</span></h2>
            <p className="text-[#5E6B7A] max-w-2xl mx-auto -mt-6">Growzzy protects your money with world-class security systems that help detect fraud and preventing hacking.</p>

            <div className="relative h-[400px] flex items-center justify-center">
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gray-200" />
              {/* Central Node */}
              <div className="relative z-10 bg-white p-6 rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100 w-80">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                    {/* Avatar placeholder */}
                    <div className="w-full h-full bg-gray-300" />
                  </div>
                  <div className="text-left leading-tight">
                    <p className="font-bold text-sm">Jeff T. Ryan</p>
                    <p className="text-[10px] text-gray-400">Security Analyst</p>
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1">$3,050.00</p>
                <p className="text-xs text-green-500 bg-green-50 inline-block px-2 py-0.5 rounded-full font-bold">Safe Chain Verified</p>
              </div>

              {/* Leaf Nodes */}
              <div className="absolute left-[10%] top-[30%] bg-white p-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100" /> <span className="text-xs font-bold text-gray-600">ID #4251</span>
              </div>
              <div className="absolute right-[10%] top-[30%] bg-white p-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100" /> <span className="text-xs font-bold text-gray-600">Encrypted</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- Bottom CTA --- */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto rounded-[40px] bg-gradient-to-r from-[#2BAFF2] to-[#1F57F5] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-500/30">
            {/* Background Textures */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(45deg,transparent_25%,white_25%,white_50%,transparent_50%,transparent_75%,white_75%,white_100%)] bg-[size:20px_20px]" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-300/30 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Start Accepting Payments <br /> in Just 4 Minutes
              </h2>
              <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm p-2 rounded-full border border-white/20 flex shadow-lg">
                <input
                  placeholder="Your email address"
                  className="bg-transparent border-none outline-none text-white placeholder:text-blue-100 px-6 flex-1 font-medium"
                />
                <button className="bg-[#05090E] text-white px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-12 font-satoshi">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 mb-20">
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1F57F5] to-[#2BAFF2] flex items-center justify-center text-white">
                <Command className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-[#05090E]">Growzzy</span>
            </div>
            <p className="text-[#5E6B7A] text-sm leading-relaxed max-w-xs">
              Growzzy is a systematic simplifying payments. We deliver omni-channel seamless solution.
            </p>
          </div>

          {[
            { header: "Menu", links: ["About", "Benefits", "Projects", "Tour"] },
            { header: "Company", links: ["Contact", "Blog", "Support Center"] },
            { header: "Social Media", links: ["Twitter", "LinkedIn", "Instagram", "Facebook"] },
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
          <p>© 2026 Growzzy Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#">Terms</Link>
            <Link href="#">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Rocket(props: any) {
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
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  )
}
