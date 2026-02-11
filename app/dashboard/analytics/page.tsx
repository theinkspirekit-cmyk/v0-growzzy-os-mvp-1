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
  Search,
  Download,
} from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"

const PLATFORMS = [
  { name: "Google Ads", spend: 15200, revenue: 48600, roas: 3.2, leads: 412, change: 8.3, color: "bg-black" },
  { name: "Meta Ads", spend: 18400, revenue: 62100, roas: 3.37, leads: 538, change: 12.1, color: "bg-neutral-800" },
  { name: "LinkedIn Ads", spend: 7300, revenue: 18450, roas: 2.53, leads: 186, change: -3.2, color: "bg-neutral-600" },
]

const PERFORMANCE_DATA = [
  { name: "Mon", revenue: 4000, spend: 2400 },
  { name: "Tue", revenue: 5200, spend: 3100 },
  { name: "Wed", revenue: 4800, spend: 2900 },
  { name: "Thu", revenue: 7800, spend: 3400 },
  { name: "Fri", revenue: 6500, spend: 4000 },
  { name: "Sat", revenue: 9200, spend: 3800 },
  { name: "Sun", revenue: 11500, spend: 4200 },
]

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="p-8 lg:p-12 space-y-12 bg-white min-h-[calc(100vh-64px)] overflow-y-auto pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-100 pb-10 gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Marketing Intelligence</h1>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Global cross-channel attribution</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-neutral-100 rounded-md p-1 border border-neutral-200">
              {["7D", "30D", "90D"].map((r) => (
                <button
                  key={r}
                  className={`px-4 py-1.5 text-[9px] font-black rounded transition-all ${r === "30D" ? "bg-black text-white" : "text-neutral-400 hover:text-black"}`}
                >
                  {r}
                </button>
              ))}
            </div>
            <button className="enterprise-button h-10 px-6 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Analysis
            </button>
          </div>
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Aggregate ROAS", value: "3.42x", change: 8.2, icon: Target, status: "up" },
            { label: "Net Revenue", value: "$429,400", change: 14.1, icon: DollarSign, status: "up" },
            { label: "Customer Acquisition", value: "4,840", change: 9.8, icon: Users, status: "up" },
            { label: "Avg. CPC Index", value: "$1.82", change: -4.3, icon: BarChart3, status: "down" },
          ].map((stat) => (
            <div key={stat.label} className="enterprise-card p-6 border-l-4 border-l-transparent hover:border-l-black transition-all group">
              <div className="flex items-center justify-between mb-4 text-left">
                <div className={`w-10 h-10 bg-neutral-50 rounded flex items-center justify-center text-neutral-400 group-hover:bg-black group-hover:text-white transition-all`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black ${stat.status === "up" ? "text-black" : "text-neutral-400"}`}>
                  {stat.status === "up" ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <div className="space-y-1 text-left">
                <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Viz Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold uppercase tracking-tight text-left">Revenue Growth Velocity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-neutral-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                  Performance
                </div>
              </div>
            </div>
            <div className="enterprise-card p-8 h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERFORMANCE_DATA}>
                  <defs>
                    <linearGradient id="anGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.05} />
                      <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: '#A3A3A3' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: '#A3A3A3' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '4px', border: '1px solid #E5E5E5', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    labelStyle={{ fontSize: '10px', fontWeight: 800, marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#000000" strokeWidth={3} fillOpacity={1} fill="url(#anGradient)" />
                  <Area type="monotone" dataKey="spend" stroke="#E5E5E5" strokeWidth={2} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-12">
            <div className="space-y-6 text-left">
              <h3 className="text-sm font-bold uppercase tracking-tight px-2">Channel Efficiency</h3>
              <div className="space-y-6">
                {PLATFORMS.map((p) => (
                  <div key={p.name} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900">{p.name}</span>
                      <span className="text-[10px] font-black text-black">{p.roas}x ROAS</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-50 rounded-full overflow-hidden">
                      <div className={`h-full bg-black transition-all duration-1000`} style={{ width: `${(p.roas / 4) * 100}%` }} />
                    </div>
                    <div className="flex justify-between text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                      <span>Contribution Index</span>
                      <span className={p.change >= 0 ? "text-black" : "text-neutral-400"}>
                        {p.change >= 0 ? "+" : ""}{p.change}% Velocity
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="enterprise-card bg-black text-white p-8 space-y-6">
              <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-tight">AI Forecasting</h3>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-medium">
                  Current trajectory projects 22% increase in ROAS for Q2 if deduplication is applied to Google/Meta overlapping segments.
                </p>
              </div>
              <button className="w-full h-10 bg-white text-black rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-100 transition-all">
                Execute Optimization
              </button>
            </div>
          </div>
        </div>

        {/* Audit Table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <h3 className="text-sm font-bold uppercase tracking-tight text-left">Intelligence Audit Trail</h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input type="text" placeholder="Filter audit trail..." className="enterprise-input pl-9 h-9 text-[10px] w-48" />
            </div>
          </div>

          <div className="enterprise-card overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-100">
                  <th className="px-8 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Platform Intelligence</th>
                  <th className="px-8 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right">Allocation</th>
                  <th className="px-8 py-4 text-[10px) font-black text-neutral-400 uppercase tracking-widest text-right">CPL</th>
                  <th className="px-8 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right">Conv. Rate</th>
                  <th className="px-8 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right">Action Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {[
                  { name: "Google Engine", cost: "$15,200", cpl: "$36.80", cr: "4.21%", action: "OPTIMIZE" },
                  { name: "Meta Architecture", cost: "$18,400", cpl: "$34.20", cr: "5.18%", action: "SCALE" },
                  { name: "LinkedIn Segment", cost: "$7,300", cpl: "$58.40", cr: "2.84%", action: "AUDIT" },
                ].map((row) => (
                  <tr key={row.name} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-8 py-6 text-sm font-bold text-neutral-900 text-left">{row.name}</td>
                    <td className="px-8 py-6 text-right text-xs font-bold text-neutral-600">{row.cost}</td>
                    <td className="px-8 py-6 text-right text-xs font-bold text-neutral-600">{row.cpl}</td>
                    <td className="px-8 py-6 text-right text-xs font-bold text-neutral-600">{row.cr}</td>
                    <td className="px-8 py-6 text-right">
                      <button className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest border transition-all ${row.action === 'SCALE' ? 'bg-black text-white border-black' : 'bg-neutral-50 text-neutral-400 border-neutral-200 hover:border-black hover:text-black'}`}>
                        {row.action}
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
