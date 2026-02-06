"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Users, 
  BarChart3,
  RefreshCw,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [metrics, setMetrics] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [platformBreakdown, setPlatformBreakdown] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
        const [metricsRes, campaignsRes, historicalRes, platformRes] = await Promise.all([
          fetch(`/api/analytics/summary?userId=${data.user.id}`),
          fetch(`/api/campaigns?userId=${data.user.id}`),
          fetch(`/api/analytics/historical?userId=${data.user.id}`),
          fetch(`/api/analytics/aggregate?userId=${data.user.id}`),
        ])

        if (metricsRes.ok) {
          const metricsData = await metricsRes.json()
          setMetrics(metricsData.summary)
        }

        if (campaignsRes.ok) {
          const campaignsData = await campaignsRes.json()
          setCampaigns(campaignsData.campaigns || [])
        }

        if (historicalRes.ok) {
          const histData = await historicalRes.json()
          setHistoricalData(histData.data || [])
        }

        if (platformRes.ok) {
          const platformData = await platformRes.json()
          setPlatformBreakdown(platformData.breakdown || [])
        }
      } catch (error) {
        console.error("[v0] Dashboard error:", error)
        router.push("/auth")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const MetricCard = ({ 
    label, 
    value, 
    change, 
    changeType, 
    icon: Icon,
    color = "text-blue-600"
  }: {
    label: string
    value: string
    change: string
    changeType: 'increase' | 'decrease'
    icon: React.ComponentType<{ className?: string }>
    color?: string
  }) => {
    const isPositive = changeType === 'increase'
    
    return (
      <Card className="p-6 bg-white hover:shadow-lg transition-shadow border-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2 font-medium">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mb-3">{value}</p>
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              )}>
                {isPositive ? (
                  <ArrowUp className="w-3 h-3" />
                ) : (
                  <ArrowDown className="w-3 h-3" />
                )}
                {change}
              </div>
              <span className="text-xs text-gray-500">vs last period</span>
            </div>
          </div>
          <div className={cn("p-3 rounded-lg bg-gray-50", color)}>
            <Icon className="w-6 h-6" />
          </div>
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

  const totalSpend = metrics?.totalSpend || 0
  const totalRevenue = metrics?.totalRevenue || 0
  const roas = metrics?.roas || 0
  const conversions = metrics?.totalConversions || 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {user.full_name || user.email}!
            </h2>
            <p className="text-gray-600">Here's your marketing performance overview for the last 30 days.</p>
          </div>
          <Button className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            label="Total Spend"
            value={`$${totalSpend.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
            change="+12.5%"
            changeType="increase"
            icon={DollarSign}
            color="text-blue-600"
          />
          <MetricCard
            label="Total Revenue"
            value={`$${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
            change="+8.2%"
            changeType="increase"
            icon={TrendingUp}
            color="text-green-600"
          />
          <MetricCard
            label="ROAS"
            value={`${roas.toFixed(2)}x`}
            change="-2.1%"
            changeType="decrease"
            icon={BarChart3}
            color="text-purple-600"
          />
          <MetricCard
            label="Conversions"
            value={conversions.toLocaleString()}
            change="+15.3%"
            changeType="increase"
            icon={Users}
            color="text-orange-600"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Chart */}
          <Card className="lg:col-span-2 p-6 bg-white border-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h3>
            {historicalData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={2} dot={false} name="Spend" />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={false} name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-500">
                <p>No data available. Connect platforms to see trends.</p>
              </div>
            )}
          </Card>

          {/* Platform Breakdown */}
          <Card className="p-6 bg-white border-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spend by Platform</h3>
            {platformBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={platformBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: $${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {platformBreakdown.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-500">
                <p>No platform data</p>
              </div>
            )}
          </Card>
        </div>

        {/* Recent Campaigns */}
        <Card className="p-6 bg-white border-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Campaigns</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Campaign</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Platform</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Spend</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Revenue</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.slice(0, 5).map((campaign: any) => (
                  <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{campaign.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 capitalize">{campaign.platform}</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-900">
                      ${(campaign.spend || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-green-600">
                      ${(campaign.revenue || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium">
                      <span className={campaign.roas > 2 ? 'text-green-600' : campaign.roas > 1 ? 'text-yellow-600' : 'text-red-600'}>
                        {(campaign.roas || 0).toFixed(2)}x
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
