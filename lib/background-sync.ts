/**
 * Background Sync Orchestrator (Prisma Version)
 * Manages all platform data syncs with retry logic and token refresh
 */

import { prisma } from '@/lib/prisma';
import { getPlatformConnector } from '@/lib/platform-connector';

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

interface SyncResult {
  connectionId: string;
  platform: string;
  success: boolean;
  campaignsSynced: number;
  error?: string;
  duration: number;
}

interface SyncStats {
  totalConnections: number;
  successfulSyncs: number;
  failedSyncs: number;
  totalCampaigns: number;
  duration: number;
  errors: SyncResult[];
}

export async function syncAllUserConnections(userId: string): Promise<SyncStats> {
  const startTime = Date.now();
  const stats: SyncStats = {
    totalConnections: 0,
    successfulSyncs: 0,
    failedSyncs: 0,
    totalCampaigns: 0,
    duration: 0,
    errors: [],
  };

  try {
    console.log(`[Sync] Starting orchestrator for user ${userId}`);

    // Get all active platforms/connections for the user
    const platforms = await prisma.platform.findMany({
      where: {
        userId,
        isActive: true,
      },
    });

    if (!platforms || platforms.length === 0) {
      console.log(`[Sync] No active platforms for user ${userId}`);
      return stats;
    }

    stats.totalConnections = platforms.length;

    // Sync each platform with retry logic
    for (const platform of platforms) {
      const syncResult = await syncPlatformWithRetry(platform, userId);

      if (syncResult.success) {
        stats.successfulSyncs++;
        stats.totalCampaigns += syncResult.campaignsSynced;
      } else {
        stats.failedSyncs++;
        stats.errors.push(syncResult);
      }
    }

    stats.duration = Date.now() - startTime;
    console.log(`[Sync] Complete. Success: ${stats.successfulSyncs}/${stats.totalConnections}, Campaigns: ${stats.totalCampaigns}, Duration: ${stats.duration}ms`);

    return stats;
  } catch (error: any) {
    console.error('[Sync] Orchestrator fatal error:', error);
    stats.duration = Date.now() - startTime;
    return stats;
  }
}

async function syncPlatformWithRetry(platform: any, userId: string): Promise<SyncResult> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await syncPlatform(platform, userId);
    } catch (error: any) {
      lastError = error;
      console.error(`[Sync] Attempt ${attempt}/${MAX_RETRIES} failed for ${platform.name}:`, error.message);

      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
      }
    }
  }

  return {
    connectionId: platform.id,
    platform: platform.name,
    success: false,
    campaignsSynced: 0,
    error: lastError?.message || 'Unknown error',
    duration: 0,
  };
}

async function syncPlatform(platform: any, userId: string): Promise<SyncResult> {
  const startTime = Date.now();
  let campaignsSynced = 0;

  try {
    const connector = getPlatformConnector(platform.name);

    // 1. Refresh token handled internally by connector or skipped for mock
    // 2. Fetch campaigns from platform
    const platformCampaigns = await connector.getCampaigns(platform.accountId);

    // 3. Update campaigns in database
    for (const pc of platformCampaigns) {
      try {
        await prisma.campaign.upsert({
          where: {
            // Unique index for userId, platformName, externalId
            // Ensure this exists in your Prisma schema or use findFirst + update/create
            id: (await prisma.campaign.findFirst({
              where: {
                userId,
                platformName: platform.name.toLowerCase(),
                externalId: pc.id
              }
            }))?.id || 'new-campaign'
          },
          update: {
            name: pc.name,
            status: pc.status,
            totalSpend: pc.spend || 0,
            roas: pc.roas || null,
            dailyBudget: pc.budget || null,
            updatedAt: new Date(),
          },
          create: {
            userId,
            platformId: platform.id,
            platformName: platform.name.toLowerCase(),
            externalId: pc.id,
            name: pc.name,
            status: pc.status,
            totalSpend: pc.spend || 0,
            roas: pc.roas || null,
            dailyBudget: pc.budget || null,
            objective: pc.objective || 'unknown',
          }
        });
        campaignsSynced++;
      } catch (err) {
        console.error(`[Sync] Error upserting campaign ${pc.id}:`, err);
      }
    }

    // 4. Update platform last synced at
    await prisma.platform.update({
      where: { id: platform.id },
      data: { lastSynced: new Date() }
    });

    return {
      connectionId: platform.id,
      platform: platform.name,
      success: true,
      campaignsSynced,
      duration: Date.now() - startTime,
    };
  } catch (error: any) {
    console.error(`[Sync] Error syncing ${platform.name}:`, error);
    throw error;
  }
}
