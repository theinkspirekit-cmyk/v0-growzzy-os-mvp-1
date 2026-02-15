"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import {
  User,
  Bell,
  Lock,
  CreditCard,
  Building,
  Globe,
  Settings,
  Shield,
  Layers,
  ChevronRight,
  Check,
  Smartphone,
  Mail,
  Zap,
  Facebook,
  Linkedin,
  Plus,
  Loader2,
  Trash2,
  ShieldCheck,
  Activity,
  Command,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const SETTINGS_TABS = [
  {
    category: "ACCOUNT",
    items: [
      { id: "profile", label: "My Profile", icon: User },
      { id: "general", label: "General", icon: Settings },
      { id: "applications", label: "Platform Bridges", icon: Globe },
    ],
  },
  {
    category: "WORKSPACE",
    items: [
      { id: "members", label: "Team Members", icon: User },
      { id: "billing", label: "Billing & Plans", icon: CreditCard },
      { id: "security", label: "Security Hub", icon: Shield },
    ],
  },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("applications")
  const [platforms, setPlatforms] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchPlatforms = async () => {
    try {
      const res = await fetch("/api/platforms")
      const data = await res.json()
      if (data.success) setPlatforms(data.platforms)
    } catch (e) {
      toast.error("Failed to load platform connections")
    }
  }

  useEffect(() => {
    if (activeTab === "applications") fetchPlatforms()
  }, [activeTab])

  const connectPlatform = async (name: string) => {
    setIsLoading(true)
    toast.loading(`Connecting to ${name}...`)

    setTimeout(async () => {
      try {
        const res = await fetch("/api/platforms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            accountName: `${name} Account`,
            accessToken: "fake-token",
            refreshToken: "fake-refresh"
          })
        })
        if (res.ok) {
          toast.dismiss()
          toast.success(`Connected to ${name}`)
          fetchPlatforms()
        }
      } finally {
        setIsLoading(false)
      }
    }, 1500)
  }

  const disconnectPlatform = async (id: string) => {
    if (!confirm("Are you sure you want to disconnect this platform?")) return
    try {
      await fetch(`/api/platforms?id=${id}`, { method: 'DELETE' })
      setPlatforms(prev => prev.filter(p => p.id !== id))
      toast.success("Platform disconnected")
    } catch (e) {
      toast.error("Failed to disconnect")
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "applications":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Available Integrations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Google Ads', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50', desc: 'Search & Display Network' },
                  { name: 'Meta Ads', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Facebook & Instagram' },
                  { name: 'LinkedIn Ads', icon: Linkedin, color: 'text-blue-700', bg: 'bg-blue-50', desc: 'Professional Network' },
                ].map(p => {
                  const isConnected = platforms.some(ep => ep.name.toLowerCase().includes(p.name.toLowerCase().split(' ')[0].toLowerCase()))
                  return (
                    <div key={p.name} className="flex flex-col p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-white">
                      <div className="flex items-start justify-between mb-4">
                        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", p.bg, p.color)}>
                          <p.icon className="w-6 h-6" />
                        </div>
                        {isConnected && <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase rounded-full flex items-center gap-1"><Check className="w-3 h-3" /> Active</div>}
                      </div>
                      <h4 className="font-bold text-gray-900">{p.name}</h4>
                      <p className="text-xs text-gray-500 mb-6">{p.desc}</p>

                      <button
                        disabled={isLoading || isConnected}
                        onClick={() => connectPlatform(p.name)}
                        className={cn(
                          "mt-auto w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors",
                          isConnected
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-900 text-white hover:bg-gray-800"
                        )}
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : isConnected ? "Connected" : "Connect"}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Active Connections</h3>
              <div className="space-y-4">
                {platforms.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                    <Layers className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No active platform connections found.</p>
                  </div>
                ) : (
                  platforms.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 shadow-sm">
                          <Zap className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{p.accountName || p.name}</p>
                          <p className="text-xs text-gray-500 font-mono">ID: {p.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                      <button
                        onClick={() => disconnectPlatform(p.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )
      case "profile":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>
              <div className="flex items-start gap-8">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-2xl font-bold border-4 border-white shadow-sm shrink-0">
                  MR
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                    <input type="text" defaultValue="Max Reynolds" className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                    <input type="email" defaultValue="max@growzzy.global" className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none transition-colors" />
                  </div>
                  <div className="col-span-2">
                    <button className="h-10 px-6 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400">
            <Settings className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm">This section is currently under development.</p>
          </div>
        )
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto font-satoshi pb-20">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500">Manage your workspace preferences and integrations.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-1">
            {SETTINGS_TABS.map((group) => (
              <div key={group.category} className="mb-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">{group.category}</h3>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        activeTab === item.id
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-blue-600" : "text-gray-400")} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
