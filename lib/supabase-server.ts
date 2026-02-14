/**
 * Supabase Server Client
 * Legacy compatibility layer for SSR routes.
 * New code should use NextAuth session + Prisma.
 */

export async function createServerClientInstance() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client when Supabase is not configured
    return createMockServerClient()
  }

  try {
    const { createServerClient } = await import("@supabase/ssr")
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()

    return createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: any) => {
          cookiesToSet.forEach(({ name, value, options }: any) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    })
  } catch {
    return createMockServerClient()
  }
}

function createMockServerClient() {
  const mockAuth = {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
  }
  const mockResponse = { data: null, error: null }
  const chainable: any = {
    auth: mockAuth,
    from: () => chainable,
    select: () => chainable,
    insert: () => Promise.resolve(mockResponse),
    update: () => chainable,
    delete: () => chainable,
    eq: () => chainable,
    single: () => Promise.resolve(mockResponse),
    then: (resolve: any) => resolve(mockResponse),
  }
  return chainable
}
