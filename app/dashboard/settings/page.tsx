"use client"

import { useState } from "react"
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
    <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto h-full">
      {/* Settings Navigation Sidebar */}
      <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
        <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
          Settings <ChevronRight className="w-5 h-5 text-neutral-400" /> <span className="text-neutral-400 font-normal">General</span>
        </h1>

        {SETTINGS_TABS.map((group) => (
          <div key={group.category}>
            <h3 className="text-xs font-semibold text-neutral-400 mb-3 tracking-wider pl-3 uppercase">{group.category}</h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${activeTab === item.id
                      ? "bg-neutral-100 text-neutral-900"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                    }
                  `}
                >
                  <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-neutral-900" : "text-neutral-400"}`} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 max-w-3xl pt-2">
        <h2 className="text-xl font-semibold text-neutral-900 mb-8 border-b border-neutral-100 pb-4">General Settings</h2>

        <div className="space-y-10">

          {/* Notifications Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-neutral-900">My Notifications</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">About notifications?</button>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-neutral-900">Notify me when...</h4>
                {[
                  { id: "dailyUpdate", label: "Daily productivity update" },
                  { id: "newEvent", label: "New event created" },
                  { id: "newTeam", label: "When added on new team" },
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => toggle(item.id as any)}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${notifications[item.id as keyof typeof notifications]
                          ? "bg-blue-600 border-blue-600"
                          : "bg-white border-neutral-300 group-hover:border-neutral-400"
                        }`}>
                      {notifications[item.id as keyof typeof notifications] && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">{item.label}</span>
                  </label>
                ))}
              </div>

              <div className="space-y-6 border-t border-neutral-100 pt-6">
                {[
                  { id: "mobile", label: "Mobile push notifications", desc: "Receive push notification whenever your organisation requires your attentions", icon: Smartphone },
                  { id: "desktop", label: "Desktop Notification", desc: "Receive desktop notification whenever your organisation requires your attentions", icon: Bell },
                  { id: "email", label: "Email Notification", desc: "Receive email whenever your organisation requires your attentions", icon: Mail },
                ].map((toggleItem) => (
                  <div key={toggleItem.id} className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900 mb-1">{toggleItem.label}</h4>
                      <p className="text-xs text-neutral-500 max-w-md leading-relaxed">{toggleItem.desc}</p>
                    </div>
                    <button
                      onClick={() => toggle(toggleItem.id as any)}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${notifications[toggleItem.id as keyof typeof notifications] ? "bg-blue-600" : "bg-neutral-200"
                        }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${notifications[toggleItem.id as keyof typeof notifications] ? "translate-x-5" : "translate-x-0"
                        }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Connected Apps / Preferences */}
          <section className="border-t border-neutral-100 pt-10">
            <h3 className="text-lg font-medium text-neutral-900 mb-6">My Settings</h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-neutral-900">Appearance</h4>
                  <p className="text-xs text-neutral-500">Customize how your theme looks on your device.</p>
                </div>
                <select className="bg-neutral-50 border border-neutral-200 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-neutral-300 transition-all text-neutral-600">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="max-w-md">
                  <h4 className="text-sm font-medium text-neutral-900">Two-factor authentication</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed mt-1">Keep your account secure by enabling 2FA via SMS or using a temporary one-time passcode (TOTP).</p>
                </div>
                <button
                  onClick={() => toggle("twoFactor")}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 flex-shrink-0 ${notifications.twoFactor ? "bg-blue-600" : "bg-neutral-200"
                    }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${notifications.twoFactor ? "translate-x-5" : "translate-x-0"
                    }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-neutral-900">Language</h4>
                  <p className="text-xs text-neutral-500">Select language of the dashboard.</p>
                </div>
                <select className="bg-neutral-50 border border-neutral-200 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-neutral-300 transition-all text-neutral-600 min-w-[100px]">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
