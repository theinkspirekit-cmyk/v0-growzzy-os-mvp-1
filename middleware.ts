import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isDemoMode = req.cookies.get("growzzy_demo_mode")?.value === "true"
  const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard")

  if (isDashboardPage && !isLoggedIn && !isDemoMode) {
    return NextResponse.redirect(new URL("/auth", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*"],
};
