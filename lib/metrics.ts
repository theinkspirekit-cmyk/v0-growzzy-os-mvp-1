// Marketing metrics calculations
export const MetricsCalculator = {
  // Calculate Cost Per Click
  calculateCPC(spend: number, clicks: number): number {
    if (clicks === 0) return 0
    return spend / clicks
  },

  // Calculate Click Through Rate
  calculateCTR(clicks: number, impressions: number): number {
    if (impressions === 0) return 0
    return (clicks / impressions) * 100
  },

  // Calculate Cost Per Action/Conversion
  calculateCPA(spend: number, conversions: number): number {
    if (conversions === 0) return 0
    return spend / conversions
  },

  // Calculate Return On Ad Spend
  calculateROAS(revenue: number, spend: number): number {
    if (spend === 0) return 0
    return revenue / spend
  },

  // Calculate Conversion Rate
  calculateConversionRate(conversions: number, clicks: number): number {
    if (clicks === 0) return 0
    return (conversions / clicks) * 100
  },

  // Calculate Average Order Value
  calculateAOV(revenue: number, conversions: number): number {
    if (conversions === 0) return 0
    return revenue / conversions
  },

  // Calculate Cost Per Lead
  calculateCPL(spend: number, leads: number): number {
    if (leads === 0) return 0
    return spend / leads
  },

  // Calculate Impressions from CTR and clicks
  calculateImpressions(clicks: number, ctr: number): number {
    if (ctr === 0) return 0
    return Math.round((clicks / ctr) * 100)
  },

  // Calculate ROI (Return on Investment)
  calculateROI(revenue: number, spend: number): number {
    if (spend === 0) return 0
    return ((revenue - spend) / spend) * 100
  },

  // Calculate profit
  calculateProfit(revenue: number, spend: number): number {
    return revenue - spend
  },

  // Calculate breakeven point
  calculateBreakeven(spend: number, profitMargin: number): number {
    if (profitMargin === 0) return 0
    return spend / (1 - profitMargin)
  },

  // Aggregate metrics across campaigns
  aggregateMetrics(
    campaigns: Array<{
      spend: number
      revenue: number
      clicks: number
      impressions: number
      conversions: number
    }>
  ) {
    const totals = campaigns.reduce(
      (acc, c) => ({
        spend: acc.spend + c.spend,
        revenue: acc.revenue + c.revenue,
        clicks: acc.clicks + c.clicks,
        impressions: acc.impressions + c.impressions,
        conversions: acc.conversions + c.conversions,
      }),
      { spend: 0, revenue: 0, clicks: 0, impressions: 0, conversions: 0 }
    )

    return {
      ...totals,
      cpc: this.calculateCPC(totals.spend, totals.clicks),
      ctr: this.calculateCTR(totals.clicks, totals.impressions),
      cpa: this.calculateCPA(totals.spend, totals.conversions),
      roas: this.calculateROAS(totals.revenue, totals.spend),
      conversionRate: this.calculateConversionRate(totals.conversions, totals.clicks),
      aov: this.calculateAOV(totals.revenue, totals.conversions),
      roi: this.calculateROI(totals.revenue, totals.spend),
      profit: this.calculateProfit(totals.revenue, totals.spend),
    }
  },

  // Calculate trending direction and percentage change
  calculateTrend(current: number, previous: number): {
    change: number
    percentage: number
    direction: "up" | "down" | "neutral"
    isPositive: boolean
  } {
    const change = current - previous
    const percentage = previous !== 0 ? (change / previous) * 100 : 0
    const direction = change > 0 ? "up" : change < 0 ? "down" : "neutral"
    const isPositive = change > 0

    return { change, percentage, direction, isPositive }
  },

  // Benchmark comparison
  compareToBenchmark(
    actual: number,
    benchmark: number,
    isHigherBetter = true
  ): {
    variance: number
    variancePercentage: number
    status: "excellent" | "good" | "average" | "poor"
  } {
    const variance = actual - benchmark
    const variancePercentage = benchmark !== 0 ? (variance / benchmark) * 100 : 0

    let status: "excellent" | "good" | "average" | "poor"
    const absVariancePercentage = Math.abs(variancePercentage)

    if (isHigherBetter) {
      if (variancePercentage > 10) status = "excellent"
      else if (variancePercentage > 0) status = "good"
      else if (variancePercentage > -10) status = "average"
      else status = "poor"
    } else {
      if (variancePercentage < -10) status = "excellent"
      else if (variancePercentage < 0) status = "good"
      else if (variancePercentage < 10) status = "average"
      else status = "poor"
    }

    return { variance, variancePercentage, status }
  },

  // Calculate attribution credit across touchpoints
  calculateAttributionCredit(
    touchpoints: Array<{ channel: string; value: number }>,
    attributionModel: "first" | "last" | "linear" | "time_decay" = "linear"
  ) {
    if (touchpoints.length === 0) return {}

    const totalValue = touchpoints.reduce((sum, tp) => sum + tp.value, 0)
    const credits: Record<string, number> = {}

    if (attributionModel === "first") {
      credits[touchpoints[0].channel] = totalValue
    } else if (attributionModel === "last") {
      credits[touchpoints[touchpoints.length - 1].channel] = totalValue
    } else if (attributionModel === "linear") {
      const creditPerTouchpoint = totalValue / touchpoints.length
      touchpoints.forEach((tp) => {
        credits[tp.channel] = (credits[tp.channel] || 0) + creditPerTouchpoint
      })
    } else if (attributionModel === "time_decay") {
      // More recent touchpoints get more credit
      const weights = touchpoints.map((_, index) => Math.pow(2, index))
      const totalWeight = weights.reduce((sum, w) => sum + w, 0)
      touchpoints.forEach((tp, index) => {
        const credit = (weights[index] / totalWeight) * totalValue
        credits[tp.channel] = (credits[tp.channel] || 0) + credit
      })
    }

    return credits
  },

  // Calculate customer lifetime value
  calculateCLV(aov: number, purchaseFrequency: number, customerLifespan: number): number {
    return aov * purchaseFrequency * customerLifespan
  },

  // Calculate payback period (months)
  calculatePaybackPeriod(monthlyROI: number): number {
    if (monthlyROI <= 0) return Infinity
    return 1 / monthlyROI
  },
}
