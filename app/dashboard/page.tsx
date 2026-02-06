"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Users, 
  BarChart3,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Facebook,
  Search,
  Linkedin,
  Lightbulb,
  ArrowRight
} from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [metrics, setMetrics] = useState<any>(null)
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [platformData, setPlatformData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) {
          router.push("/auth")
          return
        }
        const data = await response.json()
        setUser(data.user)

        // Fetch dashboard data
        const [metricsRes, historicalRes, platformRes] = await Promise.all([
          fetch(`/api/analytics/summary?userId=${data.user.id}&range=${timeRange}`),
          fetch(`/api/analytics/historical?userId=${data.user.id}&range=${timeRange}`),
          fetch(`/api/analytics/platforms?userId=${data.user.id}`),
        ])

        if (metricsRes.ok) {
          const metricsData = await metricsRes.json()
          setMetrics(metricsData.summary)
        }

        if (historicalRes.ok) {
          const histData = await historicalRes.json()
          setHistoricalData(histData.data || [])
        }

        if (platformRes.ok) {
          const platformData = await platformRes.json()
          setPlatformData(platformData.platforms || [])
        }
      } catch (error) {
        console.error("[v0] Dashboard error:", error)
        router.push("/auth")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, timeRange])

  // SECTION A: KPI METRICS - Nexus Style
  const MetricCard = ({ 
    title, 
    value, 
    change, 
    changeType,
    icon: Icon
  }: {
    title: string
    value: string
    change: string
    changeType: 'increase' | 'decrease'
    icon: React.ComponentType<{ className?: string }>
  }) => {
    const isPositive = changeType === 'increase'
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                <Icon className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">{title}</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
            <div className="flex items-center gap-2">
              {isPositive ? (
                <ArrowUp className="w-4 h-4 text-green-600" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-600" />
              )}
              <span className={cn(
                "text-sm font-medium",
                isPositive ? "text-green-600" : "text-red-600"
              )}>
                {change}
              </span>
              <span className="text-sm text-gray-500">vs last period</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // SECTION B: PERFORMANCE OVERVIEW - Nexus Style
  const PerformanceChart = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-20 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7d</SelectItem>
            <SelectItem value="30d">30d</SelectItem>
            <SelectItem value="90d">90d</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={historicalData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280" 
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            stroke="#6b7280" 
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value: any) => [`$${value.toLocaleString()}`, '']}
          />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
          <Line type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={2} name="Spend" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )

  // Performance Metrics - Right Side
  const PerformanceMetrics = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="text-2xl font-bold text-gray-900 mb-1">3.2%</div>
        <div className="text-sm text-gray-600 mb-2">Conversion Rate</div>
        <div className="text-xs text-green-600">+0.3% vs last period</div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="text-2xl font-bold text-gray-900 mb-1">$2.45</div>
        <div className="text-sm text-gray-600 mb-2">CPC</div>
        <div className="text-xs text-red-600">+0.12 vs last period</div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="text-2xl font-bold text-gray-900 mb-1">$76.80</div>
        <div className="text-sm text-gray-600 mb-2">CPA</div>
        <div className="text-xs text-green-600">-5.2% vs last period</div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="text-2xl font-bold text-gray-900 mb-1">2.8%</div>
        <div className="text-sm text-gray-600 mb-2">CTR</div>
        <div className="text-xs text-green-600">+0.4% vs last period</div>
      </div>
    </div>
  )

  // SECTION C: PLATFORM BREAKDOWN - Nexus Style
  const PlatformCard = ({ platform, data }: { platform: string; data: any }) => {
    const getIcon = (platform: string) => {
      switch (platform.toLowerCase()) {
        case 'meta': return <Facebook className="w-5 h-5" />
        case 'google': return <Search className="w-5 h-5" />
        case 'linkedin': return <Linkedin className="w-5 h-5" />
        default: return <BarChart3 className="w-5 h-5" />
      }
    }

    const trend = data.change || 0
    const isPositive = trend > 0

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              {getIcon(platform)}
            </div>
            <h3 className="font-semibold text-gray-900">{platform} Ads</h3>
          </div>
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          )}>
            {isPositive ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
            {Math.abs(trend).toFixed(1)}%
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Spend</span>
            <span className="text-sm font-medium text-gray-900">
              ${(data.spend || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Revenue</span>
            <span className="text-sm font-medium text-green-600">
              ${(data.revenue || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">ROAS</span>
            <span className="text-sm font-bold text-gray-900">
              {(data.roas || 0).toFixed(2)}x
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div 
              className={cn(
                "h-2 rounded-full",
                isPositive ? "bg-green-600" : "bg-red-600"
              )}
              style={{ width: `${Math.min(Math.abs(trend) * 10, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    )
  }

  // SECTION D: LEADS SNAPSHOT - Nexus Style
  const LeadsSummary = () => {
    const totalLeads = metrics?.totalLeads || 0
    const qualifiedLeads = Math.floor(totalLeads * 0.35)
    const unqualifiedLeads = totalLeads - qualifiedLeads

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads Snapshot</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalLeads}</div>
            <div className="text-sm text-blue-800">Total Leads Today</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Qualified</span>
              <span className="text-sm font-medium text-green-600">{qualifiedLeads}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Unqualified</span>
              <span className="text-sm font-medium text-gray-600">{unqualifiedLeads}</span>
            </div>
          </div>
        </div>
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Best Campaign</span>
            <span className="font-medium text-gray-900">Summer Sale 2024</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Best Platform</span>
            <span className="font-medium text-gray-900">Meta Ads</span>
          </div>
        </div>
        <Button variant="outline" className="w-full">
          View All Leads
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    )
  }

  // SECTION E: AI INSIGHTS - Nexus Style
  const AIInsightCard = ({ insight }: { insight: any }) => {
    const getTypeColor = (type: string) => {
      switch (type) {
        case 'opportunity': return "bg-green-50 text-green-800 border-green-200"
        case 'warning': return "bg-yellow-50 text-yellow-800 border-yellow-200"
        case 'action': return "bg-blue-50 text-blue-800 border-blue-200"
        default: return "bg-gray-50 text-gray-800 border-gray-200"
      }
    }

    return (
      <div className={cn("rounded-lg border p-4", getTypeColor(insight.type))}>
        <div className="flex items-start gap-3">
          <Lightbulb className="w-4 h-4 mt-1" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 mb-1">{insight.title}</p>
            <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
            <Button size="sm" variant="outline" className="text-xs">
              {insight.action}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user) return null

  const totalRevenue = metrics?.totalRevenue || 0
  const totalSpend = metrics?.totalSpend || 0
  const totalLeads = metrics?.totalLeads || 0
  const roas = metrics?.roas || 0

  const aiInsights = [
    {
      type: "action",
      title: "Scale Meta Campaign Y",
      description: "ROAS 4.2x - strong performance",
      action: "Scale Campaign"
    },
    {
      type: "warning", 
      title: "Pause Campaign X",
      description: "CPA increased by 23%",
      action: "Review Campaign"
    },
    {
      type: "opportunity",
      title: "Optimize Google Ads",
      description: "CTR below industry average",
      action: "Get Suggestions"
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6 bg-gray-50/50 p-6 rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
            <p className="text-gray-600 mt-1">Quick business health check</p>
          </div>
          <Button className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* SECTION A: KPI METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
            change="+12.5%"
            changeType="increase"
            icon={DollarSign}
          />
          <MetricCard
            title="Ad Spend"
            value={`$${totalSpend.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
            change="+8.2%"
            changeType="increase"
            icon={BarChart3}
          />
          <MetricCard
            title="Leads Generated"
            value={totalLeads.toLocaleString()}
            change="+15.3%"
            changeType="increase"
            icon={Users}
          />
          <MetricCard
            title="ROAS"
            value={`${roas.toFixed(2)}x`}
            change="-2.1%"
            changeType="decrease"
            icon={Target}
          />
        </div>

        {/* SECTION B: PERFORMANCE OVERVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PerformanceChart />
          </div>
          <div>
            <PerformanceMetrics />
          </div>
        </div>

        {/* SECTION C: PLATFORM BREAKDOWN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platformData.map((platform: any) => (
            <PlatformCard 
              key={platform.name} 
              platform={platform.name}
              data={platform}
            />
          ))}
        </div>

        {/* SECTION D & E: LEADS SNAPSHOT + AI INSIGHTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeadsSummary />
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
            <div className="space-y-3">
              {aiInsights.map((insight, index) => (
                <AIInsightCard key={index} insight={insight} />
              ))}
            </div>
            <Button className="w-full mt-4">
              Open AI Copilot
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
