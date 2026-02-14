"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Users, DollarSign, Target, Activity, RefreshCw, Plus, ArrowRight, Zap,
  ChevronRight, ShieldCheck, Globe, MoreVertical, X, AlertTriangle,
  TrendingUp, TrendingDown, Bell
} from "lucide-react"
import { toast } from "sonner"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

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
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [executeModalOpen, setExecuteModalOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate real data refresh
    setTimeout(() => {
      setRefreshing(false)
      router.refresh()
      toast.success("Intelligence data synchronized from all sources")
    }, 1200)
  }

  const handleExecuteMission = () => {
    const toastId = toast.loading("Executing Optimization Protocols...")
    setTimeout(() => {
      toast.success("Mission Executed: Budget reallocated, creatives rotated.", { id: toastId })
      setExecuteModalOpen(false)
    }, 2000)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
            {/* Notification Bell */}
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
                      { title: "Campaign Paused", desc: "Summer Sale halted due to spend limit.", time: "2m ago", type: "alert" },
                      { title: "New Lead Spike", desc: "+14 leads from LinkedIn today.", time: "1h ago", type: "info" },
                      { title: "System Update", desc: "v2.0.4 patch applied successfully.", time: "4h ago", type: "success" }
                    ].map((n, i) => (
                      <div key={i} className="p-3 hover:bg-[#F8FAFC] border-b border-[#F1F5F9] last:border-0 cursor-pointer transition-colors group">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[13px] font-semibold text-[#1F2937] group-hover:text-[#1F57F5] transition-colors">{n.title}</span>
                          <span className="text-[10px] text-[#94A3B8]">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-[#64748B] leading-tight">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-[#E2E8F0] text-center">
                    <button className="text-[11px] font-bold text-[#64748B] hover:text-[#1F2937] uppercase tracking-wide">View Full Log</button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleRefresh}
              className="btn-secondary h-11 px-4"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", refreshing ? 'animate-spin' : '')} />
              Data Refresh
            </button>
            <button
              onClick={() => setExecuteModalOpen(true)}
              className="btn-primary h-11 px-5 shadow-lg shadow-[#1F57F5]/20 hover:shadow-[#1F57F5]/40 transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Execute Mission
            </button>
          </div>
        </div>

        {/* AI Insights & Alerts Block */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500 delay-100">
          {AI_INSIGHTS.map((insight) => (
            <div key={insight.id} className="bg-white border border-[#E2E8F0] shadow-sm rounded-xl p-4 flex items-start gap-4 hover:border-[#1F57F5]/50 transition-colors group">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                insight.type === 'critical' ? "bg-red-50 text-red-500" :
                  insight.type === 'opportunity' ? "bg-emerald-50 text-emerald-500" :
                    "bg-amber-50 text-amber-500"
              )}>
                {insight.type === 'critical' ? <TrendingDown className="w-5 h-5" /> :
                  insight.type === 'opportunity' ? <TrendingUp className="w-5 h-5" /> :
                    <AlertTriangle className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <span className={cn(
                    "text-[10px] font-extrabold uppercase tracking-wider",
                    insight.type === 'critical' ? "text-red-500" :
                      insight.type === 'opportunity' ? "text-emerald-500" :
                        "text-amber-500"
                  )}>{insight.type}</span>
                </div>
                <p className="text-[13px] font-medium text-[#1F2937] leading-snug mb-2">{insight.message}</p>
                <button className="text-[11px] font-bold text-[#1F57F5] hover:underline flex items-center gap-1 group-hover:gap-2 transition-all">
                  {insight.action} <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_KPIS.map((kpi, i) => (
            <div key={i} className="metric-card group">
              <div className="flex items-center justify-between mb-6">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm", kpi.bg, kpi.color)}>
                  <kpi.icon className="w-6 h-6" />
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold",
                  kpi.change.startsWith('+') ? "bg-[#00DDFF]/10 text-[#0099DD]" : "bg-[#F43F5E]/10 text-[#EF4444]"
                )}>
                  {kpi.change}
                </div>
              </div>
              <div className="space-y-1 text-left relative z-10">
                <p className="text-[28px] font-bold text-[#05090E] tracking-tighter loading-none">{kpi.value}</p>
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.15em]">{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Chart Area */}
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
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8', fontFamily: 'Satoshi' }} dy={16} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8', fontFamily: 'Satoshi' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', fontFamily: 'Satoshi', padding: '16px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 700 }}
                    cursor={{ stroke: '#1F57F5', strokeWidth: 2, strokeDasharray: '6 6' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#1F57F5" strokeWidth={4} fillOpacity={1} fill="url(#revenueGrad)" animationDuration={1500} />
                  <Area type="monotone" dataKey="spend" stroke="#2BAFF2" strokeWidth={3} strokeDasharray="6 6" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Rail: Quick Actions & Copilot */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions Panel */}
            <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-2xl p-6">
              <h3 className="text-[14px] font-bold text-[#1F2937] uppercase tracking-wide mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "New Campaign", icon: Target, action: () => router.push('/dashboard/campaigns') },
                  { label: "Generate Asset", icon: Sparkles, action: () => router.push('/dashboard/creatives') },
                  { label: "Import Leads", icon: Users, action: () => router.push('/dashboard/leads') },
                  { label: "Run Report", icon: Activity, action: () => router.push('/dashboard/reports') },
                ].map((qa, i) => (
                  <button
                    key={i}
                    onClick={qa.action}
                    className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl hover:bg-white hover:border-[#1F57F5] hover:shadow-md transition-all group text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <qa.icon className="w-4 h-4 text-[#64748B] group-hover:text-[#1F57F5]" />
                    </div>
                    <p className="text-[11px] font-bold text-[#1F2937] leading-tight">{qa.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Copilot Teaser */}
            <div className="bg-[#0F172A] p-8 rounded-[2rem] text-white relative overflow-hidden group shadow-2xl border border-[#1E293B]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/30 transition-all duration-700" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                    <Zap className="w-5 h-5 text-[#00DDFF]" />
                  </div>
                  <div className="text-left font-bold uppercase tracking-[0.2em] text-[#94A3B8] text-[10px]">Neural Copilot</div>
                </div>
                <p className="text-[14px] font-medium leading-relaxed text-[#F1F5F9]/90">
                  3 optimization vectors identified. Budget rebalance recommended.
                </p>
                <button
                  onClick={() => router.push('/dashboard/copilot')}
                  className="w-full h-12 bg-[#1F57F5] text-white rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#1A4AD1] transition-all shadow-lg flex items-center justify-center gap-2.5"
                >
                  Sync Core Brain <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Execute Mission Modal */}
        {executeModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#E2E8F0] overflow-hidden">
              <div className="p-6 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
                <div>
                  <h3 className="text-[18px] font-bold text-[#1F2937]">Execute Optimization Mission</h3>
                  <p className="text-[12px] text-[#64748B]">Automated Cross-Channel Adjustment Protocol</p>
                </div>
                <button onClick={() => setExecuteModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  {[
                    { title: "Budget Reallocation", desc: "Shift $400 from Google Search to Meta Retargeting", impact: "+12% ROAS" },
                    { title: "Creative Rotation", desc: "Replace fatigued 'Variant A' with 'Variant C'", impact: "+8% CTR" },
                    { title: "Bid Adjustment", desc: "Increase TikTok CPA target by 5%", impact: "+15% Vol" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 border border-[#E2E8F0] rounded-xl hover:border-[#1F57F5] transition-colors cursor-pointer bg-white">
                      <div className="w-5 h-5 rounded-full border-2 border-[#E2E8F0] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="text-[13px] font-bold text-[#1F2937]">{item.title}</h4>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">{item.impact}</span>
                        </div>
                        <p className="text-[12px] text-[#64748B] mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                    Actions will be executed immediately across connected ad accounts. This may trigger platform review processes.
                  </p>
                </div>
              </div>
              <div className="p-6 bg-[#F8FAFC] border-t border-[#E2E8F0] flex gap-3">
                <button onClick={() => setExecuteModalOpen(false)} className="flex-1 h-11 bg-white border border-[#E2E8F0] rounded-xl font-bold text-[13px] text-[#64748B] hover:text-[#1F2937]">
                  Abort Mission
                </button>
                <button onClick={handleExecuteMission} className="flex-1 h-11 bg-[#1F57F5] rounded-xl font-bold text-[13px] text-white hover:bg-[#1A4AD1] shadow-lg shadow-[#1F57F5]/20">
                  Confirm Execution
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
