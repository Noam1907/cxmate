import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/onboarding", "/auth", "/auth/callback", "/reset"];

// Routes that require auth OR preview data
const APP_ROUTES = ["/dashboard", "/confrontation", "/journey", "/playbook"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Public routes — always accessible
  if (PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    return supabaseResponse;
  }

  // API routes — let them handle their own auth
  if (pathname.startsWith("/api/")) {
    return supabaseResponse;
  }

  // App routes — check for auth or preview mode
  if (APP_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    // Check for preview mode via query param
    const id = request.nextUrl.searchParams.get("id");
    const isPreview = id === "preview";

    // Allow if user is authenticated OR in preview mode
    // (Preview mode users will see data from sessionStorage)
    if (user || isPreview) {
      return supabaseResponse;
    }

    // For dashboard and playbook (no ?id param), allow through
    // — the pages themselves handle the empty state
    if (pathname === "/dashboard" || pathname === "/playbook") {
      return supabaseResponse;
    }

    // No auth and no preview flag — redirect to auth
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
