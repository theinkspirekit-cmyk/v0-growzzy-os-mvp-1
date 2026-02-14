"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState } from "react"
import {
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  Loader2,
  BarChart3,
  PieChart,
  Target,
  Settings2,
  LineChart,
  Grid
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportReady, setReportReady] = useState<{ url: string, name: string } | null>(null)

  const [config, setConfig] = useState<any>({
    title: "Executive Weekly Summary",
    period: "Last 30 Days",
    sections: {
      overview: true,
      channels: true,
      creatives: false,
      automations: true,
      ga: true
    }
  })

  const generateReport = async () => {
    setIsGenerating(true)
    const toastId = toast.loading("Synthesizing Report Data...")

    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      if (!response.ok) throw new Error("Server Generation Failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const filename = `${config.title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`

      setReportReady({ url, name: filename })

      // Auto-trigger download (optional)
      // const a = document.createElement('a'); a.href = url; a.download = filename; a.click();

      toast.success("Report Ready for Download", { id: toastId })

    } catch (e) {
      console.error(e)
      toast.error("Generation Protocol Failed", { id: toastId })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 font-satoshi max-w-5xl mx-auto">
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-[20px] font-semibold text-text-primary">Intelligence Reports</h1>
            <p className="text-[13px] text-text-secondary">Automated PDF briefs and performance summaries.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Config Panel */}
          <div className="card p-6 space-y-6 lg:col-span-1 h-fit">
            <div className="flex items-center gap-2 mb-2">
              <Settings2 className="w-4 h-4 text-text-tertiary" />
              <h3 className="text-[13px] font-bold uppercase text-text-secondary">Configuration</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-medium uppercase text-text-tertiary">Report Title</label>
                <input
                  type="text"
                  className="input"
                  value={config.title}
                  onChange={e => setConfig({ ...config, title: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium uppercase text-text-tertiary">Time Horizon</label>
                <select
                  className="input"
                  value={config.period}
                  onChange={e => setConfig({ ...config, period: e.target.value })}
                >
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last Quarter</option>
                  <option>Year to Date</option>
                </select>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-medium uppercase text-text-tertiary">Include Modules</label>
                {[
                  { id: 'overview', label: 'Performance Overview', icon: BarChart3 },
                  { id: 'channels', label: 'Channel Breakdown', icon: PieChart },
                  { id: 'creatives', label: 'Creative Analysis', icon: Target },
                  { id: 'automations', label: 'Automation Log', icon: CheckCircle2 },
                  { id: 'ga', label: 'Traffic (GA4)', icon: LineChart }
                ].map(m => (
                  <label key={m.id} className="flex items-center gap-3 p-2 border border-border rounded-[6px] hover:bg-gray-50 cursor-pointer transition-colors group">
                    <input
                      type="checkbox"
                      checked={config.sections[m.id]}
                      onChange={e => setConfig({ ...config, sections: { ...config.sections, [m.id]: e.target.checked } })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <m.icon className="w-4 h-4 text-text-tertiary group-hover:text-text-secondary" />
                    <span className="text-[13px] font-medium text-text-primary">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="btn btn-primary w-full h-10 justify-center"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Synthesizing...</span>
              ) : (
                <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Generate Brief</span>
              )}
            </button>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2 bg-gray-50/50 border border-border border-dashed rounded-[8px] p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
            {reportReady && !isGenerating ? (
              <div className="space-y-6 animate-in fade-in zoom-in duration-300 w-full max-w-sm">
                <div className="w-16 h-16 bg-success-bg rounded-full flex items-center justify-center border border-success/20 mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-[16px] font-bold text-text-primary">Generation Complete</h3>
                  <p className="text-[13px] text-text-secondary">Your intelligence brief is ready.</p>
                </div>

                <div className="card p-4 flex items-center gap-4 text-left bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-red-50 rounded-[6px] flex items-center justify-center text-red-500 border border-red-100">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-text-primary truncate" title={reportReady.name}>{reportReady.name}</p>
                    <p className="text-[11px] text-text-tertiary">PDF Document • {config.period}</p>
                  </div>
                  <a
                    href={reportReady.url}
                    download={reportReady.name}
                    className="btn btn-secondary h-8 w-8 p-0 flex items-center justify-center text-text-secondary hover:text-primary"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>

                <button
                  onClick={() => setReportReady(null)}
                  className="text-[12px] font-medium text-text-tertiary hover:text-text-primary underline decoration-dotted underline-offset-4"
                >
                  Configure New Report
                </button>
              </div>
            ) : (
              <div className="space-y-4 opacity-40">
                <div className="w-24 h-32 border-2 border-dashed border-gray-400 rounded mx-auto bg-white shadow-sm" />
                <p className="text-[13px] font-medium text-text-tertiary">Configure settings to generate a report</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
