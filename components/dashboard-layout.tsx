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
  Bell,
  Menu,
  X,
  Shield,
  Layers,
  Target,
  FileBarChart,
  Command,
  Activity,
  Box,
  Cpu,
  Globe
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children?: { title: string; href: string }[]
}

const navItems: NavItem[] = [
  { title: "Command Hub", href: "/dashboard", icon: LayoutDashboard },
  { title: "AI Ad Creatives", href: "/dashboard/creatives", icon: Sparkles },
  { title: "Content Studio", href: "/dashboard/content", icon: Wand2 },
  { title: "Campaign Matrix", href: "/dashboard/campaigns", icon: Megaphone },
  { title: "Target Index (CRM)", href: "/dashboard/leads", icon: Users },
  {
    title: "Intelligence",
    href: "/dashboard/analytics",
    icon: BarChart3,
    children: [
      { title: "Overview", href: "/dashboard/analytics" },
      { title: "Google Engine", href: "/dashboard/analytics/google" },
      { title: "Meta Architecture", href: "/dashboard/analytics/meta" },
      { title: "LinkedIn Segment", href: "/dashboard/analytics/linkedin" },
      { title: "Shopify Sync", href: "/dashboard/analytics/shopify" },
    ]
  },
  { title: "Orchestration", href: "/dashboard/automations", icon: Zap },
  { title: "Strategic Reports", href: "/dashboard/reports", icon: FileBarChart },
  { title: "AI Orchestrator", href: "/dashboard/ai", icon: Bot },
  { title: "System Config", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href
    return pathname.startsWith(href)
  }

  const toggleExpand = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    )
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white text-[#05090E] border-r border-[#F1F5F9] font-satoshi">
      {/* Brand Header */}
      <div className="p-10 pb-12 flex items-center gap-4">
        <div className="w-12 h-12 bg-[#05090E] rounded-[1.25rem] flex items-center justify-center text-[#1F57F5] shadow-2xl shadow-[#05090E]/20 hover:scale-105 transition-transform duration-300">
          <Command className="w-6 h-6" />
        </div>
        <div className="text-left space-y-0.5">
          <h2 className="text-[20px] font-bold tracking-tight text-[#05090E]">GROWZZY <span className="text-[#1F57F5]">OS</span></h2>
          <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.3em]">Enterprise Intelligence</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href)
          const isExpanded = expandedItems.includes(item.title)

          return (
            <div key={item.title} className="space-y-1.5">
              <button
                onClick={() => {
                  if (item.children) {
                    toggleExpand(item.title)
                  } else {
                    router.push(item.href)
                  }
                }}
                className={cn(
                  "w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-[14px] transition-all duration-300 group",
                  active
                    ? "bg-[#1F57F5] text-white shadow-xl shadow-[#1F57F5]/20 font-bold"
                    : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#05090E] font-semibold"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                    active ? "bg-white/10" : "bg-white border border-[#F1F5F9] group-hover:border-[#1F57F5]/30 group-hover:text-[#1F57F5]"
                  )}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="tracking-tight">{item.title}</span>
                </div>
                {item.children && (
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform duration-300",
                    isExpanded ? 'rotate-180' : '',
                    active ? 'text-white' : 'text-[#A3A3A3]'
                  )} />
                )}
              </button>

              {item.children && isExpanded && (
                <div className="ml-9 space-y-1.5 border-l-2 border-[#F1F5F9] pl-5 py-3">
                  {item.children.map(child => (
                    <button
                      key={child.href}
                      onClick={() => router.push(child.href)}
                      className={cn(
                        "w-full text-left py-2.5 text-[13px] transition-all font-bold tracking-tight text-[#64748B]",
                        pathname === child.href ? 'text-[#1F57F5]' : 'hover:text-[#05090E]'
                      )}
                    >
                      {child.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User Session Staging Area */}
      <div className="p-8 border-t border-[#F1F5F9] bg-[#F8FAFC]/30">
        <div className="bg-white p-4 rounded-2xl border-2 border-[#F1F5F9] flex items-center gap-4 group hover:border-[#1F57F5] transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-[1rem] bg-[#05090E] flex items-center justify-center text-[#1F57F5] font-bold text-sm shadow-lg shadow-[#05090E]/10 group-hover:scale-105 transition-transform">
            MR
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[14px] font-bold text-[#05090E] truncate">Max Reynolds</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00DDFF] animate-pulse" />
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest">Node Active</span>
            </div>
          </div>
          <button className="p-2 text-[#A3A3A3] hover:text-[#F43F5E] transition-colors hover:bg-[#F43F5E]/5 rounded-xl">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-white font-satoshi selection:bg-[#1F57F5]/10 selection:text-[#1F57F5]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[320px] flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Main Execution Layer */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Superior Operational Header */}
        <header className="h-[88px] bg-white border-b border-[#F1F5F9] flex items-center justify-between px-12 flex-shrink-0 z-50">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-3 hover:bg-[#F8FAFC] rounded-2xl transition-all border border-[#F1F5F9]"
            >
              <Menu className="w-6 h-6 text-[#05090E]" />
            </button>
            <div className="flex items-center gap-4 px-6 py-2.5 bg-[#F8FAFC] border border-[#F1F5F9] rounded-2xl shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1F57F5] shadow-[0_0_10px_rgba(31,87,245,0.5)]" />
              <span className="text-[11px] font-bold text-[#05090E] uppercase tracking-[0.2em] flex items-center gap-3">
                <Globe className="w-4 h-4 text-[#64748B]" /> Production Environment
              </span>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="hidden lg:flex items-center gap-12 border-r border-[#F1F5F9] pr-12">
              {[
                { label: 'Latency Index', value: '12ms', icon: Activity, color: '#00DDFF' },
                { label: 'System Uptime', value: '99.9%', icon: Shield, color: '#00DDFF' },
              ].map(i => (
                <div key={i.label} className="text-left flex items-center gap-4 group">
                  <div className="p-2.5 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9] group-hover:border-[#1F57F5] transition-all">
                    <i.icon className="w-4 h-4 text-[#64748B]" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-[0.2em]">{i.label}</p>
                    <p className="text-[14px] font-bold text-[#05090E]">{i.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <button className="p-3.5 hover:bg-[#F8FAFC] rounded-2xl text-[#64748B] hover:text-[#05090E] transition-all relative border border-transparent hover:border-[#F1F5F9]">
                <Bell className="w-5 h-5" />
                <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-[#00DDFF] rounded-full ring-4 ring-white" />
              </button>
              <div className="w-12 h-12 bg-[#05090E] rounded-[1.25rem] flex items-center justify-center text-[#1F57F5] text-sm font-bold shadow-xl shadow-[#05090E]/20 hover:scale-105 transition-transform cursor-pointer">
                MR
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-white relative">
          {children}
          {/* Subtle Global Overlay for depth */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#F8FAFC]/20 to-transparent opacity-50" />
        </main>
      </div>


      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-[1000] lg:hidden">
          <div className="absolute inset-0 bg-[#05090E]/40 backdrop-blur-md transition-all duration-500" onClick={() => setMobileSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[340px] bg-white animate-in slide-in-from-left duration-500 ease-out shadow-2xl">
            <SidebarContent />
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-10 right-[-64px] w-12 h-12 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-[#05090E] hover:rotate-90 transition-all border border-[#F1F5F9]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
