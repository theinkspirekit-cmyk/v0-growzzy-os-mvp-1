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
  Calendar,
  Download,
  Filter
} from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default function AnalyticsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [platformData, setPlatformData] = useState<any[]>([])
  const [funnelData, setFunnelData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("revenue")

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

        // Fetch analytics data
        const [analyticsRes, historicalRes, platformRes, funnelRes] = await Promise.all([
          fetch(`/api/analytics/summary?userId=${data.user.id}&range=${timeRange}`),
          fetch(`/api/analytics/historical?userId=${data.user.id}&range=${timeRange}`),
          fetch(`/api/analytics/platforms?userId=${data.user.id}`),
          fetch(`/api/analytics/funnel?userId=${data.user.id}`),
        ])

        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json()
          setAnalytics(analyticsData.summary)
        }

        if (historicalRes.ok) {
          const histData = await historicalRes.json()
          setHistoricalData(histData.data || [])
        }

        if (platformRes.ok) {
          const platformData = await platformRes.json()
          setPlatformData(platformData.platforms || [])
        }

        if (funnelRes.ok) {
          const funnelData = await funnelRes.json()
          setFunnelData(funnelData.stages || [])
        }
      } catch (error) {
        console.error("[v0] Analytics error:", error)
        router.push("/auth")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, timeRange])

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    changeType,
    icon: Icon,
    format = "number"
  }: {
    title: string
    value: number
    change: number
    changeType: 'increase' | 'decrease'
    icon: React.ComponentType<{ className?: string }>
    format?: 'number' | 'currency' | 'percentage'
  }) => {
    const isPositive = changeType === 'increase'
    
    const formatValue = (val: number) => {
      switch (format) {
        case 'currency':
          return `$${val.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
        case 'percentage':
          return `${val.toFixed(1)}%`
        default:
          return val.toLocaleString()
      }
    }

    return (
      <Card className="p-6 bg-white border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Icon className="w-5 h-5 text-gray-600" />
          </div>
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          )}>
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(change).toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatValue(value)}
          </div>
          <div className="text-sm text-gray-600">{title}</div>
        </div>
      </Card>
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
            <p className="text-gray-600 mt-1">Comprehensive performance metrics and insights</p>
          </div>
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Revenue"
            value={analytics?.totalRevenue || 0}
            change={12.5}
            changeType="increase"
            icon={DollarSign}
            format="currency"
          />
          <MetricCard
            title="Ad Spend"
            value={analytics?.totalSpend || 0}
            change={8.2}
            changeType="increase"
            icon={BarChart3}
            format="currency"
          />
          <MetricCard
            title="ROAS"
            value={analytics?.roas || 0}
            change={-2.1}
            changeType="decrease"
            icon={Target}
            format="number"
          />
          <MetricCard
            title="Conversions"
            value={analytics?.totalConversions || 0}
            change={15.3}
            changeType="increase"
            icon={Users}
            format="number"
          />
        </div>

        {/* Performance Chart */}
        <Card className="p-6 bg-white border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Trend</h3>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="spend">Spend</SelectItem>
                <SelectItem value="conversions">Conversions</SelectItem>
                <SelectItem value="roas">ROAS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={historicalData}>
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
                tickFormatter={(value) => {
                  if (selectedMetric === 'revenue' || selectedMetric === 'spend') {
                    return `$${(value / 1000).toFixed(0)}k`
                  }
                  return value.toLocaleString()
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => {
                  if (selectedMetric === 'revenue' || selectedMetric === 'spend') {
                    return [`$${value.toLocaleString()}`, selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)]
                  }
                  return [value.toLocaleString(), selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)]
                }}
              />
              <Area 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Platform Performance & Funnel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Platform Performance */}
          <Card className="p-6 bg-white border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="platform" 
                  stroke="#6b7280" 
                  style={{ fontSize: '12px' }}
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
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spend" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Conversion Funnel */}
          <Card className="p-6 bg-white border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Conversion Funnel</h3>
            <div className="space-y-4">
              {funnelData.map((stage, index) => (
                <div key={stage.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{stage.name}</span>
                    <span className="text-sm text-gray-600">{stage.count.toLocaleString()}</span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-8">
                      <div 
                        className="bg-blue-600 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ width: `${(stage.count / funnelData[0].count) * 100}%` }}
                      >
                        {((stage.count / funnelData[0].count) * 100).toFixed(1)}%
                      </div>
                    </div>
                    {index < funnelData.length - 1 && (
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {((1 - stage.count / funnelData[index + 1].count) * 100).toFixed(1)}% drop-off
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Attribution Analysis */}
        <Card className="p-6 bg-white border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Attribution Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {analytics?.firstTouchAttribution || 0}%
              </div>
              <div className="text-sm text-gray-600">First Touch</div>
              <div className="text-xs text-gray-500 mt-1">
                Initial interaction credit
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {analytics?.lastTouchAttribution || 0}%
              </div>
              <div className="text-sm text-gray-600">Last Touch</div>
              <div className="text-xs text-gray-500 mt-1">
                Final conversion credit
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {analytics?.multiTouchAttribution || 0}%
              </div>
              <div className="text-sm text-gray-600">Multi-Touch</div>
              <div className="text-xs text-gray-500 mt-1">
                Distributed credit model
              </div>
            </div>
          </div>
        </Card>

        {/* Customer Acquisition Cost */}
        <Card className="p-6 bg-white border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Acquisition Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                ${(analytics?.cac || 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">CAC</div>
              <div className="text-xs text-gray-500 mt-1">Customer Acquisition Cost</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                ${(analytics?.ltv || 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">LTV</div>
              <div className="text-xs text-gray-500 mt-1">Lifetime Value</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 mb-2">
                {((analytics?.ltv || 0) / (analytics?.cac || 1)).toFixed(1)}x
              </div>
              <div className="text-sm text-gray-600">LTV:CAC Ratio</div>
              <div className="text-xs text-gray-500 mt-1">Efficiency metric</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {((analytics?.paybackPeriod || 0)).toFixed(1)} mo
              </div>
              <div className="text-sm text-gray-600">Payback Period</div>
              <div className="text-xs text-gray-500 mt-1">Time to recover CAC</div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
