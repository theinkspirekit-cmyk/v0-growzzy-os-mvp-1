"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import {
  Zap,
  Plus,
  Play,
  Pause,
  Trash2,
  Clock,
  ChevronRight,
  Sparkles,
  Loader2,
  AlertTriangle,
  Settings2,
  Activity,
  ArrowRight,
  ShieldCheck,
  Search,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)

  // Creation state
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    triggerType: "ROAS_DROP",
    actionType: "PAUSE_CAMPAIGN",
    description: ""
  })

  useEffect(() => {
    fetchAutomations()
  }, [])

  const fetchAutomations = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/automations")
      const data = await res.json()
      if (data.success) setAutomations(data.automations)
    } catch (error) {
      toast.error("Execution bridge disconnected")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleStatus = async (id: string, current: boolean) => {
    toast.info("Updating protocol status...")
    try {
      const res = await fetch("/api/automations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !current })
      })
      if (res.ok) {
        setAutomations(prev => prev.map(a => a.id === id ? { ...a, isActive: !current } : a))
        toast.success(`Protocol ${!current ? 'ACTIVATED' : 'HIBERNATED'}`)
      }
    } catch (err) {
      toast.error("Handshake failure")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Defragment automation record?")) return
    try {
      const res = await fetch(`/api/automations?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        setAutomations(prev => prev.filter(a => a.id !== id))
        toast.success("Execution logic purged")
      }
    } catch (err) {
      toast.error("Purge failure")
    }
  }

  const handleCreate = async () => {
    if (!newAutomation.name) return toast.error("Logic label required")

    try {
      const res = await fetch("/api/automations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAutomation,
          trigger: { threshold: 1.5, window: "24h" },
          action: { notify: true }
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success("New orchestration logic deployed")
        setIsNewModalOpen(false)
        fetchAutomations()
      }
    } catch (err) {
      toast.error("Deployment failed")
    }
  }

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'ROAS_DROP': return <AlertTriangle className="w-4 h-4 text-rose-500" />
      case 'CPA_SPIKE': return <Activity className="w-4 h-4 text-amber-500" />
      default: return <Clock className="w-4 h-4 text-blue-500" />
    }
  }

  return (
    <DashboardLayout>
      <div className="p-8 lg:p-12 space-y-12 bg-white min-h-[calc(100vh-64px)] pb-24 font-satoshi">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#F1F5F9] pb-10 gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-[32px] font-bold text-[#05090E] tracking-tight">Logic Orchestration</h1>
            <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-[0.2em]">Autonomous Rule Engine v4.0</p>
          </div>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="enterprise-button h-12 px-10 flex items-center gap-2.5 bg-[#1F57F5] shadow-lg shadow-[#1F57F5]/20"
          >
            <Plus className="w-5 h-5" />
            Deploy Protocol
          </button>
        </div>

        {/* Categories Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Budget Protocols', count: 12, impact: '+$1.2k save', icon: ShieldCheck, color: '#1F57F5' },
            { label: 'Growth Loops', count: 4, impact: '+8% ROAS', icon: Zap, color: '#00DDFF' },
            { label: 'Audit Alerts', count: 2, impact: '100% Uptime', icon: Activity, color: '#2BAFF2' },
            { label: 'Scheduled Tasks', count: 8, impact: 'No Latency', icon: Clock, color: '#64748B' },
          ].map(cat => (
            <div key={cat.label} className="bg-white p-8 rounded-[2rem] border-2 border-[#F1F5F9] hover:border-[#1F57F5] transition-all duration-300 group shadow-sm hover:shadow-xl">
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-start">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all", "bg-[#F8FAFC]")} style={{ color: cat.color }}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-[#05090E] tracking-tight">{cat.impact}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[16px] font-bold text-[#05090E]">{cat.label}</p>
                  <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">{cat.count} Units Online</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Filter */}
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-6">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              {["ALL", "ACTIVE", "INACTIVE", "ERROR"].map(f => (
                <button
                  key={f}
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-wider px-5 py-2 rounded-lg transition-all",
                    f === "ALL" ? "bg-[#05090E] text-white" : "text-[#64748B] hover:text-[#05090E] hover:bg-[#F8FAFC]"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#A3A3A3]" />
            <input
              type="text"
              placeholder="Filter logic tree..."
              className="h-11 pl-12 pr-6 border-[#F1F5F9] bg-[#F8FAFC] text-[13px] rounded-xl w-80 focus:ring-[#1F57F5]/20 focus:border-[#1F57F5] transition-all outline-none"
            />
          </div>
        </div>

        {/* Automation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {isLoading ? (
            <div className="col-span-2 h-64 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#1F57F5] opacity-20" />
              <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Synchronizing Logic Units...</p>
            </div>
          ) : automations.map((a) => (
            <div key={a.id} className="bg-white p-10 rounded-[2.5rem] border-2 border-[#F1F5F9] hover:border-[#1F57F5] transition-all duration-300 shadow-sm hover:shadow-2xl group overflow-hidden">
              <div className="flex items-start justify-between mb-10">
                <div className="space-y-1.5 text-left">
                  <h3 className="text-[20px] font-bold text-[#05090E] group-hover:text-[#1F57F5] transition-colors">{a.name}</h3>
                  <p className="text-[14px] text-[#64748B] font-medium leading-relaxed max-w-sm">{a.description || 'Execution path for real-time campaign optimization.'}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-3 h-3 rounded-full ring-4",
                    a.isActive ? 'bg-[#00DDFF] ring-[#00DDFF]/10 animate-pulse' : 'bg-[#D1D5DB] ring-[#D1D5DB]/10'
                  )} />
                  <button
                    onClick={() => toggleStatus(a.id, a.isActive)}
                    className={cn(
                      "p-3 rounded-xl transition-all active:scale-95",
                      a.isActive ? 'bg-[#1F57F5] text-white hover:bg-[#1A4AD1]' : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E5E7EB]'
                    )}
                  >
                    {a.isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-12 mb-10 p-6 bg-[#F8FAFC] rounded-3xl border border-[#F1F5F9]">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    {getTriggerIcon(a.triggerType)}
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.1em]">Signal</span>
                  </div>
                  <p className="text-[15px] font-bold text-[#05090E]">{a.triggerType.replace('_', ' ')}</p>
                </div>
                <div className="h-12 w-12 rounded-full border border-[#F1F5F9] flex items-center justify-center bg-white">
                  <ArrowRight className="w-5 h-5 text-[#A3A3A3]" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#FFB800]" />
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.1em]">Protocol</span>
                  </div>
                  <p className="text-[15px] font-bold text-[#05090E]">{a.actionType.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-[#F1F5F9]">
                <div className="flex items-center gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-wider">Last Fired</p>
                    <p className="text-[13px] font-bold text-[#05090E]">{a.lastRun ? new Date(a.lastRun).toLocaleTimeString() : 'Never'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-wider">Executions</p>
                    <p className="text-[13px] font-bold text-[#05090E]">{a.runCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-3 text-[#A3A3A3] hover:text-[#05090E] hover:bg-[#F8FAFC] rounded-xl transition-all">
                    <Settings2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(a.id)} className="p-3 text-[#A3A3A3] hover:text-[#F43F5E] hover:bg-[#F43F5E]/5 rounded-xl transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Log Snapshot Overlay */}
              {a.logs && a.logs.length > 0 && (
                <div className="mt-8 pt-8 border-t border-[#F1F5F9] space-y-3">
                  <h4 className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.2em] mb-4">Transmission Logs</h4>
                  {a.logs.slice(0, 2).map((log: any) => (
                    <div key={log.id} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-2xl border border-[#F1F5F9] text-[12px]">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-1.5 h-1.5 rounded-full", log.success ? 'bg-[#00DDFF]' : 'bg-[#F43F5E]')} />
                        <span className="text-[#64748B] font-bold uppercase tracking-tighter">{new Date(log.runTime).toLocaleTimeString()}</span>
                        <span className="text-[#05090E] font-bold uppercase">{log.actionTaken}</span>
                      </div>
                      <span className="text-[#00DDFF] font-bold">{log.impact || 'EXECUTED'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Create Modal */}
        {isNewModalOpen && (
          <div className="fixed inset-0 z-[100] bg-[#05090E]/80 backdrop-blur-xl flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border border-white/20">
              <div className="p-10 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]/50">
                <div className="text-left space-y-1">
                  <h3 className="text-[18px] font-bold text-[#05090E]">Protocol Definition</h3>
                  <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-widest">Autonomous Rule Creation</p>
                </div>
                <button onClick={() => setIsNewModalOpen(false)} className="p-3 hover:bg-white rounded-2xl text-[#64748B] shadow-sm transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-12 space-y-10">
                <div className="space-y-8 text-left">
                  <div className="space-y-3">
                    <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.15em]">Logic Identifier</label>
                    <input
                      type="text"
                      placeholder="e.g. ROAS EMERGENCY BRAKE"
                      className="w-full h-14 px-6 border-2 border-[#F1F5F9] bg-[#F8FAFC] text-[15px] font-bold rounded-2xl focus:border-[#1F57F5] outline-none transition-all placeholder:text-[#A3A3A3]"
                      value={newAutomation.name}
                      onChange={e => setNewAutomation({ ...newAutomation, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3 text-left">
                      <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.15em]">Trigger Signal</label>
                      <select
                        className="w-full h-14 px-6 border-2 border-[#F1F5F9] bg-[#F8FAFC] text-[14px] font-bold rounded-2xl focus:border-[#1F57F5] outline-none transition-all appearance-none cursor-pointer"
                        value={newAutomation.triggerType}
                        onChange={e => setNewAutomation({ ...newAutomation, triggerType: e.target.value })}
                      >
                        <option value="ROAS_DROP">IF ROAS DROPS BELOW 1.5X</option>
                        <option value="CPA_SPIKE">IF CPA SPIKES ABOVE $50</option>
                        <option value="BUDGET_EXHAUST">IF BUDGET &gt; 90% EXPENDED</option>
                        <option value="CTR_LOW">IF CTR &lt; 0.5% DETECTED</option>
                      </select>
                    </div>
                    <div className="space-y-3 text-left">
                      <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.15em]">Execution Path</label>
                      <select
                        className="w-full h-14 px-6 border-2 border-[#F1F5F9] bg-[#F8FAFC] text-[14px] font-bold rounded-2xl focus:border-[#1F57F5] outline-none transition-all appearance-none cursor-pointer"
                        value={newAutomation.actionType}
                        onChange={e => setNewAutomation({ ...newAutomation, actionType: e.target.value })}
                      >
                        <option value="PAUSE_CAMPAIGN">SUSPEND AFFECTED NODES</option>
                        <option value="INCREASE_BUDGET">ALLOCATE ADDITIONAL CAPITAL</option>
                        <option value="NOTIFY_SLACK">TRANSMIT PRIORITY ALERTS</option>
                        <option value="GENERATE_REPORT">SYNTHESIZE DIAGNOSTIC LOGS</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.15em]">Operational Context</label>
                    <textarea
                      placeholder="Explain the logic intent for system oversight..."
                      className="w-full min-h-[140px] p-6 border-2 border-[#F1F5F9] bg-[#F8FAFC] text-[15px] font-medium rounded-2xl focus:border-[#1F57F5] outline-none transition-all resize-none placeholder:text-[#A3A3A3]"
                      value={newAutomation.description}
                      onChange={e => setNewAutomation({ ...newAutomation, description: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  onClick={handleCreate}
                  className="w-full h-16 bg-[#1F57F5] text-white text-[14px] font-bold uppercase tracking-[0.25em] rounded-2xl hover:bg-[#1A4AD1] transition-all shadow-xl shadow-[#1F57F5]/30 active:scale-[0.98]"
                >
                  Deploy Orchestration
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>

  )
}

