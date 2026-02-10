"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState } from "react"
import {
  Users,
  Search,
  Filter,
  Plus,
  Upload,
  Star,
  Mail,
  Phone,
  MoreHorizontal,
  Sparkles,
  ArrowUpDown,
  ChevronRight,
} from "lucide-react"

const LEADS = [
  { id: 1, name: "Sarah Chen", email: "sarah@techcorp.com", company: "TechCorp", source: "Google Ads", status: "Hot", score: 92, value: "$12,000", lastActivity: "2h ago" },
  { id: 2, name: "James Wilson", email: "james@startup.io", company: "StartupIO", source: "Meta Ads", status: "Warm", score: 78, value: "$8,500", lastActivity: "5h ago" },
  { id: 3, name: "Maria Garcia", email: "maria@enterprise.co", company: "Enterprise Co", source: "LinkedIn", status: "Hot", score: 88, value: "$25,000", lastActivity: "1d ago" },
  { id: 4, name: "Alex Kim", email: "alex@digital.agency", company: "Digital Agency", source: "Organic", status: "Cold", score: 45, value: "$3,200", lastActivity: "3d ago" },
  { id: 5, name: "Emma Davis", email: "emma@brand.com", company: "Brand Inc", source: "Meta Ads", status: "Warm", score: 71, value: "$6,800", lastActivity: "1d ago" },
  { id: 6, name: "Ryan Park", email: "ryan@saas.dev", company: "SaaS Dev", source: "Google Ads", status: "Hot", score: 95, value: "$18,000", lastActivity: "30m ago" },
  { id: 7, name: "Lisa Thompson", email: "lisa@media.group", company: "Media Group", source: "LinkedIn", status: "Warm", score: 67, value: "$9,400", lastActivity: "2d ago" },
  { id: 8, name: "David Brown", email: "david@retail.co", company: "Retail Co", source: "Organic", status: "Cold", score: 32, value: "$2,100", lastActivity: "5d ago" },
]

const PIPELINE_STAGES = [
  { name: "New", count: 24, value: "$48,200", color: "bg-neutral-300" },
  { name: "Contacted", count: 18, value: "$36,800", color: "bg-neutral-400" },
  { name: "Qualified", count: 12, value: "$52,400", color: "bg-neutral-600" },
  { name: "Proposal", count: 8, value: "$68,000", color: "bg-neutral-700" },
  { name: "Closed Won", count: 5, value: "$42,500", color: "bg-neutral-900" },
]

export default function LeadsPage() {
  const [view, setView] = useState<"table" | "pipeline">("table")

  const statusColor = (s: string) => {
    if (s === "Hot") return "bg-red-100 text-red-700"
    if (s === "Warm") return "bg-amber-100 text-amber-700"
    return "bg-neutral-100 text-neutral-600"
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Leads & CRM</h2>
            <p className="text-sm text-neutral-500 mt-0.5">Manage, score, and convert your leads</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 text-sm text-neutral-600 bg-white border border-neutral-200 px-3 py-2 rounded-lg hover:border-neutral-300">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button className="flex items-center gap-2 text-sm text-white bg-neutral-900 px-4 py-2 rounded-lg hover:bg-neutral-800">
              <Plus className="w-4 h-4" />
              Add Lead
            </button>
          </div>
        </div>

        {/* View Toggle + Search */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center bg-neutral-100 rounded-lg p-0.5">
            <button onClick={() => setView("table")} className={`px-4 py-1.5 text-xs font-medium rounded-md ${view === "table" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}>Table View</button>
            <button onClick={() => setView("pipeline")} className={`px-4 py-1.5 text-xs font-medium rounded-md ${view === "pipeline" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}>Pipeline</button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search leads..." className="pl-9 pr-4 py-2 text-sm bg-white border border-neutral-200 rounded-lg w-64 focus:outline-none focus:border-neutral-400 transition-colors" />
            </div>
            <button className="flex items-center gap-2 text-sm text-neutral-600 bg-white border border-neutral-200 px-3 py-2 rounded-lg hover:border-neutral-300">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {view === "pipeline" ? (
          /* Pipeline View */
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PIPELINE_STAGES.map((stage) => (
              <div key={stage.name} className="bg-white rounded-xl border border-neutral-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                  <h4 className="text-sm font-semibold text-neutral-900">{stage.name}</h4>
                  <span className="text-xs bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded-full ml-auto">{stage.count}</span>
                </div>
                <div className="text-lg font-bold text-neutral-900">{stage.value}</div>
                <div className="mt-3 space-y-2">
                  {LEADS.filter((_, i) => i % PIPELINE_STAGES.length === PIPELINE_STAGES.indexOf(stage)).slice(0, 2).map((lead) => (
                    <div key={lead.id} className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                      <div className="text-sm font-medium text-neutral-900">{lead.name}</div>
                      <div className="text-xs text-neutral-500">{lead.company}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-medium text-neutral-700">{lead.value}</span>
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span className="text-xs text-neutral-500">{lead.score}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50">
                    <th className="text-left py-3 px-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Name</th>
                    <th className="text-left py-3 px-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Company</th>
                    <th className="text-left py-3 px-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Source</th>
                    <th className="text-left py-3 px-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">
                      <div className="flex items-center gap-1">AI Score <Sparkles className="w-3 h-3 text-amber-500" /></div>
                    </th>
                    <th className="text-left py-3 px-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Value</th>
                    <th className="text-left py-3 px-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Activity</th>
                    <th className="text-right py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {LEADS.map((lead) => (
                    <tr key={lead.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors cursor-pointer">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-medium">{lead.name.split(" ").map(n => n[0]).join("")}</span>
                          </div>
                          <div>
                            <div className="font-medium text-neutral-900">{lead.name}</div>
                            <div className="text-xs text-neutral-400">{lead.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-700">{lead.company}</td>
                      <td className="py-3.5 px-4 text-neutral-600">{lead.source}</td>
                      <td className="py-3.5 px-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor(lead.status)}`}>{lead.status}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div className="h-full bg-neutral-900 rounded-full" style={{ width: `${lead.score}%` }} />
                          </div>
                          <span className="text-xs font-medium text-neutral-700">{lead.score}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-neutral-900">{lead.value}</td>
                      <td className="py-3.5 px-4 text-xs text-neutral-400">{lead.lastActivity}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="text-neutral-400 hover:text-neutral-900 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AI Lead Insights */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-neutral-900" />
            <h3 className="text-base font-semibold text-neutral-900">AI Lead Intelligence</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-100">
              <div className="text-xs text-neutral-500 mb-1">Predicted Conversions</div>
              <div className="text-2xl font-bold text-neutral-900">18</div>
              <div className="text-xs text-neutral-500 mt-1">of 67 qualified leads this month</div>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-100">
              <div className="text-xs text-neutral-500 mb-1">Best Follow-up Time</div>
              <div className="text-2xl font-bold text-neutral-900">Tue 10AM</div>
              <div className="text-xs text-neutral-500 mt-1">Highest response rate window</div>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-100">
              <div className="text-xs text-neutral-500 mb-1">Top Lead Source</div>
              <div className="text-2xl font-bold text-neutral-900">LinkedIn</div>
              <div className="text-xs text-neutral-500 mt-1">Highest quality score average</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
