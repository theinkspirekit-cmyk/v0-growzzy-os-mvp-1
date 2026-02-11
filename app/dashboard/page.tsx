"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import DashboardLayout from "@/components/dashboard-layout"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  MousePointerClick,
  Lightbulb,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  ChevronRight,
  Zap,
  BarChart3,
  Play,
  Pause,
  PlusCircle,
} from "lucide-react"

// ─────────────────────────────────────────────
// MOCK DATA (used for demo / mock auth)
// ─────────────────────────────────────────────

const MOCK_KPIS = [
  { label: "Total Revenue", value: "$128,450", change: 12.5, prefix: "$", icon: DollarSign, tooltip: "Revenue up due to Meta retargeting performance" },
  { label: "Ad Spend", value: "$42,300", change: 8.2, prefix: "$", icon: TrendingUp, tooltip: "Spend increased with new Google campaigns" },
  { label: "Leads Generated", value: "1,240", change: 15.3, prefix: "", icon: Users, tooltip: "LinkedIn generating 40% of total leads" },
  { label: "ROAS", value: "3.03x", change: -2.1, prefix: "", icon: Target, tooltip: "ROAS dipped slightly due to Meta CPM increase" },
  { label: "Conversion Rate", value: "3.2%", change: 0.3, prefix: "", icon: MousePointerClick, tooltip: "Stable conversions across all channels" },
  { label: "CPC", value: "$2.45", change: -5.1, prefix: "$", icon: BarChart3, tooltip: "CPC decreased — ad relevance improving" },
]

const MOCK_CHART_DATA = [
  { date: "Jan 1", revenue: 3200, spend: 1400, leads: 28 },
  { date: "Jan 8", revenue: 4100, spend: 1600, leads: 35 },
  { date: "Jan 15", revenue: 3800, spend: 1500, leads: 32 },
  { date: "Jan 22", revenue: 5200, spend: 1800, leads: 45 },
  { date: "Jan 29", revenue: 6100, spend: 2100, leads: 52 },
  { date: "Feb 5", revenue: 5800, spend: 2000, leads: 48 },
  { date: "Feb 12", revenue: 7200, spend: 2400, leads: 61 },
  { date: "Feb 19", revenue: 8500, spend: 2600, leads: 72 },
  { date: "Feb 26", revenue: 9100, spend: 2800, leads: 78 },
  { date: "Mar 5", revenue: 11200, spend: 3200, leads: 95 },
]

const MOCK_INSIGHTS = [
  { type: "warning", title: "Google Ads conversions dropped 12%", desc: "Keyword fatigue detected on 3 top campaigns. Consider refreshing ad copy and expanding keyword sets.", priority: "High" },
  { type: "success", title: "Meta video creatives outperforming by 23%", desc: "Video ads have a 23% higher CTR than static images. Shift budget allocation toward video formats.", priority: "Medium" },
  { type: "info", title: "LinkedIn CPC decreased 8% this week", desc: "Audience targeting refinements are paying off. Continue narrowing by job title and seniority.", priority: "Low" },
  { type: "warning", title: "Landing page bounce rate increased to 62%", desc: "Mobile bounce rate spiked. Review page load speed and above-fold content for mobile users.", priority: "High" },
]

const MOCK_RECOMMENDATIONS = [
  { title: "Pause 3 low-performing campaigns", desc: "Campaigns with ROAS below 1.0x are draining budget. Pausing them would save $2,400/month.", action: "Review & Pause", icon: Pause },
  { title: "Increase budget on high ROAS campaigns", desc: "2 campaigns have ROAS above 5x. Increasing budget by 30% could yield $8,000 more revenue.", action: "Optimize Budget", icon: PlusCircle },
  { title: "Generate new creatives for declining ads", desc: "Ad fatigue detected on 5 ad sets. Fresh creatives could restore CTR by an estimated 15%.", action: "Generate Creatives", icon: Sparkles },
  { title: "Launch retargeting campaign", desc: "1,200 website visitors haven't converted. A retargeting campaign could capture 3-5% of them.", action: "Create Campaign", icon: Play },
]

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

function KPICard({ kpi }: { kpi: typeof MOCK_KPIS[0] }) {
  const isPositive = kpi.change >= 0
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-md transition-shadow duration-200 group relative">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 bg-neutral-100 rounded-lg flex items-center justify-center">
          <kpi.icon className="w-[18px] h-[18px] text-neutral-600" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isPositive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
          }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPositive ? "+" : ""}{kpi.change}%
        </div>
      </div>
      <div className="text-2xl font-bold text-neutral-900 tracking-tight">{kpi.value}</div>
      <div className="text-[13px] text-neutral-500 mt-1">{kpi.label}</div>

      {/* AI Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-neutral-900 text-white text-xs rounded-lg px-3 py-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg z-10">
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles className="w-3 h-3 text-yellow-400" />
          <span className="font-medium">AI Insight</span>
        </div>
        {kpi.tooltip}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-900 rotate-45 -mt-1" />
      </div>
    </div>
  )
}

function PerformanceChart({ data, timeRange, onTimeRangeChange }: {
  data: typeof MOCK_CHART_DATA
  timeRange: string
  onTimeRangeChange: (range: string) => void
}) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue))
  const maxSpend = Math.max(...data.map((d) => d.spend))
  const maxVal = Math.max(maxRevenue, maxSpend)

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">Performance Overview</h3>
          <p className="text-[13px] text-neutral-500 mt-0.5">Revenue, spend & leads across all platforms</p>
        </div>
        <div className="flex items-center bg-neutral-100 rounded-lg p-0.5">
          {["7d", "30d", "90d"].map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange(range)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${timeRange === range
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
                }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center gap-5 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neutral-900" />
          <span className="text-xs text-neutral-600">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neutral-400" />
          <span className="text-xs text-neutral-600">Spend</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neutral-200" />
          <span className="text-xs text-neutral-600">Leads</span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative h-[260px] w-full">
        <svg viewBox={`0 0 ${data.length * 80} 260`} className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="0"
              y1={i * 65}
              x2={data.length * 80}
              y2={i * 65}
              stroke="#f5f5f5"
              strokeWidth="1"
            />
          ))}

          {/* Revenue area */}
          <path
            d={`M ${data.map((d, i) => `${i * 80 + 40},${260 - (d.revenue / maxVal) * 240}`).join(" L ")} L ${(data.length - 1) * 80 + 40},260 L 40,260 Z`}
            fill="rgba(23,23,23,0.06)"
          />
          {/* Revenue line */}
          <path
            d={`M ${data.map((d, i) => `${i * 80 + 40},${260 - (d.revenue / maxVal) * 240}`).join(" L ")}`}
            fill="none"
            stroke="#171717"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Spend line */}
          <path
            d={`M ${data.map((d, i) => `${i * 80 + 40},${260 - (d.spend / maxVal) * 240}`).join(" L ")}`}
            fill="none"
            stroke="#a3a3a3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6,4"
          />

          {/* Revenue dots */}
          {data.map((d, i) => (
            <circle
              key={`rev-${i}`}
              cx={i * 80 + 40}
              cy={260 - (d.revenue / maxVal) * 240}
              r="3.5"
              fill="#171717"
              stroke="white"
              strokeWidth="2"
            />
          ))}
        </svg>

        {/* X axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 -mb-5">
          {data.map((d) => (
            <span key={d.date} className="text-[10px] text-neutral-400">{d.date}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function InsightCard({ insight }: { insight: typeof MOCK_INSIGHTS[0] }) {
  const iconMap = {
    warning: AlertTriangle,
    success: TrendingUp,
    info: Lightbulb,
  }
  const colorMap = {
    warning: "text-amber-600 bg-amber-50",
    success: "text-emerald-600 bg-emerald-50",
    info: "text-blue-600 bg-blue-50",
  }
  const Icon = iconMap[insight.type as keyof typeof iconMap] || Lightbulb
  const color = colorMap[insight.type as keyof typeof colorMap] || colorMap.info

  return (
    <div className="flex gap-3 p-4 rounded-lg border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/50 transition-all duration-150">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium text-neutral-900 leading-snug">{insight.title}</h4>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${insight.priority === "High" ? "bg-red-100 text-red-700"
            : insight.priority === "Medium" ? "bg-amber-100 text-amber-700"
              : "bg-neutral-100 text-neutral-600"
            }`}>{insight.priority}</span>
        </div>
        <p className="text-[13px] text-neutral-500 mt-1 leading-relaxed">{insight.desc}</p>
      </div>
    </div>
  )
}

function RecommendationCard({ rec }: { rec: typeof MOCK_RECOMMENDATIONS[0] }) {
  const router = useRouter()
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border border-neutral-100 hover:border-neutral-300 hover:shadow-sm transition-all duration-200 group cursor-pointer">
      <div className="w-9 h-9 bg-neutral-900 rounded-lg flex items-center justify-center flex-shrink-0">
        <rec.icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-neutral-900">{rec.title}</h4>
        <p className="text-[13px] text-neutral-500 mt-1 leading-relaxed">{rec.desc}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (rec.action.includes("Pause") || rec.action.includes("Budget")) {
            router.push("/dashboard/campaigns");
          } else if (rec.action.includes("Creative")) {
            router.push("/dashboard/creatives");
          } else if (rec.action.includes("Campaign")) {
            router.push("/dashboard/campaign-launcher");
          }
        }}
        className="flex items-center gap-1 text-xs font-medium text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-lg transition-colors flex-shrink-0"
      >
        {rec.action}
        <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN DASHBOARD PAGE
// ─────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter()
  const sessionResult = useSession()
  const session = sessionResult?.data
  const status = sessionResult?.status || "loading"

  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")
  const [refreshing, setRefreshing] = useState(false)

  const [isDemoMode] = useState(() => {
    if (typeof document === "undefined") return false
    return document.cookie.includes("growzzy_demo_mode=true")
  })

  // Load data on mount
  useEffect(() => {
    // For demo / mock auth, use mock data immediately
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  // Auth check
  useEffect(() => {
    if (isDemoMode) return
    if (status === "loading") return
    if (status === "unauthenticated") {
      router.push("/auth")
    }
  }, [isDemoMode, status, router])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1500)
  }

  // Loading State
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 lg:p-8 space-y-6">
          {/* Skeleton KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-neutral-200 p-5 animate-pulse">
                <div className="w-9 h-9 bg-neutral-100 rounded-lg mb-3" />
                <div className="h-7 bg-neutral-100 rounded w-20 mb-2" />
                <div className="h-4 bg-neutral-50 rounded w-16" />
              </div>
            ))}
          </div>
          {/* Skeleton Chart */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 animate-pulse">
            <div className="h-5 bg-neutral-100 rounded w-40 mb-2" />
            <div className="h-4 bg-neutral-50 rounded w-60 mb-6" />
            <div className="h-[260px] bg-neutral-50 rounded-lg" />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
              Dashboard Overview
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              Your marketing command center
              {isDemoMode && <span className="ml-2 text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">Demo Mode</span>}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 hover:border-neutral-300 px-4 py-2 rounded-lg transition-all hover:shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {MOCK_KPIS.map((kpi) => (
            <KPICard key={kpi.label} kpi={kpi} />
          ))}
        </div>

        {/* Performance Chart */}
        <PerformanceChart
          data={MOCK_CHART_DATA}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />

        {/* AI Insights + AI Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Insights */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-900">AI Insights</h3>
                <p className="text-[12px] text-neutral-500">Anomalies, opportunities & risks</p>
              </div>
            </div>
            <div className="space-y-3">
              {MOCK_INSIGHTS.map((insight, i) => (
                <InsightCard key={i} insight={insight} />
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-900">AI Recommendations</h3>
                <p className="text-[12px] text-neutral-500">Actionable suggestions from your AI</p>
              </div>
            </div>
            <div className="space-y-3">
              {MOCK_RECOMMENDATIONS.map((rec, i) => (
                <RecommendationCard key={i} rec={rec} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
