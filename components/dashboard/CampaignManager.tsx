'use client'

import { useState, useEffect } from 'react'
import { Pause, Play, MoreVertical, Trash2, Edit2, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { getCampaigns, pauseCampaign, resumeCampaign } from '@/app/actions/campaigns'
import { formatCurrency, formatROAS, getCampaignStatusColor } from '@/lib/formatters'

interface Campaign {
  id: string
  name: string
  platform: string
  status: string
  dailyBudget: number
  totalSpend?: number
  totalRevenue?: number
  roas?: number
  createdAt: Date
}

export function CampaignManager() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'ended'>('all')

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      const data = await getCampaigns()
      setCampaigns(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch campaigns:', error)
      toast.error('Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }

  const handlePause = async (id: string) => {
    try {
      const result = await pauseCampaign(id)
      if (result.success) {
        toast.success('Campaign paused')
        fetchCampaigns()
      } else {
        toast.error(result.error || 'Failed to pause campaign')
      }
    } catch (error) {
      toast.error('Failed to pause campaign')
    }
  }

  const handleResume = async (id: string) => {
    try {
      const result = await resumeCampaign(id)
      if (result.success) {
        toast.success('Campaign resumed')
        fetchCampaigns()
      } else {
        toast.error(result.error || 'Failed to resume campaign')
      }
    } catch (error) {
      toast.error('Failed to resume campaign')
    }
  }

  const filteredCampaigns = campaigns.filter(c => {
    if (filter === 'all') return true
    return c.status === filter
  })

  if (loading) {
    return <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Campaigns</h3>
        <div className="flex gap-2">
          {['all', 'active', 'paused', 'ended'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-3 py-1 text-sm rounded-lg font-medium transition ${
                filter === status
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredCampaigns.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No campaigns found</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredCampaigns.map(campaign => (
            <div key={campaign.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${getCampaignStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{campaign.platform}</p>
                </div>

                <div className="flex items-center gap-2">
                  {campaign.status === 'active' ? (
                    <button
                      onClick={() => handlePause(campaign.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Pause campaign"
                    >
                      <Pause className="w-4 h-4 text-gray-600" />
                    </button>
                  ) : campaign.status === 'paused' ? (
                    <button
                      onClick={() => handleResume(campaign.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Resume campaign"
                    >
                      <Play className="w-4 h-4 text-gray-600" />
                    </button>
                  ) : null}

                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-600">Daily Budget</p>
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(campaign.dailyBudget)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Spend</p>
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(campaign.totalSpend || 0)}</p>
                </div>
                {campaign.roas && (
                  <div>
                    <p className="text-xs text-gray-600">ROAS</p>
                    <p className="text-sm font-semibold text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {formatROAS(campaign.roas)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
