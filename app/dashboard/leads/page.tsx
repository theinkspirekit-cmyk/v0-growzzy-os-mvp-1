"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  MoreHorizontal,
  ChevronDown,
  Users,
  Target,
  TrendingUp
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export const dynamic = "force-dynamic"

export default function LeadsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedLead, setSelectedLead] = useState<any>(null)

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
        const leadsRes = await fetch(`/api/leads?userId=${data.user.id}`)
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
  }, [router])

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || lead.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800"
      case "contacted": return "bg-yellow-100 text-yellow-800"
      case "qualified": return "bg-green-100 text-green-800"
      case "converted": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
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
      <div className="flex h-full">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Lead Management</h2>
                <p className="text-sm text-gray-600 mt-1">Manage and track your leads across all platforms</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Add Lead
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Status: {selectedStatus === "all" ? "All" : selectedStatus}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedStatus("all")}>All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("new")}>New</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("contacted")}>Contacted</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("qualified")}>Qualified</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("converted")}>Converted</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{leads.length}</div>
                <div className="text-sm text-gray-600">Total Leads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {leads.filter(l => l.status === "new").length}
                </div>
                <div className="text-sm text-gray-600">New</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {leads.filter(l => l.status === "contacted").length}
                </div>
                <div className="text-sm text-gray-600">Contacted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {leads.filter(l => l.status === "qualified").length}
                </div>
                <div className="text-sm text-gray-600">Qualified</div>
              </div>
            </div>
          </div>

          {/* Leads Table */}
          <div className="flex-1 bg-white overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-gray-700">
                            {lead.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                          <div className="text-sm text-gray-500">ID: {lead.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-900">{lead.email}</div>
                      <div className="text-sm text-gray-500">{lead.phone}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-900">{lead.platform}</div>
                      <div className="text-sm text-gray-500">{lead.campaign}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className={`text-sm font-medium ${getScoreColor(lead.score || 0)}`}>
                        {lead.score || 0}/100
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-900">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
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
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
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

        {/* Right Sidebar - Lead Details */}
        {selectedLead && (
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedLead.name}</h3>
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
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-6">
              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{selectedLead.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{selectedLead.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{selectedLead.location || "Not specified"}</span>
                  </div>
                </div>
              </div>

              {/* Lead Score */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Lead Score</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Score</span>
                    <span className={`text-lg font-bold ${getScoreColor(selectedLead.score || 0)}`}>
                      {selectedLead.score || 0}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${selectedLead.score || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Campaign Source */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Campaign Source</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Platform</span>
                    <span className="text-sm font-medium text-gray-900">{selectedLead.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Campaign</span>
                    <span className="text-sm font-medium text-gray-900">{selectedLead.campaign}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ad Set</span>
                    <span className="text-sm font-medium text-gray-900">{selectedLead.ad_set || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Activity Timeline */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Activity Timeline</h4>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Lead Created</div>
                      <div className="text-xs text-gray-500">
                        {new Date(selectedLead.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {selectedLead.status === "contacted" && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Contact Attempted</div>
                        <div className="text-xs text-gray-500">2 days ago</div>
                      </div>
                    </div>
                  )}
                  {selectedLead.status === "qualified" && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Lead Qualified</div>
                        <div className="text-xs text-gray-500">1 day ago</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button className="w-full">Contact Lead</Button>
                <Button variant="outline" className="w-full">View Full Profile</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
