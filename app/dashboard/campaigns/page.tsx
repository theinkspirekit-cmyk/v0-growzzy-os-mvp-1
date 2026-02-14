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
  Filter,
  Monitor,
  Smartphone
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { getCampaigns, createCampaign, updateCampaignStatus, deleteCampaign } from "@/app/actions/campaigns"

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  // Modal State
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
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
      toast.error("Name and Budget are required")
      return
    }

    setIsCreating(true)
    try {
      const res = await createCampaign({
        name: newCampaign.name,
        objective: newCampaign.objective,
        budget: parseFloat(newCampaign.budget),
        status: "active"
      })

      if (res.success) {
        toast.success("Campaign created successfully")
        setIsNewModalOpen(false)
        setNewCampaign({ name: "", objective: "conversions", budget: "", status: "draft" })
        loadData()
      } else {
        toast.error(res.error || "Creation failed")
      }
    } catch (e) {
      toast.error("Network error")
    } finally {
      setIsCreating(false)
    }
  }

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active"
    // Optimistic Update
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c))

    const res = await updateCampaignStatus(id, newStatus)
    if (!res.success) {
      toast.error("Status update failed")
      loadData() // Revert
    } else {
      toast.success(newStatus === "active" ? "Campaign Active" : "Campaign Paused")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this campaign permanently?")) return

    setCampaigns(prev => prev.filter(c => c.id !== id))
    const res = await deleteCampaign(id)

    if (!res.success) {
      toast.error("Failed to delete")
      loadData()
    } else {
      toast.success("Campaign deleted")
    }
  }

  const filteredCampaigns = activeTab === "all"
    ? campaigns
    : campaigns.filter(c => c.status === activeTab)

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-semibold text-text-primary">Campaign Matrix</h1>
            <p className="text-[13px] text-text-secondary">Orchestrate multi-channel acquisition campaigns.</p>
          </div>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="btn btn-primary"
          >
            <Plus className="w-3.5 h-3.5" /> New Campaign
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="card p-4 flex flex-col justify-between h-[100px]">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-medium uppercase text-text-secondary">Active Spend</span>
              <DollarSign className="w-4 h-4 text-text-tertiary" />
            </div>
            <div>
              <span className="text-[20px] font-semibold text-text-primary">$12,450</span>
              <span className="text-[11px] text-success ml-2 font-medium">+12%</span>
            </div>
          </div>
          <div className="card p-4 flex flex-col justify-between h-[100px]">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-medium uppercase text-text-secondary">Avg ROAS</span>
              <TrendingUp className="w-4 h-4 text-text-tertiary" />
            </div>
            <div>
              <span className="text-[20px] font-semibold text-text-primary">3.42x</span>
              <span className="text-[11px] text-success ml-2 font-medium">+0.4</span>
            </div>
          </div>
          <div className="card p-4 flex flex-col justify-between h-[100px]">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-medium uppercase text-text-secondary">Conversions</span>
              <Target className="w-4 h-4 text-text-tertiary" />
            </div>
            <div>
              <span className="text-[20px] font-semibold text-text-primary">842</span>
              <span className="text-[11px] text-text-secondary ml-2 font-medium">Last 30d</span>
            </div>
          </div>
          <div className="card p-4 flex flex-col justify-between h-[100px]">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-medium uppercase text-text-secondary">Active Campaigns</span>
              <Megaphone className="w-4 h-4 text-text-tertiary" />
            </div>
            <div>
              <span className="text-[20px] font-semibold text-text-primary">{campaigns.filter(c => c.status === 'active').length}</span>
              <span className="text-[11px] text-text-secondary ml-2 font-medium">/ {campaigns.length} total</span>
            </div>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex gap-4 text-[13px] font-medium text-text-secondary">
            <button
              onClick={() => setActiveTab("all")}
              className={cn("pb-4 -mb-4 border-b-2 transition-colors", activeTab === "all" ? "text-primary border-primary" : "border-transparent hover:text-text-primary")}
            >
              All Campaigns
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={cn("pb-4 -mb-4 border-b-2 transition-colors", activeTab === "active" ? "text-primary border-primary" : "border-transparent hover:text-text-primary")}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab("draft")}
              className={cn("pb-4 -mb-4 border-b-2 transition-colors", activeTab === "draft" ? "text-primary border-primary" : "border-transparent hover:text-text-primary")}
            >
              Drafts
            </button>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1.5 w-4 h-4 text-text-tertiary" />
              <input className="input h-8 pl-9 w-64" placeholder="Filter campaigns..." />
            </div>
            <button className="btn btn-secondary h-8"><Filter className="w-3.5 h-3.5" /> Filter</button>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-[40px] px-2"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th>Campaign</th>
                <th className="text-center">Status</th>
                <th className="text-right">Budget</th>
                <th className="text-right">Spend</th>
                <th className="text-right">ROAS</th>
                <th className="w-[100px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="p-12 text-center text-text-tertiary"><Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />Loading matrices...</td></tr>
              ) : filteredCampaigns.length === 0 ? (
                <tr><td colSpan={7} className="p-12 text-center text-text-tertiary">No campaigns found.</td></tr>
              ) : (
                filteredCampaigns.map(c => (
                  <tr key={c.id} className="group hover:bg-gray-50/50">
                    <td className="px-2"><input type="checkbox" className="rounded border-gray-300" /></td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-[6px] bg-gray-100 flex items-center justify-center text-text-tertiary border border-border">
                          <Monitor className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-text-primary text-[13px]">{c.name}</p>
                          <p className="text-[11px] text-text-tertiary uppercase tracking-wide">{c.objective}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className={cn(
                        "badge capitalize",
                        c.status === 'active' ? 'badge-success' : 'badge-neutral'
                      )}>
                        {c.status}
                      </span>
                    </td>
                    <td className="text-right font-medium text-text-primary">
                      ${c.dailyBudget?.toLocaleString()}
                      <span className="text-[10px] text-text-tertiary ml-1">/d</span>
                    </td>
                    <td className="text-right text-text-secondary">
                      ${(c.totalSpend || 0).toLocaleString()}
                    </td>
                    <td className="text-right">
                      <span className={cn(
                        "font-medium",
                        (c.roas || 0) >= 3 ? "text-success" :
                          (c.roas || 0) >= 1 ? "text-warning" : "text-text-secondary"
                      )}>
                        {(c.roas || 0).toFixed(2)}x
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleStatus(c.id, c.status)}
                          className="btn btn-ghost h-7 w-7 p-0"
                          title={c.status === 'active' ? "Pause" : "Resume"}
                        >
                          {c.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="btn btn-ghost h-7 w-7 p-0 text-text-tertiary hover:text-danger"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Create Modal */}
        {isNewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
            <div className="bg-white rounded-[8px] shadow-lg w-[440px] border border-border overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-5 py-4 border-b border-border bg-gray-50/50">
                <h3 className="font-semibold text-[14px]">Create New Campaign</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium uppercase text-text-tertiary">Campaign Name</label>
                  <input
                    className="input"
                    placeholder="e.g. Q4 Black Friday Scale"
                    value={newCampaign.name}
                    onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    autoFocus
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium uppercase text-text-tertiary">Objective</label>
                    <select
                      className="input"
                      value={newCampaign.objective}
                      onChange={e => setNewCampaign({ ...newCampaign, objective: e.target.value })}
                    >
                      <option value="conversions">Conversions</option>
                      <option value="traffic">Traffic</option>
                      <option value="leads">Leads</option>
                      <option value="awareness">Awareness</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium uppercase text-text-tertiary">Daily Budget</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-text-tertiary text-[13px]">$</span>
                      <input
                        className="input pl-7"
                        placeholder="0.00"
                        type="number"
                        value={newCampaign.budget}
                        onChange={e => setNewCampaign({ ...newCampaign, budget: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    onClick={handleCreate}
                    disabled={isCreating}
                    className="btn btn-primary w-full"
                  >
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {isCreating ? 'Provisioning...' : 'Launch Campaign'}
                  </button>
                </div>
              </div>
              <div className="px-5 py-3 bg-gray-50 border-t border-border flex justify-end">
                <button
                  onClick={() => setIsNewModalOpen(false)}
                  className="text-[12px] text-text-secondary hover:text-text-primary px-3 py-1.5 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
