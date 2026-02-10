"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useParams } from "next/navigation"
import {
    TrendingUp,
    Target,
    Users,
    MousePointerClick,
    Globe,
    Filter,
} from "lucide-react"

export default function PlatformAnalyticsPage() {
    const params = useParams()
    const platform = (params?.platform as string) || "Unknown"

    const platformName = platform.charAt(0).toUpperCase() + platform.slice(1) + " Ads"

    // Mock data tailored per platform (could be fetched dynamically)
    const isMeta = platform === "meta"
    const isGoogle = platform === "google"

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-neutral-900 tracking-tight">{platformName} Analytics</h2>
                        <p className="text-sm text-neutral-500 mt-0.5">Performance overview for {platformName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 text-sm text-neutral-600 bg-white border border-neutral-200 px-3 py-2 rounded-lg hover:border-neutral-300 transition-colors">
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                        <div className="flex items-center bg-neutral-100 rounded-lg p-0.5">
                            {["7d", "30d", "90d"].map((r) => (
                                <button key={r} className={`px-3 py-1.5 text-xs font-medium rounded-md ${r === "30d" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}>{r}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Platform Specific KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border border-neutral-200 p-5">
                        <div className="text-[13px] text-neutral-500 mb-1">Spend</div>
                        <div className="text-2xl font-bold text-neutral-900">{isGoogle ? "$15,200" : "$18,400"}</div>
                        <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1">
                            <TrendingUp className="w-3 h-3" /> +12%
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-neutral-200 p-5">
                        <div className="text-[13px] text-neutral-500 mb-1">Conversions</div>
                        <div className="text-2xl font-bold text-neutral-900">{isGoogle ? "412" : "538"}</div>
                        <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1">
                            <Target className="w-3 h-3" /> +8.3%
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-neutral-200 p-5">
                        <div className="text-[13px] text-neutral-500 mb-1">CTR</div>
                        <div className="text-2xl font-bold text-neutral-900">{isGoogle ? "4.2%" : "2.8%"}</div>
                        <div className="flex items-center gap-1 text-xs text-neutral-500 mt-1">
                            <MousePointerClick className="w-3 h-3" /> 0.2%
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-neutral-200 p-5">
                        <div className="text-[13px] text-neutral-500 mb-1">ROAS</div>
                        <div className="text-2xl font-bold text-neutral-900">{isGoogle ? "3.2x" : "3.37x"}</div>
                        <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1">
                            <TrendingUp className="w-3 h-3" /> +0.5x
                        </div>
                    </div>
                </div>

                {/* Charts & Graphs Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-neutral-200 p-6 h-[300px] flex items-center justify-center text-neutral-400 text-sm">
                        {platformName} Spend vs Revenue Chart
                    </div>
                    <div className="bg-white rounded-xl border border-neutral-200 p-6 h-[300px] flex items-center justify-center text-neutral-400 text-sm">
                        Top Performing Campaigns Table
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
