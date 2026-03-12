import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

function isPasswordProtected() {
  return !!process.env.SITE_PASSWORD;
}

function hasBetaAccess(request: NextRequest): boolean {
  return request.cookies.get("beta_access")?.value === "granted";
}

export async function middleware(request: NextRequest) {
  // Site-wide password gate (for beta testing)
  if (isPasswordProtected()) {
    const pathname = request.nextUrl.pathname;

    // Always allow: the gate page, its APIs, waitlist signup, and webhook endpoints
    if (
      pathname === "/gate" ||
      pathname === "/api/gate" ||
      pathname === "/api/waitlist" ||
      pathname.startsWith("/api/billing/webhook")
    ) {
      return await updateSession(request);
    }

    // Check for beta access cookie
    if (!hasBetaAccess(request)) {
      const gateUrl = request.nextUrl.clone();
      gateUrl.pathname = "/gate";
      return NextResponse.redirect(gateUrl);
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
