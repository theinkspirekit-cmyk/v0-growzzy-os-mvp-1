"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import {
    TrendingUp,
    Download,
    Filter,
    ArrowRight,
    RefreshCw,
    BarChart3,
    LineChart
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
// Recharts dynamic imports to prevent hydration/serialization crashes
import dynamic from "next/dynamic"
import { getAnalyticsOverview } from "@/app/actions/analytics"

const BarChart = dynamic(() => import("recharts").then(mod => mod.BarChart), { ssr: false })
const Bar = dynamic(() => import("recharts").then(mod => mod.Bar), { ssr: false })
const Cell = dynamic(() => import("recharts").then(mod => mod.Cell), { ssr: false })
const XAxis = dynamic(() => import("recharts").then(mod => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then(mod => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import("recharts").then(mod => mod.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then(mod => mod.Tooltip), { ssr: false })
const Legend = dynamic(() => import("recharts").then(mod => mod.Legend), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false })

export default function ChannelAnalyticsPage() {
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
                toast.error("Channel data stream interrupted")
            } finally {
                setIsLoading(false)
            }
        }
        fetch()
    }, [period])

    if (!isMounted) return <div className="min-h-screen bg-[#F8FAFC]" />

    return (
        <DashboardLayout>
            <div className="space-y-6 font-satoshi">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1 text-left">
                        <h1 className="text-[24px] font-bold text-[#1F2937] tracking-tight">Channel Analytics</h1>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1F57F5] animate-pulse" />
                            <p className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider">Multi-Touch Attribution</p>
                        </div>
                    </div>
                </div>

                {isLoading || !data ? (
                    <div className="h-96 flex flex-col items-center justify-center bg-white border border-[#E2E8F0] rounded-lg">
                        <div className="w-6 h-6 border-2 border-[#1F57F5] border-t-transparent rounded-full animate-spin mb-2" />
                        <p className="text-[12px] text-[#64748B]">Synthesizing Channel Metrics...</p>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Metrics Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-sm flex flex-col justify-between text-left">
                                <div>
                                    <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Top Performer</p>
                                    <h3 className="text-[24px] font-bold text-[#1F2937] mt-1">Facebook Ads</h3>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[11px] font-bold">+18% ROAS</span>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-sm flex flex-col justify-between text-left">
                                <div>
                                    <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Efficiency</p>
                                    <h3 className="text-[24px] font-bold text-[#1F2937] mt-1">Google Search</h3>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="bg-blue-50 text-[#1F57F5] px-2 py-0.5 rounded text-[11px] font-bold">$12.42 CPA</span>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-sm flex flex-col justify-between text-left">
                                <div>
                                    <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Scale Opportunity</p>
                                    <h3 className="text-[24px] font-bold text-[#1F2937] mt-1">TikTok Ads</h3>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-[11px] font-bold">Scaling Phase</span>
                                </div>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-[14px] font-bold text-[#1F2937] flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-[#1F57F5]" /> Spend vs Revenue Distribution
                                </h3>
                            </div>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.channels}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                        <XAxis dataKey="channel" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#64748B' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                                        <Legend />
                                        <Bar dataKey="spend" name="Ad Spend" fill="#2BAFF2" radius={[4, 4, 0, 0]} barSize={40} />
                                        <Bar dataKey="return" name="Revenue" fill="#1F57F5" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                            {data.channels.map((c: any, i: number) => (
                                <div key={i} className="bg-white border border-[#E2E8F0] p-5 rounded-lg hover:border-[#1F57F5] transition-colors group text-left">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#1F57F5] font-bold group-hover:bg-[#1F57F5] group-hover:text-white transition-colors">
                                                {c.channel.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-[14px] font-bold text-[#1F2937]">{c.channel}</h4>
                                                <p className="text-[11px] text-[#64748B]">Active campaigns</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[16px] font-bold text-[#1F2937]">{c.roas}x</p>
                                            <p className="text-[10px] uppercase font-bold text-[#94A3B8]">ROAS</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 py-3 border-t border-[#F1F5F9]">
                                        <div>
                                            <p className="text-[10px] text-[#94A3B8] uppercase font-bold">Spend</p>
                                            <p className="text-[12px] font-bold text-[#1F2937]">${(c.spend / 1000).toFixed(1)}k</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-[#94A3B8] uppercase font-bold">Conv.</p>
                                            <p className="text-[12px] font-bold text-[#1F2937]">{c.conversions}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-[#94A3B8] uppercase font-bold">CPA</p>
                                            <p className="text-[12px] font-bold text-[#1F2937]">${(c.spend / c.conversions).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <button className="w-full mt-2 h-9 border border-[#E2E8F0] rounded text-[11px] font-bold text-[#64748B] hover:text-[#1F57F5] flex items-center justify-center gap-2">
                                        Detail View <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
