"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import {
  FileBarChart,
  Plus,
  Download,
  Trash2,
  Calendar,
  Sparkles,
  Loader2,
  ChevronRight,
  FileText,
  Clock,
  ExternalLink,
  Target,
  Users,
  DollarSign,
  TrendingUp,
  X,
  ShieldCheck,
  Zap,
} from "lucide-react"
import { toast } from "sonner"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { cn } from "@/lib/utils"

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)

  // Creation state
  const [newReport, setNewReport] = useState({
    name: "",
    type: "performance",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/reports")
      const data = await res.json()
      if (data.success) setReports(data.reports)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!newReport.name) return toast.error("Report label required")
    setIsGenerating(true)
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReport)
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Strategic Report Synthesized")
        setIsNewModalOpen(false)
        fetchReports()
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this strategic record?")) return
    try {
      const res = await fetch(`/api/reports?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        setReports(prev => prev.filter(r => r.id !== id))
        toast.success("Record purged")
      }
    } catch (err) {
      toast.error("Cleanup failed")
    }
  }

  const exportPDF = (report: any) => {
    const doc = new jsPDF() as any

    // Header
    doc.setFontSize(22)
    doc.text("GROWZZY OS STRATEGIC REPORT", 20, 30)
    doc.setFontSize(12)
    doc.setTextColor(100)
    doc.text(`Title: ${report.name.toUpperCase()}`, 20, 40)
    doc.text(`Generated: ${new Date(report.createdAt).toLocaleDateString()}`, 20, 48)
    doc.text(`Range: ${new Date(report.startDate).toLocaleDateString()} - ${new Date(report.endDate).toLocaleDateString()}`, 20, 56)

    // Summary
    doc.setTextColor(0)
    doc.setFontSize(16)
    doc.text("AI EXECUTIVE SUMMARY", 20, 75)
    doc.setFontSize(11)
    const lines = doc.splitTextToSize(report.aiSummary || "Analysis pending...", 170)
    doc.text(lines, 20, 85)

    // Metrics Table
    const tableData = [
      ["Metric", "Value", "Index Status"],
      ["Total Gross Spend", `$${report.data?.spend?.toLocaleString() || '0'}`, "Synchronized"],
      ["Revenue Generated", `$${report.data?.revenue?.toLocaleString() || '0'}`, "Verified"],
      ["Lead Ingestion", report.data?.leads?.toString() || '0', "Audited"],
      ["Aggregated ROAS", `${report.data?.roas || '0'}x`, "Optimized"]
    ]

    doc.autoTable({
      startY: 120,
      head: [tableData[0]],
      body: tableData.slice(1),
      theme: 'grid',
      headStyles: { fillStyle: '#111111', textColor: '#FFFFFF' }
    })

    doc.save(`${report.name}_strategic_analysis.pdf`)
    toast.success("PDF Transmission Complete")
  }

  return (
    <DashboardLayout>
      <div className="p-8 lg:p-12 space-y-12 bg-white min-h-[calc(100vh-64px)] pb-40 font-satoshi">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#F1F5F9] pb-10 gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-[32px] font-bold text-[#05090E] tracking-tight">Strategic Reporting</h1>
            <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-[0.2em]">Enterprise Analytics Engine</p>
          </div>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="h-12 px-10 bg-[#1F57F5] text-white text-[12px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-[#1F57F5]/20 hover:bg-[#1A4AD1] transition-all flex items-center gap-3 active:scale-95"
          >
            <Plus className="w-5 h-5" /> Initialize Report
          </button>
        </div>

        {/* Global Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Total Audits', value: reports.length, icon: FileText, color: '#1F57F5' },
            { label: 'AI Summarized', value: reports.filter(r => r.status === 'ready').length, icon: Sparkles, color: '#FFB800' },
            { label: 'Scheduled Tasks', value: '4', icon: Clock, color: '#00DDFF' },
          ].map(stat => (
            <div key={stat.label} className="bg-white p-8 border-2 border-[#F1F5F9] rounded-[2rem] hover:border-[#1F57F5] transition-all duration-300 shadow-sm hover:shadow-xl group flex items-center gap-8">
              <div className="w-16 h-16 bg-[#F8FAFC] rounded-2xl flex items-center justify-center transition-all group-hover:scale-110" style={{ color: stat.color }}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-left space-y-1">
                <p className="text-[32px] font-bold text-[#05090E] tracking-tight leading-none">{stat.value}</p>
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reports Index */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-4 text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em] border-b border-[#F1F5F9] pb-6">
            <span>Audited Records Index</span>
            <div className="flex items-center gap-2 text-[#05090E]">
              <ShieldCheck className="w-4 h-4 text-[#00DDFF]" />
              <span>Sorted by Generation Matrix</span>
            </div>
          </div>

          {isLoading ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-6 bg-[#F8FAFC]/50 rounded-[3rem] border-2 border-dashed border-[#F1F5F9]">
              <Loader2 className="w-12 h-12 animate-spin text-[#1F57F5] opacity-20" />
              <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Fetching Secure Records...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {reports.map((r) => (
                <div key={r.id} className="bg-white p-10 rounded-[2.5rem] border-2 border-[#F1F5F9] transition-all duration-300 shadow-sm hover:shadow-2xl group relative overflow-hidden">
                  <div className="flex items-start justify-between mb-10">
                    <div className="space-y-2 text-left">
                      <h3 className="text-[22px] font-bold text-[#05090E] group-hover:text-[#1F57F5] transition-colors cursor-pointer">{r.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-[#1F57F5] uppercase tracking-wider px-3 py-1 bg-[#1F57F5]/5 border border-[#1F57F5]/10 rounded-lg">{r.type} AUDIT</span>
                        <span className="text-[10px] font-bold text-[#A3A3A3] mt-0.5">#{r.id.slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                    <div className={cn(
                      "px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      r.status === 'ready' ? 'bg-[#00DDFF] text-[#05090E] shadow-sm' : 'bg-[#F8FAFC] text-[#A3A3A3] border border-[#F1F5F9]'
                    )}>
                      {r.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-6 p-8 bg-[#F8FAFC] rounded-[2rem] border border-[#F1F5F9] mb-10">
                    {[
                      { label: 'Spend', value: `$${r.data?.spend?.toLocaleString() || '--'}`, icon: DollarSign },
                      { label: 'Revenue', value: `$${r.data?.revenue?.toLocaleString() || '--'}`, icon: TrendingUp },
                      { label: 'ROAS', value: `${r.data?.roas || '--'}x`, icon: Target },
                      { label: 'Leads', value: r.data?.leads || '--', icon: Users },
                    ].map(m => (
                      <div key={m.label} className="space-y-1.5 text-left">
                        <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-wider">{m.label}</p>
                        <p className="text-[15px] font-bold text-[#05090E] tracking-tight">{m.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 text-left mb-10">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-5 h-5 text-[#FFB800]" />
                      <span className="text-[11px] font-bold text-[#05090E] uppercase tracking-widest">Cognitive Intelligence Summary</span>
                    </div>
                    <p className="text-[14px] text-[#64748B] font-medium leading-relaxed line-clamp-3">
                      {r.aiSummary || "Analysis in progress. System is calculating multi-platform attribution models and scaling indices."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-10 border-t border-[#F1F5F9]">
                    <div className="flex items-center gap-6 text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(r.startDate).toLocaleDateString()}
                      </div>
                      <ChevronRight className="w-3 h-3 text-[#E2E8F0]" />
                      <div className="flex items-center gap-2">
                        {new Date(r.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => exportPDF(r)}
                        className="h-12 px-8 bg-[#05090E] text-white rounded-xl hover:bg-neutral-800 transition-all flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-[#05090E]/10"
                      >
                        <Download className="w-4 h-4" /> PDF TRANSMISSION
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="h-12 w-12 flex items-center justify-center hover:bg-[#F43F5E]/5 text-[#A3A3A3] hover:text-[#F43F5E] rounded-xl transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {reports.length === 0 && (
                <div className="col-span-2 py-32 text-center opacity-10 flex flex-col items-center space-y-6">
                  <FileBarChart className="w-20 h-20" />
                  <p className="text-[14px] font-bold uppercase tracking-[0.4em]">No strategic records synthesized</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* New Report Modal */}
        {isNewModalOpen && (
          <div className="fixed inset-0 z-[100] bg-[#05090E]/80 backdrop-blur-xl flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-2xl rounded-[3.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border border-white/20">
              <div className="p-12 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]/50">
                <div className="text-left space-y-1.5">
                  <h3 className="text-[20px] font-bold text-[#05090E]">Audit Protocol Initialization</h3>
                  <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-widest">Strategic Matrix Acquisition</p>
                </div>
                <button onClick={() => setIsNewModalOpen(false)} className="p-3 hover:bg-white rounded-2xl text-[#64748B] shadow-sm transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-16 space-y-12">
                <div className="space-y-10 text-left">
                  <div className="space-y-4">
                    <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Deployment Identifier</label>
                    <input
                      type="text"
                      placeholder="e.g. Q1 PERFORMANCE REBOOT"
                      className="w-full h-16 px-8 bg-[#F8FAFC] border-2 border-[#F1F5F9] text-[16px] font-bold rounded-2xl focus:border-[#1F57F5] outline-none transition-all placeholder:text-[#A3A3A3]"
                      value={newReport.name}
                      onChange={e => setNewReport({ ...newReport, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4 text-left">
                      <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Protocol Class</label>
                      <select
                        className="w-full h-16 px-8 bg-[#F8FAFC] border-2 border-[#F1F5F9] text-[14px] font-bold rounded-2xl focus:border-[#1F57F5] outline-none transition-all appearance-none cursor-pointer"
                        value={newReport.type}
                        onChange={e => setNewReport({ ...newReport, type: e.target.value })}
                      >
                        <option value="performance">GLOBAL PERFORMANCE</option>
                        <option value="lead_gen">LEAD INGESTION AUDIT</option>
                        <option value="revenue">REVENUE SYNC MATRIX</option>
                        <option value="executive">EXECUTIVE SUMMARY</option>
                      </select>
                    </div>
                    <div className="space-y-4 text-left">
                      <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Target Topology</label>
                      <div className="h-16 flex items-center px-8 bg-[#F8FAFC] border-2 border-dashed border-[#F1F5F9] rounded-2xl text-[14px] font-bold text-[#1F57F5] gap-3">
                        <Zap className="w-5 h-5" /> SECURE PDF ENCRYPTED
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4 text-left">
                      <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Epoch Commencement</label>
                      <input
                        type="date"
                        className="w-full h-16 px-8 bg-[#F8FAFC] border-2 border-[#F1F5F9] text-[14px] font-bold rounded-2xl focus:border-[#1F57F5] outline-none transition-all"
                        value={newReport.startDate}
                        onChange={e => setNewReport({ ...newReport, startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-4 text-left">
                      <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Epoch Termination</label>
                      <input
                        type="date"
                        className="w-full h-16 px-8 bg-[#F8FAFC] border-2 border-[#F1F5F9] text-[14px] font-bold rounded-2xl focus:border-[#1F57F5] outline-none transition-all"
                        value={newReport.endDate}
                        onChange={e => setNewReport({ ...newReport, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <button
                  disabled={isGenerating}
                  onClick={handleCreate}
                  className="w-full h-20 bg-[#1F57F5] text-white text-[15px] font-bold uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl shadow-[#1F57F5]/30 hover:bg-[#1A4AD1] transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="w-7 h-7 animate-spin" /> : 'Execute Hub Synthesis'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
