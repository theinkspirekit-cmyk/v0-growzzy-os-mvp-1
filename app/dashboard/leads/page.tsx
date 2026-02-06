"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Users,
  TrendingUp,
  DollarSign,
  Target,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Eye,
  Edit,
  Mail,
  Phone,
  Calendar,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export const dynamic = "force-dynamic"

export default function LeadsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<any>(null)
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

        // Fetch leads data
        const leadsRes = await fetch(`/api/leads?userId=${data.user.id}&range=${timeRange}`)
        if (leadsRes.ok) {
          const leadsData = await leadsRes.json()
          setLeads(leadsData.leads || [])
        }
      } catch (error) {
        console.error("[v0] Leads error:", error)
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

  // Lead Detail Card - same style as dashboard cards
  const LeadDetailCard = ({ lead }: { lead: any }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "new": return "bg-blue-100 text-blue-800"
        case "qualified": return "bg-green-100 text-green-800"
        case "contacted": return "bg-yellow-100 text-yellow-800"
        case "converted": return "bg-purple-100 text-purple-800"
        default: return "bg-gray-100 text-gray-800"
      }
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
            <p className="text-sm text-gray-600">Lead Details</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSelectedLead(null)}
          >
            ×
          </Button>
        </div>

        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-900">{lead.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-900">{lead.phone}</span>
              </div>
            </div>
          </div>

          {/* Lead Details */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Lead Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Source</span>
                <span className="text-sm font-medium text-gray-900">{lead.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Campaign</span>
                <span className="text-sm font-medium text-gray-900">{lead.campaign}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className={getStatusColor(lead.status)}>
                  {lead.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Date</span>
                <span className="text-sm text-gray-900">
                  {new Date(lead.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button className="w-full">Contact Lead</Button>
            <Button variant="outline" className="w-full">Edit Lead</Button>
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

  const totalLeads = leads.length
  const qualifiedLeads = leads.filter(l => l.status === 'qualified').length
  const avgCostPerLead = 45.50
  const conversionRate = 3.2

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800"
      case "qualified": return "bg-green-100 text-green-800"
      case "contacted": return "bg-yellow-100 text-yellow-800"
      case "converted": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 bg-gray-50/50 p-6 rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Lead Management</h2>
            <p className="text-gray-600 mt-1">Track and manage your leads</p>
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
            title="Total Leads"
            value={totalLeads.toLocaleString()}
            change="+15.3%"
            changeType="increase"
            icon={Users}
          />
          <MetricCard
            title="Qualified Leads"
            value={qualifiedLeads.toLocaleString()}
            change="+8.2%"
            changeType="increase"
            icon={Target}
          />
          <MetricCard
            title="Cost per Lead"
            value={`$${avgCostPerLead.toFixed(2)}`}
            change="-5.1%"
            changeType="decrease"
            icon={DollarSign}
          />
          <MetricCard
            title="Conversion Rate"
            value={`${conversionRate.toFixed(1)}%`}
            change="+0.3%"
            changeType="increase"
            icon={TrendingUp}
          />
        </div>

        {/* Main Content - Leads Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Leads</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Email / Phone</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Source</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Campaign</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr 
                        key={lead.id} 
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <td className="py-3 px-4">
                          <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900">{lead.email}</div>
                          <div className="text-sm text-gray-500">{lead.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900">{lead.source}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900">{lead.campaign}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900">
                            {new Date(lead.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
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

          {/* Lead Details */}
          <div>
            {selectedLead ? (
              <LeadDetailCard lead={selectedLead} />
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-center text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a lead to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
