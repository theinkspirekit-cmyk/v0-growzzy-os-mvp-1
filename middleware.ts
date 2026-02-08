import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Check if it's a protected route
  if (pathname.startsWith("/dashboard")) {
    // Check if user has a session cookie
    const sessionCookie = request.cookies.get("next-auth.session-token") || 
                         request.cookies.get("__Secure-next-auth.session-token");
    
    if (!sessionCookie) {
      // Redirect to auth page if no session
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
