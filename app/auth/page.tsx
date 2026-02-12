"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { ArrowLeft, ArrowRight, Layers, Mail, Lock, User, Loader2, AlertCircle, Command, ShieldCheck, Zap } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

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
          throw new Error(result.error === "CredentialsSignin" ? "Invalid email or password" : result.error)
        }
        router.replace("/dashboard")
      } else {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Registration failed")

        setSuccessMessage("Account synchronized. You may now establish identity.")
        setIsLogin(true)
        setIsLoading(false)
      }
    } catch (err: any) {
      setError(err.message || "Protocol communication failure")
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-white text-[#05090E] font-satoshi selection:bg-[#1F57F5]/10 selection:text-[#1F57F5] flex overflow-hidden">
      {/* Cinematic Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#05090E] relative overflow-hidden flex-col justify-between p-20">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#1F57F5]/20 rounded-full -mr-96 -mt-96 blur-[120px]" />

        <Link href="/" className="flex items-center gap-4 relative z-10 group">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#1F57F5] shadow-xl border border-white/10 backdrop-blur-xl group-hover:scale-110 transition-transform">
            <Command className="w-6 h-6" />
          </div>
          <span className="text-white text-2xl font-bold tracking-tighter">
            GROWZZY <span className="text-[#1F57F5]">OS</span>
          </span>
        </Link>

        <div className="space-y-12 relative z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full w-fit backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-[#00DDFF] animate-pulse" />
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.3em]">Node Authorization Layer</span>
            </div>
            <h1 className="text-6xl font-bold text-white leading-[0.9] tracking-tighter">
              Enterprise <br /> <span className="text-[#1F57F5]">SaaS Intelligence</span>
            </h1>
            <p className="text-xl text-white/50 font-medium max-w-md leading-relaxed">
              Access your unified marketing orchestration matrix. High-fidelity analytics and neural ad generation at your fingertips.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/10">
            {[
              { label: 'Uptime', value: '99.99%', icon: Zap },
              { label: 'Security', value: 'AES-256', icon: ShieldCheck },
            ].map(i => (
              <div key={i.label} className="space-y-1">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                  <i.icon className="w-3.5 h-3.5" /> {i.label}
                </p>
                <p className="text-xl font-bold text-white">{i.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">
          <span>© 2024 GROWZZY OS ARCHITECTURE</span>
          <span>PRODUCTION_V4.2</span>
        </div>
      </div>

      {/* Auth Interaction Panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-12 py-20 relative bg-white">
        <Link
          href="/"
          className="absolute top-10 left-10 lg:left-auto lg:right-10 flex items-center gap-3 text-[#64748B] hover:text-[#05090E] transition-all group font-bold text-[12px] uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </Link>

        <div className="w-full max-w-[440px] space-y-12 text-center">
          <div className="space-y-4">
            <h2 className="text-[32px] font-bold text-[#05090E] tracking-tight">
              {isLogin ? "System Entry" : "Identity Creation"}
            </h2>
            <p className="text-[14px] text-[#64748B] font-medium leading-relaxed">
              {isLogin ? "Synchronize your credentials to access the OS" : "Initialize a new enterprise operator node"}
            </p>
          </div>

          {successMessage && (
            <div className="p-4 bg-[#00DDFF]/10 border border-[#00DDFF]/20 rounded-2xl flex items-center gap-4 text-[#00DDFF] animate-in fade-in zoom-in duration-300">
              <ShieldCheck className="w-5 h-5" />
              <p className="text-[12px] font-bold uppercase tracking-wider">{successMessage}</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-[#F43F5E]/10 border border-[#F43F5E]/20 rounded-2xl flex items-center gap-4 text-[#F43F5E] animate-in fade-in shake duration-300">
              <AlertCircle className="w-5 h-5" />
              <p className="text-[12px] font-bold uppercase tracking-wider">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            {!isLogin && (
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.2em] pl-2">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A3A3A3] group-focus-within:text-[#1F57F5] transition-colors" />
                  <input
                    type="text"
                    placeholder="Srikrishna"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-16 pl-16 pr-8 bg-[#F8FAFC] border-2 border-[#F1F5F9] text-[15px] font-bold text-[#05090E] rounded-2xl focus:border-[#1F57F5] outline-none transition-all placeholder:text-[#A3A3A3]"
                    required={!isLogin}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.2em] pl-2">Neural Link (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A3A3A3] group-focus-within:text-[#1F57F5] transition-colors" />
                <input
                  type="email"
                  placeholder="operator@growzzy.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-16 pl-16 pr-8 bg-[#F8FAFC] border-2 border-[#F1F5F9] text-[15px] font-bold text-[#05090E] rounded-2xl focus:border-[#1F57F5] outline-none transition-all placeholder:text-[#A3A3A3]"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-3 relative">
              <div className="flex justify-between px-2">
                <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Keycode</label>
                {isLogin && (
                  <Link href="/auth/forgot-password" title="Forgot Password" className="text-[11px] font-bold text-[#1F57F5] hover:text-[#2BAFF2] uppercase tracking-[0.2em]">
                    Forgot?
                  </Link>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A3A3A3] group-focus-within:text-[#1F57F5] transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-16 pl-16 pr-8 bg-[#F8FAFC] border-2 border-[#F1F5F9] text-[15px] font-bold text-[#05090E] rounded-2xl focus:border-[#1F57F5] outline-none transition-all placeholder:text-[#A3A3A3]"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-18 bg-[#05090E] text-white text-[14px] font-bold uppercase tracking-[0.4em] rounded-2xl shadow-2xl shadow-black/20 hover:bg-[#1F57F5] transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50 mt-10"
            >
              {isLoading ? (
                <div className="flex items-center gap-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : isLogin ? (
                "Establish Identity"
              ) : (
                "Initialize Node"
              )}
            </button>
          </form>

          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#F1F5F9]" />
              </div>
              <div className="relative flex justify-center text-[10px] font-bold text-[#A3A3A3] uppercase tracking-[0.3em]">
                <span className="px-6 bg-white">Staging Operations</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full h-14 bg-white border-2 border-[#F1F5F9] text-[#05090E] text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:border-[#1F57F5] transition-all flex items-center justify-center"
              >
                {isLogin ? "Create New Node" : "Existing Identity Login"}
              </button>

              <button
                onClick={() => {
                  document.cookie = "growzzy_demo_mode=true; path=/; max-age=3600"
                  window.location.assign("/dashboard")
                }}
                className="w-full h-14 bg-[#1F57F5]/5 text-[#1F57F5] text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-[#1F57F5]/10 transition-all flex items-center justify-center gap-3 group"
              >
                Bypass to Live Demo Node <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
