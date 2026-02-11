"use client"

import DashboardLayout from "@/components/dashboard-layout"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Sparkles,
  Globe,
  Filter,
  Target,
  DollarSign,
  Users,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"

const PLATFORMS = [
  { name: "Google Ads", spend: 15200, revenue: 48600, roas: 3.2, leads: 412, change: 8.3, color: "#171717" },
  { name: "Meta Ads", spend: 18400, revenue: 62100, roas: 3.37, leads: 538, change: 12.1, color: "#404040" },
  { name: "LinkedIn Ads", spend: 7300, revenue: 18450, roas: 2.53, leads: 186, change: -3.2, color: "#737373" },
]

const PERFORMANCE_DATA = [
  { name: "Mon", revenue: 4000, spend: 2400 },
  { name: "Tue", revenue: 3000, spend: 1398 },
  { name: "Wed", revenue: 2000, spend: 9800 },
  { name: "Thu", revenue: 2780, spend: 3908 },
  { name: "Fri", revenue: 1890, spend: 4800 },
  { name: "Sat", revenue: 2390, spend: 3800 },
  { name: "Sun", revenue: 3490, spend: 4300 },
]

const COMBINED_METRICS = [
  { label: "Total Impressions", value: "2.4M", change: 14.2 },
  { label: "Total Clicks", value: "84,200", change: 9.8 },
  { label: "Avg CTR", value: "3.51%", change: 0.4 },
  { label: "Avg CPC", value: "$2.12", change: -6.3 },
  { label: "Conversions", value: "2,840", change: 11.5 },
  { label: "Cost / Conversion", value: "$14.40", change: -4.1 },
]

const AI_CROSS_INSIGHTS = [
  "Google Ads and Meta are driving overlapping audiences — consider deduplication",
  "LinkedIn has the highest lead quality score (8.2/10) despite lower volume",
  "Meta retargeting converts 3x better than prospecting campaigns",
  "Cross-platform attribution shows 22% of conversions are multi-touch",
]

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 space-y-10 bg-[#fafafa] min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Performance Data
            </div>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Marketing Intelligence</h1>
            <p className="text-sm text-neutral-500 mt-1 font-medium">Global cross-channel attribution & performance command</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-xs font-bold text-neutral-600 bg-white border border-neutral-200 px-5 py-3 rounded-2xl hover:border-neutral-900 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              REFINE DATA
            </button>
            <div className="flex items-center bg-neutral-100 rounded-2xl p-1 shadow-inner border border-neutral-200/50">
              {["7D", "30D", "90D", "YTD"].map((r) => (
                <button
                  key={r}
                  className={`px-5 py-2 text-[10px] font-black rounded-xl transition-all ${r === "30D" ? "bg-white text-neutral-900 shadow-md" : "text-neutral-400 hover:text-neutral-600"
                    }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total ROAS", value: "3.42x", change: 8.2, icon: Target, color: "text-emerald-600 bg-emerald-50" },
            { label: "Net Revenue", value: "$129,400", change: 14.1, icon: DollarSign, color: "text-neutral-900 bg-neutral-100" },
            { label: "Total Leads", value: "2,840", change: 9.8, icon: Users, color: "text-blue-600 bg-blue-50" },
            { label: "Avg. CPC", value: "$1.82", change: -4.3, icon: BarChart3, color: "text-purple-600 bg-purple-50" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black ${stat.change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {stat.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <div className="text-3xl font-black text-neutral-900 mb-1">{stat.value}</div>
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Primary Visualization Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-neutral-200 p-10 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Revenue Growth Velocity</h3>
                <p className="text-xs text-neutral-400 font-medium">Aggregated daily performance across all ad networks</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-neutral-900" />
                  <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-neutral-200" />
                  <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Spend</span>
                </div>
              </div>
            </div>

            <div className="h-[350px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERFORMANCE_DATA}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#171717" stopOpacity={0.08} />
                      <stop offset="95%" stopColor="#171717" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#A3A3A3' }}
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#A3A3A3' }}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '15px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 800 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#171717"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#chartGradient)"
                    animationDuration={2000}
                  />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    stroke="#E5E5E5"
                    strokeWidth={2}
                    fill="transparent"
                    strokeDasharray="8 4"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Efficiency Breakdown */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="flex-1 bg-white rounded-[2.5rem] border border-neutral-200 p-8 shadow-sm">
              <h3 className="text-lg font-bold text-neutral-900 mb-8">Network Efficiency</h3>
              <div className="space-y-8">
                {PLATFORMS.map((p) => (
                  <div key={p.name} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${p.color} rounded-xl flex items-center justify-center text-white`}>
                          <Globe className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-neutral-800">{p.name}</span>
                      </div>
                      <span className="text-xs font-black text-neutral-900">{p.roas}x ROAS</span>
                    </div>
                    <div className="h-2 w-full bg-neutral-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-neutral-900 rounded-full transition-all duration-1000"
                        style={{ width: `${(p.roas / 4) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      <span>Efficiency Score</span>
                      <span className={p.change >= 0 ? "text-emerald-500" : "text-amber-500"}>
                        {p.change >= 0 ? "+" : ""}{p.change}% Trend
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-colors" />
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">AI Performance Forecast</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-6 font-medium">
                  Based on current trends, we project a 14.2% increase in ROAS if you reallocate $4.2k from LinkedIn to Meta retargeting.
                </p>
                <button className="w-full py-3 bg-white text-neutral-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-neutral-100 transition-colors">
                  SIMULATE STRATEGY
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Insights Table */}
        <div className="bg-white rounded-[2.5rem] border border-neutral-200 p-10 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-bold text-neutral-900">Platform Performance Audit</h3>
            <button className="text-xs font-black text-neutral-400 hover:text-neutral-900 transition-colors uppercase tracking-widest flex items-center gap-2">
              Export Analysis <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 pb-4">
                  <th className="pb-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Platform</th>
                  <th className="pb-6 text-right text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Allocation</th>
                  <th className="pb-6 text-right text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">CPL</th>
                  <th className="pb-6 text-right text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">CR (%)</th>
                  <th className="pb-6 text-right text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Trend</th>
                  <th className="pb-6 text-right text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 text-sm">
                {[
                  { name: "Google Ads", budget: "$15,200", cpl: "$36.80", cr: "4.21%", trend: 8.3, status: "Optimize" },
                  { name: "Meta Ads", budget: "$18,400", cpl: "$34.20", cr: "5.18%", trend: 12.1, status: "Scale" },
                  { name: "LinkedIn", budget: "$7,300", cpl: "$58.40", cr: "2.84%", trend: -3.2, status: "Review" },
                ].map((row) => (
                  <tr key={row.name} className="group hover:bg-neutral-50/50 transition-all">
                    <td className="py-6 pr-4">
                      <span className="font-black text-neutral-900">{row.name}</span>
                    </td>
                    <td className="py-6 text-right font-bold text-neutral-700">{row.budget}</td>
                    <td className="py-6 text-right font-bold text-neutral-700">{row.cpl}</td>
                    <td className="py-6 text-right font-bold text-neutral-700">{row.cr}</td>
                    <td className="py-6 text-right">
                      <div className={`flex items-center justify-end gap-1 font-black ${row.trend >= 0 ? "text-emerald-500" : "text-amber-500"}`}>
                        {row.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {row.trend}%
                      </div>
                    </td>
                    <td className="py-6 text-right">
                      <button
                        className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${row.status === "Scale" ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" :
                          row.status === "Review" ? "bg-amber-50 text-amber-600 hover:bg-amber-100" :
                            "bg-neutral-50 text-neutral-500 hover:bg-neutral-100"
                          }`}
                      >
                        {row.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
