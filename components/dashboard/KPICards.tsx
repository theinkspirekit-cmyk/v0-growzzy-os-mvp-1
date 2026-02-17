'use client'

import { TrendingUp, TrendingDown, DollarSign, BarChart3, Target, Eye } from 'lucide-react'
import { formatCurrency, formatNumber, formatPercentage, formatCompactNumber } from '@/lib/formatters'
import { getTrendIndicator } from '@/lib/formatters'

interface KPICardProps {
  label: string
  value: number | string
  currency?: boolean
  percentage?: boolean
  compact?: boolean
  trend?: { current: number; previous: number }
  icon?: React.ReactNode
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
}

function KPICard({
  label,
  value,
  currency = false,
  percentage = false,
  compact = false,
  trend,
  icon,
  color = 'blue'
}: KPICardProps) {
  let formattedValue: string

  if (typeof value === 'number') {
    if (currency) formattedValue = formatCurrency(value)
    else if (percentage) formattedValue = formatPercentage(value)
    else if (compact) formattedValue = formatCompactNumber(value)
    else formattedValue = formatNumber(value)
  } else {
    formattedValue = value
  }

  let trendDisplay = null
  let trendColor = 'text-gray-500'

  if (trend) {
    const { direction, percentage: trendPercentage } = getTrendIndicator(trend.current, trend.previous)
    if (direction === 'up') {
      trendColor = 'text-green-600'
      trendDisplay = (
        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-semibold">{trendPercentage > 0 ? '+' : ''}{trendPercentage.toFixed(1)}%</span>
        </div>
      )
    } else if (direction === 'down') {
      trendColor = 'text-red-600'
      trendDisplay = (
        <div className="flex items-center gap-1">
          <TrendingDown className="w-4 h-4" />
          <span className="text-sm font-semibold">{trendPercentage.toFixed(1)}%</span>
        </div>
      )
    }
  }

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200',
    red: 'bg-red-50 border-red-200'
  }

  const iconColorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600'
  }

  return (
    <div className={`p-6 border rounded-lg ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <div className="text-3xl font-bold text-gray-900">{formattedValue}</div>
          {trendDisplay && <div className={trendColor}>{trendDisplay}</div>}
        </div>
        {icon && <div className={`p-3 rounded-lg ${iconColorClasses[color]}`}>{icon}</div>}
      </div>
    </div>
  )
}

interface KPIGridProps {
  kpis: {
    revenue?: { value: number; change?: number }
    spend?: { value: number; change?: number }
    roas?: { value: number; change?: number }
    conversions?: { value: number; change?: number }
    ctr?: { value: number; change?: number }
    cpa?: { value: number; change?: number }
  }
}

export function KPIGrid({ kpis }: KPIGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpis.revenue && (
        <KPICard
          label="Total Revenue"
          value={kpis.revenue.value}
          currency
          icon={<DollarSign className="w-5 h-5" />}
          color="green"
          trend={
            kpis.revenue.change ? { current: kpis.revenue.value, previous: kpis.revenue.value / (1 + kpis.revenue.change / 100) } : undefined
          }
        />
      )}
      {kpis.spend && (
        <KPICard
          label="Total Spend"
          value={kpis.spend.value}
          currency
          icon={<BarChart3 className="w-5 h-5" />}
          color="orange"
          trend={
            kpis.spend.change ? { current: kpis.spend.value, previous: kpis.spend.value / (1 + kpis.spend.change / 100) } : undefined
          }
        />
      )}
      {kpis.roas && (
        <KPICard
          label="ROAS"
          value={kpis.roas.value.toFixed(2) + 'x'}
          icon={<TrendingUp className="w-5 h-5" />}
          color="blue"
          trend={
            kpis.roas.change ? { current: kpis.roas.value, previous: kpis.roas.value / (1 + kpis.roas.change / 100) } : undefined
          }
        />
      )}
      {kpis.conversions && (
        <KPICard
          label="Conversions"
          value={kpis.conversions.value}
          compact
          icon={<Target className="w-5 h-5" />}
          color="purple"
          trend={
            kpis.conversions.change ? { current: kpis.conversions.value, previous: kpis.conversions.value / (1 + kpis.conversions.change / 100) } : undefined
          }
        />
      )}
      {kpis.ctr && (
        <KPICard
          label="CTR"
          value={kpis.ctr.value.toFixed(2) + '%'}
          icon={<Eye className="w-5 h-5" />}
          color="red"
          trend={
            kpis.ctr.change ? { current: kpis.ctr.value, previous: kpis.ctr.value / (1 + kpis.ctr.change / 100) } : undefined
          }
        />
      )}
      {kpis.cpa && (
        <KPICard
          label="CPA"
          value={kpis.cpa.value}
          currency
          icon={<DollarSign className="w-5 h-5" />}
          color="red"
          trend={
            kpis.cpa.change ? { current: kpis.cpa.value, previous: kpis.cpa.value / (1 + kpis.cpa.change / 100) } : undefined
          }
        />
      )}
    </div>
  )
}

export default KPICard
