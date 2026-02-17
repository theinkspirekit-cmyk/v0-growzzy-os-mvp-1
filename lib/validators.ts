import { z } from "zod"

// Campaign Schemas
export const createCampaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  platform: z.enum(["meta", "google", "linkedin", "shopify"]),
  objective: z.string().min(1, "Campaign objective is required"),
  budget: z.number().positive("Budget must be positive"),
  duration: z.number().min(1, "Duration must be at least 1 day"),
  targeting: z.record(z.any()).optional(),
  creativeIds: z.array(z.string()).optional(),
})

export const updateCampaignSchema = createCampaignSchema.partial().extend({
  id: z.string(),
})

export const campaignStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["active", "paused", "ended", "draft"]),
})

// Lead Schemas
export const createLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  phone: z.string().optional(),
  title: z.string().optional(),
  source: z.string().optional().default("manual"),
  estimatedValue: z.number().nonnegative().optional().default(0),
  notes: z.string().optional(),
})

export const bulkImportLeadsSchema = z.object({
  leads: z.array(createLeadSchema),
})

export const updateLeadSchema = createLeadSchema.partial().extend({
  id: z.string(),
  status: z.enum(["new", "contacted", "qualified", "converted", "lost"]).optional(),
  aiScore: z.number().min(0).max(100).optional(),
})

// Creative Schemas
export const createCreativeSchema = z.object({
  name: z.string().min(1, "Creative name is required"),
  type: z.enum(["image", "video", "carousel", "text"]),
  platform: z.enum(["meta", "google", "linkedin", "shopify"]),
  content: z.string().min(1, "Content is required"),
  headline: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  cta: z.string().optional(),
})

export const generateCreativeSchema = z.object({
  type: z.enum(["headline", "ad_copy", "cta"]),
  brief: z.string().min(10, "Brief must be at least 10 characters"),
  tone: z.enum(["professional", "casual", "urgent", "educational"]).optional(),
  platform: z.enum(["meta", "google", "linkedin", "shopify"]).optional(),
})

// Automation Schemas
export const createAutomationSchema = z.object({
  name: z.string().min(1, "Automation name is required"),
  trigger: z.enum(["roas_drop", "cpa_spike", "budget_exhausted", "low_ctr", "time_based"]),
  triggerValue: z.number().optional(),
  action: z.enum(["pause_campaign", "increase_budget", "notify_slack", "generate_report"]),
  actionValue: z.number().optional(),
  targetCampaigns: z.array(z.string()).optional(),
  schedule: z.enum(["immediate", "daily", "weekly"]).optional(),
  enabled: z.boolean().default(true),
})

export const updateAutomationSchema = createAutomationSchema.partial().extend({
  id: z.string(),
})

// Report Schemas
export const createReportSchema = z.object({
  name: z.string().min(1, "Report name is required"),
  template: z.enum(["performance", "attribution", "roi", "creative_performance", "custom"]),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  platforms: z.array(z.enum(["meta", "google", "linkedin", "shopify"])).optional(),
  metrics: z.array(z.string()).optional(),
  scheduled: z.boolean().optional(),
  scheduleFrequency: z.enum(["daily", "weekly", "monthly"]).optional(),
  emailRecipients: z.array(z.string().email()).optional(),
})

// Notification Preference Schemas
export const notificationPreferenceSchema = z.object({
  channel: z.enum(["email", "slack", "in_app"]),
  eventType: z.enum(["automation_executed", "alert", "report_ready", "sync_failed"]),
  enabled: z.boolean(),
  frequency: z.enum(["immediate", "daily", "weekly"]).optional(),
})

// Analytics Query Schema
export const analyticsQuerySchema = z.object({
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  platforms: z.array(z.enum(["meta", "google", "linkedin", "shopify"])).optional(),
  campaigns: z.array(z.string()).optional(),
  metrics: z.array(z.string()).optional(),
  groupBy: z.enum(["day", "week", "month", "platform", "campaign"]).optional(),
})

// Type exports for use in components
export type CreateCampaign = z.infer<typeof createCampaignSchema>
export type UpdateCampaign = z.infer<typeof updateCampaignSchema>
export type CreateLead = z.infer<typeof createLeadSchema>
export type CreateCreative = z.infer<typeof createCreativeSchema>
export type CreateAutomation = z.infer<typeof createAutomationSchema>
export type CreateReport = z.infer<typeof createReportSchema>
