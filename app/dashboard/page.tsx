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
  { label: "Total Revenue", value: "...", change: "...", trend: "neutral", icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Ad Spend", value: "...", change: "...", trend: "neutral", icon: Activity, color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Active Leads", value: "...", change: "...", trend: "neutral", icon: Users, color: "text-green-600", bg: "bg-green-50" },
  { label: "Return on Ad Spend", value: "...", change: "...", trend: "neutral", icon: Target, color: "text-purple-600", bg: "bg-purple-50" },
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
            // Map metrics to icons & colors
            const mappedKpi = overviewData.kpi.map((k: any) => ({
              ...k,
              icon: k.metric === 'revenue' ? DollarSign :
                k.metric === 'spend' ? Activity :
                  k.metric === 'leads' ? Users : Target,
              color: k.metric === 'revenue' ? "text-blue-600" :
                k.metric === 'spend' ? "text-orange-600" :
                  k.metric === 'leads' ? "text-green-600" : "text-purple-600",
              bg: k.metric === 'revenue' ? "bg-blue-50" :
                k.metric === 'spend' ? "bg-orange-50" :
                  k.metric === 'leads' ? "bg-green-50" : "bg-purple-50",
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
      <div className="space-y-8 font-satoshi pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">Overview</h1>
            <p className="text-[14px] text-gray-500 font-medium">Real-time performance metrics & AI insights.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn btn-secondary h-10 text-xs font-bold uppercase tracking-wider bg-white border border-gray-200 text-gray-600 hover:text-gray-900 shadow-sm">
              <RefreshCw className="w-3.5 h-3.5 mr-2" /> Sync Data
            </button>
            <button onClick={() => router.push('/dashboard/campaigns')} className="btn btn-primary h-10 text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 border-0">
              <Plus className="w-3.5 h-3.5 mr-2" /> New Campaign
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between h-[140px] relative overflow-hidden">
              <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 transition-transform group-hover:scale-110", kpi.bg.replace('50', '500'))} />

              <div className="flex justify-between items-start relative z-10">
                <span className="text-[11px] font-bold uppercase text-gray-400 tracking-widest">{kpi.label}</span>
                <div className={cn("p-2 rounded-lg", kpi.bg, kpi.color)}>
                  <kpi.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="relative z-10">
                <div className="flex items-baseline gap-3">
                  <span className="text-[32px] font-bold text-gray-900 tracking-tight">{kpi.value}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn("text-[11px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1", kpi.trend === "up" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
                    {kpi.change} {kpi.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">vs last period</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Chart Section */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm min-h-[450px] relative overflow-hidden">
            {/* Decorative Background Blur */}
            <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] bg-blue-50/50 rounded-full blur-[80px]" />

            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-[18px] font-bold text-gray-900 flex items-center gap-2">
                  Revenue Velocity
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] uppercase font-bold rounded-full tracking-wider">Live</span>
                </h3>
                <p className="text-[13px] text-gray-500 font-medium mt-1">30-day performance trend vs AI projection.</p>
              </div>
              <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
                <button className="text-[11px] font-bold text-blue-700 bg-white shadow-sm border border-gray-100 px-3 py-1.5 rounded-lg transition-all">Revenue</button>
                <button className="text-[11px] font-bold text-gray-400 hover:text-gray-600 px-3 py-1.5 transition-colors">Spend</button>
              </div>
            </div>
            <div className="h-[320px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
                    dx={-10}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 600, color: '#1E293B' }}
                    labelStyle={{ fontSize: '11px', color: '#64748B', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#2563EB"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2, fill: '#2563EB' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights Feed */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full relative">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800 text-white">
              <div>
                <h3 className="text-[16px] font-bold flex items-center gap-2 text-white">
                  <Sparkles className="w-4 h-4 text-yellow-400" /> Neural Copilot
                </h3>
                <p className="text-[11px] text-gray-400 font-medium mt-1">Real-time optimization engine active.</p>
              </div>
              <div className="animate-pulse w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)] border border-green-300" />
            </div>

            <div className="flex-1 overflow-y-auto p-0 scrollbar-hide bg-gray-50/30">
              {loadingInsights ? (
                <div className="p-8 text-center text-gray-400 text-sm font-medium">Scanning data streams...</div>
              ) : insights.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm font-medium flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-2"><TrendingUp className="w-5 h-5" /></div>
                  No critical alerts. System optimal.
                </div>
              ) : (
                insights.map((insight, i) => (
                  <div key={i} className="p-5 border-b border-gray-100 last:border-b-0 hover:bg-white transition-colors group cursor-pointer relative">
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-transparent group-hover:bg-blue-500 transition-colors" />
                    <div className="flex justify-between items-start mb-2">
                      <span className={cn(
                        "text-[9px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-md border",
                        insight.type === 'danger' ? "bg-red-50 text-red-600 border-red-100" :
                          insight.type === 'warning' ? "bg-amber-50 text-amber-600 border-amber-100" :
                            insight.type === 'success' ? "bg-green-50 text-green-600 border-green-100" :
                              "bg-blue-50 text-blue-600 border-blue-100"
                      )}>
                        {insight.metric}
                      </span>
                      <span className="text-[11px] font-bold text-gray-400 group-hover:text-blue-600 transition-colors">{insight.impact}</span>
                    </div>
                    <h4 className="text-[13px] font-bold text-gray-900 mb-1 leading-snug">{insight.title}</h4>
                    <p className="text-[12px] text-gray-500 leading-relaxed mb-4 font-medium">{insight.description}</p>

                    <button className="w-full py-2 text-[11px] font-bold border border-gray-200 rounded-lg text-gray-500 hover:bg-blue-600 hover:border-transparent hover:text-white transition-all shadow-sm flex items-center justify-center gap-2 group-hover:shadow-md bg-white">
                      Apply Recommendation <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-white">
              <button
                onClick={async () => {
                  const toastId = toast.loading("Initializing Mission Control...")
                  try {
                    const res = await fetch('/api/ai/optimize', { method: 'POST' })
                    if (!res.ok) throw new Error("Mission failed")
                    const data = await res.json()
                    toast.success(`Mission Complete: ${data.insightsCount || 0} insights generated`)
                    toast.dismiss(toastId)
                    if (data.reports) {
                      setInsights(data.reports.flatMap((r: any) => r.insights))
                    }
                  } catch (e) {
                    toast.error("Optimization Mission Failed")
                    toast.dismiss(toastId)
                  }
                }}
                className="w-full h-11 bg-gray-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-yellow-400" /> Execute Optimization Mission
              </button>
            </div>
          </div>

        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <button onClick={() => router.push('/dashboard/creatives')} className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 transition-all group text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[14px] font-bold text-gray-900 block mb-1">New Creative</span>
            <span className="text-[11px] text-gray-400 font-medium">Generate high-converting assets</span>
          </button>

          <button onClick={() => router.push('/dashboard/reports')} className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg hover:-translate-y-1 transition-all group text-left">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[14px] font-bold text-gray-900 block mb-1">Executive Report</span>
            <span className="text-[11px] text-gray-400 font-medium">One-click PDF briefing</span>
          </button>

          <button onClick={() => router.push('/dashboard/leads')} className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-lg hover:-translate-y-1 transition-all group text-left">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[14px] font-bold text-gray-900 block mb-1">Manage Leads</span>
            <span className="text-[11px] text-gray-400 font-medium">Import & track pipeline</span>
          </button>

          <button onClick={() => router.push('/dashboard/automations')} className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-lg hover:-translate-y-1 transition-all group text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[14px] font-bold text-gray-900 block mb-1">Deploy Automation</span>
            <span className="text-[11px] text-gray-400 font-medium">Set up active rules</span>
          </button>
        </div>

      </div>
    </DashboardLayout>
  )
}
