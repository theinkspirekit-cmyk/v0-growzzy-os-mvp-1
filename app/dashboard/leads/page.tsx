"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import {
  Users,
  Search,
  Filter,
  Plus,
  Upload,
  TrendingUp,
  Target,
  Zap,
  Building2,
  Sparkles,
  ShieldCheck,
  X,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
// Import Server Actions
import { createLead, getLeads, importLeads, syncLeadsToHub } from "@/app/actions/leads"

export default function LeadsPage() {
  const [view, setView] = useState<"table" | "pipeline">("table")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [leads, setLeads] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newLead, setNewLead] = useState({ name: "", email: "", company: "", value: "", phone: "" })
  const [isCreating, setIsCreating] = useState(false)

  // Fetch Leads on Mount
  const refreshLeads = async () => {
    try {
      const data = await getLeads()
      if (data) setLeads(data)
    } catch (error) {
      console.error("Failed to fetch leads:", error)
      toast.error("Failed to load leads from database")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshLeads()
  }, [])

  const handleCreateLead = async () => {
    if (!newLead.name || !newLead.email) {
      toast.error("Name and Email are required")
      return
    }

    setIsCreating(true)
    try {
      const result = await createLead({
        name: newLead.name,
        email: newLead.email,
        company: newLead.company,
        phone: newLead.phone,
        estimatedValue: newLead.value ? parseFloat(newLead.value.replace(/[^0-9.]/g, "")) : 0,
        source: "Manual",
        status: "new"
      })

      if (result.success) {
        toast.success(`Lead ${newLead.name} created successfully`)
        setNewLead({ name: "", email: "", company: "", value: "", phone: "" })
        setIsAddModalOpen(false)
        refreshLeads()
      } else {
        toast.error(result.error || "Failed to create lead")
      }
    } catch (error) {
      toast.error("Network error")
    } finally {
      setIsCreating(false)
    }
  }

  const handleSyncHub = async () => {
    const toastId = toast.loading("Executing Hub Synchronization...")
    try {
      await syncLeadsToHub()
      toast.success("Hub Synchronization Complete", { id: toastId })
    } catch (e) {
      toast.error("Sync Failed", { id: toastId })
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const toastId = toast.loading("Ingesting data stream...")
    const reader = new FileReader()
    reader.onload = async (event) => {
      const csvData = event.target?.result as string
      try {
        const result = await importLeads(csvData)
        if (result.success) {
          toast.success(result.message || "Import success", { id: toastId })
          refreshLeads()
          setIsImportModalOpen(false)
        } else {
          toast.error(result.error || "Import failed", { id: toastId })
        }
      } catch (err) {
        toast.error("Data ingestion error", { id: toastId })
      }
    }
    reader.readAsText(file)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 font-satoshi">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-[24px] font-bold text-[#1F2937] tracking-tight">Lead Intelligence</h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider">Operational Entity Directory</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncHub}
              className="px-3 py-2 bg-white border border-[#E2E8F0] shadow-sm rounded-md text-[13px] font-medium text-[#1F2937] hover:bg-[#F8FAFC] flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Sync Hub
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-3 py-2 bg-white border border-[#E2E8F0] shadow-sm rounded-md text-[13px] font-medium text-[#1F2937] hover:bg-[#F8FAFC] flex items-center gap-2"
            >
              <Upload className="w-3.5 h-3.5" /> Import CSV
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-2 bg-[#1F57F5] text-white rounded-md text-[13px] font-medium hover:bg-[#1A4AD1] shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Lead
            </button>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Entities', value: leads.length, change: '+12.4%', icon: Users, color: 'text-[#1F57F5]' },
            { label: 'Conversion Index', value: '4.2%', change: '+0.5%', icon: TrendingUp, color: 'text-[#00DDFF]' },
            { label: 'Target Velocity', value: 'High', change: 'Stable', icon: Target, color: 'text-[#2BAFF2]' },
            { label: 'Pipeline Yield', value: `$${leads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0).toLocaleString()}`, change: '+8%', icon: Zap, color: 'text-[#F59E0B]' },
          ].map(stat => (
            <div key={stat.label} className="bg-white border border-[#E2E8F0] shadow-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("w-8 h-8 bg-[#F8FAFC] rounded-lg flex items-center justify-center", stat.color)}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <div className="px-2 py-0.5 bg-[#F8FAFC] rounded-md border border-slate-100">
                  <span className="text-[10px] font-semibold text-[#05090E]">{stat.change}</span>
                </div>
              </div>
              <div className="space-y-0.5 text-left">
                <p className="text-[20px] font-bold text-[#1F2937] tracking-tight">{stat.value}</p>
                <p className="text-[11px] font-medium text-[#64748B]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Navigation */}
        <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-lg p-2 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex bg-[#F1F5F9] p-1 rounded-md">
            <button
              onClick={() => setView("table")}
              className={cn(
                "px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all",
                view === "table" ? "bg-white text-[#1F57F5] shadow-sm" : "text-[#64748B] hover:text-[#05090E]"
              )}
            >
              Index Grid
            </button>
            <button
              onClick={() => setView("pipeline")}
              className={cn(
                "px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all",
                view === "pipeline" ? "bg-white text-[#1F57F5] shadow-sm" : "text-[#64748B] hover:text-[#05090E]"
              )}
            >
              Pipe Engine
            </button>
          </div>
          {/* Search & Filter */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                className="w-full h-9 pl-9 pr-4 bg-white border border-[#E2E8F0] rounded-md text-[13px] placeholder:text-gray-400 focus:border-[#1F57F5] focus:ring-1 focus:ring-[#1F57F5] outline-none"
              />
            </div>
            <button className="h-9 w-9 flex items-center justify-center bg-white border border-[#E2E8F0] rounded-md text-gray-500 hover:bg-gray-50">
              <Filter className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-4 border border-dashed border-gray-200 rounded-lg bg-gray-50/50">
            <Loader2 className="w-6 h-6 animate-spin text-[#1F57F5] opacity-50" />
            <p className="text-[12px] font-medium text-[#64748B]">Loading Data...</p>
          </div>
        ) : view === "table" ? (
          <div className="bg-white border border-[#E2E8F0] shadow-sm overflow-hidden rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="px-6 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Lead Name</th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider text-center">Source</th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider text-center">Score</th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider text-right">Value</th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-[#F8FAFC]/50 transition-colors group">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[11px] font-bold text-[#64748B]">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-[#111827]">{lead.name}</p>
                          <p className="text-[11px] text-[#64748B]">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-[13px] text-[#4B5563]">
                      {lead.company || '-'}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium border border-gray-200">
                        {lead.source || 'Manual'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="inline-flex items-center gap-1">
                        <span className={cn(
                          "text-[12px] font-bold",
                          (lead.aiScore || 0) > 80 ? 'text-emerald-600' : 'text-amber-600'
                        )}>{lead.aiScore || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className="font-medium text-[13px] text-[#111827]">${(lead.estimatedValue || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className={cn(
                        "inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wide",
                        lead.status === 'new' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          lead.status === 'won' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            'bg-gray-50 text-gray-600 border-gray-100'
                      )}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {leads.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-[13px] text-[#64748B]">No leads found. Add or import to get started.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start h-full overflow-x-auto pb-4">
            {["NEW", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON"].map(stage => {
              const stageLeads = leads.filter(l => l.status.toUpperCase() === stage || (stage === "NEW" && l.status === "new"))
              return (
                <div key={stage} className="space-y-3 bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] min-h-[400px]">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">{stage}</span>
                    <span className="text-[10px] font-medium text-gray-400">
                      {stageLeads.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {stageLeads.map(lead => (
                      <div key={lead.id} className="bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-all cursor-move border border-[#E2E8F0]">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-medium text-[#64748B] uppercase">{lead.company}</span>
                          <span className="text-[10px] font-bold text-emerald-600">${(lead.estimatedValue / 1000).toFixed(1)}k</span>
                        </div>
                        <p className="text-[13px] font-medium text-[#111827] mb-1">{lead.name}</p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                          <span className="text-[10px] text-gray-400">Score {lead.aiScore}</span>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setIsAddModalOpen(true)} className="w-full py-2 border border-dashed border-[#CBD5E1] rounded-lg text-[#94A3B8] hover:text-[#1F57F5] hover:border-[#1F57F5]/30 hover:bg-white transition-all text-[10px] font-medium uppercase tracking-wide">
                      + Add
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Create Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center p-6 transition-all duration-300">
            <div className="bg-white w-full max-w-lg rounded-lg overflow-hidden shadow-2xl border border-[#E2E8F0]">
              <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <h3 className="text-[15px] font-semibold text-[#111827]">Add New Lead</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-[#64748B] hover:text-[#111827]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    className="input-field h-9"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    className="input-field h-9"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label>Company</label>
                    <input
                      type="text"
                      className="input-field h-9"
                      value={newLead.company}
                      onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label>Value ($)</label>
                    <input
                      type="text"
                      className="input-field h-9"
                      value={newLead.value}
                      onChange={(e) => setNewLead({ ...newLead, value: e.target.value })}
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    disabled={isCreating}
                    onClick={handleCreateLead}
                    className="w-full h-9 bg-[#1F57F5] text-white font-medium rounded-md hover:bg-[#1A4AD1] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-[13px] shadow-sm"
                  >
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Lead'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isImportModalOpen && (
          <div className="fixed inset-0 z-[100] bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-lg rounded-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <h3 className="text-[15px] font-semibold text-[#111827]">Import Leads</h3>
                <button onClick={() => setIsImportModalOpen(false)} className="text-[#64748B] hover:text-[#111827]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-8 flex flex-col items-center space-y-6">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-[#1F57F5]" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-[14px] font-bold text-[#111827]">Upload CSV File</p>
                  <p className="text-[12px] text-[#64748B]">Drag and drop or click to browse</p>
                </div>
                <input type="file" id="fileInlet" className="hidden" accept=".csv" onChange={handleImport} />
                <button
                  onClick={() => document.getElementById('fileInlet')?.click()}
                  className="h-9 px-4 bg-white text-[#1E293B] font-medium rounded-md border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-[13px] shadow-sm w-full"
                >
                  Browse Files
                </button>
                <p className="text-[10px] text-[#94A3B8]">Supported: CSV, XLSX • Max 5MB</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
