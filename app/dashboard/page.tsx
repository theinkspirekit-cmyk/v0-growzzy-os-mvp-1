"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Users, DollarSign, Target, Activity, RefreshCw, Plus, ArrowRight, Zap,
  ChevronRight, ShieldCheck, Globe, MoreVertical, X, AlertTriangle,
  TrendingUp, TrendingDown, Bell, Sparkles, CheckCircle
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
// Using dynamic import for Recharts to prevent CSR/SSR mismatch crashes
import dynamic from "next/dynamic"

const AreaChart = dynamic(() => import("recharts").then(mod => mod.AreaChart), { ssr: false })
const Area = dynamic(() => import("recharts").then(mod => mod.Area), { ssr: false })
const XAxis = dynamic(() => import("recharts").then(mod => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then(mod => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import("recharts").then(mod => mod.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then(mod => mod.Tooltip), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false })

const MOCK_KPIS = [
  { label: "Total Yield", value: "$412,850", change: "+12.5%", icon: Target, color: "text-[#1F57F5]", bg: "bg-[#1F57F5]/5" },
  { label: "Effective Spend", value: "$82,300", change: "+8.2%", icon: DollarSign, color: "text-[#2BAFF2]", bg: "bg-[#2BAFF2]/5" },
  { label: "Acquired Leads", value: "8,240", change: "+15.3%", icon: Users, color: "text-[#00DDFF]", bg: "bg-[#00DDFF]/5" },
  { label: "Channel ROAS", value: "5.02x", change: "-2.1%", icon: Activity, color: "text-[#FFB800]", bg: "bg-[#FFB800]/5" },
]

const MOCK_CHART_DATA = [
  { name: "Day 0", revenue: 4000, spend: 2400 },
  { name: "Day 5", revenue: 5200, spend: 3100 },
  { name: "Day 10", revenue: 4800, spend: 2900 },
  { name: "Day 15", revenue: 7800, spend: 3400 },
  { name: "Day 20", revenue: 6500, spend: 4000 },
  { name: "Day 25", revenue: 9200, spend: 3800 },
  { name: "Day 30", revenue: 11500, spend: 4200 },
]

const AI_INSIGHTS = [
  { id: 1, type: 'critical', message: 'Campaign "Summer Sale" ROAS dropped 12% in last 3 days.', action: 'Review Targeting' },
  { id: 2, type: 'opportunity', message: 'Creative Set B is outperforming control by 22% CTR.', action: 'Scale Budget' },
  { id: 3, type: 'warning', message: 'Lead cost on TikTok increased by $4.50 avg.', action: 'Check Bids' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [executeModalOpen, setExecuteModalOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      router.refresh()
      toast.success("Intelligence data synchronized from all sources")
    }, 1200)
  }

  const handleExecuteMission = () => {
    const toastId = toast.loading("Executing Optimization Protocols...")
    setTimeout(() => {
      toast.success("Mission Executed: Parameters optimized.", { id: toastId })
      setExecuteModalOpen(false)
    }, 2000)
  }

  if (!isMounted) return null

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-white/50 rounded-[2rem] animate-pulse border border-[#E2E8F0]" />
            ))}
          </div>
          <div className="h-[400px] bg-white/50 rounded-[2.5rem] animate-pulse border border-[#E2E8F0]" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-40 font-satoshi relative">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-[32px] font-bold text-[#05090E] tracking-tight">Executive Command Hub</h1>
            <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em] opacity-80">Unified Operational Intelligence Matrix</p>
          </div>
          <div className="flex items-center gap-4 relative">
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2.5 bg-white border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] transition-colors relative"
              >
                <Bell className="w-5 h-5 text-[#64748B]" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#F43F5E] rounded-full ring-2 ring-white"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-14 w-80 bg-white border border-[#E2E8F0] shadow-xl rounded-xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
                    <span className="text-[12px] font-bold text-[#1F2937]">System Alerts</span>
                    <button className="text-[10px] text-[#1F57F5] font-medium hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {[
                      { title: "Campaign Paused", desc: "Spend limit reached on set A.", time: "2m ago" },
                      { title: "Lead Influx", desc: "14 new leads from Meta.", time: "1h ago" }
                    ].map((n, i) => (
                      <div key={i} className="p-3 hover:bg-[#F8FAFC] border-b border-[#F1F5F9] last:border-0 cursor-pointer">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[13px] font-semibold text-[#1F2937]">{n.title}</span>
                          <span className="text-[10px] text-[#94A3B8]">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-[#64748B] leading-tight">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button onClick={handleRefresh} className="btn-secondary h-11 px-4">
              <RefreshCw className={cn("w-4 h-4 mr-2", refreshing ? 'animate-spin' : '')} />
              Data Refresh
            </button>
            <button onClick={() => setExecuteModalOpen(true)} className="btn-primary h-11 px-5 shadow-lg shadow-[#1F57F5]/20">
              <Plus className="w-5 h-5 mr-2" />
              Execute Mission
            </button>
          </div>
        </div>

        {/* Neural Insights & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#1F57F5]" />
                <h2 className="text-[18px] font-bold text-[#05090E]">Neural Intelligence Stream</h2>
              </div>
              <span className="text-[10px] font-bold text-[#1F57F5] bg-[#1F57F5]/5 px-3 py-1 rounded-full border border-[#1F57F5]/20 animate-pulse">
                Real-time Optimization Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AI_INSIGHTS.map((insight) => (
                <div key={insight.id} className="glass-card p-5 flex flex-col justify-between hover:border-[#1F57F5]/40 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                      insight.type === 'critical' ? "bg-red-50 text-red-500" :
                        insight.type === 'opportunity' ? "bg-emerald-50 text-emerald-500" :
                          "bg-amber-50 text-amber-500"
                    )}>
                      {insight.type === 'critical' ? <TrendingDown className="w-5 h-5" /> :
                        insight.type === 'opportunity' ? <TrendingUp className="w-5 h-5" /> :
                          <AlertTriangle className="w-5 h-5" />}
                    </div>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded",
                      insight.type === 'critical' ? "bg-red-100/50 text-red-600" :
                        insight.type === 'opportunity' ? "bg-emerald-100/50 text-emerald-600" :
                          "bg-amber-100/50 text-amber-600"
                    )}>{insight.type}</span>
                  </div>
                  <div className="text-left space-y-3">
                    <p className="text-[14px] font-bold text-[#1F2937] leading-tight">{insight.message}</p>
                    <button className="flex items-center gap-2 text-[11px] font-bold text-[#1F57F5] group-hover:translate-x-1 transition-transform">
                      {insight.action} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-white/40 border border-[#E2E8F0] rounded-[2rem] p-6 flex flex-col justify-between relative overflow-hidden group shadow-sm">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-amber-500" />
                <h2 className="text-[16px] font-bold text-[#05090E]">Deep Recommendations</h2>
              </div>
              <div className="space-y-4">
                {[
                  "Reallocate 15% budget to high-performing Creative X",
                  "A/B Test landing page variant for TikTok segment",
                  "Audit Google Search keywords with CTR < 1.2%"
                ].map((rec, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/60 border border-white rounded-xl shadow-sm text-left">
                    <div className="w-6 h-6 rounded-full bg-[#EFF6FF] text-[#1F57F5] flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </div>
                    <p className="text-[12px] font-medium text-[#475569] leading-tight">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => setExecuteModalOpen(true)}
              className="relative z-10 w-full h-11 bg-[#1F2937] hover:bg-black text-white rounded-xl text-[11px] font-semibold uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 mt-6"
            >
              Apply Matrix Suggestions <CheckCircle className="w-4 h-4" />
            </button>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#1F57F5]/5 rounded-full blur-3xl group-hover:bg-[#1F57F5]/10 transition-all duration-700" />
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_KPIS.map((kpi, i) => {
            const Icon = kpi.icon
            return (
              <div key={i} className="metric-card group">
                <div className="flex items-center justify-between mb-6">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm", kpi.bg, kpi.color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold",
                    kpi.change.startsWith('+') ? "bg-[#00DDFF]/10 text-[#0099DD]" : "bg-[#F43F5E]/10 text-[#EF4444]"
                  )}>
                    {kpi.change}
                  </div>
                </div>
                <div className="space-y-1 text-left relative z-10">
                  <p className="text-[28px] font-bold text-[#05090E] tracking-tighter leading-none">{kpi.value}</p>
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.15em]">{kpi.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Chart Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6 glass-card p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                <div className="text-left space-y-0.5">
                  <h3 className="text-[18px] font-bold text-[#05090E]">Performance Velocity</h3>
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Aggregate Growth Metrics</p>
                </div>
              </div>
            </div>
            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART_DATA}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1F57F5" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1F57F5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} dy={16} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', padding: '16px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 700 }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#1F57F5" strokeWidth={4} fillOpacity={1} fill="url(#revenueGrad)" />
                  <Area type="monotone" dataKey="spend" stroke="#2BAFF2" strokeWidth={3} strokeDasharray="6 6" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-2xl p-6 text-left">
              <h3 className="text-[14px] font-bold text-[#1F2937] uppercase tracking-wide mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "New Campaign", icon: Target, action: () => router.push('/dashboard/campaigns') },
                  { label: "AI Creative", icon: Sparkles, action: () => router.push('/dashboard/creatives') },
                  { label: "Target Index", icon: Users, action: () => router.push('/dashboard/leads') },
                  { label: "KPI Reports", icon: Activity, action: () => router.push('/dashboard/reports') },
                ].map((qa, i) => {
                  const ActionIcon = qa.icon
                  return (
                    <button
                      key={i}
                      onClick={qa.action}
                      className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl hover:bg-white hover:border-[#1F57F5] transition-all group text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                        <ActionIcon className="w-4 h-4 text-[#64748B] group-hover:text-[#1F57F5]" />
                      </div>
                      <p className="text-[11px] font-bold text-[#1F2937] leading-tight text-left">{qa.label}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="bg-[#0F172A] p-8 rounded-[2rem] text-white relative overflow-hidden group shadow-2xl border border-[#1E293B] text-left">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/30 transition-all duration-700" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                    <Zap className="w-5 h-5 text-[#00DDFF]" />
                  </div>
                  <div className="text-left font-bold uppercase tracking-[0.2em] text-[#94A3B8] text-[10px]">Neural Copilot</div>
                </div>
                <p className="text-[14px] font-medium leading-relaxed text-[#F1F5F9]/90 text-left">
                  3 optimization vectors identified. Rebalance recommended.
                </p>
                <button
                  onClick={() => router.push('/dashboard/copilot')}
                  className="w-full h-12 bg-[#1F57F5] text-white rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#1A4AD1] transition-all flex items-center justify-center gap-2.5"
                >
                  Sync Core Brain <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Execute Mission Modal */}
        {executeModalOpen && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#E2E8F0] overflow-hidden">
              <div className="p-6 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
                <div>
                  <h3 className="text-[18px] font-bold text-[#1F2937]">Mission Protocol</h3>
                  <p className="text-[12px] text-[#64748B]">Automated Adjustment Matrix</p>
                </div>
                <button onClick={() => setExecuteModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { title: "Budget Reallocation", impact: "+12% ROAS" },
                  { title: "Creative Rotation", impact: "+8% CTR" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-xl bg-white hover:border-[#1F57F5] transition-all cursor-pointer">
                    <h4 className="text-[13px] font-bold text-[#1F2937]">{item.title}</h4>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{item.impact}</span>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-[#F8FAFC] border-t border-[#E2E8F0] flex gap-3">
                <button onClick={() => setExecuteModalOpen(false)} className="flex-1 h-11 bg-white border border-[#E2E8F0] rounded-xl font-bold text-[13px] text-[#64748B]">
                  Abort
                </button>
                <button onClick={handleExecuteMission} className="flex-1 h-11 bg-[#1F57F5] rounded-xl font-bold text-[13px] text-white shadow-lg shadow-[#1F57F5]/20">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
