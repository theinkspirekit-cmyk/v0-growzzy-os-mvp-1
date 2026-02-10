"use client"

import DashboardLayout from "@/components/dashboard-layout"
import {
  Zap,
  Play,
  Pause,
  AlertTriangle,
  Plus,
  ArrowRight,
  Settings,
} from "lucide-react"

const AUTOMATIONS = [
  { id: 1, name: "Pause low ROAS campaigns", trigger: "ROAS < 1.0", action: "Pause Campaign", status: "Active" },
  { id: 2, name: "Increase budget for high performers", trigger: "ROAS > 4.0", action: "Increase Budget 20%", status: "Active" },
  { id: 3, name: "Flag high CPA ads", trigger: "CPA > $50", action: "Send Alert", status: "Inactive" },
]

export default function AutomationsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Automations</h2>
            <p className="text-sm text-neutral-500 mt-0.5">Set it and forget it rules</p>
          </div>
          <button className="flex items-center gap-2 text-sm text-white bg-neutral-900 px-4 py-2 rounded-lg hover:bg-neutral-800">
            <Plus className="w-4 h-4" />
            New Rule
          </button>
        </div>

        <div className="space-y-4">
          {AUTOMATIONS.map((auto) => (
            <div key={auto.id} className="bg-white rounded-xl border border-neutral-200 p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${auto.status === "Active" ? "bg-emerald-100 text-emerald-600" : "bg-neutral-100 text-neutral-400"}`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{auto.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                    <span className="bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">{auto.trigger}</span>
                    <ArrowRight className="w-3 h-3 text-neutral-300" />
                    <span className="bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">{auto.action}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${auto.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"}`}>{auto.status}</span>
                <button className="p-2 hover:bg-neutral-50 rounded-lg text-neutral-400 hover:text-neutral-900 transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
