"use client"

import DashboardLayout from "@/components/dashboard-layout"
import {
  Megaphone,
  Play,
  Pause,
  TrendingUp,
  TrendingDown,
  Plus,
  MoreHorizontal,
  Sparkles,
  DollarSign,
  Target,
  Eye,
  MousePointerClick,
  AlertTriangle,
} from "lucide-react"

const CAMPAIGNS = [
  { id: 1, name: "Summer Sale — Retargeting", platform: "Meta Ads", status: "Active", budget: "$1,200/day", spend: "$8,400", revenue: "$32,600", roas: "3.88x", leads: 142, health: "Excellent" },
  { id: 2, name: "Brand Awareness Q1", platform: "Google Ads", status: "Active", budget: "$800/day", spend: "$5,600", revenue: "$14,200", roas: "2.54x", leads: 89, health: "Good" },
  { id: 3, name: "B2B Decision Makers", platform: "LinkedIn", status: "Active", budget: "$500/day", spend: "$3,500", revenue: "$9,800", roas: "2.80x", leads: 56, health: "Good" },
  { id: 4, name: "Product Launch Video", platform: "Meta Ads", status: "Paused", budget: "$600/day", spend: "$2,400", revenue: "$3,100", roas: "1.29x", leads: 18, health: "Poor" },
  { id: 5, name: "Search — High Intent KWs", platform: "Google Ads", status: "Active", budget: "$1,500/day", spend: "$10,500", revenue: "$42,000", roas: "4.00x", leads: 210, health: "Excellent" },
  { id: 6, name: "Lookalike Audience Test", platform: "Meta Ads", status: "Active", budget: "$400/day", spend: "$2,800", revenue: "$5,600", roas: "2.00x", leads: 34, health: "Fair" },
]

const AI_ALERTS = [
  { type: "warning", message: "\"Product Launch Video\" campaign has ROAS below 1.5x — consider pausing" },
  { type: "success", message: "\"Search — High Intent KWs\" is your best performer — 15% budget increase recommended" },
  { type: "info", message: "\"Lookalike Audience Test\" needs 3 more days of data before AI can optimize" },
]

export default function CampaignsPage() {
  const healthColor = (h: string) => {
    if (h === "Excellent") return "bg-emerald-100 text-emerald-700"
    if (h === "Good") return "bg-blue-100 text-blue-700"
    if (h === "Fair") return "bg-amber-100 text-amber-700"
    return "bg-red-100 text-red-700"
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Campaigns</h2>
            <p className="text-sm text-neutral-500 mt-0.5">Create, manage, and optimize your ad campaigns</p>
          </div>
          <button className="flex items-center gap-2 text-sm text-white bg-neutral-900 px-4 py-2 rounded-lg hover:bg-neutral-800">
            <Plus className="w-4 h-4" />
            Create Campaign
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Campaigns", value: "5", icon: Play },
            { label: "Total Spend", value: "$33,200", icon: DollarSign },
            { label: "Total Revenue", value: "$107,300", icon: TrendingUp },
            { label: "Avg ROAS", value: "3.23x", icon: Target },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-neutral-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className="w-4 h-4 text-neutral-400" />
                <span className="text-xs text-neutral-500">{s.label}</span>
              </div>
              <div className="text-2xl font-bold text-neutral-900">{s.value}</div>
            </div>
          ))}
        </div>

        {/* AI Alerts */}
        <div className="space-y-2">
          {AI_ALERTS.map((alert, i) => (
            <div key={i} className={`flex items-start gap-3 p-3.5 rounded-lg border ${alert.type === "warning" ? "bg-amber-50/50 border-amber-200"
                : alert.type === "success" ? "bg-emerald-50/50 border-emerald-200"
                  : "bg-blue-50/50 border-blue-200"
              }`}>
              <Sparkles className={`w-4 h-4 mt-0.5 flex-shrink-0 ${alert.type === "warning" ? "text-amber-600" : alert.type === "success" ? "text-emerald-600" : "text-blue-600"
                }`} />
              <p className="text-sm text-neutral-800">{alert.message}</p>
            </div>
          ))}
        </div>

        {/* Campaign Table */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50">
                  <th className="text-left py-3 px-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Campaign</th>
                  <th className="text-left py-3 px-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Platform</th>
                  <th className="text-left py-3 px-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Budget</th>
                  <th className="text-right py-3 px-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Spend</th>
                  <th className="text-right py-3 px-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Revenue</th>
                  <th className="text-right py-3 px-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">ROAS</th>
                  <th className="text-left py-3 px-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Health</th>
                  <th className="text-right py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {CAMPAIGNS.map((c) => (
                  <tr key={c.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-neutral-900">{c.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600">{c.platform}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {c.status === "Active" ? (
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-neutral-300" />
                        )}
                        <span className="text-sm text-neutral-700">{c.status}</span>
                      </div>
                    </td>
                    <td className="text-right py-3.5 px-4 text-neutral-600">{c.budget}</td>
                    <td className="text-right py-3.5 px-4 text-neutral-700">{c.spend}</td>
                    <td className="text-right py-3.5 px-4 text-neutral-900 font-medium">{c.revenue}</td>
                    <td className="text-right py-3.5 px-4 font-semibold text-neutral-900">{c.roas}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${healthColor(c.health)}`}>{c.health}</span>
                    </td>
                    <td className="text-right py-3.5 px-4">
                      <button className="text-neutral-400 hover:text-neutral-900">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
