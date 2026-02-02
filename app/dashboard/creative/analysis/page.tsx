'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, TrendingUp, Zap } from 'lucide-react'

export default function CreativeAnalysis() {
  const [creatives, setCreatives] = useState([
    {
      id: 1,
      name: 'Summer Promo Ad',
      format: 'image',
      status: 'winning',
      fatigue: 0.2,
      ctr: 2.8,
      roas: 3.5,
    },
    {
      id: 2,
      name: 'Product Launch Video',
      format: 'video',
      status: 'stable',
      fatigue: 0.45,
      ctr: 1.9,
      roas: 2.1,
    },
    {
      id: 3,
      name: 'Holiday Collection',
      format: 'carousel',
      status: 'losing',
      fatigue: 0.8,
      ctr: 0.8,
      roas: 0.9,
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'winning':
        return 'bg-green-100 text-green-800'
      case 'stable':
        return 'bg-blue-100 text-blue-800'
      case 'losing':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Creative Analysis</h1>
        <p className="text-slate-500 mt-2">Performance insights for your creative assets</p>
      </div>

      <div className="space-y-4">
        {creatives.map((creative) => (
          <Card key={creative.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{creative.name}</h3>
                  <Badge className={getStatusColor(creative.status)}>
                    {creative.status.charAt(0).toUpperCase() + creative.status.slice(1)}
                  </Badge>
                  <Badge variant="outline">{creative.format}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-slate-500">CTR</p>
                    <p className="text-lg font-bold">{creative.ctr}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">ROAS</p>
                    <p className="text-lg font-bold">{creative.roas.toFixed(1)}x</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Fatigue Score</p>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${creative.fatigue * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {creative.fatigue > 0.7 && (
                <div className="ml-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <p className="text-xs text-yellow-700 mt-1">Fatigue Alert</p>
                </div>
              )}

              {creative.status === 'winning' && (
                <div className="ml-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <p className="text-xs text-green-700 mt-1">Scale Ready</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
