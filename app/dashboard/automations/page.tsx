"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import {
  Zap,
  Plus,
  Play,
  RotateCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Settings2,
  X,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
// Actions
import { getAutomations, deployAutomation, toggleAutomation, deleteAutomation, testAutomation } from "@/app/actions/automations"

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false)

  // Deploy Form
  const [newAuto, setNewAuto] = useState({
    name: "",
    trigger: "ROAS_DROP",
    action: "NOTIFY_SLACK",
    threshold: "1.5"
  })
  const [isDeploying, setIsDeploying] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      const data = await getAutomations()
      setAutomations(data || [])
    } catch {
      toast.error("Failed to load automation matrix")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeploy = async () => {
    if (!newAuto.name) return toast.error("Name required")
    setIsDeploying(true)
    try {
      const res = await deployAutomation(newAuto)
      if (res.success) {
        toast.success("Automation Deployed to Grid")
        setIsDeployModalOpen(false)
        setNewAuto({ name: "", trigger: "ROAS_DROP", action: "NOTIFY_SLACK", threshold: "1.5" })
        load()
      } else {
        toast.error(res.error)
      }
    } catch {
      toast.error("Deployment Error")
    } finally {
      setIsDeploying(false)
    }
  }

  const handleTest = async () => {
    const toastId = toast.loading("Running Simulation...")
    try {
      const res = await testAutomation("mock-id")
      if (res.success) {
        setTestResult(res.impact)
        toast.success("Simulation Complete", { id: toastId })
      }
    } catch {
      toast.error("Simulation Failed", { id: toastId })
    }
  }

  const handleToggle = async (id: string, current: boolean) => {
    // Optimistic
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, isActive: !current } : a))
    try {
      await toggleAutomation(id, current)
      toast.success(current ? "Automation Paused" : "Automation Activated")
    } catch {
      toast.error("State change failed")
      load()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this automation node?")) return
    setAutomations(prev => prev.filter(a => a.id !== id))
    await deleteAutomation(id)
    toast.success("Node Terminated")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 font-satoshi">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-[24px] font-bold text-[#1F2937] tracking-tight">Automation Grid</h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <p className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider">Autonomous Optimization Layer</p>
            </div>
          </div>
          <button onClick={() => setIsDeployModalOpen(true)} className="btn-primary h-9 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Deploy Node
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Nodes", value: automations.filter(a => a.isActive).length, icon: Zap, color: "#F59E0B" },
            { label: "Executions (24h)", value: "1,240", icon: Play, color: "#10B981" },
            { label: "Optimization Value", value: "$4,250", icon: TrendingUp, color: "#1F57F5" }, // TrendingUp needs import
            { label: "Uptime", value: "99.99%", icon: CheckCircle2, color: "#64748B" },
          ].map((s, i) => (
            <div key={i} className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-sm flex flex-col justify-between h-24">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">{s.label}</span>
                <s.icon className="w-4 h-4 text-[#94A3B8]" />
              </div>
              <p className="text-[20px] font-bold text-[#1F2937] tracking-tight" style={{ color: s.color === '#1F57F5' ? '#1F2937' : undefined }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Main List */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
          ) : (
            <div className="divide-y divide-[#F1F5F9]">
              {automations.map(auto => (
                <div key={auto.id} className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-[#F9FAFB] transition-colors group">
                  {/* Left: Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                      auto.isActive ? "bg-amber-50 text-amber-600" : "bg-gray-100 text-gray-400"
                    )}>
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-bold text-[#1F2937]">{auto.name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-[11px] font-medium text-[#64748B]">
                        <span className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200 uppercase">{auto.triggerType}</span>
                        <span>→</span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200 uppercase">{auto.actionType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Stats */}
                  <div className="flex items-center gap-8 text-[12px] text-[#64748B] hidden md:flex">
                    <div className="text-center">
                      <p className="font-bold text-[#1F2937]">{auto.runCount}</p>
                      <p className="text-[10px] uppercase">Runs</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-[#1F2937]">{auto.lastRun ? new Date(auto.lastRun).toLocaleDateString() : '-'}</p>
                      <p className="text-[10px] uppercase">Last Run</p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 mr-4">
                      <span className={cn("text-[11px] font-bold uppercase", auto.isActive ? "text-emerald-600" : "text-gray-400")}>
                        {auto.isActive ? "Active" : "Paused"}
                      </span>
                      <button
                        onClick={() => handleToggle(auto.id, auto.isActive)}
                        className={cn(
                          "w-9 h-5 rounded-full relative transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F57F5]",
                          auto.isActive ? "bg-[#10B981]" : "bg-gray-200"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200",
                            auto.isActive ? "translate-x-4" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                    <button onClick={() => handleDelete(auto.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Deploy Modal */}
        {isDeployModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg border border-[#E2E8F0]">
              <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
                <div>
                  <h3 className="text-[15px] font-bold text-[#1F2937]">Deploy Automation Node</h3>
                  <p className="text-[11px] text-[#64748B] uppercase tracking-wide">Logic: IF [Trigger] THEN [Action]</p>
                </div>
                <button onClick={() => setIsDeployModalOpen(false)}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
              </div>
              <div className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label>Node Name *</label>
                  <input
                    type="text"
                    className="input-field h-10"
                    placeholder="e.g. Budget Protection Protocol"
                    value={newAuto.name}
                    onChange={e => setNewAuto({ ...newAuto, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label>Trigger Condition</label>
                    <select className="input-field h-10" value={newAuto.trigger} onChange={e => setNewAuto({ ...newAuto, trigger: e.target.value })}>
                      <option value="ROAS_DROP">ROAS Drops Below Target</option>
                      <option value="CPA_SPIKE">CPA Spikes &gt; 20%</option>
                      <option value="SPEND_CAP">Spend Reaches Cap</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label>Threshold Value</label>
                    <input
                      type="text"
                      className="input-field h-10"
                      placeholder="e.g. 1.5"
                      value={newAuto.threshold}
                      onChange={e => setNewAuto({ ...newAuto, threshold: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label>Execute Action</label>
                  <select className="input-field h-10" value={newAuto.action} onChange={e => setNewAuto({ ...newAuto, action: e.target.value })}>
                    <option value="NOTIFY_SLACK">Notify Slack Channel</option>
                    <option value="PAUSE_CAMPAIGN">Pause Campaign Immediately</option>
                    <option value="DECREASE_BUDGET">Decrease Budget by 20%</option>
                  </select>
                </div>

                {/* Test Run Box */}
                <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase text-[#64748B]">Simulation Engine</span>
                    <button onClick={handleTest} className="text-[10px] font-bold text-[#1F57F5] hover:underline flex items-center gap-1">
                      <Play className="w-3 h-3" /> Run Dry Test
                    </button>
                  </div>
                  {testResult ? (
                    <p className="text-[11px] font-medium text-[#10B981]">{testResult}</p>
                  ) : (
                    <p className="text-[11px] text-gray-400 italic">Run a test to see projected impact...</p>
                  )}
                </div>

                <div className="pt-2">
                  <button onClick={handleDeploy} disabled={isDeploying} className="btn-primary w-full h-10 justify-center">
                    {isDeploying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Deploy to Main Grid"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
import { TrendingUp as TrendingUpIcon } from "lucide-react"

// Fix hidden name conflict
const TrendingUp = TrendingUpIcon
