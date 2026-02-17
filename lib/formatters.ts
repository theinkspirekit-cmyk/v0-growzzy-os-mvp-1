import { format, formatDistance, parseISO } from "date-fns"

// Currency formatting
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

// Percentage formatting
export function formatPercentage(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

// Number formatting with commas
export function formatNumber(num: number, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

// Date formatting
export function formatDate(date: Date | string, formatStr = "MMM dd, yyyy"): string {
  const d = typeof date === "string" ? parseISO(date) : date
  return format(d, formatStr)
}

export function formatDateShort(date: Date | string): string {
  return formatDate(date, "MMM dd")
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, "MMM dd, yyyy HH:mm")
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date
  return formatDistance(d, new Date(), { addSuffix: true })
}

// Metrics formatting
export function formatROAS(roas: number): string {
  return `${roas.toFixed(2)}x`
}

export function formatCPC(cpc: number): string {
  return formatCurrency(cpc)
}

export function formatCPA(cpa: number): string {
  return formatCurrency(cpa)
}

export function formatCTR(ctr: number): string {
  return formatPercentage(ctr / 100, 2)
}

export function formatMetric(name: string, value: number): string {
  const lowerName = name.toLowerCase()

  if (lowerName.includes("roas")) return formatROAS(value)
  if (lowerName.includes("cpc")) return formatCPC(value)
  if (lowerName.includes("cpa")) return formatCPA(value)
  if (lowerName.includes("ctr")) return formatCTR(value)
  if (lowerName.includes("cost") || lowerName.includes("revenue") || lowerName.includes("spend"))
    return formatCurrency(value)
  if (lowerName.includes("rate")) return formatPercentage(value / 100)

  return formatNumber(value)
}

// Lead status badge colors
export function getLeadStatusColor(status: string): string {
  const colors: Record<string, string> = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-yellow-100 text-yellow-800",
    qualified: "bg-purple-100 text-purple-800",
    converted: "bg-green-100 text-green-800",
    lost: "bg-red-100 text-red-800",
  }
  return colors[status] || "bg-gray-100 text-gray-800"
}

// Campaign status badge colors
export function getCampaignStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    ended: "bg-gray-100 text-gray-800",
    draft: "bg-blue-100 text-blue-800",
  }
  return colors[status] || "bg-gray-100 text-gray-800"
}

// Format platform name
export function formatPlatformName(platform: string): string {
  const names: Record<string, string> = {
    meta: "Meta Ads",
    google: "Google Ads",
    linkedin: "LinkedIn Ads",
    shopify: "Shopify",
  }
  return names[platform.toLowerCase()] || platform
}

// Truncate string
export function truncate(text: string, length = 50): string {
  return text.length > length ? `${text.substring(0, length)}...` : text
}

// Format large numbers (1M, 1K, etc.)
export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return formatNumber(num)
}

// Parse metric value from string format
export function parseMetricValue(formatted: string): number {
  // Remove currency symbol and percentage signs
  let value = formatted.replace(/[$%,x]/g, "").trim()
  return parseFloat(value) || 0
}

// Format time duration (minutes/hours/days)
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h`
  return `${Math.round(seconds / 86400)}d`
}

// Get trend indicator
export function getTrendIndicator(current: number, previous: number): {
  direction: "up" | "down" | "neutral"
  change: number
  percentage: number
} {
  const change = current - previous
  const percentage = previous !== 0 ? (change / previous) * 100 : 0
  const direction =
    change > 0 ? "up" : change < 0 ? "down" : ("neutral" as const)

  return { direction, change, percentage }
}
