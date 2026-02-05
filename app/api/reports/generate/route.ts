import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { calculateReportMetrics } from "@/lib/report-metrics";
import { generateAIInsights } from "@/lib/report-insights";
import { generateActionPlan } from "@/lib/report-action-plan";
import { ComprehensiveReportBuilder } from "@/lib/comprehensive-report-builder";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { dateRange = "last30days" } = await req.json();

    console.log("[v0] Generating comprehensive report for user:", user.id, "dateRange:", dateRange);

    // Calculate date range
    const endDate = new Date();
    let startDate = new Date();

    switch (dateRange) {
      case "last7days":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "last30days":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "last90days":
        startDate.setDate(startDate.getDate() - 90);
        break;
      case "thisMonth":
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
      case "lastMonth":
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);
        endDate.setDate(0);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // Step 1: Calculate metrics from real data
    console.log("[v0] Step 1: Calculating metrics from real campaign data");
    const metrics = await calculateReportMetrics(user.id, {
      from: startDate,
      to: endDate,
    });

    console.log("[v0] Metrics calculated - spend:", metrics.totalSpend, "revenue:", metrics.totalRevenue, "roas:", metrics.averageROAS.toFixed(2));

    // Step 2: Generate AI insights using Claude
    console.log("[v0] Step 2: Generating AI insights with Claude");
    const insights = await generateAIInsights(metrics);

    console.log("[v0] AI insights generated - wins:", insights.wins.length, "concerns:", insights.concerns.length, "recommendations:", insights.recommendations.length);

    // Step 3: Generate action plan
    console.log("[v0] Step 3: Generating weekly action plan");
    const actionPlan = await generateActionPlan(metrics, insights);

    console.log("[v0] Action plan generated with", actionPlan.weeks.length, "weeks");

    // Step 4: Create PDF
    console.log("[v0] Step 4: Building comprehensive PDF report");
    const reportId = `RPT-${new Date().getFullYear()}-${uuidv4().substring(0, 6).toUpperCase()}`;
    const pdfBuilder = new ComprehensiveReportBuilder(metrics, insights, actionPlan, reportId);
    const pdfDoc = pdfBuilder.build();
    const pdfBuffer = pdfBuilder.getBuffer();

    console.log("[v0] PDF generated successfully");

    // Step 5: Save report to database
    console.log("[v0] Step 5: Saving report to database");
    const { data: savedReport, error: dbError } = await supabase
      .from("reports")
      .insert({
        user_id: user.id,
        title: `Performance Report - ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
        type: "comprehensive",
        platform: "all",
        period_start: startDate.toISOString().split("T")[0],
        period_end: endDate.toISOString().split("T")[0],
        metrics: JSON.stringify(metrics),
        insights: JSON.stringify(insights),
        recommendations: JSON.stringify(actionPlan),
        status: "completed",
        generated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error("[v0] Database error:", dbError);
      throw dbError;
    }

    console.log("[v0] Report saved to database with ID:", savedReport.id);

    // Step 6: Return PDF directly for download
    console.log("[v0] Report generation completed successfully - returning PDF");

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="GROWZZY-Report-${reportId}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("[v0] Report generation error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to generate report",
      },
      { status: 500 }
    );
  }
}
