"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Lock,
  User,
  Loader2,
  AlertCircle,
  Command,
  ShieldCheck,
  Zap,
  ChevronRight,
  Shield
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          throw new Error("Handshake failed: Invalid authorization credentials.")
        }
        router.replace("/dashboard")
      } else {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Registry error")

        setIsLogin(true)
        setIsLoading(false)
      }
    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#05090E] font-satoshi selection:bg-[#1F57F5]/10 selection:text-[#1F57F5] flex overflow-hidden">

      {/* Cinematic Branding Panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#05090E] relative overflow-hidden flex-col justify-between p-24">
        {/* Background Depth Layers */}
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-[#1F57F5]/20 rounded-full -mr-96 -mt-96 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#00DDFF]/10 rounded-full -ml-32 -mb-32 blur-[120px]" />
        <div className="absolute inset-0 grid-pattern opacity-10" />

        <Link href="/" className="flex items-center gap-4 relative z-10 group">
          <div className="w-14 h-14 glass-dark rounded-2xl flex items-center justify-center text-[#1F57F5] shadow-2xl transition-transform duration-500 group-hover:scale-110">
            <Command className="w-8 h-8" />
          </div>
          <span className="text-white text-3xl font-black tracking-tighter">
            GROWZZY<span className="text-[#1F57F5]">OS</span>
          </span>
        </Link>

        <div className="space-y-12 relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00DDFF] animate-pulse" />
              <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">Node Authorization Layer</span>
            </div>
            <h1 className="text-7xl font-bold text-white leading-[0.9] tracking-tighter">
              The Matrix <br /> <span className="text-[#1F57F5] italic underline decoration-white/10 underline-offset-8">Awaits.</span>
            </h1>
            <p className="text-xl text-white/40 font-medium max-w-md leading-relaxed">
              Unify your marketing orchestration matrix. High-fidelity analytics and neural generation synchronized in real-time.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 py-12 border-y border-white/5">
            {[
              { label: 'Latency', value: '14ms', icon: Zap },
              { label: 'Protocol', value: 'SOC2-T2', icon: Shield },
            ].map(i => (
              <div key={i.label} className="space-y-3">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] flex items-center gap-2">
                  <i.icon className="w-3.5 h-3.5 text-[#1F57F5]" /> {i.label}
                </p>
                <p className="text-2xl font-bold text-white">{i.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[10px] font-bold text-white/10 uppercase tracking-[0.5em]">
          <span>© 2024 ARCHITECTURE</span>
          <span>STABLE_BUILD_4.5</span>
        </div>
      </div>

      {/* Auth Interaction Layer */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 lg:px-20 py-20 relative">
        {/* Subtle Floating Shapes for Depth */}
        <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-[#1F57F5]/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[20%] left-[10%] w-64 h-64 bg-[#00DDFF]/5 blur-[100px] rounded-full" />

        <Link
          href="/"
          className="absolute top-12 left-12 lg:left-auto lg:right-12 flex items-center gap-3 text-[#64748B] hover:text-[#05090E] transition-all group font-black text-[11px] uppercase tracking-[0.3em] bg-white px-5 py-2.5 rounded-full border border-[#EEF2F7] shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Terminal Exit
        </Link>

        <div className="w-full max-w-[480px] space-y-16 relative z-10">
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-[40px] font-bold text-[#05090E] tracking-tighter leading-none">
              {isLogin ? "System Entry" : "Protocol Setup"}
            </h2>
            <p className="text-[16px] text-[#64748B] font-medium leading-relaxed max-w-sm">
              {isLogin ? "Synchronize your authorization credentials to access the OS matrix." : "Initialize a new enterprise operator node on the Growzzy network."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-5 bg-red-50 border border-red-100 rounded-[14px] flex items-center gap-4 text-red-600 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-[12px] font-bold uppercase tracking-wider">{error}</p>
              </div>
            )}

            <div className="space-y-8">
              {!isLogin && (
                <div className="space-y-4">
                  <label>Operator Name</label>
                  <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#1F57F5] transition-colors" />
                    <input
                      type="text"
                      placeholder="MAX REYNOLDS"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-premium pl-16 uppercase tracking-widest text-[13px]"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <label>Auth Identifier (Email)</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#1F57F5] transition-colors" />
                  <input
                    type="email"
                    placeholder="OPERATOR@GROWZZY.GLOBAL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-premium pl-16 uppercase tracking-widest text-[13px]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center pr-2">
                  <label>System Keycode</label>
                  {isLogin && (
                    <Link href="#" className="text-[10px] font-black text-[#1F57F5] uppercase tracking-[0.2em] mb-2">Recovery Key?</Link>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#1F57F5] transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-premium pl-16"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-premium w-full h-18 text-[15px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Authorizing...</span>
                </div>
              ) : isLogin ? (
                <>Synchronize Identity <ArrowRight className="w-5 h-5" /></>
              ) : (
                "Initialize Node"
              )}
            </button>
          </form>

          <div className="space-y-10 pt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#EEF2F7]" />
              </div>
              <div className="relative flex justify-center text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.5em]">
                <span className="px-6 bg-[#F7FAFC]">Transition Point</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="h-14 bg-white border border-[#EEF2F7] text-dark-text rounded-[14px] font-bold text-[11px] uppercase tracking-[0.2em] hover:border-[#1F57F5] transition-all"
              >
                {isLogin ? "Initialize New Node" : "Existing Identity Login"}
              </button>
              <button
                onClick={() => {
                  document.cookie = "growzzy_demo_mode=true; path=/; max-age=3600"
                  window.location.assign("/dashboard")
                }}
                className="h-14 bg-white border border-[#EEF2F7] text-dark-text rounded-[14px] font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-[#F7FAFC] flex items-center justify-center gap-3 group"
              >
                Demo Mode <ChevronRight className="w-4 h-4 text-[#1F57F5] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
