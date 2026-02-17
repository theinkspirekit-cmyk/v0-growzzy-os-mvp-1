'use client'

import { useState, useEffect } from 'react'
import { Mail, Trash2, Filter, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { getLeads, updateLeadStatus, getLeadsByScore } from '@/app/actions/leads'
import { getLeadStatusColor } from '@/lib/formatters'

interface Lead {
  id: string
  name: string
  email: string
  company?: string
  source: string
  status: string
  aiScore?: number
  createdAt: Date
}

type SortBy = 'recent' | 'score' | 'name'

export function LeadManager() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'>('all')
  const [sortBy, setSortBy] = useState<SortBy>('recent')

  useEffect(() => {
    fetchLeads()
  }, [filter, sortBy])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      let data
      if (sortBy === 'score') {
        data = await getLeadsByScore()
      } else {
        data = await getLeads(filter === 'all' ? undefined : { status: filter })
      }
      setLeads(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch leads:', error)
      toast.error('Failed to load leads')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const result = await updateLeadStatus(leadId, newStatus)
      if (result.success) {
        toast.success(`Lead status updated to ${newStatus}`)
        fetchLeads()
      } else {
        toast.error(result.error || 'Failed to update status')
      }
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  if (loading) {
    return <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Leads</h3>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortBy)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg"
          >
            <option value="recent">Recent</option>
            <option value="score">Top Score</option>
            <option value="name">Name</option>
          </select>

          <div className="relative">
            <select
              value={filter}
              onChange={e => setFilter(e.target.value as any)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg appearance-none pr-8"
            >
              <option value="all">All</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
            <Filter className="absolute right-2 top-2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No leads found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Company</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Score</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{lead.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      {lead.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{lead.company || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${(lead.aiScore || 0) / 100 * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-900">{lead.aiScore}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={e => handleStatusChange(lead.id, e.target.value)}
                      className={`px-2 py-1 text-xs rounded font-medium cursor-pointer ${getLeadStatusColor(
                        lead.status
                      )}`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="converted">Converted</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
