/**
 * Safe Supabase client factory
 * Returns a Supabase client that won't crash when env vars are missing.
 * For new code, prefer using Prisma + NextAuth directly.
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const supabaseSafe = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdminSafe = createClient(supabaseUrl, supabaseServiceKey)

export function getSupabaseClient() {
    return supabaseSafe
}

export function getSupabaseAdmin() {
    return supabaseAdminSafe
}
