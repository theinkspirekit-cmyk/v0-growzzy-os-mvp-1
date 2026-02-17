'use client'

import { useState } from 'react'
import { FileText, Loader2, Download, Share2 } from 'lucide-react'
import { toast } from 'sonner'

interface ReportTemplate {
  id: string
  name: string
  description: string
  icon: React.ReactNode
}

const templates: ReportTemplate[] = [
  {
    id: 'performance',
    name: 'Performance Report',
    description: 'Overview of campaign performance metrics',
    icon: <FileText className="w-5 h-5" />
  },
  {
    id: 'attribution',
    name: 'Attribution Report',
    description: 'Multi-touch attribution analysis',
    icon: <FileText className="w-5 h-5" />
  },
  {
    id: 'roi',
    name: 'ROI Report',
    description: 'Return on investment analysis',
    icon: <FileText className="w-5 h-5" />
  },
  {
    id: 'creative_performance',
    name: 'Creative Performance',
    description: 'Creative variations and performance',
    icon: <FileText className="w-5 h-5" />
  }
]

export function AIReportGenerator() {
  const [loading, setLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  })

  const generateReport = async (templateId: string) => {
    try {
      setLoading(true)
      setSelectedTemplate(templateId)

      const res = await fetch('/api/reports/generate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: templateId,
          dateRange: {
            from: new Date(dateRange.from),
            to: new Date(dateRange.to)
          }
        })
      })

      if (!res.ok) throw new Error('Failed to generate report')

      const data = await res.json()
      toast.success('Report generated successfully')

      // TODO: Handle report download or display
      console.log('Generated report:', data)
    } catch (error) {
      toast.error('Failed to generate report')
      console.error('Report generation error:', error)
    } finally {
      setLoading(false)
      setSelectedTemplate(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Report Templates</h3>
        <p className="text-sm text-gray-600">Generate AI-powered insights reports</p>
      </div>

      {/* Date Range Selector */}
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <input
            type="date"
            value={dateRange.from}
            onChange={e => setDateRange({ ...dateRange, from: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <input
            type="date"
            value={dateRange.to}
            onChange={e => setDateRange({ ...dateRange, to: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map(template => (
          <button
            key={template.id}
            onClick={() => generateReport(template.id)}
            disabled={loading}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="text-gray-600">{template.icon}</div>
              {selectedTemplate === template.id && loading && (
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              )}
            </div>
            <h4 className="font-semibold text-gray-900">{template.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
          </button>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Recent Reports</h3>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Performance Report</p>
                  <p className="text-xs text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Share2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
