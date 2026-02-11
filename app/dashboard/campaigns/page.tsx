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
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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
        // Fallback mock data for demo if API fails
        const mock: Campaign[] = [
          { id: "1", name: "Summer Pro Launch", platform: "Meta", status: "ACTIVE", budget: 5000, spend: 1200, revenue: 4200, roas: 3.5, ctr: 2.1, cpc: 1.2, health: "Good" },
          { id: "2", name: "Enterprise B2B Search", platform: "Google", status: "ACTIVE", budget: 10000, spend: 4500, revenue: 9000, roas: 2.0, ctr: 1.8, cpc: 4.5, health: "Fair" },
          { id: "3", name: "Talent Acquisition", platform: "LinkedIn", status: "PAUSED", budget: 2000, spend: 1900, revenue: 0, roas: 0, ctr: 0.5, cpc: 12.0, health: "Critical" },
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
        message: `${criticalCampaigns.length} campaigns are operating below target ROI. Automated pause recommended.`,
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
    toast.success(`Campaign ${newStatus.toLowerCase()} successfully`)
  }

  const filteredCampaigns = campaigns.filter(c => filter === "ALL" || c.status === filter)

  return (
    <DashboardLayout>
      <div className="p-8 lg:p-12 space-y-12 bg-white min-h-[calc(100vh-64px)] overflow-y-auto pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-100 pb-10 gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Campaign Manager</h1>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Global Cross-channel Orchestration</p>
          </div>
          <button
            onClick={() => router.push("/dashboard/campaign-launcher")}
            className="enterprise-button h-12 px-8 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Launch New Campaign
          </button>
        </div>

        {/* AI Orchestrator Alerts */}
        {aiAlerts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiAlerts.map(alert => (
              <div key={alert.id} className={`p-6 rounded-md border flex items-start gap-4 transition-all shadow-sm ${alert.type === "critical" ? "bg-white border-l-4 border-l-black border-neutral-200" : "bg-neutral-900 text-white border-none shadow-xl"}`}>
                <div className={`mt-0.5 p-2 rounded ${alert.type === "critical" ? "bg-neutral-100 text-black" : "bg-white/10 text-white"}`}>
                  {alert.type === "critical" ? <AlertTriangle className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                </div>
                <div className="flex-1 space-y-3 text-left">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-tight">{alert.title}</h4>
                    <p className={`text-xs mt-1 leading-relaxed ${alert.type === "critical" ? "text-neutral-500" : "text-neutral-400"}`}>{alert.message}</p>
                  </div>
                  <button className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded transition-all flex items-center gap-2 ${alert.type === "critical" ? "bg-black text-white hover:bg-neutral-800" : "bg-white text-black hover:bg-neutral-100"}`}>
                    {alert.action} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Intelligence Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-1.5">
              {["ALL", "ACTIVE", "PAUSED"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${filter === f ? "bg-black text-white" : "text-neutral-400 hover:text-black hover:bg-neutral-50"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <button className="p-2 text-neutral-400 hover:text-black transition-colors"><Filter className="w-4 h-4" /></button>
          </div>

          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-neutral-200 animate-spin" />
            </div>
          ) : (
            <div className="enterprise-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-neutral-50/50 border-b border-neutral-100">
                      <th className="px-8 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Campaign Identity</th>
                      <th className="px-8 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Operational Status</th>
                      <th className="px-8 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right">Effective Spend</th>
                      <th className="px-8 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right">Yield (ROAS)</th>
                      <th className="px-8 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">System Health</th>
                      <th className="px-8 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="group hover:bg-neutral-50/30 transition-colors">
                        <td className="px-8 py-6">
                          <div className="space-y-0.5 text-left">
                            <p className="text-sm font-bold text-neutral-900 group-hover:text-black">{campaign.name}</p>
                            <div className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${campaign.platform === 'Meta' ? 'bg-blue-600' : campaign.platform === 'Google' ? 'bg-red-500' : 'bg-blue-800'}`} />
                              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{campaign.platform} Intelligence</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-left">
                          <button
                            onClick={() => toggleStatus(campaign.id, campaign.status)}
                            className={`px-3 py-1 rounded bg-neutral-50 border border-neutral-200 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:border-black transition-all ${campaign.status === 'ACTIVE' ? 'text-black' : 'text-neutral-400 opacity-60'}`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${campaign.status === 'ACTIVE' ? 'bg-black animate-pulse' : 'bg-neutral-300'}`} />
                            {campaign.status}
                          </button>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <p className="text-xs font-bold text-neutral-900">${campaign.spend.toLocaleString()}</p>
                          <p className="text-[10px] text-neutral-400 font-medium">of ${campaign.budget.toLocaleString()}</p>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-black tracking-tighter ${campaign.roas >= 3 ? "bg-emerald-50 text-emerald-700" : campaign.roas >= 2 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>
                            {campaign.roas.toFixed(2)}x <BarChart2 className="w-3 h-3" />
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="flex justify-center">
                            <div className={`w-2 h-2 rounded-full ${campaign.health === 'Good' ? 'bg-black' : campaign.health === 'Fair' ? 'bg-neutral-400' : 'bg-red-500'} shadow-[0_0_8px_rgba(0,0,0,0.1)]`} title={`Health: ${campaign.health}`} />
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="p-2 text-neutral-400 hover:text-black transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredCampaigns.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-8 py-20 text-center space-y-2">
                          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest leading-loose">No Operational Campaigns Found</p>
                          <button onClick={() => router.push("/dashboard/campaign-launcher")} className="text-[10px] font-black text-black underline uppercase tracking-widest">Execute First Launch</button>
                        </td>
                      </tr>
                    )}
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
