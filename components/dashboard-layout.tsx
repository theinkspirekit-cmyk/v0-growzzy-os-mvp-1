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
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  Menu,
  X,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children?: { title: string; href: string }[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    children: [
      { title: "Overview", href: "/dashboard/analytics" },
      { title: "Google Ads", href: "/dashboard/analytics/google" },
      { title: "Meta Ads", href: "/dashboard/analytics/meta" },
      { title: "LinkedIn Ads", href: "/dashboard/analytics/linkedin" },
    ],
  },
  {
    title: "Leads & CRM",
    href: "/dashboard/leads",
    icon: Users,
  },
  {
    title: "Campaigns",
    href: "/dashboard/campaigns",
    icon: Megaphone,
  },
  {
    title: "AI Copilot",
    href: "/dashboard/copilot",
    icon: Bot,
  },
  {
    title: "AI Ad Creatives",
    href: "/dashboard/creatives",
    icon: Sparkles,
  },
  {
    title: "Automations",
    href: "/dashboard/automations",
    icon: Zap,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedSections, setExpandedSections] = useState<string[]>(["Analytics"])
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href
    return pathname.startsWith(href)
  }

  const handleNavigate = (item: NavItem) => {
    if (item.children) {
      toggleSection(item.title)
    } else {
      router.push(item.href)
      setMobileSidebarOpen(false)
    }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-neutral-800">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-black font-bold text-sm">G</span>
        </div>
        {sidebarOpen && (
          <span className="text-white font-semibold text-base tracking-tight">
            GROWZZY OS
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href)
          const isExpanded = expandedSections.includes(item.title)
          const hasChildren = item.children && item.children.length > 0

          return (
            <div key={item.title}>
              <button
                onClick={() => handleNavigate(item)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${active && !hasChildren
                    ? "bg-white text-black"
                    : active && hasChildren
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                  }
                `}
              >
                <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? (hasChildren ? "text-white" : "text-black") : ""}`} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left truncate">{item.title}</span>
                    {hasChildren && (
                      isExpanded
                        ? <ChevronDown className="w-4 h-4 text-neutral-500" />
                        : <ChevronRight className="w-4 h-4 text-neutral-500" />
                    )}
                  </>
                )}
              </button>

              {/* Sub-items */}
              {hasChildren && isExpanded && sidebarOpen && (
                <div className="ml-5 mt-1 space-y-0.5 border-l border-neutral-700 pl-4">
                  {item.children!.map((child) => {
                    const childActive = pathname === child.href
                    return (
                      <button
                        key={child.href}
                        onClick={() => {
                          router.push(child.href)
                          setMobileSidebarOpen(false)
                        }}
                        className={`
                          w-full text-left px-3 py-2 rounded-md text-[13px] transition-all duration-150
                          ${childActive
                            ? "text-white font-medium bg-neutral-800"
                            : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/40"
                          }
                        `}
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

      {/* Bottom Section */}
      <div className="px-3 py-4 border-t border-neutral-800">
        <button
          onClick={async () => {
            document.cookie = "growzzy_demo_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
            await signOut({ redirect: true, callbackUrl: "/auth" })
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-all duration-150"
        >
          <LogOut className="w-[18px] h-[18px]" />
          {sidebarOpen && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col bg-neutral-950 transition-all duration-300 flex-shrink-0
          ${sidebarOpen ? "w-[260px]" : "w-[72px]"}
        `}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative w-[260px] h-full bg-neutral-950">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-[60px] bg-white border-b border-neutral-200 px-4 lg:px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-1.5 rounded-md hover:bg-neutral-100 transition-colors"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="w-5 h-5 text-neutral-600" />
            </button>

            {/* Desktop sidebar toggle */}
            <button
              className="hidden lg:block p-1.5 rounded-md hover:bg-neutral-100 transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="w-4 h-4 text-neutral-500" />
              ) : (
                <Menu className="w-4 h-4 text-neutral-500" />
              )}
            </button>

            {/* Page Title */}
            <h1 className="text-base font-semibold text-neutral-900 truncate">
              {navItems.find((item) => isActive(item.href))?.title || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
              <Search className="w-4 h-4 text-neutral-500" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors">
              <Bell className="w-4 h-4 text-neutral-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-black rounded-full" />
            </button>

            {/* User Avatar */}
            <button className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center ml-1">
              <span className="text-white text-xs font-medium">A</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
