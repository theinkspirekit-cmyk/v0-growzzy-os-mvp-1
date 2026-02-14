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
  Activity,
  Command,
  Home,
  RefreshCw,
  Search,
  Plus
} from "lucide-react"
import { cn } from "@/lib/utils"
// import { useSession, signOut } from "next-auth/react" // Uncomment when Auth is ready

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children?: { title: string; href: string }[]
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
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
  { title: "Automation", href: "/dashboard/automations", icon: Zap },
  { title: "Reports", href: "/dashboard/reports", icon: FileBarChart },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(['Intelligence'])
  const router = useRouter()
  const pathname = usePathname()
  // const { data: session } = useSession() 

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
    <div className="flex flex-col h-full bg-white border-r border-border font-satoshi">
      {/* Brand Header */}
      <div className="h-14 flex items-center gap-3 px-4 border-b border-border">
        <div className="w-6 h-6 bg-primary rounded-[4px] flex items-center justify-center text-white shadow-xs">
          <Command className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-[14px] font-bold tracking-tight text-text-primary leading-none">GROWZZY</h2>
        </div>
        <div className="ml-auto px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-medium text-text-secondary border border-border">
          PRO
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href)
          const isExpanded = expandedItems.includes(item.title)

          return (
            <div key={item.title}>
              <button
                onClick={() => {
                  if (item.children) {
                    toggleExpand(item.title)
                  } else {
                    router.push(item.href)
                  }
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-1.5 rounded-[6px] text-[13px] font-medium transition-all group",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-text-secondary hover:bg-gray-50 hover:text-text-primary"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className={cn(
                    "w-4 h-4",
                    active ? "text-primary" : "text-text-tertiary group-hover:text-text-secondary"
                  )} />
                  <span>{item.title}</span>
                </div>
                {item.children && (
                  <ChevronDown className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200",
                    isExpanded ? 'rotate-180' : '',
                    active ? 'text-primary' : 'text-text-tertiary'
                  )} />
                )}
              </button>

              {item.children && isExpanded && (
                <div className="ml-9 space-y-0.5 my-0.5">
                  {item.children.map(child => {
                    const childActive = pathname === child.href;
                    return (
                      <button
                        key={child.href}
                        onClick={() => router.push(child.href)}
                        className={cn(
                          "w-full text-left py-1 px-2 rounded-[4px] text-[12px] transition-all font-medium block border-l-2",
                          childActive
                            ? 'border-primary text-primary bg-gray-50'
                            : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-gray-50'
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

      {/* User Footer */}
      <div className="p-3 border-t border-border">
        <div className="p-2 rounded-[6px] hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-text-primary truncate">John Doe</p>
            <p className="text-[11px] text-text-tertiary truncate">john@growzzy.com</p>
          </div>
          <LogOut className="w-4 h-4 text-text-tertiary hover:text-danger transition-colors" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 font-satoshi">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[220px] flex-col flex-shrink-0 z-20 h-full fixed left-0 top-0 bottom-0 shadow-xs">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative lg:pl-[220px]">
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 hover:bg-gray-100 rounded-md text-text-secondary"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Search */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-text-tertiary">/</span>
              <span className="text-[13px] font-medium text-text-secondary">Dashboard</span>
            </div>

            <div className="hidden md:flex relative ml-4">
              <Search className="absolute left-2.5 top-1.5 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search or jump to..."
                className="h-8 pl-9 pr-4 bg-gray-50 border border-border rounded-[6px] text-[13px] w-64 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
              />
              <span className="absolute right-2 top-1.5 text-[10px] text-text-tertiary border border-border px-1.5 rounded-[4px]">⌘K</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Uptime Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-success-bg/50 rounded-full border border-success-bg">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
              <span className="text-[11px] font-medium text-success-700">Systems Normal</span>
            </div>

            <div className="h-4 w-[1px] bg-border mx-1"></div>

            <button className="text-text-tertiary hover:text-text-primary transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
            </button>

            <button className="btn btn-primary h-8 px-3 text-[12px] shadow-sm">
              <Plus className="w-4 h-4 mr-1.5" /> Create
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-300">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-[1000] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-all" onClick={() => setMobileSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[240px] bg-white animate-in slide-in-from-left duration-200 shadow-xl flex flex-col">
            <SidebarContent />
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-2 right-[-40px] w-10 h-10 flex items-center justify-center text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
