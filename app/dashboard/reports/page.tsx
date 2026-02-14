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
  Settings2
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportReady, setReportReady] = useState<string | null>(null) // URL or date

  const [config, setConfig] = useState({
    title: "Executive Weekly Summary",
    period: "Last 30 Days",
    sections: {
      overview: true,
      channels: true,
      creatives: false,
      automations: true
    }
  })

  const generateReport = async () => {
    setIsGenerating(true)
    const toastId = toast.loading("Synthesizing Report Data...")

    try {
      // Simulate data fetch delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      const doc = new jsPDF()

      // Header
      doc.setFontSize(22)
      doc.text("GrowzzyOS Intelligence Report", 14, 22)
      doc.setFontSize(12)
      doc.setTextColor(100)
      doc.text(`Generated: ${new Date().toLocaleDateString()} | Period: ${config.period}`, 14, 32)

      let yPos = 45

      // Overview Section
      if (config.sections.overview) {
        doc.setFillColor(31, 87, 245) // Primary Blue
        doc.rect(14, yPos, 182, 10, 'F')
        doc.setTextColor(255)
        doc.setFontSize(12)
        doc.text("Performance Overview", 18, yPos + 7)
        yPos += 20

        const kpis = [
          ['Revenue', '$124,592', '+12.5%'],
          ['Spend', '$32,450', '+5.2%'],
          ['ROAS', '3.84x', '+8.1%'],
          ['CPA', '$42.15', '-2.4%']
        ]

        autoTable(doc, {
          startY: yPos,
          head: [['Metric', 'Value', 'Change']],
          body: kpis,
          theme: 'grid',
          headStyles: { fillColor: [240, 240, 240], textColor: [50, 50, 50], fontStyle: 'bold' },
          styles: { fontSize: 10, cellPadding: 6 }
        })
        yPos = (doc as any).lastAutoTable.finalY + 20
      }

      // Channels Section
      if (config.sections.channels) {
        doc.setFillColor(31, 87, 245)
        doc.rect(14, yPos, 182, 10, 'F')
        doc.setTextColor(255)
        doc.text("Channel Efficiency Model", 18, yPos + 7)
        yPos += 20

        const channels = [
          ['Facebook Ads', '$12,450', '4.2x', '342'],
          ['Google Search', '$8,200', '3.8x', '215'],
          ['TikTok', '$5,400', '2.1x', '128']
        ]

        autoTable(doc, {
          startY: yPos,
          head: [['Channel', 'Spend', 'ROAS', 'Conversions']],
          body: channels,
          theme: 'striped',
          headStyles: { fillColor: [240, 240, 240], textColor: [50, 50, 50], fontStyle: 'bold' }
        })
        yPos = (doc as any).lastAutoTable.finalY + 20
      }

      doc.save(`Growzzy_Report_${Date.now()}.pdf`)

      toast.success("Report Downloaded Successfully", { id: toastId })
      setReportReady(new Date().toLocaleTimeString())

    } catch (e: any) {
      console.error(e)
      toast.error("Generation Protocol Failed", { id: toastId })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 font-satoshi max-w-5xl mx-auto">
        <div className="flex items-end justify-between border-b border-[#E2E8F0] pb-6">
          <div className="space-y-1">
            <h1 className="text-[24px] font-bold text-[#1F2937] tracking-tight">Report Generator</h1>
            <p className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider">Automated Intelligence Briefs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Config Panel */}
          <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm p-6 space-y-6">
            <h3 className="text-[14px] font-bold text-[#1F2937] uppercase flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> Configuration
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#64748B]">Report Title</label>
                <input
                  type="text"
                  className="w-full h-9 border border-[#E2E8F0] rounded px-3 text-[13px] outline-none focus:border-[#1F57F5]"
                  value={config.title}
                  onChange={e => setConfig({ ...config, title: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#64748B]">Time Horizon</label>
                <select
                  className="w-full h-9 border border-[#E2E8F0] rounded px-3 text-[13px] outline-none focus:border-[#1F57F5]"
                  value={config.period}
                  onChange={e => setConfig({ ...config, period: e.target.value })}
                >
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last Quarter</option>
                  <option>Year to Date</option>
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-[12px] font-bold text-[#64748B]">Include Modules</label>
                {[
                  { id: 'overview', label: 'Performance Overview', icon: BarChart3 },
                  { id: 'channels', label: 'Channel Breakdown', icon: PieChart },
                  { id: 'creatives', label: 'Creative Analysis', icon: Target },
                  { id: 'automations', label: 'Automation Log', icon: CheckCircle2 }
                ].map(m => (
                  <label key={m.id} className="flex items-center gap-3 p-3 border border-[#E2E8F0] rounded hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={(config.sections as any)[m.id]}
                      onChange={e => setConfig({ ...config, sections: { ...config.sections, [m.id]: e.target.checked } })}
                      className="rounded border-gray-300 text-[#1F57F5] focus:ring-[#1F57F5]"
                    />
                    <m.icon className="w-4 h-4 text-[#94A3B8]" />
                    <span className="text-[13px] font-medium text-[#1F2937]">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="w-full btn-primary h-12 justify-center text-[13px] tracking-wide"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Synthesizing PDF...</span>
              ) : (
                <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Generate Executive Brief</span>
              )}
            </button>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-8 flex flex-col items-center justify-center text-center min-h-[500px]">
            {reportReady && !isGenerating ? (
              <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-[18px] font-bold text-[#1F2937]">Report Generated Successfully</h3>
                  <p className="text-[13px] text-[#64748B]">Ready for distribution or archival.</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-[#E2E8F0] shadow-sm flex items-center gap-4 text-left max-w-sm mx-auto">
                  <div className="w-10 h-10 bg-red-50 rounded flex items-center justify-center text-red-500">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#1F2937]">{config.title}.pdf</p>
                    <p className="text-[11px] text-[#64748B]">{config.period} • 2.4 MB</p>
                  </div>
                </div>
                <button onClick={() => setReportReady(null)} className="text-[12px] font-medium text-[#1F57F5] hover:underline">
                  Create Another Report
                </button>
              </div>
            ) : (
              <div className="space-y-4 opacity-50">
                <div className="w-32 h-40 border-2 border-dashed border-gray-300 rounded-lg mx-auto bg-white" />
                <p className="text-[13px] font-medium text-[#94A3B8]">Configure settings to preview report structure</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

