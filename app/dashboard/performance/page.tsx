'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, DollarSign, Eye, MousePointerClick } from 'lucide-react'

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState({
    spend: 1250,
    revenue: 4200,
    impressions: 50000,
    clicks: 1250,
    ctr: 2.5,
    cpa: 14.71,
    roas: 3.36,
  })

  const [chartData] = useState([
    { date: 'Mon', spend: 150, revenue: 480 },
    { date: 'Tue', spend: 180, revenue: 520 },
    { date: 'Wed', spend: 200, revenue: 600 },
    { date: 'Thu', spend: 220, revenue: 680 },
    { date: 'Fri', spend: 250, revenue: 750 },
    { date: 'Sat', spend: 180, revenue: 540 },
    { date: 'Sun', spend: 70, revenue: 230 },
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Performance Dashboard</h1>
        <p className="text-slate-500 mt-2">Unified metrics across all connected platforms</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Spend</p>
              <p className="text-2xl font-bold">${metrics.spend.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-slate-400" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Revenue</p>
              <p className="text-2xl font-bold">${metrics.revenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Impressions</p>
              <p className="text-2xl font-bold">{(metrics.impressions / 1000).toFixed(0)}K</p>
            </div>
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">ROAS</p>
              <p className="text-2xl font-bold">{metrics.roas.toFixed(2)}x</p>
            </div>
            <MousePointerClick className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Spend vs Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="spend" stroke="#ef4444" />
              <Line type="monotone" dataKey="revenue" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Daily Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Connected Platforms</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>Meta Ads</span>
            <span className="text-green-500 text-sm">Connected</span>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>Google Ads</span>
            <span className="text-green-500 text-sm">Connected</span>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>TikTok Ads</span>
            <span className="text-yellow-500 text-sm">Connect</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
