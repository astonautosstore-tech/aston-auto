import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Seamlessly redirect any legacy /admin URLs to /backdoor
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const targetPath = pathname.replace(/^\/admin/, "/backdoor");
    const targetUrl = new URL(targetPath, request.url);
    targetUrl.search = request.nextUrl.search;
    return NextResponse.redirect(targetUrl);
  }

  // Allow the login page itself to pass through
  if (pathname === "/backdoor/login") {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    const loginUrl = new URL("/backdoor/login", request.url);
    loginUrl.searchParams.set("error", "missing_config");
    return NextResponse.redirect(loginUrl);
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/backdoor/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if user is registered in admin_users
  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError) {
    console.error("[proxy] Supabase admin_users check error:", adminError.message);
    const loginUrl = new URL("/backdoor/login", request.url);
    loginUrl.searchParams.set("error", "query_failed");
    loginUrl.searchParams.set("msg", adminError.message);
    return NextResponse.redirect(loginUrl);
  }

  if (!adminUser) {
    console.warn(`[proxy] User ${user.email} (${user.id}) signed in but no row in admin_users`);
    const loginUrl = new URL("/backdoor/login", request.url);
    loginUrl.searchParams.set("error", "not_admin");
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/backdoor", "/backdoor/:path*", "/admin", "/admin/:path*"],
};
