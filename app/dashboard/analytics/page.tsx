"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  PieChart as PieIcon
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
// Recharts dynamic imports to prevent hydration/serialization crashes
import dynamic from "next/dynamic"
import { getAnalyticsOverview, RevenueTrend } from "@/app/actions/analytics"

const AreaChart = dynamic(() => import("recharts").then(mod => mod.AreaChart), { ssr: false })
const Area = dynamic(() => import("recharts").then(mod => mod.Area), { ssr: false })
const XAxis = dynamic(() => import("recharts").then(mod => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then(mod => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import("recharts").then(mod => mod.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then(mod => mod.Tooltip), { ssr: false })
const PieChart = dynamic(() => import("recharts").then(mod => mod.PieChart), { ssr: false })
const Pie = dynamic(() => import("recharts").then(mod => mod.Pie), { ssr: false })
const Cell = dynamic(() => import("recharts").then(mod => mod.Cell), { ssr: false })
const Legend = dynamic(() => import("recharts").then(mod => mod.Legend), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false })

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [period, setPeriod] = useState("30d")
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const fetch = async () => {
      try {
        const res = await getAnalyticsOverview()
        setData(res)
      } catch {
        toast.error("Analytics stream interrupted")
      } finally {
        setIsLoading(false)
      }
    }
    fetch()
  }, [period])

  const handleExport = () => {
    if (!data) return
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Date,Revenue,Spend\n"
      + data.trend.map((r: RevenueTrend) => `${r.date},${r.revenue},${r.spend}`).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `analytics_export_${period}.csv`)
    document.body.appendChild(link)
    link.click()
    toast.success("Data exported to CSV")
  }

  if (!isMounted) return <div className="min-h-screen bg-[#F8FAFC]" />

  return (
    <DashboardLayout>
      <div className="space-y-6 font-satoshi">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-[24px] font-bold text-[#1F2937] tracking-tight">Intelligence Engine</h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <p className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider">Integrated Metrics Stream</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-[#F1F5F9] p-1 rounded-md">
              {['7d', '30d', '90d'].map(d => (
                <button
                  key={d}
                  onClick={() => setPeriod(d)}
                  className={cn(
                    "px-3 py-1.5 text-[12px] font-bold uppercase tracking-wider rounded-md transition-all",
                    period === d ? "bg-white text-[#1F57F5] shadow-sm" : "text-[#64748B]"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
            <button onClick={handleExport} className="btn-secondary h-9 text-[12px]">
              <Download className="w-4 h-4 mr-2" /> Export
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading || !data ? (
          <div className="h-96 flex flex-col items-center justify-center bg-white border border-[#E2E8F0] rounded-lg">
            <div className="w-6 h-6 border-2 border-[#1F57F5] border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-[12px] text-[#64748B]">Aggregating Data Sources...</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { label: "Total Revenue", value: `$${data.kpi.revenue.value.toLocaleString()}`, change: `+${data.kpi.revenue.change}%`, color: "#10B981" },
                { label: "Ad Spend", value: `$${data.kpi.spend.value.toLocaleString()}`, change: `+${data.kpi.spend.change}%`, color: "#F43F5E" },
                { label: "ROAS", value: `${data.kpi.roas.value}x`, change: `+${data.kpi.roas.change}%`, color: "#1F57F5" },
                { label: "LTV:CAC", value: `4.2:1`, change: `+0.4`, color: "#00DDFF" },
                { label: "Churn Rate", value: `1.2%`, change: `-0.2%`, color: "#F59E0B" },
                { label: "CPA", value: `$${data.kpi.cpa.value}`, change: `${data.kpi.cpa.change}%`, color: "#8B5CF6" },
              ].map((k, i) => (
                <div key={i} className="bg-white p-4 border border-[#E2E8F0] rounded-2xl shadow-sm text-left hover:shadow-md transition-shadow">
                  <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">{k.label}</p>
                  <p className="text-[20px] font-bold text-[#0F172A] tracking-tight">{k.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={cn("text-[10px] font-black", k.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-500')}>
                      {k.change}
                    </span>
                    <span className="text-[9px] text-[#94A3B8] font-bold uppercase tracking-tight">velocity</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue vs Spend */}
              <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[14px] font-bold text-[#1F2937] flex items-center gap-2 text-left">
                    <TrendingUp className="w-4 h-4 text-[#1F57F5]" /> Revenue Velocity
                  </h3>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.trend}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1F57F5" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#1F57F5" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} dy={10} minTickGap={30} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#1F57F5" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                      <Area type="monotone" dataKey="spend" stroke="#F43F5E" strokeWidth={2} fillOpacity={1} fill="url(#colorSpend)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Channel Breakdown */}
              <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-sm">
                <h3 className="text-[14px] font-bold text-[#1F2937] mb-6 flex items-center gap-2 text-left">
                  <PieIcon className="w-4 h-4 text-[#2BAFF2]" /> Channel Distribution
                </h3>
                <div className="h-[250px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.channels}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="spend"
                      >
                        {data.channels.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={['#1F57F5', '#2BAFF2', '#00DDFF', '#F43F5E', '#F59E0B'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <p className="text-[24px] font-bold text-[#1F2937]">{data.channels.length}</p>
                      <p className="text-[10px] text-[#64748B] uppercase">Active Channels</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mt-4">
                  {data.channels.map((c: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-[12px]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#1F57F5', '#2BAFF2', '#00DDFF', '#F43F5E', '#F59E0B'][i % 5] }} />
                        <span className="font-medium text-[#1F2937]">{c.channel}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[#64748B]">${(c.spend / 1000).toFixed(1)}k</span>
                        <span className="font-bold text-[#1F2937]">{c.roas}x</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Efficiency Matrix Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden pb-40">
              <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
                <h3 className="text-[14px] font-bold text-[#1F2937]">Efficiency Matrix</h3>
                <Filter className="w-4 h-4 text-[#94A3B8]" />
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F8FAFC]">
                    <th className="px-6 py-3 text-[11px] font-semibold text-[#64748B] uppercase">Channel</th>
                    <th className="px-6 py-3 text-[11px] font-semibold text-[#64748B] uppercase text-right">Spend</th>
                    <th className="px-6 py-3 text-[11px] font-semibold text-[#64748B] uppercase text-right">ROAS</th>
                    <th className="px-6 py-3 text-[11px] font-semibold text-[#64748B] uppercase text-right">Conv.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.channels.map((c: any, i: number) => (
                    <tr key={i} className="hover:bg-muted-100 transition-colors">
                      <td className="px-6 py-3 text-[13px] font-bold text-text-primary text-left">{c.channel}</td>
                      <td className="px-6 py-3 text-[13px] text-text-secondary text-right">${c.spend.toLocaleString()}</td>
                      <td className="px-6 py-3 text-right">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[11px] font-bold",
                          c.roas > 3
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        )}>{c.roas}x</span>
                      </td>
                      <td className="px-6 py-3 text-[13px] text-text-primary text-right">{c.conversions}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
