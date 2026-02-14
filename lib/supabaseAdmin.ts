/**
 * Supabase Admin Client
 * Legacy compatibility layer — maintained for old routes during migration to Prisma.
 * New code should use Prisma directly via @/lib/prisma.
 */

let supabaseAdmin: any

try {
  const { createClient } = require("@supabase/supabase-js")
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  if (supabaseUrl && serviceRoleKey) {
    supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  } else {
    // Create a mock client that returns empty data
    supabaseAdmin = createMockClient()
  }
} catch {
  supabaseAdmin = createMockClient()
}

function createMockClient() {
  const mockResponse = { data: null, error: null, count: 0 }
  const chainable: any = {
    from: () => chainable,
    select: () => chainable,
    insert: () => Promise.resolve(mockResponse),
    update: () => chainable,
    delete: () => chainable,
    eq: () => chainable,
    single: () => Promise.resolve(mockResponse),
    limit: () => chainable,
    order: () => chainable,
    range: () => chainable,
    then: (resolve: any) => resolve(mockResponse),
  }
  return chainable
}

export { supabaseAdmin }
