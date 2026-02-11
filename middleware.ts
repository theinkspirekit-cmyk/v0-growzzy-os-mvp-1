import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isDemoMode = req.cookies.get("growzzy_demo_mode")?.value === "true"
  const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard")

  // Log specific conditions (filter noise)
  if (isDashboardPage && !isLoggedIn && !isDemoMode) {
    console.log(`[middleware] Redirecting unauthorized user from ${req.nextUrl.pathname}`)
    return NextResponse.redirect(new URL("/auth", req.nextUrl))
  }

  // If in demo mode, explicitly allow
  if (isDemoMode) {
    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*"],
};
