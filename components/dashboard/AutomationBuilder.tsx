'use client'

import { useState, useEffect } from 'react'
import { Zap, Trash2, Copy, Settings, Play } from 'lucide-react'
import { toast } from 'sonner'
import { getAutomations, deployAutomation, deleteAutomation, toggleAutomation, testAutomation, cloneAutomation } from '@/app/actions/automations'

interface Automation {
  id: string
  name: string
  triggerType: string
  actionType: string
  status: string
  runCount: number
  createdAt: Date
}

const TRIGGERS = [
  { id: 'ROAS_DROP', label: 'ROAS Drops Below', description: 'When ROAS falls below threshold' },
  { id: 'CPA_HIGH', label: 'CPA Exceeds', description: 'When cost per acquisition rises' },
  { id: 'BUDGET_LIMIT', label: 'Budget Limit Reached', description: 'When daily budget is exhausted' },
  { id: 'NO_CONVERSIONS', label: 'No Conversions', description: '24 hours without conversions' },
  { id: 'QUALITY_SCORE_DROP', label: 'Quality Score Drop', description: 'When ad quality decreases' }
]

const ACTIONS = [
  { id: 'NOTIFY_SLACK', label: 'Send Slack Alert', description: 'Notify team in Slack' },
  { id: 'PAUSE_CAMPAIGN', label: 'Pause Campaign', description: 'Automatically pause underperforming campaigns' },
  { id: 'ADJUST_BUDGET', label: 'Adjust Budget', description: 'Reduce daily budget by X%' },
  { id: 'EMAIL_ALERT', label: 'Email Alert', description: 'Send email notification' },
  { id: 'ESCALATE_REVIEW', label: 'Escalate for Review', description: 'Flag for manual review' }
]

export function AutomationBuilder() {
  const [automations, setAutomations] = useState<Automation[]>([])
  const [loading, setLoading] = useState(true)
  const [showBuilder, setShowBuilder] = useState(false)
  const [selectedTrigger, setSelectedTrigger] = useState<string>('')
  const [selectedAction, setSelectedAction] = useState<string>('')
  const [name, setName] = useState('')

  useEffect(() => {
    fetchAutomations()
  }, [])

  const fetchAutomations = async () => {
    try {
      setLoading(true)
      const data = await getAutomations()
      setAutomations(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch automations:', error)
      toast.error('Failed to load automations')
    } finally {
      setLoading(false)
    }
  }

  const handleDeploy = async () => {
    if (!name || !selectedTrigger || !selectedAction) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const result = await deployAutomation({
        name,
        trigger: selectedTrigger,
        action: selectedAction
      })

      if (result.success) {
        toast.success('Automation deployed')
        setName('')
        setSelectedTrigger('')
        setSelectedAction('')
        setShowBuilder(false)
        fetchAutomations()
      } else {
        toast.error(result.error || 'Failed to deploy automation')
      }
    } catch (error) {
      toast.error('Failed to deploy automation')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this automation?')) return

    try {
      const result = await deleteAutomation(id)
      if (result.success) {
        toast.success('Automation deleted')
        fetchAutomations()
      }
    } catch (error) {
      toast.error('Failed to delete automation')
    }
  }

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      const result = await toggleAutomation(id, !isActive)
      if (result.success) {
        toast.success(isActive ? 'Automation paused' : 'Automation activated')
        fetchAutomations()
      }
    } catch (error) {
      toast.error('Failed to toggle automation')
    }
  }

  const handleTest = async (id: string) => {
    try {
      const result = await testAutomation(id)
      if (result.success) {
        toast.success(`Test successful: ${result.impact}`)
      }
    } catch (error) {
      toast.error('Test failed')
    }
  }

  const handleClone = async (id: string) => {
    try {
      const result = await cloneAutomation(id)
      if (result.success) {
        toast.success('Automation cloned')
        fetchAutomations()
      }
    } catch (error) {
      toast.error('Failed to clone automation')
    }
  }

  if (loading) {
    return <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}</div>
  }

  return (
    <div className="space-y-6">
      {/* Builder */}
      {showBuilder && (
        <div className="p-6 border-2 border-blue-200 rounded-lg bg-blue-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Automation</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., Pause Low ROAS Campaigns"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Trigger</label>
              <div className="space-y-2">
                {TRIGGERS.map(trigger => (
                  <label key={trigger.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-white">
                    <input
                      type="radio"
                      name="trigger"
                      value={trigger.id}
                      checked={selectedTrigger === trigger.id}
                      onChange={e => setSelectedTrigger(e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{trigger.label}</p>
                      <p className="text-sm text-gray-600">{trigger.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Action</label>
              <div className="space-y-2">
                {ACTIONS.map(action => (
                  <label key={action.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-white">
                    <input
                      type="radio"
                      name="action"
                      value={action.id}
                      checked={selectedAction === action.id}
                      onChange={e => setSelectedAction(e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{action.label}</p>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleDeploy}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Deploy Automation
              </button>
              <button
                onClick={() => setShowBuilder(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Automations List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Active Automations</h3>
          <button
            onClick={() => setShowBuilder(!showBuilder)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            + New Automation
          </button>
        </div>

        {automations.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Zap className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-600">No automations yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {automations.map(automation => (
              <div key={automation.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-orange-500" />
                      <h4 className="font-semibold text-gray-900">{automation.name}</h4>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        automation.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {automation.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {TRIGGERS.find(t => t.id === automation.triggerType)?.label} →{' '}
                      {ACTIONS.find(a => a.id === automation.actionType)?.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Executed {automation.runCount} times</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTest(automation.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Test automation"
                    >
                      <Play className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleToggle(automation.id, automation.status === 'active')}
                      className={`px-3 py-1 text-sm rounded-lg font-medium transition ${
                        automation.status === 'active'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {automation.status === 'active' ? 'Pause' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleClone(automation.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Clone automation"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(automation.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Delete automation"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
