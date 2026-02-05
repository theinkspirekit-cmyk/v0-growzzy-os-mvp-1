# GROWZZY OS - Environment Configuration Guide

Copy this content to `.env.local` file in your project root:

```
# ==========================================
# APP CONFIGURATION
# ==========================================
NEXT_PUBLIC_APP_URL=https://v0-growzzyos.vercel.app

# ==========================================
# SUPABASE CONFIGURATION (Required)
# Get these from your Supabase project settings
# ==========================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ==========================================
# OPENAI API (Required for AI features)
# Get from https://v0-growzzyos.vercel.appform.openai.com/api-keys
# ==========================================
OPENAI_API_KEY=sk-your-openai-api-key

# ==========================================
# PLATFORM API KEYS (Optional - for production)
# ==========================================
META_APP_ID=your-meta-app-id
META_APP_SECRET=your-meta-app-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
SHOPIFY_API_KEY=your-shopify-api-key
SHOPIFY_API_SECRET=your-shopify-api-secret

# ==========================================
# STRIPE PAYMENTS
# ==========================================
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# ==========================================
# SECURITY
# ==========================================
JWT_SECRET=your-jwt-secret-key-min-32-characters-long
```

## Setup Instructions:

1. Create a Supabase project at https://supabase.com
2. Get your API keys from Project Settings > API
3. Set up email provider in Supabase Auth settings
4. Deploy to Vercel with NEXT_PUBLIC_APP_URL set to https://v0-growzzyos.vercel.app
