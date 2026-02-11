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
  const [activeTab, setActiveTab] = useState("profile")
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

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <section className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-neutral-900 rounded-md flex items-center justify-center text-white text-2xl font-bold">
                  SK
                </div>
                <div className="space-y-2">
                  <button className="enterprise-button text-xs py-1.5 h-auto">Change Avatar</button>
                  <p className="text-[11px] text-neutral-500 uppercase font-bold tracking-tight">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Full Name</label>
                  <input type="text" defaultValue="Srikrishna" className="enterprise-input text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Public Email</label>
                  <input type="email" defaultValue="admin@growzzy.os" className="enterprise-input text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Bio</label>
                <textarea className="enterprise-input text-sm h-24 resize-none" placeholder="Add a short bio..." />
              </div>
            </section>
            <div className="pt-6 border-t border-neutral-100 flex justify-end">
              <button className="enterprise-button">Save Changes</button>
            </div>
          </div>
        );
      case "billing":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="enterprise-card p-6 border-l-4 border-l-black">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold uppercase tracking-tight">Current Plan: Pro Enterprise</h3>
                  <p className="text-xs text-neutral-500">Your next billing date is March 1st, 2024</p>
                </div>
                <div className="text-xl font-bold">$129.00/mo</div>
              </div>
            </div>
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Payment Methods</h3>
              <div className="enterprise-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5" />
                  <div>
                    <p className="text-sm font-bold">Visa ending in 4242</p>
                    <p className="text-xs text-neutral-500">Expires 12/26</p>
                  </div>
                </div>
                <button className="text-xs font-bold hover:underline">Edit</button>
              </div>
            </section>
          </div>
        );
      case "members":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center bg-neutral-50 p-4 rounded-md border border-neutral-100">
              <p className="text-xs text-neutral-600">You have 4 vacant seats in your current plan.</p>
              <button className="enterprise-button text-xs py-1.5 h-auto">Invite Member</button>
            </div>
            <div className="space-y-1">
              {[
                { name: "Srikrishna", email: "admin@growzzy.os", role: "Owner" },
                { name: "Sarah Chen", email: "sarah@techcorp.com", role: "Manager" },
              ].map((member, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b border-neutral-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-neutral-100 rounded-md flex items-center justify-center text-[10px] font-bold">
                      {member.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{member.name}</p>
                      <p className="text-xs text-neutral-500">{member.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase py-1 px-2 bg-neutral-50 border border-neutral-200 rounded-md">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case "general":
      default:
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <section className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-tight">Organization Name</h3>
                <p className="text-xs text-neutral-500">This will be shown on reports and billing.</p>
              </div>
              <input type="text" defaultValue="Growzzy Inc" className="enterprise-input text-sm" />
            </section>

            <section className="space-y-6 border-t border-neutral-100 pt-8">
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-tight">Notification Channels</h3>
                <p className="text-xs text-neutral-500">How would you like to receive activity alerts?</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: "mobile", label: "Push Notifications", icon: Smartphone },
                  { id: "desktop", label: "Browser Notifications", icon: Bell },
                  { id: "email", label: "Email Summaries", icon: Mail },
                ].map((item) => (
                  <div key={item.id} className="enterprise-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-neutral-50 rounded-md flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-neutral-400" />
                      </div>
                      <span className="text-sm font-semibold">{item.label}</span>
                    </div>
                    <button
                      onClick={() => toggle(item.id as any)}
                      className={`w-9 h-5 rounded-full transition-all relative flex items-center px-1 ${notifications[item.id as keyof typeof notifications] ? "bg-black" : "bg-neutral-200"}`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${notifications[item.id as keyof typeof notifications] ? "translate-x-4" : "translate-x-0"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto h-full p-8 lg:p-12 gap-16 bg-white min-h-[calc(100vh-64px)] overflow-y-auto">
        {/* Settings Navigation */}
        <div className="w-full lg:w-56 flex-shrink-0 space-y-10">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Settings</h1>
            <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Workspace Management</p>
          </div>

          <nav className="space-y-8">
            {SETTINGS_TABS.map((group) => (
              <div key={group.category} className="space-y-2">
                <h3 className="text-[10px] font-bold text-neutral-400 pl-3 tracking-widest uppercase">{group.category}</h3>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all
                        ${activeTab === item.id
                          ? "bg-neutral-900 text-white shadow-sm"
                          : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                        }
                      `}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 max-w-2xl">
          <div className="space-y-8">
            <div className="pb-8 border-b border-neutral-100 flex justify-between items-end">
              <div className="space-y-1 text-left">
                <h2 className="text-xl font-bold text-neutral-900 tracking-tight capitalize">
                  {activeTab.replace('-', ' ')}
                </h2>
                <p className="text-xs text-neutral-500">Configure your specific workspace parameters and preferences.</p>
              </div>
              <div className="hidden sm:block text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                System OK
              </div>
            </div>

            <div className="pt-2">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
