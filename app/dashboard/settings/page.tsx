"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import {
  User,
  Bell,
  Lock,
  CreditCard,
  Building,
  Globe,
  Settings,
  Shield,
  Layers,
  ChevronRight,
  Check,
  Smartphone,
  Mail,
  Zap,
  Facebook,
  Linkedin,
  Plus,
  Loader2,
  Trash2,
  ShieldCheck,
  Activity,
  Command,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const SETTINGS_TABS = [
  {
    category: "ACCOUNT",
    items: [
      { id: "profile", label: "My Profile", icon: User },
      { id: "general", label: "General", icon: Settings },
      { id: "applications", label: "Platform Bridges", icon: Globe },
    ],
  },
  {
    category: "WORKSPACE",
    items: [
      { id: "members", label: "Team Members", icon: User },
      { id: "billing", label: "Billing & Plans", icon: CreditCard },
      { id: "security", label: "Security Hub", icon: Shield },
    ],
  },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("applications")
  const [platforms, setPlatforms] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchPlatforms = async () => {
    try {
      const res = await fetch("/api/platforms")
      const data = await res.json()
      if (data.success) setPlatforms(data.platforms)
    } catch (e) {
      toast.error("Cloud bridge handshake failed")
    }
  }

  useEffect(() => {
    if (activeTab === "applications") fetchPlatforms()
  }, [activeTab])

  const connectPlatform = async (name: string) => {
    setIsLoading(true)
    toast.info(`Initializing ${name} OAuth protocol...`)

    setTimeout(async () => {
      try {
        const res = await fetch("/api/platforms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            accountName: `${name} Production Node`,
            accessToken: "fake-token",
            refreshToken: "fake-refresh"
          })
        })
        if (res.ok) {
          toast.success(`${name} Bridge Established`)
          fetchPlatforms()
        }
      } finally {
        setIsLoading(false)
      }
    }, 1500)
  }

  const disconnectPlatform = async (id: string) => {
    if (!confirm("Terminate this platform bridge?")) return
    try {
      await fetch(`/api/platforms?id=${id}`, { method: 'DELETE' })
      setPlatforms(prev => prev.filter(p => p.id !== id))
      toast.success("Bridge Terminated")
    } catch (e) {
      toast.error("Cleanup failed")
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "applications":
        return (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                { name: 'Google Ads', icon: Globe, color: '#1F57F5', desc: 'Unified Search & Display Engine' },
                { name: 'Meta Ads', icon: Facebook, color: '#1F57F5', desc: 'Behavioral Social Architecture' },
                { name: 'LinkedIn Ads', icon: Linkedin, color: '#1F57F5', desc: 'Enterprise B2B Targeting Segment' },
              ].map(p => {
                const isConnected = platforms.some(ep => ep.name.toLowerCase().includes(p.name.toLowerCase().split(' ')[0].toLowerCase()))
                return (
                  <div key={p.name} className="bg-white p-10 rounded-[3rem] border-2 border-[#F1F5F9] hover:border-[#1F57F5] transition-all duration-300 shadow-sm hover:shadow-2xl group flex flex-col justify-between min-h-[340px]">
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="w-16 h-16 bg-[#F8FAFC] rounded-2xl flex items-center justify-center text-[#1F57F5] group-hover:scale-110 transition-transform">
                          <p.icon className="w-8 h-8" />
                        </div>
                        <div className={cn(
                          "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2",
                          isConnected ? "bg-[#00DDFF]/10 text-[#00DDFF]" : "bg-[#F8FAFC] text-[#A3A3A3] border border-[#F1F5F9]"
                        )}>
                          {isConnected ? <Check className="w-3 h-3" /> : null}
                          {isConnected ? 'Synchronized' : 'Not Connected'}
                        </div>
                      </div>
                      <div className="text-left space-y-2">
                        <h4 className="text-[20px] font-bold text-[#05090E]">{p.name}</h4>
                        <p className="text-[14px] text-[#64748B] font-medium leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                    <button
                      disabled={isLoading || isConnected}
                      onClick={() => connectPlatform(p.name)}
                      className={cn(
                        "w-full h-14 rounded-2xl text-[12px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3",
                        isConnected
                          ? "bg-[#F8FAFC] text-[#A3A3A3] border-2 border-[#F1F5F9] cursor-not-allowed"
                          : "bg-[#05090E] text-white hover:bg-[#1F57F5] shadow-lg shadow-[#05090E]/5"
                      )}
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : isConnected ? 'Operational Node Active' : `Establish Bridge`}
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="space-y-10 pt-8">
              <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-8">
                <div className="flex items-center gap-4">
                  <Activity className="w-6 h-6 text-[#1F57F5]" />
                  <div className="text-left">
                    <h3 className="text-[18px] font-bold text-[#05090E]">Active Connection Hub</h3>
                    <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-widest">Global Protocol Matrix</p>
                  </div>
                </div>
                <div className="px-6 py-2 bg-[#F8FAFC] border border-[#F1F5F9] rounded-2xl">
                  <span className="text-[12px] font-bold text-[#05090E] tracking-tight">{platforms.length} Autonomous Nodes Active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {platforms.map(p => (
                  <div key={p.id} className="bg-white p-8 rounded-[2.5rem] border-2 border-[#F1F5F9] flex items-center justify-between hover:border-[#1F57F5] transition-all group shadow-sm">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-gradient-to-tr from-[#05090E] to-[#1F57F5] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#1F57F5]/10">
                        <Zap className="w-6 h-6 text-[#00DDFF] fill-[#00DDFF]" />
                      </div>
                      <div className="text-left space-y-1">
                        <p className="text-[16px] font-bold text-[#05090E]">{p.accountName || p.name}</p>
                        <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-[0.2em] font-mono">PROTOCOL_XID_{p.id.slice(-8)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => disconnectPlatform(p.id)}
                      className="p-3.5 text-[#A3A3A3] hover:text-[#F43F5E] hover:bg-[#F43F5E]/5 rounded-2xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                {platforms.length === 0 && (
                  <div className="col-span-2 py-32 rounded-[3rem] border-2 border-dashed border-[#F1F5F9] bg-[#F8FAFC]/50 flex flex-col items-center justify-center space-y-4 opacity-30">
                    <Layers className="w-16 h-16" />
                    <p className="text-[12px] font-bold uppercase tracking-[0.4em]">Zero Active Mission Bridges</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      case "profile":
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
            <section className="space-y-12">
              <div className="flex items-center gap-10 bg-[#F8FAFC] p-10 rounded-[3rem] border-2 border-[#F1F5F9]">
                <div className="w-24 h-24 bg-[#05090E] rounded-[2rem] flex items-center justify-center text-[#1F57F5] text-3xl font-bold shadow-2xl shadow-[#05090E]/20 ring-4 ring-white">
                  MR
                </div>
                <div className="space-y-4">
                  <button className="h-11 px-8 bg-white border-2 border-[#F1F5F9] text-[12px] font-bold uppercase tracking-widest rounded-xl hover:border-[#1F57F5] transition-all shadow-sm">Update Avatar</button>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#00DDFF] animate-pulse" />
                    <p className="text-[11px] text-[#A3A3A3] font-bold uppercase tracking-[0.25em]">Authorized Operator: Max Reynolds</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em] pl-2">Operational Name</label>
                  <input type="text" defaultValue="Max Reynolds" className="w-full h-16 px-8 bg-[#F8FAFC] border-2 border-[#F1F5F9] text-[16px] font-bold rounded-2xl focus:border-[#1F57F5] outline-none transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em] pl-2">Neural Link (Email)</label>
                  <input type="email" defaultValue="max@growzzy.global" className="w-full h-16 px-8 bg-[#F8FAFC] border-2 border-[#F1F5F9] text-[16px] font-bold rounded-2xl focus:border-[#1F57F5] outline-none transition-all" />
                </div>
              </div>
              <button className="h-16 px-12 bg-[#1F57F5] text-white text-[13px] font-bold uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-[#1F57F5]/20 hover:bg-[#1A4AD1] transition-all active:scale-95">
                Save Identity Changes
              </button>
            </section>
          </div>
        );
      default:
        return (
          <div className="py-40 text-center flex flex-col items-center space-y-6 opacity-10">
            <Command className="w-20 h-20" />
            <p className="text-[14px] font-bold uppercase tracking-[0.5em]">Protocol Staging Area</p>
          </div>
        );
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-88px)] bg-white font-satoshi relative">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-80 border-r border-[#F1F5F9] p-12 space-y-16">
          <div className="space-y-4">
            <h1 className="text-[36px] font-bold text-[#05090E] tracking-tight leading-none">Settings <br /> <span className="text-[#1F57F5]">Config</span></h1>
            <p className="text-[11px] text-[#64748B] font-bold uppercase tracking-[0.3em]">Neural OS Control Center</p>
          </div>

          <nav className="space-y-16">
            {SETTINGS_TABS.map((group) => (
              <div key={group.category} className="space-y-6">
                <h3 className="text-[11px] font-bold text-[#A3A3A3] pl-2 tracking-[0.4em] uppercase">{group.category}</h3>
                <div className="space-y-3">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "w-full flex items-center gap-5 px-6 py-4 rounded-2xl text-[12px] font-bold uppercase tracking-widest transition-all duration-300",
                        activeTab === item.id
                          ? "bg-[#05090E] text-white shadow-2xl shadow-[#05090E]/20 scale-[1.05]"
                          : "text-[#64748B] hover:text-[#05090E] hover:bg-[#F8FAFC]"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-[#1F57F5]" : "text-[#A3A3A3]")} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="pt-20">
            <div className="bg-[#F8FAFC] p-8 rounded-[2.5rem] border-2 border-[#F1F5F9] space-y-4">
              <ShieldCheck className="w-8 h-8 text-[#00DDFF]" />
              <p className="text-[13px] font-bold text-[#05090E] uppercase tracking-wider leading-tight">Secure Management Environment</p>
              <p className="text-[11px] text-[#A3A3A3] font-medium leading-relaxed">All infrastructure changes are executed via AES-256 encrypted protocols.</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-16 lg:p-24 overflow-y-auto pb-40">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#F1F5F9] pb-10 gap-8">
              <div className="space-y-2 text-left">
                <h2 className="text-[32px] font-bold text-[#05090E] tracking-tight uppercase">
                  {activeTab.replace('-', ' ')}
                </h2>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#00DDFF] animate-pulse" />
                  <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-widest">Protocol status: synchronized and active</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
