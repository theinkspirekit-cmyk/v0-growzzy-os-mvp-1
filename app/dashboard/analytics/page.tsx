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
      <div className="p-6 lg:p-8 space-y-8 bg-neutral-50/50 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Analytics Command Center</h1>
            <p className="text-sm text-neutral-500 mt-1">Real-time performance metrics across your entire ecosystem</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 text-sm font-semibold text-neutral-600 bg-white border border-neutral-200 px-4 py-2 rounded-xl hover:border-neutral-900 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </button>
            <div className="flex items-center bg-white border border-neutral-200 rounded-xl p-1 shadow-sm">
              {["7d", "30d", "90d"].map((r) => (
                <button key={r} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${r === "30d" ? "bg-neutral-900 text-white shadow-md" : "text-neutral-500 hover:text-neutral-900"}`}>{r}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-base font-bold text-neutral-900">Revenue vs Spend Trend</h3>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-neutral-900" /> Revenue</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-neutral-300" /> Spend</div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERFORMANCE_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#171717" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#171717" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#171717" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="spend" stroke="#d4d4d4" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-neutral-900 mb-8">Spend by Platform</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PLATFORMS} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#444' }} width={80} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="spend" fill="#171717" radius={[0, 8, 8, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Combined Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {COMBINED_METRICS.map((m) => (
            <div key={m.label} className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="text-[13px] text-neutral-500 mb-1">{m.label}</div>
              <div className="text-xl font-bold text-neutral-900">{m.value}</div>
              <div className={`flex items-center gap-1 text-xs mt-1 ${m.change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                {m.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {m.change >= 0 ? "+" : ""}{m.change}%
              </div>
            </div>
          ))}
        </div>

        {/* Platform Breakdown */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="text-base font-semibold text-neutral-900 mb-5">Platform Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left py-3 px-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Platform</th>
                  <th className="text-right py-3 px-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Spend</th>
                  <th className="text-right py-3 px-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Revenue</th>
                  <th className="text-right py-3 px-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">ROAS</th>
                  <th className="text-right py-3 px-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Leads</th>
                  <th className="text-right py-3 px-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Change</th>
                  <th className="text-right py-3 px-4 text-neutral-500 font-medium text-xs uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {PLATFORMS.map((p) => (
                  <tr key={p.name} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${p.color} rounded-lg flex items-center justify-center`}>
                          <Globe className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-neutral-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 text-neutral-700 font-medium">{p.spend}</td>
                    <td className="text-right py-4 px-4 text-neutral-900 font-semibold">{p.revenue}</td>
                    <td className="text-right py-4 px-4 text-neutral-700">{p.roas}</td>
                    <td className="text-right py-4 px-4 text-neutral-700">{p.leads}</td>
                    <td className="text-right py-4 px-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${p.change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {p.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {p.change >= 0 ? "+" : ""}{p.change}%
                      </span>
                    </td>
                    <td className="text-right py-4 px-4">
                      <button className="text-neutral-400 hover:text-neutral-900 transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Cross-Platform Insights */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <h3 className="text-base font-semibold text-neutral-900">Cross-Platform AI Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AI_CROSS_INSIGHTS.map((ins, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                <BarChart3 className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-neutral-700 leading-relaxed">{ins}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
