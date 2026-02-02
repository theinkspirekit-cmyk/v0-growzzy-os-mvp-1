# GROWZZY OS - Deployment Instructions

## Quick Start Deployment

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial GROWZZY OS deployment"
git push origin main
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel Dashboard (Recommended)**
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings (auto-detected)
5. Add environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL
   - NEXT_PUBLIC_APP_URL
   - NEXT_PUBLIC_GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - NEXT_PUBLIC_META_APP_ID
   - META_APP_SECRET
   - NEXT_PUBLIC_TIKTOK_CLIENT_ID
   - TIKTOK_CLIENT_SECRET
   - OPENAI_API_KEY
   - ANTHROPIC_API_KEY
6. Click "Deploy"

**Option B: Using Vercel CLI**
```bash
npm install -g vercel
vercel --prod
# Follow prompts to set environment variables
```

### Step 3: Verify Deployment
1. Visit your Vercel URL
2. Test the landing page
3. Test authentication at `/auth`
4. Test dashboard at `/dashboard`

## Environment Variables

All required environment variables are listed in DEPLOYMENT_READY.md. Ensure all are set before deploying.

## Database Setup

Your Supabase database has been automatically configured with all tables and RLS policies. No additional setup needed.

## SSL/HTTPS

Vercel automatically provides SSL certificates. Your site will be served over HTTPS.

## Domain Configuration

To use a custom domain:
1. In Vercel dashboard, go to project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Monitoring

- Vercel Analytics: Monitor performance and traffic
- Supabase Dashboard: Monitor database metrics
- Error logs: Check /api endpoints for errors

## Rollback

If needed, rollback to a previous deployment:
1. Go to Vercel dashboard
2. Click "Deployments"
3. Click the deployment you want to rollback to
4. Click "Promote to Production"

---

**Your GROWZZY OS is ready to deploy!** 🚀
