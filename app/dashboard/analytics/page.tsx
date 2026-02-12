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
  Activity,
  Zap,
  ShieldCheck
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
import { cn } from "@/lib/utils"

const PLATFORMS = [
  { name: "Google Ads", spend: 15200, revenue: 48600, roas: 3.2, leads: 412, change: 8.3 },
  { name: "Meta Ads", spend: 18400, revenue: 62100, roas: 3.37, leads: 538, change: 12.1 },
  { name: "LinkedIn Ads", spend: 7300, revenue: 18450, roas: 2.53, leads: 186, change: -3.2 },
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
      <div className="p-8 lg:p-12 space-y-12 bg-white min-h-[calc(100vh-64px)] overflow-y-auto pb-40 font-satoshi">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#F1F5F9] pb-10 gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-[32px] font-bold text-[#05090E] tracking-tight">Marketing Intelligence</h1>
            <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-[0.2em]">Cross-Channel Attribution Engine</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex bg-[#F8FAFC] rounded-2xl p-1.5 border border-[#F1F5F9]">
              {["7D", "30D", "90D"].map((r) => (
                <button
                  key={r}
                  className={cn(
                    "px-6 py-2.5 text-[11px] font-bold rounded-xl transition-all",
                    r === "30D" ? "bg-white text-[#05090E] shadow-sm ring-1 ring-[#F1F5F9]" : "text-[#64748B] hover:text-[#05090E]"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
            <button className="h-12 px-8 bg-[#1F57F5] text-white text-[12px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-[#1F57F5]/20 hover:bg-[#1A4AD1] transition-all flex items-center gap-2.5">
              <Download className="w-5 h-5" />
              Export Analysis
            </button>
          </div>
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Aggregate ROAS", value: "3.42x", change: 8.2, icon: Target, color: "#1F57F5" },
            { label: "Net Revenue", value: "$429,400", change: 14.1, icon: DollarSign, color: "#00DDFF" },
            { label: "Acquired Leads", value: "4,840", change: 9.8, icon: Users, color: "#2BAFF2" },
            { label: "Avg. CPC Index", value: "$1.82", change: -4.3, icon: Activity, color: "#FFB800" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-8 border-2 border-[#F1F5F9] rounded-[2rem] hover:border-[#1F57F5] transition-all duration-300 shadow-sm hover:shadow-xl group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-[#F8FAFC] rounded-2xl flex items-center justify-center transition-all group-hover:scale-110" style={{ color: stat.color }}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[11px] font-bold",
                  stat.change >= 0 ? "bg-[#00DDFF]/10 text-[#00DDFF]" : "bg-[#F43F5E]/10 text-[#F43F5E]"
                )}>
                  {stat.change >= 0 ? "+" : ""}{stat.change}%
                </div>
              </div>
              <div className="space-y-1 text-left">
                <p className="text-[28px] font-bold text-[#05090E] tracking-tight">{stat.value}</p>
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.15em]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8 bg-white p-10 rounded-[3rem] border-2 border-[#F1F5F9] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-8 bg-[#1F57F5] rounded-full" />
                <div className="space-y-0.5">
                  <h3 className="text-[18px] font-bold text-[#05090E]">Revenue Growth Velocity</h3>
                  <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Historical Performance Sync</p>
                </div>
              </div>
              <div className="flex items-center gap-6 bg-[#F8FAFC] px-6 py-2 rounded-xl border border-[#F1F5F9]">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-[#05090E]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1F57F5]" />
                  Revenue
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-[#05090E]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2BAFF2] shadow-[0_0_8px_rgba(43,175,242,0.4)]" />
                  Ad Spend
                </div>
              </div>
            </div>
            <div className="h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERFORMANCE_DATA}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
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
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fontWeight: 700, fill: '#64748B', fontFamily: 'Satoshi' }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '24px', border: '2px solid #F1F5F9', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', fontFamily: 'Satoshi', padding: '16px' }}
                    itemStyle={{ fontSize: '13px', fontWeight: 700, padding: '4px 0' }}
                    cursor={{ stroke: '#1F57F5', strokeWidth: 2, strokeDasharray: '6 6' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#1F57F5" strokeWidth={5} fillOpacity={1} fill="url(#revenueGradient)" animationDuration={2000} />
                  <Area type="monotone" dataKey="spend" stroke="#2BAFF2" strokeWidth={3} strokeDasharray="8 8" fill="transparent" animationDuration={2500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border-2 border-[#F1F5F9] shadow-sm space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-8 bg-[#2BAFF2] rounded-full" />
                <h3 className="text-[18px] font-bold text-[#05090E]">Efficiency Matrix</h3>
              </div>
              <div className="space-y-10">
                {PLATFORMS.map((p) => (
                  <div key={p.name} className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-bold text-[#05090E]">{p.name}</span>
                      <div className="px-4 py-1.5 bg-[#1F57F5]/5 text-[#1F57F5] text-[12px] font-bold rounded-full ring-1 ring-[#1F57F5]/10">
                        {p.roas}x ROAS
                      </div>
                    </div>
                    <div className="h-2.5 w-full bg-[#F8FAFC] rounded-full overflow-hidden border border-[#F1F5F9]">
                      <div className="h-full bg-[#1F57F5] rounded-full transition-all duration-1500 ease-in-out shadow-sm" style={{ width: `${(p.roas / 4) * 100}%` }} />
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-[#64748B] uppercase tracking-widest">
                      <span>Market Contribution</span>
                      <span className={cn(p.change >= 0 ? "text-[#00DDFF]" : "text-[#F43F5E]")}>
                        {p.change >= 0 ? "+" : ""}{p.change}% Velocity
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#05090E] p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#1F57F5]/20 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-[#1F57F5]/30 transition-all duration-500" />
              <div className="relative z-10 space-y-8">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                  <Sparkles className="w-7 h-7 text-[#00DDFF]" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-white text-[20px] font-bold tracking-tight">Cognitive Forecasting</h3>
                  <p className="text-white/50 text-[14px] leading-relaxed font-medium">
                    Current trajectory projects <span className="text-[#00DDFF]">22% increase</span> in yield for Q2 if deduplication protocols are applied to cross-platform segments.
                  </p>
                </div>
                <button className="w-full h-14 bg-[#1F57F5] text-white text-[12px] font-bold uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#1F57F5]/20 hover:bg-[#1A4AD1] transition-all active:scale-95">
                  Execute Optimization Logic
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Trail */}
        <div className="bg-white rounded-[3rem] border-2 border-[#F1F5F9] shadow-sm overflow-hidden">
          <div className="p-10 border-b border-[#F1F5F9] flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#F8FAFC]/50">
            <div className="flex items-center gap-4">
              <Activity className="w-6 h-6 text-[#1F57F5]" />
              <div className="text-left">
                <h3 className="text-[18px] font-bold text-[#05090E]">Intelligence Audit Trail</h3>
                <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-widest">Real-time Platform Logs</p>
              </div>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#A3A3A3]" />
              <input
                type="text"
                placeholder="Filter audit trail..."
                className="w-full md:w-80 h-12 pl-12 pr-6 bg-white border-2 border-[#F1F5F9] text-[13px] font-medium rounded-xl focus:border-[#1F57F5] outline-none transition-all placeholder:text-[#A3A3A3]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  <th className="px-10 py-6 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Deployment Node</th>
                  <th className="px-10 py-6 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.2em] text-right">Allocation</th>
                  <th className="px-10 py-6 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.2em] text-right">CPL Index</th>
                  <th className="px-10 py-6 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.2em] text-right">Conv. Matrix</th>
                  <th className="px-10 py-6 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.2em] text-right">Operational Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {[
                  { name: "Google Engine Alpha", cost: "$15,200", cpl: "$36.80", cr: "4.21%", status: "OPTIMIZED", color: "#1F57F5" },
                  { name: "Meta Architecture Core", cost: "$18,400", cpl: "$34.20", cr: "5.18%", status: "SCALING", color: "#00DDFF" },
                  { name: "LinkedIn High-Yield Segment", cost: "$7,300", cpl: "$58.40", cr: "2.84%", status: "AUDITING", color: "#2BAFF2" },
                ].map((row) => (
                  <tr key={row.name} className="hover:bg-[#F8FAFC]/50 transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: row.color }} />
                        <span className="text-[15px] font-bold text-[#05090E] group-hover:text-[#1F57F5] transition-colors">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right text-[15px] font-bold text-[#05090E]">{row.cost}</td>
                    <td className="px-10 py-8 text-right text-[15px] font-medium text-[#64748B]">{row.cpl}</td>
                    <td className="px-10 py-8 text-right text-[15px] font-bold text-[#1F57F5]">{row.cr}</td>
                    <td className="px-10 py-8 text-right">
                      <button className={cn(
                        "px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                        row.status === 'SCALING' ? 'bg-[#1F57F5] text-white shadow-lg shadow-[#1F57F5]/20' : 'bg-[#F8FAFC] text-[#64748B] border border-[#F1F5F9] hover:border-[#1F57F5] hover:text-[#1F57F5]'
                      )}>
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
