# GROWZZY OS - Deployment Checklist

## Pre-Deployment (Local)
- [ ] All tests passing locally
- [ ] No console errors or warnings
- [ ] Environment variables configured in .env.local
- [ ] Database migrations run successfully
- [ ] All API endpoints tested
- [ ] OAuth flows tested locally
- [ ] Email verification working
- [ ] Reports generation tested
- [ ] Automations logic verified

## Environment Setup (Vercel Project)
- [ ] Supabase project created with all tables
- [ ] All platform OAuth apps created and configured
- [ ] ENCRYPTION_KEY generated (256-bit hex): `openssl rand -hex 32`
- [ ] CRON_SECRET generated: `openssl rand -hex 32`
- [ ] OpenAI API key obtained
- [ ] All environment variables added to Vercel > Settings > Environment Variables

## Platform OAuth Setup
- [ ] **Meta**: Facebook App ID and Secret configured
  - Redirect URI: `https://your-domain.com/api/oauth/meta/callback`
- [ ] **Google**: Google Cloud credentials configured
  - Redirect URI: `https://your-domain.com/api/oauth/google/callback`
- [ ] **LinkedIn**: LinkedIn app configured
  - Redirect URI: `https://your-domain.com/api/oauth/linkedin/callback`
- [ ] **TikTok**: TikTok app configured (if needed)
  - Redirect URI: `https://your-domain.com/api/oauth/tiktok/callback`

## Vercel Configuration
- [ ] GitHub repository connected to Vercel
- [ ] Production branch set (usually `main`)
- [ ] Build command verified: `npm run build`
- [ ] Install command verified: `npm install`
- [ ] Cron jobs configured in vercel.json
- [ ] Custom domain configured with SSL

## Database & Security
- [ ] Supabase RLS policies enabled on all tables
- [ ] Service role key set for cron jobs
- [ ] Encryption key securely stored in environment
- [ ] CORS headers configured in next.config.mjs
- [ ] Rate limiting implemented

## Post-Deployment Tests (First 24 Hours)
- [ ] Domain is accessible and loads without errors
- [ ] Health check endpoint responds: `/api/health`
- [ ] User sign-up workflow completes
- [ ] Email verification code received and works
- [ ] OAuth connection flows complete successfully
- [ ] Dashboard loads with no errors
- [ ] Reports can be generated
- [ ] AI features respond correctly
- [ ] Cron jobs executing (check Vercel > Deployments > Functions)

## Monitoring Setup
- [ ] Error tracking enabled (Sentry or Vercel error monitoring)
- [ ] Database performance monitored
- [ ] API response times tracked
- [ ] Cron job success/failure logs reviewed
- [ ] Set up alerts for critical failures

## Data Sync Verification (Wait 30 minutes after deployment)
- [ ] Platform data syncing from Meta
- [ ] Platform data syncing from Google
- [ ] Campaign metrics updating correctly
- [ ] Lead data importing properly

## Go-Live
- [ ] All checklist items completed
- [ ] Team trained on deployment
- [ ] Support contact information documented
- [ ] Rollback plan documented
- [ ] Production monitoring active
- [ ] Performance baseline established
