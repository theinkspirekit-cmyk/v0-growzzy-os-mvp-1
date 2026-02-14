import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/cron/automations
 * Evaluates all active automations for all users.
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Cron] Starting system-wide automation evaluation");

    const activeAutomations = await prisma.automation.findMany({
      where: {
        isActive: true,
      },
      include: {
        user: true,
      }
    });

    console.log(`[Cron] Evaluating ${activeAutomations.length} active automations`);

    const results = [];

    for (const automation of activeAutomations) {
      try {
        // Evaluate the automation (calling the helper)
        const result = await evaluateAutomation(automation.id);
        results.push({ automationId: automation.id, ...result });
      } catch (err: any) {
        console.error(`[Cron] Automation ${automation.id} failed:`, err.message);
        results.push({ automationId: automation.id, success: false, error: err.message });
      }
    }

    return NextResponse.json({
      ok: true,
      data: {
        totalEvaluated: activeAutomations.length,
        results,
      },
    });
  } catch (error: any) {
    console.error("[Cron] Global automation error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Evaluates a single automation and executes actions if trigger is met
 * This logic should ideally be shared with the manual run endpoint
 */
async function evaluateAutomation(automationId: string) {
  // Fetch automation with user context
  const automation = await prisma.automation.findUnique({
    where: { id: automationId },
  });

  if (!automation) return { success: false, reason: "Automation not found" };

  // Fetch relevant campaigns for this user
  const campaigns = await prisma.campaign.findMany({
    where: {
      userId: automation.userId,
      status: 'active'
    },
  });

  let triggeredCount = 0;
  const actionsTaken = [];

  for (const campaign of campaigns) {
    let triggered = false;
    const trigger = automation.trigger as any;

    switch (automation.triggerType) {
      case "ROAS_DROP":
        if (campaign.roas != null && campaign.roas < (trigger.threshold || 1.5)) {
          triggered = true;
        }
        break;
      case "BUDGET_EXHAUST":
        // Simple mock trigger for demonstration
        if (campaign.totalSpend > (campaign.dailyBudget || 0) * 0.95) {
          triggered = true;
        }
        break;
      // ... other trigger types
    }

    if (triggered) {
      // Execute Action
      triggeredCount++;
      const actionResult = await executeAction(automation, campaign);
      actionsTaken.push(actionResult);
    }
  }

  // Update automation metadata
  if (triggeredCount > 0) {
    await prisma.automation.update({
      where: { id: automationId },
      data: {
        lastRun: new Date(),
        runCount: { increment: 1 },
      },
    });
  }

  return {
    success: true,
    triggeredCount,
    actionsTaken
  };
}

async function executeAction(automation: any, campaign: any) {
  try {
    switch (automation.actionType) {
      case "PAUSE_CAMPAIGN":
        await prisma.campaign.update({
          where: { id: campaign.id },
          data: { status: "paused" },
        });

        // Log action
        await prisma.automationLog.create({
          data: {
            automationId: automation.id,
            actionTaken: `Paused campaign: ${campaign.name}`,
            success: true,
            impact: "Saved potential wasted spend due to low ROAS",
          },
        });
        return { campaignId: campaign.id, action: "pause", success: true };

      case "INCREASE_BUDGET":
        const action = automation.action as any;
        const multiplier = action.multiplier || 1.2;
        const newBudget = (campaign.dailyBudget || 50) * multiplier;

        await prisma.campaign.update({
          where: { id: campaign.id },
          data: { dailyBudget: newBudget },
        });

        await prisma.automationLog.create({
          data: {
            automationId: automation.id,
            actionTaken: `Increased budget for ${campaign.name} to $${newBudget.toFixed(2)}`,
            success: true,
            impact: "Scaling high-performing campaign",
          },
        });
        return { campaignId: campaign.id, action: "budget_increase", success: true };

      default:
        return { campaignId: campaign.id, action: automation.actionType, success: false, reason: "Unhandled action type" };
    }
  } catch (error: any) {
    return { campaignId: campaign.id, success: false, error: error.message };
  }
}
