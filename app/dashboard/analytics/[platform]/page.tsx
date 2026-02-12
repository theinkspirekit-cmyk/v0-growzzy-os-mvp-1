"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area,
} from "recharts"
import {
    PieChart as PieIcon,
    TrendingUp,
    Target,
    Users,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Sparkles,
    Search,
    Filter,
    Globe,
    Facebook,
    Linkedin,
    ShoppingBag,
} from "lucide-react"

export default function PlatformAnalyticsPage() {
    const params = useParams()
    const platform = params.platform as string
    const [data, setData] = useState<any>(null)

    const platformMeta: any = {
        google: { name: "Google Ads", icon: Globe, color: "text-blue-500", bg: "bg-blue-50" },
        meta: { name: "Meta Architecture", icon: Facebook, color: "text-indigo-500", bg: "bg-indigo-50" },
        linkedin: { name: "LinkedIn Segment", icon: Linkedin, color: "text-blue-700", bg: "bg-blue-50" },
        shopify: { name: "Shopify Sync", icon: ShoppingBag, color: "text-emerald-500", bg: "bg-emerald-50" },
    }

    const currentPlatform = platformMeta[platform] || { name: platform.toUpperCase(), icon: Globe, color: "text-black", bg: "bg-neutral-50" }

    useEffect(() => {
        // Simulated data fetch
        setData({
            kpis: [
                { label: 'Platform Spend', value: '$4,281', change: '+12%', icon: DollarSign },
                { label: 'ROAS Index', value: '3.8x', change: '+0.4', icon: TrendingUp },
                { label: 'CPA Efficiency', value: '$12.42', change: '-8%', icon: Target },
                { label: 'Conversion Rate', value: '4.2%', change: '+1.2%', icon: Users },
            ],
            hourly: Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, value: Math.floor(Math.random() * 1000) }))
        })
    }, [platform])

    if (!data) return null

    return (
        <DashboardLayout>
            <div className="p-8 lg:p-12 gemini-surface min-h-screen space-y-12 pb-32">
                {/* Platform Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-100 pb-10 gap-6">
                    <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 ${currentPlatform.bg} ${currentPlatform.color} rounded-lg flex items-center justify-center shadow-xl shadow-black/5`}>
                            <currentPlatform.icon className="w-8 h-8" />
                        </div>
                        <div className="space-y-1 text-left">
                            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">{currentPlatform.name}</h1>
                            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest font-inter flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                REAL-TIME SYNCHRONIZATION ACTIVE
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="px-5 py-2.5 bg-white border border-neutral-200 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-50 transition-all flex items-center gap-2">
                            <Filter className="w-3.5 h-3.5" /> Granularity
                        </button>
                        <button className="px-5 py-2.5 bg-black text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all">
                            Export Raw Data
                        </button>
                    </div>
                </div>

                {/* Platform Specific Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.kpis.map((stat: any) => (
                        <div key={stat.label} className="gemini-card p-8 border-l-4 border-l-black group">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-10 h-10 bg-neutral-50 rounded flex items-center justify-center text-neutral-400 group-hover:bg-black group-hover:text-white transition-all">
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black text-black">{stat.change}</span>
                            </div>
                            <div className="space-y-1 text-left">
                                <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* High Density Performance Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 gemini-card p-10 space-y-10">
                        <div className="flex items-center justify-between">
                            <div className="text-left space-y-1">
                                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900">Velocity Matrix</h3>
                                <p className="text-[10px] font-bold text-neutral-400 uppercase">Hourly Convergence Tracking</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 mr-4">
                                    <div className="w-2 h-2 rounded-full bg-black" />
                                    <span className="text-[9px] font-bold text-neutral-400 uppercase">Performance</span>
                                </div>
                                <select className="text-[10px] font-black bg-neutral-50 px-3 py-1.5 rounded uppercase cursor-pointer">
                                    <option>PAST 24 HOURS</option>
                                    <option>PAST 7 DAYS</option>
                                </select>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.hourly}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#000000" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#A3A3A3' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#A3A3A3' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '4px' }}
                                        itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#000" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="gemini-card p-10 space-y-10">
                        <div className="text-left space-y-1">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900">AI Platform Audit</h3>
                            </div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase">Intelligence Summary</p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { label: 'Creative Fatigue', status: 'Optimal', color: 'text-emerald-500' },
                                { label: 'Audience Saturation', status: 'Moderate', color: 'text-amber-500' },
                                { label: 'Bid Efficiency', status: 'Critical', color: 'text-rose-500' },
                            ].map(audit => (
                                <div key={audit.label} className="border-b border-neutral-50 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{audit.label}</span>
                                        <span className={`text-[10px] font-black uppercase ${audit.color}`}>{audit.status}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-neutral-50 rounded-full overflow-hidden">
                                        <div className={`h-full bg-black rounded-full`} style={{ width: audit.status === 'Optimal' ? '85%' : audit.status === 'Moderate' ? '45%' : '15%' }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-neutral-900 rounded-lg space-y-3">
                            <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Action Recommendation</p>
                            <p className="text-[11px] text-white font-medium leading-relaxed">
                                System suggests re-allocating 15% budget from low-performing ad sets to current ROAS winners to maximize EOD yield.
                            </p>
                            <button className="w-full py-2 bg-white text-black text-[9px] font-black uppercase tracking-tighter rounded hover:bg-neutral-200 transition-all">
                                Execute Optimization
                            </button>
                        </div>
                    </div>
                </div>

                {/* Campaign List Table (Platform Scoped) */}
                <div className="gemini-card overflow-hidden">
                    <div className="p-10 border-b border-neutral-50 text-left">
                        <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900">{platform.toUpperCase()} ACTIVE NODES</h3>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-neutral-50/50 border-b border-neutral-100">
                                <th className="px-10 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Campaign Identity</th>
                                <th className="px-10 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">Efficiency</th>
                                <th className="px-10 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right">Yield</th>
                                <th className="px-10 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {[1, 2, 3].map(i => (
                                <tr key={i} className="hover:bg-neutral-50 transition-all">
                                    <td className="px-10 py-6">
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-bold text-neutral-900">STRATEGIC_PULL_{i}_2024</p>
                                            <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">Active Since Oct {12 + i}</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 text-white rounded-sm">
                                            <Sparkles className="w-3 h-3 text-amber-500" />
                                            <span className="text-xs font-black">{(3.2 + i * 0.4).toFixed(1)}x</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right text-xs font-bold text-neutral-900">
                                        ${(4200 * i).toLocaleString()}
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-sm text-[9px] font-black uppercase tracking-widest">
                                            RUNNING
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    )
}
