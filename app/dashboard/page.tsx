"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Users, DollarSign, Target, Activity, RefreshCw, Plus, ArrowRight, Zap,
  TrendingUp, TrendingDown, Bell, Sparkles, MoreHorizontal, ArrowUpRight
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
// Recharts
import dynamic from "next/dynamic"

const AreaChart = dynamic(() => import("recharts").then(mod => mod.AreaChart), { ssr: false })
const Area = dynamic(() => import("recharts").then(mod => mod.Area), { ssr: false })
const XAxis = dynamic(() => import("recharts").then(mod => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then(mod => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import("recharts").then(mod => mod.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then(mod => mod.Tooltip), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false })

const KPI_DATA = [
  { label: "Total Revenue", value: "$412,850", change: "+12.5%", trend: "up", icon: DollarSign },
  { label: "Ad Spend", value: "$82,300", change: "+5.2%", trend: "up", icon: Activity },
  { label: "Active Leads", value: "8,240", change: "+15.3%", trend: "up", icon: Users },
  { label: "Return on Ad Spend", value: "5.02x", change: "-2.1%", trend: "down", icon: Target },
]

const CHART_DATA = [
  { name: "Mon", value: 4000 },
  { name: "Tue", value: 3000 },
  { name: "Wed", value: 5000 },
  { name: "Thu", value: 4500 },
  { name: "Fri", value: 6000 },
  { name: "Sat", value: 5500 },
  { name: "Sun", value: 7000 },
]

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return null // Or a skeleton

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-semibold text-text-primary">Overview</h1>
            <p className="text-[13px] text-text-secondary">Real-time performance metrics.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn btn-secondary h-9">
              <RefreshCw className="w-3.5 h-3.5 mr-2" /> Sync
            </button>
            <button onClick={() => router.push('/dashboard/campaigns')} className="btn btn-primary h-9">
              <Plus className="w-3.5 h-3.5 mr-2" /> Campaign
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI_DATA.map((kpi, i) => (
            <div key={i} className="card p-4 flex flex-col justify-between h-[110px]">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-medium uppercase text-text-secondary tracking-wide">{kpi.label}</span>
                <kpi.icon className="w-4 h-4 text-text-tertiary" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[24px] font-semibold text-text-primary">{kpi.value}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-success" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-danger" />
                  )}
                  <span className={cn(
                    "text-[11px] font-medium",
                    kpi.trend === 'up' ? "text-success" : "text-danger"
                  )}>{kpi.change} vs last period</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Chart Section */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[14px] font-semibold text-text-primary">Revenue Velocity</h3>
                <p className="text-[11px] text-text-secondary">Aggregate revenue over last 7 days.</p>
              </div>
              <select className="input w-[120px] h-8 text-[12px]">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    tickFormatter={value => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', padding: '8px 12px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#2563EB"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions & AI Insights */}
          <div className="space-y-6">

            {/* AI Insight Card */}
            <div className="card p-5 bg-gradient-to-b from-blue-50/50 to-white border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-[13px] font-semibold text-text-primary">AI Opportunity</h3>
              </div>
              <p className="text-[13px] text-text-secondary leading-relaxed mb-4">
                Campaign <span className="font-medium text-text-primary">Summer Scale</span> is under-pacing. Increase budget by 20% to maximize weekend traffic.
              </p>
              <button className="btn btn-primary w-full h-8 text-[12px]">
                Apply Recommendation
              </button>
            </div>

            {/* Quick Links */}
            <div className="card p-0 overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-gray-50/50">
                <h3 className="text-[12px] font-semibold text-text-secondary uppercase">Quick Access</h3>
              </div>
              <div className="divide-y divide-border">
                <button onClick={() => router.push('/dashboard/creatives')} className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[6px] bg-purple-50 flex items-center justify-center text-purple-600">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-[13px] font-medium text-text-primary">Generate Creative</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-text-tertiary group-hover:text-text-primary" />
                </button>
                <button onClick={() => router.push('/dashboard/leads')} className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[6px] bg-blue-50 flex items-center justify-center text-blue-600">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-[13px] font-medium text-text-primary">Import Leads</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-text-tertiary group-hover:text-text-primary" />
                </button>
                <button onClick={() => router.push('/dashboard/reports')} className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[6px] bg-amber-50 flex items-center justify-center text-amber-600">
                      <Activity className="w-4 h-4" />
                    </div>
                    <span className="text-[13px] font-medium text-text-primary">Monthly Report</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-text-tertiary group-hover:text-text-primary" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
