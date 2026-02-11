"use client"

import DashboardLayout from "@/components/dashboard-layout"
import {
  FileText,
  Download,
  Calendar,
  FileBarChart,
  Eye,
  Sparkles,
  Search,
  ArrowUpRight,
} from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

const REPORTS = [
  { id: 1, name: "January 2024 Performance", date: "Feb 1, 2024", type: "Monthly", status: "Ready", score: 94 },
  { id: 2, name: "Q4 2023 Meta Deep Dive", date: "Jan 5, 2024", type: "Quarterly", status: "Ready", score: 88 },
  { id: 3, name: "Campaign Efficiency Audit", date: "Jan 12, 2024", type: "Ad-hoc", status: "Ready", score: 91 },
]

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false)

  const generateReport = () => {
    setIsGenerating(true)
    toast.info("AI is synthesizing multichannel data...")
    setTimeout(() => {
      setIsGenerating(false)
      toast.success("Intelligence Report generated successfully")
    }, 2500)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-64px)] bg-white overflow-hidden">
        {/* Header */}
        <div className="shrink-0 p-8 lg:p-12 border-b border-neutral-100 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Intelligence Reports</h1>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Client-ready performance exports</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input type="text" placeholder="Search exports..." className="enterprise-input pl-9 w-64 text-xs h-10" />
            </div>
            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="enterprise-button h-10 px-6 flex items-center gap-2"
            >
              {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FileBarChart className="w-4 h-4" />}
              Generate Report
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12 pb-24">
          {/* Featured AI Insight */}
          <section className="bg-black text-white rounded-md p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -mr-20 -mt-20 blur-3xl rounded-full group-hover:bg-white/10 transition-colors" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Quarterly Intelligence</span>
                </div>
                <h2 className="text-2xl font-bold leading-tight">Your Meta Ads performance is exceeding benchmarks by 14.8%.</h2>
                <p className="text-sm text-neutral-400 leading-relaxed">AI Analysis indicates high saturation in LinkedIn segments. We recommend shifting 12% of the budget to Meta Retargeting for maximum ROI in Q2.</p>
              </div>
              <button className="shrink-0 px-6 py-3 bg-white text-black rounded-md text-xs font-bold flex items-center gap-2 hover:bg-neutral-100 transition-all shadow-xl shadow-white/5">
                Full Executive Audit
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* Report Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {REPORTS.map((report) => (
              <div key={report.id} className="enterprise-card group hover:shadow-lg hover:border-neutral-300 transition-all">
                <div className="p-6 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-neutral-50 rounded-md border border-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                      <FileText className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-neutral-50 border border-neutral-200 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-tight text-neutral-600">{report.status}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-neutral-900 leading-snug group-hover:text-black">{report.name}</h3>
                    <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {report.date}</span>
                      <span className="w-1 h-1 rounded-full bg-neutral-200" />
                      <span>{report.type}</span>
                    </div>
                  </div>

                  {/* Efficiency Bar */}
                  <div className="space-y-3 pt-6 border-t border-neutral-50">
                    <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                      <span>Data Synthesis</span>
                      <span className="text-black">{report.score}% Quality</span>
                    </div>
                    <div className="h-1 w-full bg-neutral-50 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full transition-all" style={{ width: `${report.score}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button className="enterprise-button bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-[11px] h-9">
                      Preview
                    </button>
                    <button
                      onClick={() => toast.success("Exporting high-fidelity PDF...")}
                      className="enterprise-button text-[11px] h-9 shadow-sm"
                    >
                      Export PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
