export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { dateRange, sections, userId } = await request.json();
    
    // Get user settings from request headers
    const settings = request.headers.get('x-user-settings');
    if (!settings) {
      return NextResponse.json({ error: 'No integration data found' }, { status: 401 });
    }

    // Fetch real data from platforms
    const platformsResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/platforms/data`, {
      headers: { 'x-user-settings': settings }
    });

    if (!platformsResponse.ok) {
      throw new Error('Failed to fetch platform data');
    }

    const platformData = await platformsResponse.json();
    const campaigns = platformData.campaigns || [];
    const leads = platformData.leads || [];

    // Calculate real KPIs from platform data
    const totalSpend = campaigns.reduce((sum: number, c: any) => sum + (c.spend || 0), 0);
    const totalRevenue = campaigns.reduce((sum: number, c: any) => sum + (c.revenue || 0), 0);
    const totalConversions = campaigns.reduce((sum: number, c: any) => sum + (c.conversions || 0), 0);
    const roas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '0';

    // Real platform breakdown
    const platformDataBreakdown = campaigns.reduce((acc: any, campaign: any) => {
      const platform = campaign.platform || 'Unknown';
      if (!acc[platform]) {
        acc[platform] = { platform, spend: 0, revenue: 0, campaigns: 0, conversions: 0 };
      }
      acc[platform].spend += campaign.spend || 0;
      acc[platform].revenue += campaign.revenue || 0;
      acc[platform].campaigns += 1;
      acc[platform].conversions += campaign.conversions || 0;
      return acc;
    }, {});

    const platformBreakdown = Object.values(platformDataBreakdown).map((platform: any) => ({
      ...platform,
      roas: platform.spend > 0 ? (platform.revenue / platform.spend).toFixed(2) : '0'
    }));

    // Generate executive summary from real data
    const topPerformers = campaigns
      .filter((c: any) => c.roas > 2)
      .sort((a: any, b: any) => b.roas - a.roas)
      .slice(0, 3);

    const underPerformers = campaigns
      .filter((c: any) => c.roas < 1 && c.spend > 1000)
      .sort((a: any, b: any) => a.roas - b.roas)
      .slice(0, 3);

    const executiveSummary = {
      wins: [
        `Total ROAS of ${roas}x across all platforms`,
        `${topPerformers.length} campaigns performing above 2x ROAS`,
        `Generated ₹${totalRevenue.toLocaleString()} in revenue`,
        `${leads.length} leads generated from connected platforms`,
        `${platformBreakdown.length} platforms actively running campaigns`
      ],
      concerns: [
        underPerformers.length > 0 ? `${underPerformers.length} campaigns underperforming` : 'No major concerns',
        totalSpend > totalRevenue ? 'Total spend exceeds revenue' : 'Budget optimization possible',
        campaigns.length > 0 ? `${Math.round((campaigns.filter((c: any) => c.status === 'active').length / campaigns.length) * 100)}% of campaigns active` : 'Low campaign activity',
        leads.length === 0 ? 'No leads generated - check lead generation funnels' : 'Lead generation performing well'
      ]
    };

    // Real AI Insights based on data
    const aiInsights = [
      underPerformers.length > 0 ? `Focus on optimizing ${underPerformers[0]?.name || 'underperforming'} campaigns for better ROAS` : 'All campaigns performing well',
      topPerformers.length > 0 ? `Consider increasing budget for ${topPerformers[0]?.name || 'top performing'} campaigns` : 'Scale up successful campaigns',
      platformBreakdown.length > 0 ? `${platformBreakdown[0]?.platform || 'Meta'} platform shows highest potential for growth` : 'Expand to new platforms',
      leads.length > 0 ? `Lead conversion rate: ${Math.round((leads.filter((l: any) => l.status === 'qualified').length / leads.length) * 100)}% - optimize funnel` : 'Improve lead generation strategy',
      'Implement A/B testing on ad creatives to improve CTR',
      'Review and optimize targeting parameters for better conversion rates'
    ];

    const reportData = {
      title: 'Marketing Performance Report',
      dateRange: `${dateRange.start} to ${dateRange.end}`,
      executiveSummary,
      kpi: {
        totalSpend,
        totalRevenue,
        roas: parseFloat(roas),
        conversions: totalConversions,
        leadsGenerated: leads.length,
        qualifiedLeads: leads.filter((l: any) => l.status === 'qualified').length,
        activeCampaigns: campaigns.filter((c: any) => c.status === 'active').length
      },
      campaigns: campaigns.map((c: any) => ({
        name: c.name,
        platform: c.platform,
        spend: c.spend || 0,
        revenue: c.revenue || 0,
        roas: c.roas || 0,
        conversions: c.conversions || 0,
        status: c.status || 'unknown',
        impressions: c.impressions || 0,
        ctr: c.ctr || 0
      })),
      platformBreakdown,
      leads: leads.map((l: any) => ({
        name: l.name,
        email: l.email,
        source: l.source || 'Unknown',
        status: l.status,
        value: l.value || 0,
        createdAt: l.createdAt
      })),
      aiInsights,
      dataSources: {
        platforms: platformBreakdown.map((p: any) => p.platform),
        totalCampaigns: campaigns.length,
        totalLeads: leads.length,
        reportGeneratedAt: new Date().toISOString()
      }
    };

    return NextResponse.json({
      success: true,
      data: reportData,
      message: 'Report generated successfully with real platform data'
    });

  } catch (error: any) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate report' },
      { status: 500 }
    );
  }
}

