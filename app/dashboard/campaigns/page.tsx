"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import {
  Megaphone,
  Plus,
  Play,
  Pause,
  MoreHorizontal,
  TrendingUp,
  DollarSign,
  Target,
  BarChart2,
  Trash2,
  Loader2,
  Search,
  Filter
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { getCampaigns, createCampaign, updateCampaignStatus, deleteCampaign } from "@/app/actions/campaigns"

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // New Campaign Form
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    objective: "conversions",
    budget: "",
    status: "draft"
  })

  const loadData = async () => {
    try {
      const data = await getCampaigns()
      setCampaigns(data || [])
    } catch (e) {
      toast.error("Failed to load campaigns")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreate = async () => {
    if (!newCampaign.name || !newCampaign.budget) {
      toast.error("Missing required fields")
      return
    }

    setIsCreating(true)
    try {
      const res = await createCampaign({
        name: newCampaign.name,
        objective: newCampaign.objective,
        budget: parseFloat(newCampaign.budget),
        status: "active" // active by default for demo flow
      })

      if (res.success) {
        toast.success("Campaign launched successfully")
        setIsNewModalOpen(false)
        setNewCampaign({ name: "", objective: "conversions", budget: "", status: "draft" })
        loadData()
      } else {
        toast.error(res.error)
      }
    } catch (e) {
      toast.error("Creation failed")
    } finally {
      setIsCreating(false)
    }
  }

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active"
    // Optimistic update
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c))

    const res = await updateCampaignStatus(id, newStatus)
    if (!res.success) {
      toast.error("Status update failed")
      loadData() // Revert
    } else {
      toast.success(newStatus === "active" ? "Campaign Resumed" : "Campaign Paused")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return

    setCampaigns(prev => prev.filter(c => c.id !== id))
    const res = await deleteCampaign(id)

    if (!res.success) {
      toast.error("Failed to delete")
      loadData()
    } else {
      toast.success("Campaign deleted")
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 font-satoshi">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-[24px] font-bold text-[#1F2937] tracking-tight">Campaign Matrix</h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <p className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider">Multi-Channel Orchestration</p>
            </div>
          </div>
          <button onClick={() => setIsNewModalOpen(true)} className="btn-primary h-9 text-[12px] flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Campaign
          </button>
        </div>

        {/* KPI Row (Compact) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Campaigns", value: campaigns.filter(c => c.status === 'active').length, icon: Megaphone },
            { label: "Total Spend", value: "$42,105", icon: DollarSign },
            { label: "Avg ROAS", value: "3.2x", icon: TrendingUp, color: "text-emerald-600" },
            { label: "Conversions", value: "842", icon: Target }
          ].map((k, i) => (
            <div key={i} className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-[#64748B] uppercase tracking-wide">{k.label}</p>
                <p className={cn("text-[18px] font-bold text-[#1F2937]", k.color)}>{k.value}</p>
              </div>
              <k.icon className="w-5 h-5 text-[#94A3B8]" />
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search campaigns..." className="w-full pl-9 pr-4 h-9 text-[13px] border border-[#E2E8F0] rounded-md focus:border-[#1F57F5] outline-none" />
          </div>
          <button className="h-9 px-3 border border-[#E2E8F0] rounded-md bg-white text-[#64748B] hover:text-[#1F2937] flex items-center gap-2 text-[13px] font-medium">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-6 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider w-[40px]"></th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Campaign Name</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider text-right">Budget</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider text-right">Spent</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider text-right">ROAS</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {isLoading ? (
                <tr><td colSpan={7} className="p-8 text-center text-[13px] text-[#64748B]">Loading Data...</td></tr>
              ) : campaigns.length === 0 ? (
                <tr><td colSpan={7} className="p-12 text-center text-[13px] text-[#64748B]">No campaigns found. Launch your first campaign.</td></tr>
              ) : (
                campaigns.map(c => (
                  <tr key={c.id} className="hover:bg-[#F9FAFB] group transition-colors">
                    <td className="px-6 py-3">
                      <div className={cn("w-2 h-2 rounded-full", c.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-gray-300')} />
                    </td>
                    <td className="px-6 py-3">
                      <p className="text-[13px] font-medium text-[#111827]">{c.name}</p>
                      <p className="text-[11px] text-[#64748B] uppercase tracking-wider font-medium">{c.objective || "Conversions"}</p>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => toggleStatus(c.id, c.status)}
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all hover:opacity-80",
                          c.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-600 border-gray-200'
                        )}>
                        {c.status}
                      </button>
                    </td>
                    <td className="px-6 py-3 text-right text-[13px] font-medium text-[#111827]">
                      ${c.dailyBudget?.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-right text-[13px] text-[#64748B]">
                      ${(c.totalSpend || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className={cn(
                        "text-[13px] font-bold",
                        (c.roas || 0) > 2 ? 'text-emerald-600' : 'text-amber-600'
                      )}>{(c.roas || 0).toFixed(2)}x</span>
                    </td>
                    <td className="px-6 py-3 text-right flex items-center justify-end gap-2">
                      <button onClick={() => toggleStatus(c.id, c.status)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-[#1F2937]">
                        {c.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Create Modal */}
        {isNewModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-[#E2E8F0]">
              <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
                <h3 className="text-[14px] font-bold text-[#1F2937]">New Campaign</h3>
                <button onClick={() => setIsNewModalOpen(false)}><span className="text-gray-400 hover:text-gray-600">✕</span></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label>Campaign Name</label>
                  <input type="text" className="input-field h-9" placeholder="e.g. Summer Sale Q3" value={newCampaign.name} onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label>Objective</label>
                  <select className="input-field h-9" value={newCampaign.objective} onChange={e => setNewCampaign({ ...newCampaign, objective: e.target.value })}>
                    <option value="conversions">Conversions</option>
                    <option value="traffic">Traffic</option>
                    <option value="awareness">Awareness</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label>Daily Budget ($)</label>
                  <input type="number" className="input-field h-9" placeholder="50.00" value={newCampaign.budget} onChange={e => setNewCampaign({ ...newCampaign, budget: e.target.value })} />
                </div>
                <div className="pt-2">
                  <button onClick={handleCreate} disabled={isCreating} className="btn-primary w-full h-9 justify-center">
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Launch Campaign"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
