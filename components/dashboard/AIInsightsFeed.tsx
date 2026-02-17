'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, Lightbulb, TrendingUp, X } from 'lucide-react'
import { formatDate } from '@/lib/formatters'

interface Insight {
  id: string
  title: string
  description: string
  type: 'warning' | 'success' | 'info'
  recommendation?: string
  confidence?: number
  entityType: string
  entityId: string
  createdAt: Date
}

export function AIInsightsFeed() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/ai/insights')
        if (!res.ok) throw new Error('Failed to fetch insights')
        const data = await res.json()
        setInsights(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading insights')
        setInsights([])
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [])

  const dismissInsight = async (id: string) => {
    try {
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ insightId: id, action: 'dismiss' })
      })
      if (res.ok) {
        setInsights(insights.filter(i => i.id !== id))
      }
    } catch (err) {
      console.error('Failed to dismiss insight:', err)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (error || !insights.length) {
    return null
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'success':
        return <TrendingUp className="w-5 h-5 text-green-500" />
      default:
        return <Lightbulb className="w-5 h-5 text-blue-500" />
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-red-50 border-red-200'
      case 'success':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">AI Insights</h3>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {insights.length}
        </span>
      </div>

      {insights.slice(0, 5).map(insight => (
        <div
          key={insight.id}
          className={`p-4 border rounded-lg ${getBgColor(insight.type)} flex gap-3 justify-between items-start group`}
        >
          <div className="flex gap-3 flex-1">
            <div className="mt-0.5">{getIcon(insight.type)}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                {insight.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {insight.description}
              </p>
              {insight.recommendation && (
                <p className="text-xs text-gray-600 mt-2 font-medium">
                  💡 {insight.recommendation}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {insight.confidence && (
                  <span className="text-xs text-gray-500">
                    Confidence: {insight.confidence}%
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  {formatDate(insight.createdAt, 'MMM dd HH:mm')}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => dismissInsight(insight.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      ))}
    </div>
  )
}
