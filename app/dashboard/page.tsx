"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Sparkles,
  RefreshCw,
  Plus,
  ArrowRight,
  Zap,
  Layout,
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
  { label: "Total Yield", value: "$412,850", change: "+12.5%", icon: Target, color: "#1F57F5" },
  { label: "Effective Spend", value: "$82,300", change: "+8.2%", icon: DollarSign, color: "#2BAFF2" },
  { label: "Acquired Leads", value: "8,240", change: "+15.3%", icon: Users, color: "#00DDFF" },
  { label: "Channel ROAS", value: "5.02x", change: "-2.1%", icon: Activity, color: "#FFB800" },
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
        <div className="p-8 lg:p-12 space-y-12 bg-white min-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-[#F8FAFC] rounded-[2.5rem] animate-pulse border-2 border-[#F1F5F9]" />
            ))}
          </div>
          <div className="h-[500px] bg-[#F8FAFC] rounded-[3rem] animate-pulse border-2 border-[#F1F5F9]" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8 lg:p-12 space-y-12 bg-white min-h-[calc(100vh-64px)] overflow-y-auto pb-40 font-satoshi">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#F1F5F9] pb-10 gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-[32px] font-bold text-[#05090E] tracking-tight">Executive Command Hub</h1>
            <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-[0.2em]">Unified Operational Intelligence Matrix</p>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={handleRefresh}
              className="h-12 px-8 border-2 border-[#F1F5F9] rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-3 hover:text-[#05090E] hover:border-[#1F57F5] transition-all text-[#64748B] bg-white shadow-sm"
            >
              <RefreshCw className={cn("w-4 h-4", refreshing ? 'animate-spin' : '')} />
              Data Refresh
            </button>
            <button
              onClick={() => router.push('/dashboard/campaign-launcher')}
              className="h-12 px-10 bg-[#1F57F5] text-white text-[12px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-[#1F57F5]/20 hover:bg-[#1A4AD1] transition-all flex items-center gap-3 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Execute Mission
            </button>
          </div>
        </div>

        {/* Global KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_KPIS.map((kpi, i) => (
            <div key={i} className="bg-white p-8 border-2 border-[#F1F5F9] rounded-[2.5rem] hover:border-[#1F57F5] transition-all duration-300 shadow-sm hover:shadow-xl group relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 bg-[#F8FAFC] rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm" style={{ color: kpi.color }}>
                  <kpi.icon className="w-7 h-7" />
                </div>
                <div className={cn(
                  "px-4 py-1.5 rounded-full text-[11px] font-bold",
                  kpi.change.startsWith('+') ? "bg-[#00DDFF]/10 text-[#00DDFF]" : "bg-[#F43F5E]/10 text-[#F43F5E]"
                )}>
                  {kpi.change}
                </div>
              </div>
              <div className="space-y-1 text-left relative z-10">
                <p className="text-[32px] font-bold text-[#05090E] tracking-tight">{kpi.value}</p>
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.15em]">{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Visual Intelligence */}
          <div className="lg:col-span-8 space-y-8 bg-white p-12 rounded-[3rem] border-2 border-[#F1F5F9] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-[#1F57F5] rounded-full" />
                <div className="text-left">
                  <h3 className="text-[20px] font-bold text-[#05090E]">Performance Velocity</h3>
                  <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest">Aggregate Growth Metrics</p>
                </div>
              </div>
              <div className="flex items-center gap-8 bg-[#F8FAFC] px-8 py-2.5 rounded-2xl border border-[#F1F5F9]">
                <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase text-[#05090E]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1F57F5]" />
                  Revenue
                </div>
                <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase text-[#05090E]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2BAFF2]" />
                  Ad Spend
                </div>
              </div>
            </div>

            <div className="h-[450px] w-full">
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
                    tick={{ fontSize: 11, fontWeight: 700, fill: '#64748B', fontFamily: 'Satoshi' }}
                    dy={18}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fontWeight: 700, fill: '#64748B', fontFamily: 'Satoshi' }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '24px', border: '2px solid #F1F5F9', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', fontFamily: 'Satoshi', padding: '16px' }}
                    itemStyle={{ fontSize: '13px', fontWeight: 700 }}
                    cursor={{ stroke: '#1F57F5', strokeWidth: 2, strokeDasharray: '6 6' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1F57F5"
                    strokeWidth={5}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                    animationDuration={2000}
                  />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    stroke="#2BAFF2"
                    strokeWidth={3}
                    strokeDasharray="8 8"
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Orchestration Recommendations */}
          <div className="lg:col-span-4 space-y-10 text-left">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[#00DDFF]" />
                <h3 className="text-[20px] font-bold text-[#05090E]">Intelligence Feed</h3>
              </div>
              <button className="p-2 hover:bg-[#F8FAFC] rounded-xl text-[#A3A3A3] transition-colors"><MoreVertical className="w-5 h-5" /></button>
            </div>

            <div className="space-y-8">
              {AI_RECOMMENDATIONS.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => router.push(rec.route)}
                  className="bg-white p-8 rounded-[2.5rem] border-2 border-[#F1F5F9] border-l-[#00DDFF] hover:border-[#1F57F5] hover:shadow-2xl transition-all duration-500 group cursor-pointer relative"
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#1F57F5] uppercase tracking-[0.2em] px-3 py-1 bg-[#1F57F5]/5 border border-[#1F57F5]/10 rounded-full">{rec.type}</span>
                      <div className="w-8 h-8 rounded-xl bg-[#F8FAFC] group-hover:bg-[#1F57F5] group-hover:text-white transition-all flex items-center justify-center">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-[18px] font-bold text-[#05090E] leading-tight group-hover:text-[#1F57F5] transition-colors">{rec.title}</h4>
                      <p className="text-[14px] text-[#64748B] font-medium leading-relaxed">{rec.desc}</p>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-[#F8FAFC]">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00DDFF] animate-pulse shadow-[0_0_8px_rgba(0,221,255,0.4)]" />
                      <span className="text-[11px] font-bold text-[#05090E] uppercase tracking-widest">Potential +14% Yield</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-[#05090E] p-10 rounded-[3rem] text-white relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#1F57F5]/20 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-[#1F57F5]/30 transition-all duration-700" />
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                      <Zap className="w-6 h-6 text-[#00DDFF]" />
                    </div>
                    <div className="text-left font-bold uppercase tracking-[0.2em] text-[#A3A3A3] text-[11px]">Neural Copilot</div>
                  </div>
                  <p className="text-[16px] font-medium leading-relaxed text-[#F1F5F9]/80">The system has identified 3 cross-channel optimization vectors ready for autonomous execution.</p>
                  <button
                    onClick={() => router.push('/dashboard/ai')}
                    className="w-full h-14 bg-[#1F57F5] text-white rounded-2xl text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-[#2BAFF2] transition-all shadow-xl shadow-[#1F57F5]/30 active:scale-95 flex items-center justify-center gap-3"
                  >
                    Sync Core Brain <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Intelligence Bar */}
        <div className="bg-[#F8FAFC]/50 p-10 rounded-[3rem] border-2 border-[#F1F5F9] flex flex-wrap items-center justify-between gap-12 group hover:border-[#1F57F5] transition-all">
          <div className="flex items-center gap-16">
            {[
              { label: 'Latency', value: '12ms', icon: Activity },
              { label: 'Terminal ID', value: 'OS_REYNOLDS_01', icon: Globe },
              { label: 'Auth Status', value: 'Superior Admin', icon: ShieldCheck },
              { label: 'Uptime', value: '99.99%', icon: Zap },
            ].map(i => (
              <div key={i.label} className="text-left space-y-1.5 group/item">
                <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-[0.25em] flex items-center gap-2">
                  <i.icon className="w-3.5 h-3.5 text-[#1F57F5] opacity-40 group-hover/item:opacity-100 transition-opacity" />
                  {i.label}
                </p>
                <p className="text-[14px] font-bold text-[#05090E] tracking-tight">{i.value}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <span className="text-[11px] font-bold text-[#A3A3A3] tracking-[0.2em] uppercase hidden md:block">DEPLOYMENT_REF: #98421_MATRIX</span>
            <div className="flex items-center gap-3 px-6 py-2.5 bg-white border-2 border-[#F1F5F9] rounded-2xl shadow-sm ring-1 ring-[#00DDFF]/10">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00DDFF] animate-pulse" />
              <span className="text-[12px] font-bold uppercase tracking-widest text-[#05090E]">Intelligence: OK</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
