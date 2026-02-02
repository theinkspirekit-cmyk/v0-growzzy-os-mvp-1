-- GROWZZY OS - Comprehensive Database Schema
-- Phased rollout for 5-module architecture

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- MODULE 1: ACCOUNT CONNECTION & DATA INGESTION
-- ============================================================================

CREATE TABLE IF NOT EXISTS ad_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  account_id VARCHAR(255) NOT NULL,
  account_name VARCHAR(255),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  permissions JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'active',
  last_sync_at TIMESTAMP,
  sync_error TEXT,
  connected_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, platform, account_id)
);

CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_account_id UUID NOT NULL REFERENCES ad_accounts(id) ON DELETE CASCADE,
  sync_type VARCHAR(50),
  status VARCHAR(50),
  records_synced INT DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- ============================================================================
-- MODULE 2: CAMPAIGN & PERFORMANCE DATA
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_account_id UUID NOT NULL REFERENCES ad_accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  external_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  platform VARCHAR(50),
  objective VARCHAR(100),
  status VARCHAR(50),
  budget_type VARCHAR(50),
  budget_amount DECIMAL(12, 2),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(ad_account_id, external_id)
);

CREATE TABLE IF NOT EXISTS ad_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  external_id VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  platform VARCHAR(50),
  status VARCHAR(50),
  audience_type VARCHAR(100),
  targeting_config JSONB,
  budget DECIMAL(12, 2),
  bid_strategy VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(campaign_id, external_id)
);

CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_set_id UUID NOT NULL REFERENCES ad_sets(id) ON DELETE CASCADE,
  external_id VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  creative_text TEXT,
  creative_url VARCHAR(255),
  creative_format VARCHAR(50),
  cta_text VARCHAR(100),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(ad_set_id, external_id)
);

-- ============================================================================
-- MODULE 3: PERFORMANCE METRICS & ANALYTICS
-- ============================================================================

CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_account_id UUID NOT NULL REFERENCES ad_accounts(id) ON DELETE CASCADE,
  entity_type VARCHAR(50),
  entity_id VARCHAR(255),
  metric_date DATE NOT NULL,
  spend DECIMAL(12, 2) DEFAULT 0,
  revenue DECIMAL(12, 2) DEFAULT 0,
  impressions BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  conversions DECIMAL(10, 2) DEFAULT 0,
  cost_per_acquisition DECIMAL(10, 2),
  click_through_rate DECIMAL(5, 3),
  return_on_ad_spend DECIMAL(8, 2),
  frequency DECIMAL(6, 2),
  reach BIGINT DEFAULT 0,
  cost_per_click DECIMAL(10, 2),
  conversion_rate DECIMAL(5, 3),
  cost_per_impression DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(ad_account_id, entity_type, entity_id, metric_date)
);

-- ============================================================================
-- MODULE 4: AI INSIGHTS ENGINE
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_account_id UUID NOT NULL REFERENCES ad_accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  ad_set_id UUID REFERENCES ad_sets(id) ON DELETE SET NULL,
  insight_type VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  recommendation TEXT,
  confidence_score DECIMAL(3, 2),
  affected_metrics JSONB,
  analysis_data JSONB,
  suggested_action VARCHAR(100),
  action_params JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  applied_at TIMESTAMP,
  dismissed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- ============================================================================
-- MODULE 5: AUTOMATION & RULE ENGINE
-- ============================================================================

CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_type VARCHAR(50),
  trigger_config JSONB,
  conditions JSONB NOT NULL,
  actions JSONB NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  last_executed_at TIMESTAMP,
  execution_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS automation_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_id UUID NOT NULL REFERENCES automation_rules(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(50),
  conditions_met BOOLEAN,
  actions_executed JSONB,
  error_message TEXT,
  triggered_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- ============================================================================
-- MODULE 6: CREATIVE ANALYSIS
-- ============================================================================

CREATE TABLE IF NOT EXISTS creative_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  format VARCHAR(50),
  length INT,
  colors JSONB,
  hook_type VARCHAR(100),
  cta_type VARCHAR(100),
  fatigue_score DECIMAL(3, 2),
  creative_score VARCHAR(50),
  ctr_trend DECIMAL(5, 3),
  cpa_trend DECIMAL(5, 3),
  frequency_trend DECIMAL(5, 3),
  fatigue_signals JSONB,
  analyzed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS creative_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  base_creative_id UUID REFERENCES ads(id) ON DELETE SET NULL,
  suggestion_type VARCHAR(100),
  description TEXT,
  implementation_notes TEXT,
  confidence_score DECIMAL(3, 2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- MODULE 7: AI COPILOT & CHAT
-- ============================================================================

CREATE TABLE IF NOT EXISTS copilot_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE CASCADE,
  title VARCHAR(255),
  context_data JSONB,
  message_count INT DEFAULT 0,
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS copilot_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES copilot_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50),
  content TEXT NOT NULL,
  analysis_data JSONB,
  suggested_actions JSONB,
  citations JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- ALERTS & NOTIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  alert_type VARCHAR(100),
  severity VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  affected_metrics JSONB,
  read BOOLEAN DEFAULT FALSE,
  acknowledged BOOLEAN DEFAULT FALSE,
  channels JSONB DEFAULT '["in_app"]',
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP,
  acknowledged_at TIMESTAMP
);

-- ============================================================================
-- REPORTING
-- ============================================================================

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE SET NULL,
  title VARCHAR(255),
  report_type VARCHAR(50),
  kpi_summary JSONB,
  top_campaigns JSONB,
  ai_insights JSONB,
  generated_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP
);

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_ad_accounts_user ON ad_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_user ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_performance_account_date ON performance_metrics(ad_account_id, metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_ai_insights_user ON ai_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_automation_user ON automation_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user ON alerts(user_id);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE ad_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE copilot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE copilot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - USER ISOLATION
-- ============================================================================

CREATE POLICY "Users can view their own ad_accounts"
  ON ad_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own campaigns"
  ON campaigns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own insights"
  ON ai_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own automations"
  ON automation_rules FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own alerts"
  ON alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own reports"
  ON reports FOR SELECT
  USING (auth.uid() = user_id);

-- Allow inserts for all tables
CREATE POLICY "Users can insert their own records"
  ON ad_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert insights"
  ON ai_insights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert automations"
  ON automation_rules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow updates
CREATE POLICY "Users can update their own records"
  ON ad_accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update campaigns"
  ON campaigns FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update insights"
  ON ai_insights FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update automations"
  ON automation_rules FOR UPDATE
  USING (auth.uid() = user_id);
