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
  TrendingUp as TrendingIcon,
  Zap,
  Layout,
  Activity,
  ChevronRight,
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

const MOCK_KPIS = [
  { label: "Total Yield", value: "$412,850", change: 12.5, icon: Target, status: "increase" },
  { label: "Effective Spend", value: "$82,300", change: 8.2, icon: DollarSign, status: "increase" },
  { label: "Acquired Leads", value: "8,240", change: 15.3, icon: Users, status: "increase" },
  { label: "Channel ROAS", value: "5.02x", change: -2.1, icon: TrendingUp, status: "decrease" },
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-neutral-50 rounded-md animate-pulse border border-neutral-100" />
            ))}
          </div>
          <div className="h-96 bg-neutral-50 rounded-md animate-pulse border border-neutral-100" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8 lg:p-12 space-y-12 bg-white min-h-[calc(100vh-64px)] overflow-y-auto pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-100 pb-10 gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Executive Command</h1>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">unified intelligence overview</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 border border-neutral-200 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-50 transition-all"
            >
              <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
              Sync Latency: 12ms
            </button>
            <button
              onClick={() => router.push('/dashboard/campaign-launcher')}
              className="enterprise-button h-10 px-6 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Execute Mission
            </button>
          </div>
        </div>

        {/* Global KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_KPIS.map((kpi, i) => (
            <div key={i} className="enterprise-card group p-6 hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-black">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-neutral-50 rounded-md flex items-center justify-center text-neutral-400 group-hover:bg-black group-hover:text-white transition-all">
                  <kpi.icon className="w-5 h-5" />
                </div>
                <div className={`text-[10px] font-black uppercase tracking-tighter ${kpi.status === 'increase' ? 'text-black' : 'text-neutral-400'}`}>
                  {kpi.status === 'increase' ? '+' : ''}{kpi.change}%
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-neutral-900">{kpi.value}</p>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Visual Intelligence */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-neutral-400" />
                <h3 className="text-sm font-bold uppercase tracking-tight">Performance Velocity</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-neutral-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                  Revenue
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-neutral-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
                  Spend
                </div>
              </div>
            </div>

            <div className="enterprise-card p-8 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART_DATA}>
                  <defs>
                    <linearGradient id="colRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.05} />
                      <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fontWeight: 800, fill: '#A3A3A3' }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fontWeight: 800, fill: '#A3A3A3' }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '4px', border: '1px solid #E5E5E5', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    labelStyle={{ fontSize: '10px', fontWeight: 800, marginBottom: '4px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#000000"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colRevenue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    stroke="#E5E5E5"
                    strokeWidth={2}
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Orchestration Recommendations */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2 px-2">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h3 className="text-sm font-bold uppercase tracking-tight">AI Orchestration</h3>
            </div>

            <div className="space-y-4">
              {AI_RECOMMENDATIONS.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => router.push(rec.route)}
                  className="enterprise-card group p-6 cursor-pointer hover:shadow-xl transition-all border-l-4 border-l-black relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-50 rounded-bl-full -mr-12 -mt-12 group-hover:bg-neutral-100 transition-colors" />
                  <div className="relative z-10 space-y-4 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">{rec.type}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-black transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-neutral-900 group-hover:underline">{rec.title}</h4>
                      <p className="text-[11px] text-neutral-500 leading-relaxed">{rec.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <div className="flex -space-x-1.5">
                        <div className="w-5 h-5 rounded-full border-2 border-white bg-black" />
                        <div className="w-5 h-5 rounded-full border-2 border-white bg-neutral-200" />
                        <div className="w-5 h-5 rounded-full border-2 border-white bg-neutral-100" />
                      </div>
                      <span className="text-[9px] font-bold text-neutral-400 uppercase">Analysis Impact: +14% ROI</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="enterprise-card p-6 bg-black text-white space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Copilot Status</span>
                </div>
                <p className="text-xs font-bold leading-relaxed">System ready for cross-channel budget balancing.</p>
                <button
                  onClick={() => router.push('/dashboard/copilot')}
                  className="w-full py-2 bg-white text-black rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-100 transition-all"
                >
                  Enter Copilot Hub
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Global Intelligence Bar */}
        <div className="enterprise-card p-4 bg-neutral-50 border-neutral-200 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            {[
              { label: 'Latency', value: '12ms' },
              { label: 'Identity', value: 'Michael R.' },
              { label: 'Role', value: 'Administrator' },
              { label: 'Uptime', value: '99.9%' },
            ].map(i => (
              <div key={i.label} className="space-y-0.5 text-left">
                <p className="text-[8px] font-black text-neutral-400 uppercase tracking-tighter">{i.label}</p>
                <p className="text-[10px] font-bold text-neutral-900">{i.value}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-bold text-neutral-400">LAST SYNC INDEX: #98421</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest">System Operational</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
