"use client"

import DashboardLayout from "@/components/dashboard-layout"
import {
  User,
  Bell,
  Lock,
  CreditCard,
  Building,
  Globe,
  Link,
} from "lucide-react"

const SETTINGS_SECTIONS = [
  { id: "account", label: "Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Integrations", icon: Globe },
  { id: "team", label: "Team", icon: Building },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "security", label: "Security", icon: Lock },
]

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Settings</h2>
            <p className="text-sm text-neutral-500 mt-0.5">Manage your account and preferences</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 space-y-1">
            {SETTINGS_SECTIONS.map((s) => (
              <button key={s.id} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 font-medium transition-colors">
                <s.icon className="w-4 h-4" />
                {s.label}
              </button>
            ))}
          </div>

          {/* Main Panel */}
          <div className="flex-1 bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
            <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-100 pb-4 mb-4">Integrations</h3>

            <div className="space-y-4">
              {[
                { name: "Google Ads", connected: true },
                { name: "Meta Ads", connected: true },
                { name: "LinkedIn Ads", connected: true },
                { name: "TikTok Ads", connected: false },
                { name: "Shopify", connected: false },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between p-4 border border-neutral-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${p.connected ? "bg-emerald-50 text-emerald-600" : "bg-neutral-50 text-neutral-400"}`}>
                      <Link className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900">{p.name}</h4>
                      <p className="text-xs text-neutral-500">{p.connected ? "Connected" : "Not connected"}</p>
                    </div>
                  </div>
                  <button className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${p.connected ? "text-neutral-600 border border-neutral-200 hover:bg-neutral-50" : "bg-neutral-900 text-white hover:bg-neutral-800"}`}>
                    {p.connected ? "Configure" : "Connect"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
