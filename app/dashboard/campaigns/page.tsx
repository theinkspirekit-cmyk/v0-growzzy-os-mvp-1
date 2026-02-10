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
} from "lucide-react"
import { useRouter } from "next/navigation"

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
        // Generate AI Alerts client-side for immediate feedback based on fetched data
        generateAIAlerts(data.campaigns || [])
      }
    } catch (error) {
      console.error("Failed to fetch campaigns", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIAlerts = (campaigns: Campaign[]) => {
    const alerts = []

    // Rule 1: High Spend, Low ROAS
    const criticalCampaigns = campaigns.filter(c => c.roas < 1 && c.spend > 500)
    if (criticalCampaigns.length > 0) {
      alerts.push({
        id: "alert-1",
        type: "critical",
        title: "Refund Risk Detected",
        message: `${criticalCampaigns.length} campaigns have ROAS < 1.0. Pause immediately to save budget.`,
        action: "Pause Low Performers"
      })
    }

    // Rule 2: High ROAS, Low Spend (Opportunity)
    const opportunityCampaigns = campaigns.filter(c => c.roas > 4)
    if (opportunityCampaigns.length > 0) {
      alerts.push({
        id: "alert-2",
        type: "opportunity",
        title: "Scale Opportunity",
        message: `${opportunityCampaigns.length} campaigns are crushing it (ROAS > 4.0). Increase budget by 20%.`,
        action: "Increase Budget"
      })
    }

    setAiAlerts(alerts)
  }

  const toggleCampaignStatus = async (id: string, currentStatus: string) => {
    // Optimistic Update
    const newStatus = currentStatus === "ACTIVE" ? "PAUSED" : "ACTIVE"
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c))

    try {
      // In a real app, call PATCH /api/campaigns/{id} here
      // await fetch(`/api/campaigns/${id}`, { method: "PATCH", body: JSON.stringify({ status: newStatus }) })
    } catch (error) {
      // Revert if failed
      setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: currentStatus as any } : c))
    }
  }

  const filteredCampaigns = campaigns.filter(c => filter === "ALL" || c.status === filter)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Campaign Manager</h2>
            <p className="text-sm text-neutral-500 mt-0.5">Monitor and optimize your cross-channel campaigns</p>
          </div>
          <button className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>

        {/* AI Alerts Section */}
        {aiAlerts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiAlerts.map(alert => (
              <div key={alert.id} className={`p-4 rounded-xl border flex items-start gap-3 ${alert.type === "critical" ? "bg-red-50 border-red-100" : "bg-emerald-50 border-emerald-100"}`}>
                <div className={`mt-0.5 p-1.5 rounded-full ${alert.type === "critical" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                  {alert.type === "critical" ? <AlertTriangle className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-semibold ${alert.type === "critical" ? "text-red-900" : "text-emerald-900"}`}>{alert.title}</h4>
                  <p className={`text-xs mt-1 ${alert.type === "critical" ? "text-red-700" : "text-emerald-700"}`}>{alert.message}</p>
                  <button className={`mt-3 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${alert.type === "critical" ? "bg-red-200 text-red-800 hover:bg-red-300" : "bg-emerald-200 text-emerald-800 hover:bg-emerald-300"}`}>
                    {alert.action} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Campaign Data Table */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
          {/* Controls */}
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {["ALL", "ACTIVE", "PAUSED"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === f ? "bg-neutral-900 text-white" : "text-neutral-500 hover:bg-neutral-50"}`}
                >
                  {f.charAt(0) + f.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-neutral-50 rounded-lg text-neutral-400">
                <Sliders className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-neutral-300 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-neutral-50/50 border-b border-neutral-100 text-neutral-500">
                    <th className="px-6 py-3 font-medium">Campaign</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Spend</th>
                    <th className="px-6 py-3 font-medium text-right">Revenue</th>
                    <th className="px-6 py-3 font-medium text-right">ROAS</th>
                    <th className="px-6 py-3 font-medium text-center">Health</th>
                    <th className="px-6 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="group hover:bg-neutral-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-neutral-900">{campaign.name}</div>
                        <div className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${campaign.platform === "Meta" ? "bg-blue-500" : campaign.platform === "Google" ? "bg-red-500" : "bg-blue-700"}`} />
                          {campaign.platform}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleCampaignStatus(campaign.id, campaign.status)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-all w-fit ${campaign.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100"
                              : "bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200"
                            }`}
                        >
                          {campaign.status === "ACTIVE" ? <Play className="w-2.5 h-2.5 fill-current" /> : <Pause className="w-2.5 h-2.5 fill-current" />}
                          {campaign.status}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right text-neutral-600 font-medium">
                        ${campaign.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right text-neutral-900 font-semibold">
                        ${campaign.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold ${campaign.roas > 3 ? "bg-emerald-50 text-emerald-600" : campaign.roas < 1 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                          }`}>
                          {campaign.roas.toFixed(2)}x
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${campaign.health === "Good" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : campaign.health === "Critical" ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" : "bg-amber-500"
                          }`} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-900 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredCampaigns.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-neutral-500 text-sm">
                        No campaigns found matching "{filter}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
