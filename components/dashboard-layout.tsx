"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Megaphone,
  Bot,
  Sparkles,
  Zap,
  Wand2,
  FileBarChart,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  Menu,
  X,
  Shield,
  Activity,
  Command,
  Home
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children?: { title: string; href: string }[]
}

const navItems: NavItem[] = [
  { title: "Home", href: "/dashboard", icon: Home },
  { title: "Command Hub", href: "/dashboard/command", icon: Command },
  { title: "AI Ad Creatives", href: "/dashboard/creatives", icon: Sparkles },
  { title: "Content Studio", href: "/dashboard/content", icon: Wand2 },
  { title: "Campaign Matrix", href: "/dashboard/campaigns", icon: Megaphone },
  { title: "Target Index", href: "/dashboard/leads", icon: Users },
  {
    title: "Intelligence",
    href: "/dashboard/analytics",
    icon: BarChart3,
    children: [
      { title: "Overview", href: "/dashboard/analytics" },
      { title: "Channel Analytics", href: "/dashboard/analytics/channels" },
      { title: "Efficiency Matrix", href: "/dashboard/analytics/efficiency" },
    ]
  },
  { title: "AI Assistant", href: "/dashboard/copilot", icon: Bot },
  { title: "Automation", href: "/dashboard/automations", icon: Zap },
  { title: "Reports", href: "/dashboard/reports", icon: FileBarChart },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(['Intelligence'])
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
    <div className="flex flex-col h-full bg-sidebar border-r border-[#E2E8F0] font-satoshi">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-[#E2E8F0]">
        <div className="w-8 h-8 bg-[#1F57F5] rounded-md flex items-center justify-center text-white shadow-sm">
          <Command className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-[16px] font-bold tracking-tight text-[#0F172A] leading-none">GROWZZY <span className="text-[#1F57F5]">OS</span></h2>
          <span className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider mt-1">Enterprise</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const active = isActive(item.href)
          const isExpanded = expandedItems.includes(item.title)

          // Enterprise Sidebar Item Style
          // Active: Light blue bg + Blue text + Blue Left Border (optional)
          // Inactive: Gray text + Hover light gray

          return (
            <div key={item.title} className="space-y-0.5">
              <button
                onClick={() => {
                  if (item.children) {
                    toggleExpand(item.title)
                  } else {
                    router.push(item.href)
                  }
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium transition-all group",
                  active
                    ? "bg-[#EFF6FF] text-[#1F57F5]"
                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn(
                    "w-4 h-4 transition-colors",
                    active ? "text-[#1F57F5]" : "text-[#94A3B8] group-hover:text-[#64748B]"
                  )} />
                  <span className="tracking-tight">{item.title}</span>
                </div>
                {item.children && (
                  <ChevronDown className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200 opacity-50",
                    isExpanded ? 'rotate-180' : '',
                    active ? 'text-[#1F57F5]' : 'text-[#94A3B8]'
                  )} />
                )}
              </button>

              {item.children && isExpanded && (
                <div className="ml-4 pl-3 border-l border-[#E2E8F0] space-y-0.5 my-1">
                  {item.children.map(child => {
                    const childActive = pathname === child.href;
                    return (
                      <button
                        key={child.href}
                        onClick={() => router.push(child.href)}
                        className={cn(
                          "w-full text-left py-1.5 px-3 rounded-md text-[12px] transition-all font-medium block",
                          childActive
                            ? 'text-[#1F57F5] bg-[#EFF6FF]'
                            : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                        )}
                      >
                        {child.title}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User Session Staging Area */}
      <div className="p-4 border-t border-[#E2E8F0] bg-white">
        <div className="p-2 rounded-md border border-[#E2E8F0] shadow-sm flex items-center gap-3 hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-[#1F57F5]/10 flex items-center justify-center text-[#1F57F5] font-bold text-xs">
            MR
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[12px] font-semibold text-[#0F172A] truncate">Max Reynolds</p>
            <p className="text-[10px] text-[#64748B] truncate">Admin Workspace</p>
          </div>
          <LogOut className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#EF4444] transition-colors" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-satoshi selection:bg-[#1F57F5]/20 selection:text-[#1F57F5]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[240px] flex-col flex-shrink-0 z-20 h-full fixed left-0 top-0 bottom-0">
        <SidebarContent />
      </aside>

      {/* Main Execution Layer */}
      <div className="flex-1 flex flex-col min-w-0 relative lg:pl-[240px]">

        {/* Superior Operational Header */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-[#F1F5F9] rounded-md transition-all text-[#64748B]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md">
              <span className="text-[12px] font-medium text-[#64748B]">Project:</span>
              <span className="text-[12px] font-semibold text-[#0F172A]">Growzzy MVP</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 border-r border-[#E2E8F0] pr-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                <span className="text-[12px] font-mono font-medium text-[#0F172A]">System Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#64748B]" />
                <span className="text-[12px] font-mono text-[#64748B]">12ms</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 bg-white hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] rounded-md text-[#64748B] transition-all">
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-[#F43F5E] rounded-full ring-2 ring-white" />
              </button>
              <button className="h-8 px-3 bg-[#1F57F5] hover:bg-[#1A4AD1] text-white text-[12px] font-medium rounded-md shadow-sm transition-all">
                Quick Action +
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 lg:p-8 scroll-smooth">
          <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-[1000] lg:hidden">
          <div className="absolute inset-0 bg-[#0F172A]/50 backdrop-blur-sm transition-all" onClick={() => setMobileSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[240px] bg-white animate-in slide-in-from-left duration-200 shadow-2xl flex flex-col">
            <SidebarContent />
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-[-32px] w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-[#0F172A]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
