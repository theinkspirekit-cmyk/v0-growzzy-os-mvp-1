"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import {
  Users,
  Search,
  Filter,
  Plus,
  Upload,
  Download,
  MoreHorizontal,
  ArrowUpDown,
  Zap,
  Loader2,
  FileSpreadsheet
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
// Import Server Actions
import { createLead, getLeads, importLeadsBulk, syncLeadsToHub } from "@/app/actions/leads"
// Excel Client Lib
import * as XLSX from "xlsx"

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  // New Lead Form State
  const [newLead, setNewLead] = useState({ name: "", email: "", company: "", value: "", phone: "" })
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const refreshLeads = async () => {
    try {
      const data = await getLeads()
      if (Array.isArray(data)) setLeads(data)
    } catch (error) {
      toast.error("Failed to load leads")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshLeads()
  }, [])

  const handleCreateLead = async () => {
    if (!newLead.name || !newLead.email) {
      toast.error("Name and Email are required")
      return
    }

    setIsCreating(true)
    try {
      const result = await createLead({
        name: newLead.name,
        email: newLead.email,
        company: newLead.company,
        phone: newLead.phone,
        estimatedValue: newLead.value ? parseFloat(newLead.value.replace(/[^0-9.]/g, "")) : 0,
        source: "Manual",
        status: "new"
      })

      if (result.success && result.lead) {
        toast.success("Lead created successfully")

        // Immediate UI Update
        setLeads(prev => [result.lead, ...prev])

        setNewLead({ name: "", email: "", company: "", value: "", phone: "" })
        setIsAddModalOpen(false)
        // refreshLeads() // Optional: We just updated state manually
      } else {
        toast.error(result.error || "Failed to create lead")
      }
    } catch (error) {
      toast.error("Network error")
    } finally {
      setIsCreating(false)
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const toastId = toast.loading("Processing File...")

    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const data = event.target?.result
        if (!data) return

        // Parse File (Excel or CSV)
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(sheet)

        if (jsonData.length === 0) {
          toast.error("File appears empty", { id: toastId })
          return
        }

        // Send to Server
        const result = await importLeadsBulk(jsonData)

        if (result.success) {
          toast.success(result.message, { id: toastId })
          refreshLeads()
          setIsImportModalOpen(false)
        } else {
          toast.error(result.error || "Import failed", { id: toastId })
        }
      }
      reader.readAsBinaryString(file)

    } catch (err) {
      console.error(err)
      toast.error("Failed to parse file. Please ensure it is a valid Excel or CSV file.", { id: toastId })
    }
  }

  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.company?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-semibold text-text-primary">Target Index</h1>
            <p className="text-[13px] text-text-secondary">Manage and track your lead pipeline.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="btn btn-secondary h-8"
            >
              <Upload className="w-3.5 h-3.5 mr-1" /> Import
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary h-8"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Lead
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card p-1 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2 px-2 flex-1">
            <Search className="w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full text-[13px] border-none outline-none placeholder:text-text-tertiary"
            />
          </div>
          <div className="flex items-center gap-2 border-l border-border pl-2">
            <button className="btn btn-ghost h-8 w-8 p-0"><Filter className="w-4 h-4" /></button>
            <button className="btn btn-ghost h-8 w-8 p-0"><ArrowUpDown className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Data Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-[40px] px-2"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th>Name</th>
                <th>Company</th>
                <th>Status</th>
                <th>Score</th>
                <th>Value</th>
                <th>Created</th>
                <th className="w-[40px]"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-text-tertiary">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                    Loading data...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-text-tertiary">
                    No leads found.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="group cursor-pointer">
                    <td className="px-2"><input type="checkbox" className="rounded border-gray-300" /></td>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-medium text-text-primary">{lead.name}</span>
                        <span className="text-[11px] text-text-tertiary">{lead.email}</span>
                      </div>
                    </td>
                    <td>{lead.company || '—'}</td>
                    <td>
                      <span className={cn(
                        "badge",
                        lead.status === 'new' ? 'badge-neutral' :
                          lead.status === 'won' ? 'badge-success' :
                            'badge-neutral'
                      )}>
                        {lead.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-12 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${lead.aiScore || 0}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-text-secondary">{lead.aiScore || 0}</span>
                      </div>
                    </td>
                    <td className="font-medium text-text-primary">${(lead.estimatedValue || 0).toLocaleString()}</td>
                    <td className="text-text-tertiary text-[12px]">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-ghost h-7 w-7 p-0 opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add Lead Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
            <div className="bg-white rounded-[8px] shadow-lg w-[400px] border border-border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gray-50/50">
                <h3 className="font-semibold text-[14px]">Add New Lead</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium uppercase text-text-tertiary">Full Name</label>
                  <input
                    className="input"
                    value={newLead.name}
                    onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                    autoFocus
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium uppercase text-text-tertiary">Email</label>
                  <input
                    className="input"
                    value={newLead.email}
                    onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium uppercase text-text-tertiary">Company</label>
                    <input
                      className="input"
                      value={newLead.company}
                      onChange={e => setNewLead({ ...newLead, company: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium uppercase text-text-tertiary">Value</label>
                    <input
                      className="input"
                      value={newLead.value}
                      onChange={e => setNewLead({ ...newLead, value: e.target.value })}
                      placeholder="$0.00"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border bg-gray-50/50">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateLead}
                  disabled={isCreating}
                  className="btn btn-primary"
                >
                  {isCreating ? 'Saving...' : 'Create Lead'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Import Modal */}
        {isImportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
            <div className="bg-white rounded-[8px] shadow-lg w-[400px] border border-border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gray-50/50">
                <h3 className="font-semibold text-[14px]">Import Leads</h3>
              </div>
              <div className="p-8 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-[14px]">Upload Spreadsheet</p>
                  <p className="text-[12px] text-text-tertiary mt-1">Supports .csv, .xlsx, .xls</p>
                </div>
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  onChange={handleImport}
                  className="hidden"
                  id="csvUpload"
                />
                <button
                  onClick={() => document.getElementById('csvUpload')?.click()}
                  className="btn btn-secondary w-full"
                >
                  Select File
                </button>
              </div>
              <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border bg-gray-50/50">
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
