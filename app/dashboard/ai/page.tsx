"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Bot, Sparkles, Zap, Brain, Rocket, ShieldCheck, Target, Activity } from "lucide-react"

export const dynamic = "force-dynamic"

export default function AICopilotPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) {
          router.push("/auth")
          return
        }
        const data = await response.json()
        setUser(data.user)
      } catch (error) {
        console.error("[v0] AI Copilot error:", error)
        router.push("/auth")
      }
    }

    checkAuth()
  }, [router])

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center p-8 lg:p-12 bg-white min-h-[calc(100vh-64px)] relative overflow-hidden font-satoshi">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1F57F5]/5 rounded-full -mr-64 -mt-64 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00DDFF]/5 rounded-full -ml-64 -mb-64 blur-[100px]" />

        <div className="max-w-4xl w-full relative z-10">
          <div className="text-center space-y-12">
            {/* Main AI Avatar/Icon Container */}
            <div className="relative mx-auto w-40 h-40">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1F57F5] to-[#00DDFF] rounded-[3rem] blur-2xl opacity-20 animate-pulse" />
              <div className="relative w-40 h-40 bg-white border-2 border-[#F1F5F9] rounded-[3.5rem] flex items-center justify-center shadow-2xl relative group hover:border-[#1F57F5] transition-all duration-500">
                <Bot className="w-16 h-16 text-[#05090E] group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-[#1F57F5] rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-all duration-500">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[14px] font-bold text-[#1F57F5] uppercase tracking-[0.4em]">Operational Protocol: Copilot</p>
              <h1 className="text-[48px] md:text-[64px] font-bold text-[#05090E] tracking-tight leading-none">
                Neural Growth <br /> <span className="text-[#1F57F5]">Synchronizing...</span>
              </h1>
              <p className="text-[18px] text-[#64748B] max-w-2xl mx-auto font-medium">
                We are currently engineering the most advanced AI Copilot for enterprise marketing automation. Real-time cognitive insights are arriving shortly.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 text-left">
              {[
                {
                  title: "Cognitive Inferences",
                  desc: "Natural language orchestration of your entire marketing stack.",
                  icon: Brain,
                  color: "#1F57F5"
                },
                {
                  title: "Yield Velocity",
                  desc: "Automated ROAS optimization recommendations in real-time.",
                  icon: Zapata,
                  color: "#00DDFF"
                },
                {
                  title: "Market Attunement",
                  desc: "Deep-learning analysis of competitor hooks and positioning.",
                  icon: Target,
                  color: "#2BAFF2"
                },
                {
                  title: "Autonomous Actions",
                  desc: "Campaign management and bid adjustments without manual logic.",
                  icon: Activity,
                  color: "#FFB800"
                }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border-2 border-[#F1F5F9] hover:border-[#1F57F5] transition-all duration-300 shadow-sm hover:shadow-xl group flex gap-6 items-start">
                  <div className="w-14 h-14 bg-[#F8FAFC] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#1F57F5]/5 transition-colors" style={{ color: feature.color }}>
                    {feature.icon && <feature.icon className="w-7 h-7" />}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[18px] font-bold text-[#05090E]">{feature.title}</h3>
                    <p className="text-[14px] text-[#64748B] font-medium leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-12 flex flex-col items-center gap-6">
              <div className="flex items-center gap-3 px-6 py-2 bg-[#F8FAFC] border border-[#F1F5F9] rounded-full">
                <div className="w-2 h-2 rounded-full bg-[#1F57F5] animate-pulse" />
                <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-widest">v2.0 Beta Protocol In-Dev</span>
              </div>
              <button className="h-16 px-12 bg-[#05090E] text-white text-[13px] font-bold uppercase tracking-[0.25em] rounded-2xl shadow-2xl hover:bg-neutral-800 transition-all flex items-center gap-3 active:scale-95">
                <Rocket className="w-5 h-5 text-[#1F57F5]" /> Join Early Access Alpha
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function Zapata({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}
