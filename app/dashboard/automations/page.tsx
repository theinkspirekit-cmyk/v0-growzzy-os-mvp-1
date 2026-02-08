"use client"
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { showToast } from "@/components/Toast"
import { Plus, Pause, Play, Trash2, Eye, Clock, Loader2 } from "lucide-react"

interface Automation {
  id: string
  name: string
  trigger_type: string
  trigger_config: Record<string, any>
  action_type: string
  action_config: Record<string, any>
  is_active: boolean
  last_executed_at: string | null
  created_at: string
  description: string
}

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedAuto, setSelectedAuto] = useState<Automation | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    trigger_type: "",
    trigger_config: {} as Record<string, any>,
    action_type: "",
    action_config: {} as Record<string, any>,
    description: "",
  })

  // Fetch automations from API
  useEffect(() => {
    fetchAutomations()
  }, [])

  const fetchAutomations = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/automations")
      if (response.ok) {
        const data = await response.json()
        setAutomations(data.automations || [])
      }
    } catch (error) {
      console.error("[v0] Failed to fetch automations:", error)
      showToast("Failed to fetch automations", "error")
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (id: string) => {
    try {
      const automation = automations.find((a) => a.id === id)
      const newStatus = !automation?.is_active

      const response = await fetch("/api/automations", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, is_active: newStatus }),
      })

      if (response.ok) {
        setAutomations(automations.map((a) => (a.id === id ? { ...a, is_active: newStatus } : a)))
        showToast(`Automation ${newStatus ? "activated" : "paused"} successfully`, "success")
      } else {
        showToast("Failed to update automation", "error")
      }
    } catch (error) {
      console.error("[v0] Failed to toggle automation:", error)
      showToast("Failed to update automation", "error")
    }
  }

  const deleteAutomation = async (id: string) => {
    try {
      const response = await fetch(`/api/automations?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setAutomations(automations.filter((a) => a.id !== id))
        showToast("Automation deleted successfully", "success")
      } else {
        showToast("Failed to delete automation", "error")
      }
    } catch (error) {
      console.error("[v0] Failed to delete automation:", error)
      showToast("Failed to delete automation", "error")
    }
  }

  const handleCreateNew = () => {
    console.log("[v0] Create New Automation clicked")
    setFormData({
      name: "",
      trigger_type: "",
      trigger_config: {},
      action_type: "",
      action_config: {},
      description: "",
    })
    setEditMode(false)
    setShowCreateModal(true)
  }

  const handleEdit = () => {
    if (selectedAuto) {
      setFormData({
        name: selectedAuto.name,
        trigger_type: selectedAuto.trigger_type,
        trigger_config: selectedAuto.trigger_config,
        action_type: selectedAuto.action_type,
        action_config: selectedAuto.action_config,
        description: selectedAuto.description,
      })
      setEditMode(true)
      setShowModal(false)
      setShowCreateModal(true)
    }
  }

  const handleSave = async () => {
    console.log("[v0] Save automation clicked with formData:", formData)

    if (!formData.name || !formData.trigger_type || !formData.action_type) {
      showToast("Please fill all required fields", "error")
      return
    }

    setSaving(true)
    showToast("Saving automation...", "success")

    try {
      if (editMode && selectedAuto) {
        // Update existing automation
        const response = await fetch("/api/automations", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: selectedAuto.id,
            ...formData,
          }),
        })

        const data = await response.json()
        console.log("[v0] Update response:", data)

        if (response.ok) {
          setAutomations(automations.map((a) => (a.id === selectedAuto.id ? data : a)))
          showToast("Automation updated successfully!", "success")
          setShowCreateModal(false)
        } else {
          throw new Error(data.error || "Failed to update automation")
        }
      } else {
        // Create new automation
        console.log("[v0] Creating new automation...")
        const response = await fetch("/api/automations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        const data = await response.json()
        console.log("[v0] Create response:", response.status, data)

        if (response.ok || response.status === 201) {
          const newAutomation: Automation = {
            id: data.id,
            name: data.name,
            trigger_type: data.trigger_type,
            trigger_config: data.trigger_config || {},
            action_type: data.action_type,
            action_config: data.action_config || {},
            is_active: data.is_active ?? true,
            last_executed_at: data.last_executed_at || null,
            created_at: data.created_at || new Date().toISOString(),
            description: data.description || "",
          }

          setAutomations((prev) => [newAutomation, ...prev])
          showToast("Automation created successfully!", "success")
          setShowCreateModal(false)
        } else {
          throw new Error(data.error || "Failed to create automation")
        }
      }
    } catch (error: any) {
      console.error("[v0] Error saving automation:", error)
      showToast(`Error: ${error.message}`, "error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout activeTab="automations">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Automations</h1>
          <Button type="button" onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" /> New Automation
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : automations.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No automations yet. Create one to get started!</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {automations.map((auto) => (
              <Card key={auto.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{auto.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Trigger: <span className="font-medium">{auto.trigger_type}</span> → Action:{" "}
                      <span className="font-medium">{auto.action_type}</span>
                    </p>
                    {auto.last_executed_at && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last run: {new Date(auto.last_executed_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleStatus(auto.id)}
                      title={auto.is_active ? "Pause" : "Activate"}
                    >
                      {auto.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedAuto(auto)
                        setShowModal(true)
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteAutomation(auto.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => !saving && setShowCreateModal(false)}
          >
            <Card
              className="w-full max-w-md p-6 max-h-[90vh] overflow-y-auto bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">{editMode ? "Edit Automation" : "Create Automation"}</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-sm"
                    placeholder="e.g., Send Email on New Lead"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Trigger Type *</label>
                  <select
                    value={formData.trigger_type}
                    onChange={(e) => setFormData({ ...formData, trigger_type: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-sm"
                    disabled={saving}
                  >
                    <option value="">Select trigger...</option>
                    <option value="new_lead">New Lead</option>
                    <option value="campaign_milestone">Campaign Milestone</option>
                    <option value="low_roas">Low ROAS Alert</option>
                    <option value="budget_exceeded">Budget Exceeded</option>
                    <option value="schedule">Scheduled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Action Type *</label>
                  <select
                    value={formData.action_type}
                    onChange={(e) => setFormData({ ...formData, action_type: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-sm"
                    disabled={saving}
                  >
                    <option value="">Select action...</option>
                    <option value="send_email">Send Email</option>
                    <option value="create_task">Create Task</option>
                    <option value="adjust_budget">Adjust Budget</option>
                    <option value="pause_campaign">Pause Campaign</option>
                    <option value="notify">Send Notification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-sm"
                    placeholder="Describe what this automation does..."
                    rows={2}
                    disabled={saving}
                  />
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} disabled={saving}>
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      console.log("[v0] Save button clicked")
                      handleSave()
                    }}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Automation"
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* View Modal */}
        {showModal && selectedAuto && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md p-6">
              <h2 className="text-xl font-bold mb-4">{selectedAuto.name}</h2>
              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Trigger Type</p>
                  <p className="font-medium">{selectedAuto.trigger_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Action Type</p>
                  <p className="font-medium">{selectedAuto.action_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{selectedAuto.is_active ? "Active" : "Paused"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{selectedAuto.description}</p>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Close
                </Button>
                <Button onClick={handleEdit}>Edit</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
