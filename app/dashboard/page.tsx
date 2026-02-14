"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Users, DollarSign, Target, Activity, RefreshCw, Plus, ArrowRight, Zap,
  TrendingUp, TrendingDown, Bell, Sparkles, MoreHorizontal, ArrowUpRight, ChevronRight, FileText
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

// Initial loading state or skeleton
const SKELETON_KPI = [
  { label: "Total Revenue", value: "...", change: "...", trend: "neutral", icon: DollarSign },
  { label: "Ad Spend", value: "...", change: "...", trend: "neutral", icon: Activity },
  { label: "Active Leads", value: "...", change: "...", trend: "neutral", icon: Users },
  { label: "Return on Ad Spend", value: "...", change: "...", trend: "neutral", icon: Target },
]

const SKELETON_CHART = Array(7).fill({ name: "", value: 0 })


export default function DashboardPage() {
  const router = useRouter()
  const [insights, setInsights] = useState<any[]>([])
  const [loadingInsights, setLoadingInsights] = useState(true)
  const [kpiData, setKpiData] = useState(SKELETON_KPI)
  const [chartData, setChartData] = useState(SKELETON_CHART)
  const [loadingOverview, setLoadingOverview] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        // Load Insights
        const insightsRes = await fetch("/api/ai/insights")
        const insightsData = await insightsRes.json()
        if (Array.isArray(insightsData)) setInsights(insightsData)

        // Load Overview
        const overviewRes = await fetch("/api/dashboard/overview")
        if (overviewRes.ok) {
          const overviewData = await overviewRes.json()
          if (overviewData.kpi) {
            // Map metrics to icons
            const mappedKpi = overviewData.kpi.map((k: any) => ({
              ...k,
              icon: k.metric === 'revenue' ? DollarSign :
                k.metric === 'spend' ? Activity :
                  k.metric === 'leads' ? Users : Target
            }))
            setKpiData(mappedKpi)
          }
          if (overviewData.chart) {
            setChartData(overviewData.chart)
          }
        }
      } catch (e) {
        console.error("Failed to load dashboard data", e)
      } finally {
        setLoadingInsights(false)
        setLoadingOverview(false)
      }
    }
    loadData()
  }, [])

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
          {kpiData.map((kpi, i) => (
            <div key={i} className="card p-4 flex flex-col justify-between h-[110px]">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-medium uppercase text-text-secondary tracking-wide">{kpi.label}</span>
                <kpi.icon className="w-4 h-4 text-text-tertiary" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[24px] font-semibold text-text-primary tracking-tight">{kpi.value}</span>
                  <span className={cn("text-[11px] font-medium", kpi.trend === "up" ? "text-success" : "text-danger")}>
                    {kpi.change}
                  </span>
                </div>
                <p className="text-[11px] text-text-tertiary mt-1">vs. previous period</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Chart Section */}
          <div className="lg:col-span-2 card p-6 min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[15px] font-semibold text-text-primary">Revenue Velocity</h3>
                <p className="text-[12px] text-text-secondary">30-day performance trend vs projection.</p>
              </div>
              <div className="flex gap-2">
                <button className="text-[11px] font-medium text-primary bg-primary/5 px-2 py-1 rounded">Revenue</button>
                <button className="text-[11px] font-medium text-text-tertiary hover:text-text-primary px-2 py-1 transition-colors">Spend</button>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1F57F5" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#1F57F5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 11 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 11 }}
                    dx={-10}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}
                    labelStyle={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#1F57F5"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights Feed */}
          <div className="card p-0 overflow-hidden flex flex-col h-full bg-surface">
            <div className="p-5 border-b border-border bg-gradient-to-r from-white to-gray-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-[15px] font-semibold text-text-primary flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Neural Copilot
                </h3>
                <p className="text-[11px] text-text-secondary mt-0.5">Real-time optimization engine active.</p>
              </div>
              <div className="animate-pulse w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            </div>

            <div className="flex-1 overflow-y-auto p-0 scrollbar-hide">
              {loadingInsights ? (
                <div className="p-8 text-center text-text-tertiary text-sm">Loading insights...</div>
              ) : insights.length === 0 ? (
                <div className="p-8 text-center text-text-tertiary text-sm">No critical insights found. System optimal.</div>
              ) : (
                insights.map((insight, i) => (
                  <div key={i} className="p-5 border-b border-border last:border-b-0 hover:bg-gray-50/50 transition-colors group cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                        insight.type === 'danger' ? "bg-red-50 text-red-600 border-red-100" :
                          insight.type === 'warning' ? "bg-amber-50 text-amber-600 border-amber-100" :
                            insight.type === 'success' ? "bg-green-50 text-green-600 border-green-100" :
                              "bg-blue-50 text-blue-600 border-blue-100"
                      )}>
                        {insight.metric}
                      </span>
                      <span className="text-[11px] font-medium text-text-secondary group-hover:text-primary transition-colors">{insight.impact}</span>
                    </div>
                    <h4 className="text-[13px] font-semibold text-text-primary mb-1">{insight.title}</h4>
                    <p className="text-[12px] text-text-secondary leading-relaxed mb-3">{insight.description}</p>

                    <button className="w-full py-1.5 text-[11px] font-medium border border-border rounded-[6px] text-text-secondary hover:bg-white hover:border-primary hover:text-primary transition-all shadow-sm flex items-center justify-center gap-1.5 group-hover:bg-white">
                      Apply Recommendation <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-border bg-gray-50/30">
              <button onClick={() => router.push('/dashboard/assistant')} className="w-full btn btn-secondary h-8 text-[11px] font-semibold uppercase tracking-wider">
                Full Strategy Audit
              </button>
            </div>
          </div>

        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => router.push('/dashboard/creatives')} className="card p-4 hover:border-primary/50 transition-colors group text-left">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-semibold text-text-primary block">New Creative</span>
            <span className="text-[11px] text-text-secondary">Generate ad assets</span>
          </button>

          <button onClick={() => router.push('/dashboard/reports')} className="card p-4 hover:border-primary/50 transition-colors group text-left">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-semibold text-text-primary block">Run Report</span>
            <span className="text-[11px] text-text-secondary">Export PDF briefing</span>
          </button>

          <button onClick={() => router.push('/dashboard/leads')} className="card p-4 hover:border-primary/50 transition-colors group text-left">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-semibold text-text-primary block">Add Lead</span>
            <span className="text-[11px] text-text-secondary">Manual entry</span>
          </button>

          <button onClick={() => router.push('/dashboard/automations')} className="card p-4 hover:border-primary/50 transition-colors group text-left">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 mb-3 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-semibold text-text-primary block">Deploy Rule</span>
            <span className="text-[11px] text-text-secondary">Create automation</span>
          </button>
        </div>

      </div>
    </DashboardLayout>
  )
}
