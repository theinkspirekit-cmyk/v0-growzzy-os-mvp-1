"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Target,
  DollarSign,
  TrendingUp,
  Users,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Eye,
  Edit,
  Play,
  Pause,
  Facebook,
  Search,
  Linkedin
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export const dynamic = "force-dynamic"

export default function CampaignsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
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

        // Fetch campaigns data
        const campaignsRes = await fetch(`/api/campaigns?userId=${data.user.id}&range=${timeRange}`)
        if (campaignsRes.ok) {
          const campaignsData = await campaignsRes.json()
          setCampaigns(campaignsData.campaigns || [])
        }
      } catch (error) {
        console.error("[v0] Campaigns error:", error)
        router.push("/auth")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, timeRange])

  // Reuse exact same MetricCard component from Dashboard
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
              <p className="text-sm font-medium text-gray-900">{title}</p>
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
              <span className="text-sm text-gray-600">vs last period</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Campaign Detail Card - same style as dashboard cards
  const CampaignDetailCard = ({ campaign }: { campaign: any }) => {
    const getPlatformIcon = (platform: string) => {
      switch (platform.toLowerCase()) {
        case 'meta': return <Facebook className="w-5 h-5" />
        case 'google': return <Search className="w-5 h-5" />
        case 'linkedin': return <Linkedin className="w-5 h-5" />
        default: return <Target className="w-5 h-5" />
      }
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
            <p className="text-sm text-gray-600">Campaign Details</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSelectedCampaign(null)}
          >
            ×
          </Button>
        </div>

        <div className="space-y-6">
          {/* Campaign Overview */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Campaign Overview</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {getPlatformIcon(campaign.platform)}
                <span className="text-sm font-medium text-gray-900">{campaign.platform}</span>
                <Badge className={campaign.status === 'active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {campaign.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Performance Metrics</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Spend</span>
                <span className="text-sm font-medium text-gray-900">
                  ${(campaign.spend || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="text-sm font-medium text-green-600">
                  ${(campaign.revenue || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Leads</span>
                <span className="text-sm font-medium text-gray-900">
                  {campaign.leads || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">ROAS</span>
                <span className="text-sm font-bold text-gray-900">
                  {(campaign.roas || 0).toFixed(2)}x
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button className="w-full">Edit Campaign</Button>
            <Button variant="outline" className="w-full">View Analytics</Button>
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

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length
  const totalSpend = campaigns.reduce((sum, c) => sum + (c.spend || 0), 0)
  const avgROAS = campaigns.length > 0 ? campaigns.reduce((sum, c) => sum + (c.roas || 0), 0) / campaigns.length : 0
  const avgCPA = campaigns.length > 0 ? totalSpend / campaigns.reduce((sum, c) => sum + (c.leads || 0), 0) : 0

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'meta': return <Facebook className="w-4 h-4" />
      case 'google': return <Search className="w-4 h-4" />
      case 'linkedin': return <Linkedin className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 bg-gray-50/50 p-6 rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Campaign Management</h2>
            <p className="text-gray-700 mt-1">Monitor and optimize your ad campaigns</p>
          </div>
          <div className="flex gap-3">
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
            <Button className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Top KPI Cards - Same style as Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Active Campaigns"
            value={activeCampaigns.toLocaleString()}
            change="+2"
            changeType="increase"
            icon={Target}
          />
          <MetricCard
            title="Total Spend"
            value={`$${totalSpend.toLocaleString()}`}
            change="+12.5%"
            changeType="increase"
            icon={DollarSign}
          />
          <MetricCard
            title="Average ROAS"
            value={`${avgROAS.toFixed(2)}x`}
            change="-0.3"
            changeType="decrease"
            icon={TrendingUp}
          />
          <MetricCard
            title="Average CPA"
            value={`$${avgCPA.toFixed(2)}`}
            change="-8.2%"
            changeType="decrease"
            icon={Users}
          />
        </div>

        {/* Main Content - Campaigns Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Campaigns</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Campaign Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Platform</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Spend</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Leads</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Revenue</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">ROAS</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr 
                        key={campaign.id} 
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedCampaign(campaign)}
                      >
                        <td className="py-3 px-4">
                          <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getPlatformIcon(campaign.platform)}
                            <span className="text-sm text-gray-900">{campaign.platform}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="text-sm text-gray-900">
                            ${(campaign.spend || 0).toLocaleString()}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="text-sm text-gray-900">{campaign.leads || 0}</div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="text-sm text-green-600">
                            ${(campaign.revenue || 0).toLocaleString()}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {(campaign.roas || 0).toFixed(2)}x
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={campaign.status === 'active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                            {campaign.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                {campaign.status === 'active' ? (
                                  <Pause className="w-4 h-4 mr-2" />
                                ) : (
                                  <Play className="w-4 h-4 mr-2" />
                                )}
                                {campaign.status === 'active' ? 'Pause' : 'Activate'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Campaign Details */}
          <div>
            {selectedCampaign ? (
              <CampaignDetailCard campaign={selectedCampaign} />
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-center text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Select a campaign to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
