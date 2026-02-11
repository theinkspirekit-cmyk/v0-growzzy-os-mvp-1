"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Megaphone,
  Bot,
  Sparkles,
  Zap,
  Wand2,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  Search,
  Bell,
  Menu,
  X,
  CreditCard,
  HelpCircle,
  Box,
  ShoppingCart,
  User,
  Shield,
  Layers,
  Target
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children?: { title: string; href: string }[]
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "AI Ad Creatives", href: "/dashboard/creatives", icon: Sparkles },
  { title: "Content Studio", href: "/dashboard/content", icon: Wand2 },
  { title: "Campaign Manager", href: "/dashboard/campaigns", icon: Megaphone },
  { title: "Leads & CRM", href: "/dashboard/leads", icon: Users },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { title: "AI Copilot", href: "/dashboard/copilot", icon: Bot },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#111111] text-[#A1A1AA]">
      {/* Team / Store Switcher */}
      <div className="p-4 mb-2">
        <div className="bg-[#1C1C1E] rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-[#27272A] transition-colors border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-black rounded-sm" />
            </div>
            <div>
              <div className="text-white text-sm font-medium">Growzzy Store</div>
              <div className="text-[10px] text-neutral-500">Free Plan</div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-6">
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-[#1C1C1E] text-sm text-white pl-9 pr-8 py-2.5 rounded-xl border border-transparent focus:border-neutral-700 outline-none transition-all placeholder:text-neutral-600"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-neutral-600 border border-neutral-700 rounded px-1.5 py-0.5">
            <span>⌘</span><span>K</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <button
              key={item.title}
              onClick={() => router.push(item.href)}
              className={`
                w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${active
                  ? "bg-white text-black shadow-lg shadow-white/5"
                  : "hover:bg-[#1C1C1E] hover:text-white"
                }
              `}
            >
              <item.icon className={`w-[18px] h-[18px] transition-colors ${active ? "text-black" : "text-neutral-500 group-hover:text-white"}`} />
              <span>{item.title}</span>
            </button>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 space-y-4">
        {/* Upgrade Card */}
        <div className="bg-[#1C1C1E] rounded-2xl p-4 relative overflow-hidden group border border-white/5">
          <div className="relative z-10">
            <h4 className="text-white font-semibold text-sm mb-1">Get Premium Features</h4>
            <p className="text-[11px] text-neutral-400 mb-3 leading-relaxed">
              Try new experiences with premium features on Growzzy.
            </p>
            <button className="w-full bg-black hover:bg-neutral-900 text-white text-xs font-medium py-2 rounded-lg border border-white/10 transition-colors">
              Upgrade Plan
            </button>
          </div>
          {/* Decorative gradients */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/20 blur-[40px] rounded-full group-hover:bg-purple-500/30 transition-colors" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-500/20 blur-[40px] rounded-full group-hover:bg-blue-500/30 transition-colors" />
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-1 py-1 cursor-pointer hover:bg-[#1C1C1E] rounded-xl transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-200 to-amber-500 p-[1px]">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Michael`} alt="User" className="w-full h-full rounded-full" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">Michael Robinson</div>
            <div className="text-[10px] text-neutral-500 truncate">michael.robin@gmail.com</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/auth" })}
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-[#Fdfdfd]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[280px] flex-col bg-[#111111] border-r border-white/5 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Minimal Header */}
        <header className="h-[60px] bg-white border-b border-neutral-100 flex items-center justify-between px-8 flex-shrink-0">
          <h1 className="text-xl font-semibold text-neutral-900">
            Hello, Michael!
          </h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-neutral-50 rounded-full text-neutral-400 hover:text-neutral-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
