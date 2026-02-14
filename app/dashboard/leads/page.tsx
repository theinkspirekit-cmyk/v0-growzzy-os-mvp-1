"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
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
  X,
  Loader2,
  TrendingUp,
  Target,
  Zap,
  ShieldCheck,
  Building2,
  DollarSign
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function LeadsPage() {
  const [view, setView] = useState<"table" | "pipeline">("table")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [leads, setLeads] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newLead, setNewLead] = useState({ name: "", email: "", company: "", value: "", phone: "" })
  const [isCreating, setIsCreating] = useState(false)

  const fetchLeads = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/leads")
      const json = await res.json()
      if (json.ok) {
        setLeads(json.data.leads)
      } else {
        toast.error(json.error?.message || "Failed to fetch leads")
      }
    } catch (error) {
      console.error("Leads Fetch Error:", error)
      toast.error("Network connection failure")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const handleCreateLead = async () => {
    if (!newLead.name || !newLead.email) {
      toast.error("Name and Email are required")
      return
    }

    setIsCreating(true)
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newLead,
          estimatedValue: newLead.value ? parseFloat(newLead.value.replace(/[$,]/g, "")) : 0
        })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Entity ${newLead.name} synchronized to CRM`)
        setNewLead({ name: "", email: "", company: "", value: "", phone: "" })
        setIsAddModalOpen(false)
        fetchLeads()
      } else {
        toast.error(json.error?.message || "Persistence failure")
      }
    } catch (error) {
      toast.error("Network bridge error")
    } finally {
      setIsCreating(false)
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    toast.info("Ingesting data stream...")
    const reader = new FileReader()
    reader.onload = async (event) => {
      const csvData = event.target?.result as string
      try {
        const res = await fetch("/api/leads/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "execute", csvData })
        })
        const json = await res.json()
        if (json.ok) {
          toast.success(`Success: ${json.data.results.imported} leads integrated`)
          fetchLeads()
          setIsImportModalOpen(false)
        } else {
          toast.error(json.error?.message || "Import synthesis failed")
        }
      } catch (err) {
        toast.error("Data ingestion error")
      }
    }
    reader.readAsText(file)
  }

  const getStatusStyle = (s: string) => {
    switch (s.toLowerCase()) {
      case 'hot': return 'bg-[#05090E] text-white shadow-lg'
      case 'warm': return 'bg-[#2BAFF2]/10 text-[#2BAFF2] ring-1 ring-[#2BAFF2]/20'
      case 'won': return 'bg-[#1F57F5] text-white shadow-lg shadow-[#1F57F5]/20'
      case 'new': return 'bg-[#00DDFF]/10 text-[#00DDFF] ring-1 ring-[#00DDFF]/20'
      default: return 'bg-[#F8FAFC] text-[#64748B] border border-[#F1F5F9]'
    }
  }

  return (
    <DashboardLayout>
      <div className="p-8 lg:p-12 bg-white min-h-[calc(100vh-64px)] space-y-12 pb-32 font-satoshi">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#F1F5F9] pb-10 gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-[32px] font-bold text-[#05090E] tracking-tight">Lead Intelligence</h1>
            <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-[0.2em]">Operational Entity Directory</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="h-12 px-8 border-2 border-[#F1F5F9] text-[12px] font-bold text-[#64748B] uppercase tracking-wider rounded-xl hover:text-[#05090E] hover:border-[#1F57F5] transition-all flex items-center gap-3 bg-white shadow-sm"
            >
              <Upload className="w-4 h-4" /> Ingest Data
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="h-12 px-10 bg-[#1F57F5] text-white text-[12px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-[#1F57F5]/20 hover:bg-[#1A4AD1] transition-all flex items-center gap-3"
            >
              <Plus className="w-5 h-5" /> Synthesize Entry
            </button>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Total Entities', value: leads.length, change: '+12.4%', icon: Users, color: '#1F57F5' },
            { label: 'Conversion Index', value: '4.2%', change: '+0.5%', icon: TrendingUp, color: '#00DDFF' },
            { label: 'Target Velocity', value: 'High', change: 'Stable', icon: Target, color: '#2BAFF2' },
            { label: 'Pipeline Yield', value: `$${leads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0).toLocaleString()}`, change: '+8%', icon: Zap, color: '#FFB800' },
          ].map(stat => (
            <div key={stat.label} className="bg-white p-8 border-2 border-[#F1F5F9] rounded-[2rem] hover:border-[#1F57F5] transition-all duration-300 shadow-sm hover:shadow-xl group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-[#F8FAFC] rounded-2xl flex items-center justify-center transition-all group-hover:scale-110" style={{ color: stat.color }}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="px-3 py-1 bg-[#F8FAFC] rounded-full">
                  <span className="text-[11px] font-bold text-[#05090E]">{stat.change}</span>
                </div>
              </div>
              <div className="space-y-1 text-left">
                <p className="text-[28px] font-bold text-[#05090E] tracking-tight">{stat.value}</p>
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.15em]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Navigation */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-4 border-b border-[#F1F5F9]">
          <div className="flex bg-[#F8FAFC] p-1.5 rounded-2xl border border-[#F1F5F9]">
            <button
              onClick={() => setView("table")}
              className={cn(
                "px-8 py-3 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all",
                view === "table" ? "bg-white text-[#05090E] shadow-sm ring-1 ring-[#F1F5F9]" : "text-[#64748B] hover:text-[#05090E]"
              )}
            >
              Index Grid
            </button>
            <button
              onClick={() => setView("pipeline")}
              className={cn(
                "px-8 py-3 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all",
                view === "pipeline" ? "bg-white text-[#05090E] shadow-sm ring-1 ring-[#F1F5F9]" : "text-[#64748B] hover:text-[#05090E]"
              )}
            >
              Pipe Engine
            </button>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#A3A3A3]" />
              <input
                type="text"
                placeholder="Search leads database..."
                className="w-full h-12 pl-12 pr-6 bg-[#F8FAFC] border-2 border-[#F1F5F9] text-[13px] font-medium rounded-xl focus:border-[#1F57F5] outline-none transition-all placeholder:text-[#A3A3A3]"
              />
            </div>
            <button className="h-12 w-12 flex items-center justify-center border-2 border-[#F1F5F9] rounded-xl hover:bg-[#F8FAFC] transition-all">
              <Filter className="w-5 h-5 text-[#64748B]" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        {isLoading ? (
          <div className="h-96 flex flex-col items-center justify-center space-y-6 bg-[#F8FAFC]/50 rounded-[3rem] border-2 border-dashed border-[#F1F5F9]">
            <Loader2 className="w-12 h-12 animate-spin text-[#1F57F5] opacity-20" />
            <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Synchronizing Entity Streams...</p>
          </div>
        ) : view === "table" ? (
          <div className="overflow-hidden bg-white rounded-[2.5rem] border-2 border-[#F1F5F9] shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  <th className="px-10 py-6 text-[11px] font-bold text-[#05090E] uppercase tracking-widest">Entity Metadata</th>
                  <th className="px-10 py-6 text-[11px] font-bold text-[#05090E] uppercase tracking-widest text-center">Protocol Source</th>
                  <th className="px-10 py-6 text-[11px] font-bold text-[#05090E] uppercase tracking-widest text-center">Score</th>
                  <th className="px-10 py-6 text-[11px] font-bold text-[#05090E] uppercase tracking-widest text-right">Yield Estimate</th>
                  <th className="px-10 py-6 text-[11px] font-bold text-[#05090E] uppercase tracking-widest text-right">Operational Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-[#F8FAFC]/50 transition-all group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-[#05090E] rounded-2xl flex items-center justify-center text-white text-[14px] font-bold shadow-xl shadow-[#05090E]/10 group-hover:scale-105 transition-transform">
                          {lead.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div className="space-y-1">
                          <p className="text-[16px] font-bold text-[#05090E] group-hover:text-[#1F57F5] transition-colors">{lead.name}</p>
                          <div className="flex items-center gap-3 text-[13px] text-[#64748B] font-medium">
                            <Building2 className="w-3.5 h-3.5" /> {lead.company || 'G-GLOBAL'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest px-4 py-1.5 bg-[#F8FAFC] border border-[#F1F5F9] rounded-full">
                        {lead.source || 'Neural Direct'}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9] group-hover:border-[#1F57F5] transition-all">
                        <Sparkles className="w-4 h-4 text-[#FFB800]" />
                        <span className="text-[14px] font-bold text-[#05090E]">{lead.aiScore || '84'}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <span className="text-[15px] font-bold text-[#05090E] tracking-tight">
                        ${(lead.estimatedValue || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button className={cn(
                        "px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all hover:scale-105",
                        getStatusStyle(lead.status)
                      )}>
                        {lead.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {leads.length === 0 && (
              <div className="py-24 text-center">
                <div className="flex flex-col items-center space-y-4 opacity-10">
                  <Users className="w-16 h-16" />
                  <p className="text-[12px] font-bold uppercase tracking-[0.3em]">No active entity records</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
            {["NEW", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON"].map(stage => (
              <div key={stage} className="space-y-8 bg-[#F8FAFC]/30 p-6 rounded-[2.5rem] border border-[#F1F5F9] min-h-[600px]">
                <div className="flex items-center justify-between px-4 pb-2">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest">{stage}</span>
                  <div className="w-6 h-6 bg-white border border-[#F1F5F9] rounded-lg flex items-center justify-center text-[11px] font-bold text-[#05090E] shadow-sm">
                    {leads.filter(l => l.status.toUpperCase() === stage || (stage === "NEW" && l.status === "new")).length}
                  </div>
                </div>
                <div className="space-y-4">
                  {leads.filter(l => l.status.toUpperCase() === stage || (stage === "NEW" && l.status === "new")).map(lead => (
                    <div key={lead.id} className="bg-white p-6 rounded-2xl border-2 border-[#F1F5F9] hover:border-[#1F57F5] transition-all shadow-sm group cursor-move active:scale-95">
                      <div className="space-y-4">
                        <div className="space-y-1 text-left">
                          <p className="text-[14px] font-bold text-[#05090E] group-hover:text-[#1F57F5]">{lead.name}</p>
                          <p className="text-[10px] text-[#A3A3A3] font-bold uppercase tracking-tight">{lead.company}</p>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-[#F8FAFC] rounded-lg">
                            <Sparkles className="w-3 h-3 text-[#FFB800]" />
                            <span className="text-[11px] font-bold text-[#05090E]">{lead.aiScore || '82'}</span>
                          </div>
                          <span className="text-[11px] font-bold text-[#05090E] tracking-tight">${(lead.estimatedValue || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-4 border-2 border-dashed border-[#F1F5F9] rounded-2xl text-[#A3A3A3] hover:text-[#1F57F5] hover:border-[#1F57F5] hover:bg-white transition-all text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Add Lead
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] bg-[#05090E]/80 backdrop-blur-xl flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border border-white/20">
              <div className="p-10 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]/50">
                <div className="space-y-1 text-left">
                  <h3 className="text-[18px] font-bold text-[#05090E]">Entity Synthesis</h3>
                  <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-widest">New Matrix Entry</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-3 hover:bg-white rounded-2xl text-[#64748B] shadow-sm transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-12 space-y-8">
                <div className="space-y-2 text-left">
                  <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.15em]">Legal Signature (Name)</label>
                  <input
                    type="text"
                    placeholder="e.g. MARCUS AURELIUS"
                    className="w-full h-14 px-6 bg-[#F8FAFC] border-2 border-[#F1F5F9] text-[15px] font-bold rounded-2xl focus:border-[#1F57F5] outline-none transition-all placeholder:text-[#A3A3A3]"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.15em]">Neural Link (Email)</label>
                  <input
                    type="email"
                    placeholder="SIGNATURE@NODE.COM"
                    className="w-full h-14 px-6 bg-[#F8FAFC] border-2 border-[#F1F5F9] text-[15px] font-bold rounded-2xl focus:border-[#1F57F5] outline-none transition-all placeholder:text-[#A3A3A3]"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2 text-left">
                    <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.15em]">Organization</label>
                    <input
                      type="text"
                      placeholder="AXON INC"
                      className="w-full h-14 px-6 bg-[#F8FAFC] border-2 border-[#F1F5F9] text-[15px] font-bold rounded-2xl focus:border-[#1F57F5] outline-none transition-all placeholder:text-[#A3A3A3]"
                      value={newLead.company}
                      onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.15em]">Yield Projection</label>
                    <input
                      type="text"
                      placeholder="$12,000"
                      className="w-full h-14 px-6 bg-[#F8FAFC] border-2 border-[#F1F5F9] text-[15px] font-bold rounded-2xl focus:border-[#1F57F5] outline-none transition-all placeholder:text-[#A3A3A3]"
                      value={newLead.value}
                      onChange={(e) => setNewLead({ ...newLead, value: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  disabled={isCreating}
                  onClick={handleCreateLead}
                  className="w-full h-16 bg-[#1F57F5] text-white text-[14px] font-bold uppercase tracking-[0.25em] rounded-2xl hover:bg-[#1A4AD1] transition-all shadow-xl shadow-[#1F57F5]/30 active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Execute Hub Synchronization'}
                </button>
              </div>
            </div>
          </div>
        )}

        {isImportModalOpen && (
          <div className="fixed inset-0 z-[100] bg-[#05090E]/80 backdrop-blur-xl flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border border-white/20">
              <div className="p-10 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]/50">
                <div className="space-y-1 text-left">
                  <h3 className="text-[18px] font-bold text-[#05090E]">Bulk Ingestion</h3>
                  <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-widest">High-Volume Data Stream</p>
                </div>
                <button onClick={() => setIsImportModalOpen(false)} className="p-3 hover:bg-white rounded-2xl text-[#64748B] shadow-sm transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-16 flex flex-col items-center space-y-10">
                <div className="w-24 h-24 bg-[#F8FAFC] rounded-[2rem] border-2 border-[#F1F5F9] flex items-center justify-center relative shadow-sm">
                  <Upload className="w-10 h-10 text-[#1F57F5]" />
                  <div className="absolute inset-0 border-2 border-[#1F57F5]/20 rounded-[2rem] animate-pulse" />
                </div>
                <div className="text-center space-y-3">
                  <p className="text-[20px] font-bold text-[#05090E]">Ready for Transmission</p>
                  <p className="text-[13px] font-medium text-[#64748B] uppercase tracking-[0.15em]">Supports CSV | XLSX | JSON Payloads</p>
                </div>
                <input type="file" id="fileInlet" className="hidden" accept=".csv" onChange={handleImport} />
                <button
                  onClick={() => document.getElementById('fileInlet')?.click()}
                  className="h-16 px-12 bg-[#05090E] text-white text-[13px] font-bold uppercase tracking-[0.25em] rounded-2xl hover:bg-neutral-800 transition-all shadow-xl shadow-[#05090E]/20"
                >
                  Mount External Inlet
                </button>
                <div className="flex items-center gap-2 text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4 text-[#00DDFF]" /> Secure AES-256 Protocol
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
