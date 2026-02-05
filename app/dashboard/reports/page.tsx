"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { showToast } from "@/components/Toast"
import { Plus, Download, Eye, Trash2, FileText, Loader2, Sparkles, Calendar } from "lucide-react"

interface Report {
  id: string
  title: string
  type: string
  status: "completed" | "generating" | "sent"
  platform: string
  period_start: string
  period_end: string
  generated_at: string
  metrics?: any
  insights?: any
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [generatingReport, setGeneratingReport] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [formData, setFormData] = useState({
    dateRange: "last7days",
    platforms: [] as string[],
  })

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/reports")
      if (response.ok) {
        const data = await response.json()
        setReports(data.reports || [])
      }
    } catch (error) {
      console.error("[v0] Failed to fetch reports:", error)
      showToast("Failed to fetch reports", "error")
    } finally {
      setLoading(false)
    }
  }

  const generateAIReport = async () => {
    setGeneratingReport(true)
    showToast("Generating AI-powered report with insights...", "success")

    try {
      console.log("[v0] Generating AI report with:", formData)

      const response = await fetch("/api/reports/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateRange: formData.dateRange,
          platforms: formData.platforms.length > 0 ? formData.platforms : undefined,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to generate report")
      }

      const newReport: Report = {
        id: responseData.report.id,
        title: responseData.report.title,
        type: "ai_analysis",
        status: "completed",
        platform: formData.platforms.length > 0 ? formData.platforms.join(",") : "all",
        period_start: new Date().toLocaleDateString(),
        period_end: new Date().toLocaleDateString(),
        generated_at: responseData.report.generatedAt || new Date().toISOString(),
        metrics: responseData.report.metrics,
        insights: responseData.report.insights,
      }

      setReports((prev) => [newReport, ...prev])
      setShowGenerateModal(false)
      setFormData({ dateRange: "last7days", platforms: [] })
      showToast("AI report generated successfully!", "success")
    } catch (error: any) {
      console.error("[v0] Report generation error:", error)
      showToast(`Error: ${error.message}`, "error")
    } finally {
      setGeneratingReport(false)
    }
  }

  const deleteReport = async (id: string) => {
    if (!confirm("Delete this report?")) return

    try {
      const response = await fetch(`/api/reports/${id}`, { method: "DELETE" })
      if (response.ok) {
        setReports(reports.filter((r) => r.id !== id))
        showToast("Report deleted", "success")
      }
    } catch (error) {
      showToast("Failed to delete report", "error")
    }
  }

  const downloadReport = async (report: Report) => {
    try {
      // In production, this would generate a PDF
      showToast("PDF download coming soon", "info")
    } catch (error) {
      showToast("Failed to download report", "error")
    }
  }

  const getDateRangeLabel = (dateRange: string) => {
    const labels: Record<string, string> = {
      last7days: "Last 7 Days",
      last30days: "Last 30 Days",
      last90days: "Last 90 Days",
      thisMonth: "This Month",
      lastMonth: "Last Month",
    }
    return labels[dateRange] || dateRange
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Reports & Insights</h1>
            <p className="text-muted-foreground mt-2">Generate AI-powered performance reports with deep insights</p>
          </div>
          <Button onClick={() => setShowGenerateModal(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Generate Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Total Reports</p>
            <p className="text-3xl font-bold mt-2">{reports.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">AI Reports</p>
            <p className="text-3xl font-bold mt-2">{reports.filter((r) => r.type === "ai_analysis").length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Last Generated</p>
            <p className="text-lg font-bold mt-2">
              {reports.length > 0
                ? new Date(reports[0].generated_at).toLocaleDateString()
                : "Never"}
            </p>
          </Card>
        </div>

        {/* Reports List */}
        {!loading && reports.length === 0 && (
          <Card className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
            <p className="text-muted-foreground mb-6">Generate your first AI-powered report to get started</p>
            <Button onClick={() => setShowGenerateModal(true)}>Generate Report</Button>
          </Card>
        )}

        {!loading && reports.length > 0 && (
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-purple-100 rounded">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{report.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getDateRangeLabel(report.period_start)} • {report.platform}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {report.status}
                    </span>
                  </div>
                </div>

                {/* Key Metrics Preview */}
                {report.metrics && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 rounded">
                    <div>
                      <p className="text-xs text-muted-foreground">Spend</p>
                      <p className="font-bold text-sm">${(report.metrics.totalSpend / 100).toFixed(0)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="font-bold text-sm">${(report.metrics.totalRevenue / 100).toFixed(0)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ROAS</p>
                      <p className="font-bold text-sm text-green-600">{report.metrics.roas.toFixed(2)}x</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">CTR</p>
                      <p className="font-bold text-sm">{report.metrics.ctr.toFixed(2)}%</p>
                    </div>
                  </div>
                )}

                {/* Timestamp */}
                <div className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Generated {new Date(report.generated_at).toLocaleString()}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedReport(report)
                      setShowDetails(true)
                    }}
                    className="flex items-center gap-2 flex-1"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadReport(report)}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteReport(report.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Generate Report Modal */}
        {showGenerateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6 bg-white" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-bold">Generate AI Report</h2>
                </div>
                <button
                  onClick={() => !generatingReport && setShowGenerateModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                  disabled={generatingReport}
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium mb-2">Date Range</label>
                  <select
                    value={formData.dateRange}
                    onChange={(e) => setFormData({ ...formData, dateRange: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    disabled={generatingReport}
                  >
                    <option value="last7days">Last 7 Days</option>
                    <option value="last30days">Last 30 Days</option>
                    <option value="last90days">Last 90 Days</option>
                    <option value="thisMonth">This Month</option>
                    <option value="lastMonth">Last Month</option>
                  </select>
                </div>

                {/* Platforms */}
                <div>
                  <label className="block text-sm font-medium mb-2">Platforms (Optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {["meta", "google", "shopify", "linkedin"].map((platform) => (
                      <button
                        key={platform}
                        onClick={() => {
                          const platforms = formData.platforms.includes(platform)
                            ? formData.platforms.filter((p) => p !== platform)
                            : [...formData.platforms, platform]
                          setFormData({ ...formData, platforms })
                        }}
                        disabled={generatingReport}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                          formData.platforms.includes(platform)
                            ? "bg-purple-600 text-white border-purple-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                        } ${generatingReport ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Leave empty for all platforms</p>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-purple-50 p-3 rounded mt-4 mb-6">
                <p className="text-xs text-purple-900">
                  Your report will include AI-powered insights, performance analysis, recommendations, and audience psychology insights.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={generateAIReport}
                  disabled={generatingReport}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  {generatingReport ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Report
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowGenerateModal(false)}
                  disabled={generatingReport}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Report Details Modal */}
        {showDetails && selectedReport && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{selectedReport.title}</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-muted-foreground hover:text-foreground text-2xl"
                >
                  ×
                </button>
              </div>

              {selectedReport.insights && (
                <div className="space-y-4">
                  {typeof selectedReport.insights === "string" && (
                    <div>
                      <h3 className="font-semibold mb-2">Insights</h3>
                      <p className="text-sm text-muted-foreground">{selectedReport.insights}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-6 pt-4 border-t">
                <Button onClick={() => downloadReport(selectedReport)} className="flex-1">
                  Download PDF
                </Button>
                <Button variant="outline" onClick={() => setShowDetails(false)} className="flex-1">
                  Close
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
