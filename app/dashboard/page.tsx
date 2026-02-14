"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import {
  DollarSign,
  Users,
  Target,
  Sparkles,
  RefreshCw,
  Plus,
  ArrowRight,
  Zap,
  Activity,
  ChevronRight,
  ShieldCheck,
  Globe,
  MoreVertical,
} from "lucide-react"
import { toast } from "sonner"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"
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

const AI_RECOMMENDATIONS = [
  { id: 1, title: "Shift $4.2k to Meta Retargeting", desc: "Meta ads are yielding 3.2x higher conversion than Google Search for 'Summer' segments.", type: 'strategy', route: '/dashboard/campaigns' },
  { id: 2, title: "Synthesize Fresh Ad Creatives", desc: "Ad fatigue detected on 4 major sets. AI recommends generating 3 video variations immediately.", type: 'creative', route: '/dashboard/creatives' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      toast.success("Intelligence data synchronized")
    }, 1200)
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
      <div className="space-y-12 pb-40 font-satoshi">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-[32px] font-bold text-[#05090E] tracking-tight">Executive Command Hub</h1>
            <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em] opacity-80">Unified Operational Intelligence Matrix</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              className="btn-secondary"
            >
              <RefreshCw className={cn("w-4 h-4", refreshing ? 'animate-spin' : '')} />
              Data Refresh
            </button>
            <button
              onClick={() => router.push('/dashboard/campaign-launcher')}
              className="btn-primary"
            >
              <Plus className="w-5 h-5" />
              Execute Mission
            </button>
          </div>
        </div>

        {/* Global KPIs */}
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Visual Intelligence */}
          <div className="lg:col-span-8 space-y-6 glass-card p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <div className="text-left space-y-0.5">
                  <h3 className="text-[18px] font-bold text-[#05090E]">Performance Velocity</h3>
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Aggregate Growth Metrics</p>
                </div>
              </div>
              <div className="flex items-center gap-6 bg-[#F8FAFC]/50 px-6 py-2 rounded-xl border border-[#E2E8F0]">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-[#05090E]">
                  <div className="w-2 h-2 rounded-full bg-[#1F57F5]" />
                  Revenue
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-[#05090E]">
                  <div className="w-2 h-2 rounded-full bg-[#2BAFF2]" />
                  Ad Spend
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
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8', fontFamily: 'Satoshi' }}
                    dy={16}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8', fontFamily: 'Satoshi' }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', fontFamily: 'Satoshi', padding: '16px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 700 }}
                    cursor={{ stroke: '#1F57F5', strokeWidth: 2, strokeDasharray: '6 6' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1F57F5"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                    animationDuration={2000}
                  />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    stroke="#2BAFF2"
                    strokeWidth={3}
                    strokeDasharray="6 6"
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Orchestration Recommendations */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#00DDFF]" />
                <h3 className="text-[18px] font-bold text-[#05090E]">Intelligence Feed</h3>
              </div>
              <button className="p-1.5 hover:bg-[#F1F5F9] rounded-lg text-[#94A3B8] transition-colors"><MoreVertical className="w-4 h-4" /></button>
            </div>

            <div className="space-y-6">
              {AI_RECOMMENDATIONS.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => router.push(rec.route)}
                  className="glass-card p-6 border-l-4 border-l-[#00DDFF] hover:shadow-xl transition-all duration-300 group cursor-pointer relative"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] px-2.5 py-1 bg-primary/5 border border-primary/10 rounded-md">{rec.type}</span>
                      <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-[16px] font-bold text-[#05090E] leading-tight group-hover:text-primary transition-colors">{rec.title}</h4>
                      <p className="text-[13px] text-[#64748B] font-medium leading-relaxed">{rec.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-3 border-t border-[#F8FAFC]">
                      <div className="w-2 h-2 rounded-full bg-[#00DDFF] animate-pulse shadow-[0_0_8px_rgba(0,221,255,0.4)]" />
                      <span className="text-[10px] font-bold text-[#05090E] uppercase tracking-widest">Potential +14% Yield</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-surface-dark p-8 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl border border-[#1E293B]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/30 transition-all duration-700" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                      <Zap className="w-5 h-5 text-[#00DDFF]" />
                    </div>
                    <div className="text-left font-bold uppercase tracking-[0.2em] text-[#94A3B8] text-[10px]">Neural Copilot</div>
                  </div>
                  <p className="text-[14px] font-medium leading-relaxed text-[#F1F5F9]/90">The system has identified 3 cross-channel optimization vectors ready for autonomous execution.</p>
                  <button
                    onClick={() => router.push('/dashboard/copilot')}
                    className="w-full h-12 bg-primary text-white rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#2BAFF2] transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2.5"
                  >
                    Sync Core Brain <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Intelligence Bar */}
        <div className="glass-panel p-6 flex flex-wrap items-center justify-between gap-8 group hover:border-[#1F57F5] transition-all">
          <div className="flex items-center gap-12">
            {[
              { label: 'Latency', value: '12ms', icon: Activity },
              { label: 'Terminal ID', value: 'OS_REYNOLDS_01', icon: Globe },
              { label: 'Auth Status', value: 'Superior Admin', icon: ShieldCheck },
              { label: 'Uptime', value: '99.99%', icon: Zap },
            ].map(i => (
              <div key={i.label} className="text-left space-y-1 group/item">
                <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-[0.25em] flex items-center gap-1.5">
                  <i.icon className="w-3 h-3 text-primary opacity-40 group-hover/item:opacity-100 transition-opacity" />
                  {i.label}
                </p>
                <p className="text-[13px] font-bold text-[#05090E] tracking-tight">{i.value}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-bold text-[#94A3B8] tracking-[0.2em] uppercase hidden md:block">DEPLOYMENT_REF: #98421_MATRIX</span>
            <div className="flex items-center gap-2.5 px-4 py-2 bg-white border border-[#E2E8F0] rounded-xl shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#00DDFF] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#05090E]">Intelligence: OK</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
