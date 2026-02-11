"use client"

import { useState } from "react"
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
} from "lucide-react"

const SETTINGS_TABS = [
  {
    category: "ACCOUNT",
    items: [
      { id: "profile", label: "My Profile", icon: User },
      { id: "general", label: "General", icon: Settings },
      { id: "preferences", label: "Preferences", icon: Layers },
      { id: "applications", label: "Applications", icon: Zap },
    ],
  },
  {
    category: "WORKSPACE",
    items: [
      { id: "workspace-settings", label: "Settings", icon: Settings },
      { id: "members", label: "Members", icon: User },
      { id: "upgrade", label: "Upgrade", icon: Zap },
      { id: "security", label: "Security", icon: Shield },
      { id: "billing", label: "Billing", icon: CreditCard },
    ],
  },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [notifications, setNotifications] = useState({
    dailyUpdate: true,
    newEvent: true,
    newTeam: true,
    mobile: true,
    desktop: true,
    email: false,
    twoFactor: true,
  })

  const toggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto h-full p-6 lg:p-8">
        {/* Settings Navigation Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
              Settings
            </h1>
            <p className="text-sm text-neutral-500 mt-1">Manage your account & team</p>
          </div>

          <div className="space-y-6">
            {SETTINGS_TABS.map((group) => (
              <div key={group.category}>
                <h3 className="text-[10px] font-black text-neutral-400 mb-3 tracking-[0.15em] pl-3 uppercase">{group.category}</h3>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300
                        ${activeTab === item.id
                          ? "bg-neutral-900 text-white shadow-lg shadow-neutral-200"
                          : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                        }
                      `}
                    >
                      <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-white" : "text-neutral-400"}`} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 max-w-3xl pt-2">
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-neutral-100">
              <h2 className="text-xl font-bold text-neutral-900 Capitalize">{activeTab} Settings</h2>
              <div className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                System Active
              </div>
            </div>

            <div className="space-y-12">

              {/* Notifications Section */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">Communication</h3>
                    <p className="text-xs text-neutral-500 mt-1">Configure how we talk to you</p>
                  </div>
                  <button className="text-xs text-neutral-900 hover:underline font-bold transition-colors">Help Center</button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-neutral-700">Event Alerts</h4>
                    {[
                      { id: "dailyUpdate", label: "Daily performance digest" },
                      { id: "newEvent", label: "New campaign milestone reached" },
                      { id: "newTeam", label: "Collaborator invitations" },
                    ].map((item) => (
                      <label key={item.id} className="flex items-center gap-3 cursor-pointer group p-3 bg-neutral-50 rounded-xl border border-neutral-100/50 hover:border-neutral-200 transition-all">
                        <div
                          onClick={() => toggle(item.id as any)}
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${notifications[item.id as keyof typeof notifications]
                            ? "bg-neutral-900 border-neutral-900 shadow-md shadow-neutral-200"
                            : "bg-white border-neutral-300 group-hover:border-neutral-400"
                            }`}>
                          {notifications[item.id as keyof typeof notifications] && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900 transition-colors">{item.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="space-y-6 border-t border-neutral-100 pt-8 mt-8">
                    <h4 className="text-sm font-bold text-neutral-700 mb-2">Delivery Channels</h4>
                    {[
                      { id: "mobile", label: "Push Notifications", desc: "For critical real-time performance alerts", icon: Smartphone },
                      { id: "desktop", label: "Browser Notifications", desc: "Receive updates while you work", icon: Bell },
                      { id: "email", label: "Email Reports", desc: "Weekly summaries and billing invoices", icon: Mail },
                    ].map((toggleItem) => (
                      <div key={toggleItem.id} className="flex items-start justify-between p-4 bg-white border border-neutral-100 rounded-2xl hover:shadow-md transition-all duration-300">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-400">
                            <toggleItem.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-neutral-900">{toggleItem.label}</h4>
                            <p className="text-xs text-neutral-500 max-w-sm leading-relaxed mt-0.5">{toggleItem.desc}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggle(toggleItem.id as any)}
                          className={`w-12 h-6.5 rounded-full transition-all relative flex items-center px-1 ${notifications[toggleItem.id as keyof typeof notifications] ? "bg-neutral-900" : "bg-neutral-200"
                            }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white shadow-xl transition-transform ${notifications[toggleItem.id as keyof typeof notifications] ? "translate-x-5.5" : "translate-x-0"
                            }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Preferences Section */}
              <section className="border-t border-neutral-100 pt-10">
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-neutral-900">Experience</h3>
                  <p className="text-xs text-neutral-500 mt-1">Tailor the OS to your workspace</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <h4 className="text-sm font-bold text-neutral-900 mb-1">Appearance</h4>
                    <p className="text-xs text-neutral-500 mb-4">Choose your visual theme</p>
                    <div className="flex p-1 bg-white border border-neutral-200 rounded-xl">
                      {["Light", "Dark", "Auto"].map(theme => (
                        <button key={theme} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${theme === "Light" ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-900"}`}>{theme}</button>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <h4 className="text-sm font-bold text-neutral-900 mb-1">Language</h4>
                    <p className="text-xs text-neutral-500 mb-4">Dashboard localization</p>
                    <select className="w-full bg-white border border-neutral-200 text-xs font-bold rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-neutral-200 transition-all text-neutral-900">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>Hindi</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 p-5 bg-white border border-neutral-100 rounded-2xl flex items-center justify-between">
                    <div className="max-w-md flex items-center gap-4">
                      <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center text-white">
                        <Shield className="w-6 h-6 outline-none" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900">Secure Account (2FA)</h4>
                        <p className="text-xs text-neutral-500 leading-relaxed mt-0.5">Biometric or SMS based two-factor authentication.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggle("twoFactor")}
                      className={`w-12 h-6.5 rounded-full transition-all relative flex items-center px-1 flex-shrink-0 ${notifications.twoFactor ? "bg-neutral-900" : "bg-neutral-200"
                        }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-xl transition-transform ${notifications.twoFactor ? "translate-x-5.5" : "translate-x-0"
                        }`} />
                    </button>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
