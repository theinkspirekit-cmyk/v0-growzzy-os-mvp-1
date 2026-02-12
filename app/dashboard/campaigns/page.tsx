"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import {
  Megaphone,
  Play,
  Pause,
  AlertTriangle,
  TrendingUp,
  Sliders,
  MoreHorizontal,
  Plus,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Filter,
  BarChart2,
  Zap,
  ShieldCheck,
  Target,
  Globe,
  MoreVertical,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Campaign {
  id: string
  name: string
  platform: string
  status: "ACTIVE" | "PAUSED" | "COMPLETED"
  budget: number
  spend: number
  revenue: number
  roas: number
  ctr: number
  cpc: number
  health: "Good" | "Fair" | "Critical"
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("ALL")
  const [aiAlerts, setAiAlerts] = useState<any[]>([])

  const router = useRouter()

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/campaigns")
      const data = await res.json()
      if (res.ok) {
        setCampaigns(data.campaigns || [])
        generateAIAlerts(data.campaigns || [])
      } else {
        const mock: Campaign[] = [
          { id: "1", name: "Summer Pro Launch", platform: "Meta", status: "ACTIVE", budget: 5000, spend: 1200, revenue: 4200, roas: 3.5, ctr: 2.1, cpc: 1.2, health: "Good" },
          { id: "2", name: "Enterprise B2B Search", platform: "Google", status: "ACTIVE", budget: 10000, spend: 4500, revenue: 9000, roas: 2.0, ctr: 1.8, cpc: 4.5, health: "Fair" },
          { id: "3", name: "Talent Acquisition Hub", platform: "LinkedIn", status: "PAUSED", budget: 2000, spend: 1900, revenue: 0, roas: 0, ctr: 0.5, cpc: 12.0, health: "Critical" },
        ]
        setCampaigns(mock)
        generateAIAlerts(mock)
      }
    } catch (error) {
      console.error("Failed to fetch campaigns", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIAlerts = (campaigns: Campaign[]) => {
    const alerts = []
    const criticalCampaigns = campaigns.filter(c => (c.roas < 1 && c.spend > 100) || c.health === "Critical")
    if (criticalCampaigns.length > 0) {
      alerts.push({
        id: "alert-1",
        type: "critical",
        title: "Capital Drainage Detected",
        message: `${criticalCampaigns.length} campaigns are operating below target ROI. Automated pause recommended to preserve liquidity.`,
        action: "Pause Underperformers"
      })
    }

    const opportunityCampaigns = campaigns.filter(c => c.roas > 3.0)
    if (opportunityCampaigns.length > 0) {
      alerts.push({
        id: "alert-2",
        type: "opportunity",
        title: "Scaling Potential Identified",
        message: `High ROAS detected in '${opportunityCampaigns[0].name}'. Increase daily budget by 15% for optimum yield.`,
        action: "Apply Budget Scale"
      })
    }
    setAiAlerts(alerts)
  }

  const toggleStatus = (id: string, current: string) => {
    const newStatus = current === "ACTIVE" ? "PAUSED" : "ACTIVE"
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus as any } : c))
    toast.success(`Campaign ${newStatus.toLowerCase()} successfully synchronized`)
  }

  const filteredCampaigns = campaigns.filter(c => filter === "ALL" || c.status === filter)

  return (
    <DashboardLayout>
      <div className="p-8 lg:p-12 space-y-12 bg-white min-h-[calc(100vh-64px)] overflow-y-auto pb-40 font-satoshi">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#F1F5F9] pb-10 gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-[32px] font-bold text-[#05090E] tracking-tight">Campaign Matrix</h1>
            <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-[0.2em]">Cross-Channel Deployment Orchestrator</p>
          </div>
          <button
            onClick={() => router.push("/dashboard/campaign-launcher")}
            className="h-12 px-10 bg-[#1F57F5] text-white text-[12px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-[#1F57F5]/20 hover:bg-[#1A4AD1] transition-all flex items-center gap-3 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Launch New Mission
          </button>
        </div>

        {/* AI Orchestrator Alerts (Staging Area) */}
        {aiAlerts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aiAlerts.map(alert => (
              <div key={alert.id} className={cn(
                "p-10 rounded-[2.5rem] border-2 flex items-start gap-8 transition-all duration-500 relative overflow-hidden",
                alert.type === "critical"
                  ? "bg-white border-[#F1F5F9] border-l-[#F43F5E] shadow-sm"
                  : "bg-[#05090E] border-[#05090E] shadow-2xl"
              )}>
                {alert.type !== "critical" && (
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#1F57F5]/10 rounded-full -mr-24 -mt-24 blur-3xl opacity-50 transition-all group-hover:bg-[#1F57F5]/20" />
                )}
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 relative z-10 shadow-sm",
                  alert.type === "critical" ? "bg-[#F43F5E]/5 text-[#F43F5E]" : "bg-white/10 text-[#00DDFF]"
                )}>
                  {alert.type === "critical" ? <AlertTriangle className="w-8 h-8" /> : <Zap className="w-8 h-8" />}
                </div>
                <div className="flex-1 space-y-6 text-left relative z-10">
                  <div className="space-y-2">
                    <h4 className={cn("text-[16px] font-bold uppercase tracking-[0.1em]", alert.type === "critical" ? "text-[#05090E]" : "text-white")}>
                      {alert.title}
                    </h4>
                    <p className={cn("text-[14px] leading-relaxed font-medium", alert.type === "critical" ? "text-[#64748B]" : "text-[#A3A3A3]")}>
                      {alert.message}
                    </p>
                  </div>
                  <button className={cn(
                    "text-[12px] font-bold uppercase tracking-widest h-12 px-8 rounded-xl transition-all flex items-center gap-3 active:scale-95 shadow-lg",
                    alert.type === "critical" ? "bg-[#05090E] text-white hover:bg-neutral-800" : "bg-[#1F57F5] text-white hover:bg-[#1A4AD1] shadow-[#1F57F5]/20"
                  )}>
                    {alert.action} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Intelligence Table Index */}
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-4 border-b border-[#F1F5F9]">
            <div className="flex bg-[#F8FAFC] p-1.5 rounded-2xl border border-[#F1F5F9]">
              {["ALL", "ACTIVE", "PAUSED"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-10 py-3 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all",
                    filter === f ? "bg-white text-[#05090E] shadow-sm ring-1 ring-[#F1F5F9]" : "text-[#64748B] hover:text-[#05090E]"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl">
                <ShieldCheck className="w-4 h-4 text-[#00DDFF]" />
                <span className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">Global Protocol Sync: OK</span>
              </div>
              <button className="h-10 w-10 flex items-center justify-center rounded-xl border-2 border-[#F1F5F9] text-[#64748B] hover:text-[#1F57F5] hover:border-[#1F57F5] transition-all hover:bg-white bg-[#F8FAFC] shadow-sm">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-6 bg-[#F8FAFC]/50 rounded-[3rem] border-2 border-dashed border-[#F1F5F9]">
              <Loader2 className="w-12 h-12 animate-spin text-[#1F57F5] opacity-20" />
              <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Synthesizing Deployment Matrix...</p>
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] border-2 border-[#F1F5F9] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#F8FAFC]">
                      <th className="px-12 py-8 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Campaign Identity</th>
                      <th className="px-12 py-8 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.2em] text-center">Protocol Node</th>
                      <th className="px-12 py-8 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.2em] text-right">Investment Sync</th>
                      <th className="px-12 py-8 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.2em] text-right">Yield Index (ROAS)</th>
                      <th className="px-12 py-8 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.2em] text-center">Matrix Health</th>
                      <th className="px-12 py-8 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {filteredCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="group hover:bg-[#F8FAFC]/30 transition-all duration-300">
                        <td className="px-12 py-10">
                          <div className="flex items-center gap-6">
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/5 group-hover:scale-110 transition-transform",
                              campaign.platform === 'Meta' ? 'bg-[#1877F2]' : campaign.platform === 'Google' ? 'bg-[#EA4335]' : 'bg-[#0A66C2]'
                            )}>
                              <Globe className="w-5 h-5" />
                            </div>
                            <div className="space-y-1 text-left">
                              <p className="text-[17px] font-bold text-[#05090E] group-hover:text-[#1F57F5] transition-colors tracking-tight">{campaign.name}</p>
                              <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-[0.1em]">{campaign.platform} Performance Engine</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-12 py-10 text-center">
                          <button
                            onClick={() => toggleStatus(campaign.id, campaign.status)}
                            className={cn(
                              "px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 mx-auto transition-all border-2",
                              campaign.status === 'ACTIVE'
                                ? "bg-[#1F57F5]/5 text-[#1F57F5] border-[#1F57F5]/20 hover:bg-[#1F57F5]/10 shadow-sm"
                                : "bg-[#F8FAFC] text-[#A3A3A3] border-[#F1F5F9] opacity-60"
                            )}
                          >
                            <div className={cn("w-2 h-2 rounded-full", campaign.status === 'ACTIVE' ? "bg-[#1F57F5] animate-pulse" : "bg-[#A3A3A3]")} />
                            {campaign.status}
                          </button>
                        </td>
                        <td className="px-12 py-10 text-right">
                          <p className="text-[16px] font-bold text-[#05090E] tracking-tight">${campaign.spend.toLocaleString()}</p>
                          <p className="text-[11px] text-[#A3A3A3] font-bold uppercase tracking-wider mt-0.5">ALLOCATION: ${campaign.budget.toLocaleString()}</p>
                        </td>
                        <td className="px-12 py-10 text-right">
                          <div className={cn(
                            "inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[15px] font-bold tracking-tight shadow-sm ring-1",
                            campaign.roas >= 3 ? "bg-[#00DDFF]/10 text-[#00DDFF] ring-[#00DDFF]/20" : campaign.roas >= 2 ? "bg-[#1F57F5]/10 text-[#1F57F5] ring-[#1F57F5]/20" : "bg-[#F43F5E]/10 text-[#F43F5E] ring-[#F43F5E]/20"
                          )}>
                            {campaign.roas.toFixed(2)}x <BarChart2 className="w-5 h-5" />
                          </div>
                        </td>
                        <td className="px-12 py-10 text-center">
                          <div className="flex justify-center items-center gap-3">
                            <div className={cn(
                              "w-3 h-3 rounded-full shadow-[0_0_12px_rgba(31,87,245,0.3)]",
                              campaign.health === 'Good' ? 'bg-[#00DDFF]' : campaign.health === 'Fair' ? 'bg-[#1F57F5]' : 'bg-[#F43F5E]'
                            )} />
                            <span className="text-[11px] font-bold text-[#05090E] uppercase tracking-widest">{campaign.health}</span>
                          </div>
                        </td>
                        <td className="px-12 py-10 text-right">
                          <button className="h-12 w-12 flex items-center justify-center text-[#A3A3A3] hover:text-[#05090E] transition-all rounded-2xl hover:bg-[#F8FAFC] bg-white border border-[#F1F5F9] shadow-sm">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
