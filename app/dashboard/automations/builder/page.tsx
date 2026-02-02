'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Edit2 } from 'lucide-react'

export default function AutomationBuilder() {
  const [rules, setRules] = useState([])
  const [newRule, setNewRule] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automations</h1>
          <p className="text-slate-500 mt-2">Create rules to automate campaign management</p>
        </div>
        <Button onClick={() => setNewRule(!newRule)}>
          <Plus className="w-4 h-4 mr-2" />
          New Rule
        </Button>
      </div>

      {newRule && (
        <Card className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rule Name</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. Scale High ROAS" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Trigger</label>
            <select className="w-full px-3 py-2 border rounded-lg">
              <option>When ROAS exceeds</option>
              <option>When CPA increases</option>
              <option>When impressions drop</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Action</label>
            <select className="w-full px-3 py-2 border rounded-lg">
              <option>Increase budget by %</option>
              <option>Pause campaign</option>
              <option>Send alert</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">Save Rule</Button>
            <Button variant="outline" className="flex-1" onClick={() => setNewRule(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {rules.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-slate-500">No automation rules yet. Create one to get started!</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {rules.map((rule: any) => (
            <Card key={rule.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{rule.name}</p>
                <p className="text-sm text-slate-500">{rule.trigger}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
