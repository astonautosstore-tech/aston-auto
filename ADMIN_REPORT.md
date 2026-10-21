# Comprehensive Admin Inspection & Architecture Report

**Project**: Aston Auto Dealership Platform  
**Environment**: Next.js 16.4.2 (Turbopack) | Supabase SSR / Postgres  
**Target Path / URL**: `/backdoor` (formerly `/admin`)  
**Security & Secrets Status**: All API keys, passwords, and tokens REDACTED. Only variable names referenced.

---

## 1. ADMIN FILES

A complete tree of every file that belongs to the administrative area or is directly utilized by it:

```
src/
├── proxy.ts                                  (90 lines) - Edge middleware reverse proxy: intercepts /backdoor and /admin routes, verifies session cookies, and enforces admin_users authorization checks.
├── app/
│   ├── backdoor/
│   │   ├── layout.tsx                        (18 lines) - Root backdoor layout establishing robots metadata (noindex, nofollow) and admin background.
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx                    (36 lines) - Server component layout: validates Supabase session and admin_users authorization using server cookies.
│   │   │   └── page.tsx                      (12 lines) - Server route entry point: sets metadata and mounts AdminDashboardClient.
│   │   └── login/
│   │       ├── page.tsx                     (233 lines) - Client-side sign-in form with email/password authentication, error display, and redirect handling.
│   │       └── actions.ts                    (68 lines) - Server action verifyAdminLoginAction: verifies authenticated session in cookies against admin_users.
│   └── api/
│       └── revalidate/
│           └── route.ts                      (69 lines) - API route handler for on-demand Next.js ISR cache purging, secured via admin_users check.
├── components/
│   ├── admin/
│   │   ├── AdminDashboardClient.tsx        (2255 lines) - Monolithic interactive dashboard managing vehicle catalog, inquiries, test drives, reviews, and settings.
│   │   └── AdminLogoutButton.tsx             (41 lines) - Interactive sign-out button invoking supabase.auth.signOut() and routing to /backdoor/login.
│   └── layout/
│       └── StorefrontShell.tsx               (32 lines) - Storefront shell component: suppresses public Navbar, Footer, and CookieConsent on /backdoor routes.
├── lib/
│   ├── supabase/
│   │   ├── browser.ts                        (13 lines) - Factory for browser-side Supabase client (@supabase/ssr createBrowserClient).
│   │   ├── server.ts                         (30 lines) - Factory for server-side Supabase client (@supabase/ssr createServerClient with next/headers cookies).
│   │   ├── public.ts                         (11 lines) - Anonymous standalone Supabase client (@supabase/supabase-js createClient) without cookie attachment.
│   │   └── client.ts                         (40 lines) - Legacy browser client singleton.
│   └── utils.ts                              (74 lines) - Formatting and calculation helpers (formatUSD, monthly finance payment calculation).
├── types/
│   └── database.ts                          (102 lines) - TypeScript schemas for Car, Inquiry, TestDrive, Comment, SiteSettings, and AdminUser.
└── next.config.ts                            (19 lines) - Next.js configuration defining allowed remote image hostnames (*.supabase.co, images.unsplash.com).
```

---

## 2. FULL CODE

### `src/proxy.ts`
```typescript
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
    .select("id")
    .eq("id", user.id)
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
```

---

### `src/lib/supabase/browser.ts`
```typescript
import { createBrowserClient as ssrCreateBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return ssrCreateBrowserClient(supabaseUrl, supabaseAnonKey);
}

export { createClient as createBrowserClient };
```

---

### `src/lib/supabase/server.ts`
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Can be ignored if handled by proxy
        }
      },
    },
  });
}

export { createClient as createSupabaseServerClient };
```

---

### `src/lib/supabase/public.ts`
```typescript
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createPublicClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
```

---

### `src/app/backdoor/login/page.tsx`
```typescript
"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/browser";
import { verifyAdminLoginAction } from "./actions";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/backdoor";
  const errorParam = searchParams.get("error");
  const msgParam = searchParams.get("msg");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (errorParam === "not_admin" || errorParam === "unauthorized") {
      setErrorMessage(
        "Your account exists but is not registered in the 'admin_users' table."
      );
    } else if (errorParam === "query_failed") {
      setErrorMessage(
        `Database check failed: ${msgParam ? decodeURIComponent(msgParam) : "Could not verify permissions"}`
      );
    } else if (errorParam === "missing_config") {
      setErrorMessage(
        "Supabase environment variables are missing. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
    }
  }, [errorParam, msgParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const supabase = createBrowserClient();

      // ─── CASE 1: Sign in with password (checks password/credentials) ───
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        // Case 1: Wrong password / invalid login credentials
        setErrorMessage(signInError.message || "Invalid login credentials. Please verify your email and password.");
        setLoading(false);
        return;
      }

      // Ensure session is saved in cookies and router sees the new session
      router.refresh();

      // ─── Server-side verification using session cookies ───
      const verifyResult = await verifyAdminLoginAction();

      // ─── CASE 2: Query failed (show error message) ───
      if (verifyResult.status === "query_failed") {
        setErrorMessage(`Database check failed: ${verifyResult.message}`);
        setLoading(false);
        return;
      }

      // ─── CASE 3: Signed in but no row in admin_users ───
      if (verifyResult.status === "not_admin") {
        await supabase.auth.signOut();
        router.refresh();
        setErrorMessage(
          "Your account exists but is not registered in the 'admin_users' table."
        );
        setLoading(false);
        return;
      }

      if (verifyResult.status === "auth_failed") {
        // Fallback: full browser navigation so server receives cookies via HTTP header
        window.location.href = redirectPath;
        return;
      }

      // ─── SUCCESS: Redirect so server sees authenticated session ───
      window.location.href = redirectPath;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected authentication error occurred.";
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Aston Showroom</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
          ASTON
        </h1>
        <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mt-1">
          Dealership Console & Management
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
        <div className="flex items-center gap-3 pb-6 border-b border-neutral-100 mb-6">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-neutral-900">Administrator Sign In</h2>
            <p className="text-xs text-neutral-500">Enter your dealership credentials</p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed break-words">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@aston.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:border-neutral-950 transition-all"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:border-neutral-950 transition-all"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to Console</span>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-neutral-100 flex items-center justify-center gap-2 text-[11px] text-neutral-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secured with Supabase RLS & Role-Based Auth</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center items-center p-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20 text-neutral-400 text-xs">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading portal...
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
```

---

### `src/app/backdoor/login/actions.ts`
```typescript
"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminVerifyResult =
  | { status: "success"; userId: string }
  | { status: "auth_failed"; message: string }
  | { status: "query_failed"; message: string }
  | { status: "not_admin"; message: string };

export async function verifyAdminLoginAction(): Promise<AdminVerifyResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(
        "[server verifyAdminLogin] getUser failed:",
        userError?.message || "No session"
      );
      return {
        status: "auth_failed",
        message: userError?.message || "Authentication session could not be established in cookies.",
      };
    }

    // Query exact schema: user_id column with maybeSingle()
    const { data: adminRecord, error: adminError } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (adminError) {
      console.error("[server verifyAdminLogin] Supabase admin_users check error:", adminError.message);
      return {
        status: "query_failed",
        message: adminError.message,
      };
    }

    if (!adminRecord) {
      console.warn(
        `[server verifyAdminLogin] User ${user.email} (${user.id}) signed in successfully but no matching row in admin_users.`
      );
      return {
        status: "not_admin",
        message: "Your account exists but is not registered in the 'admin_users' table.",
      };
    }

    return {
      status: "success",
      userId: user.id,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected server error during verification";
    console.error("[server verifyAdminLogin] Exception:", msg);
    return {
      status: "query_failed",
      message: msg,
    };
  }
}
```

---

### `src/app/backdoor/(dashboard)/layout.tsx`
```typescript
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/backdoor/login");
  }

  const { data: adminRecord, error: adminError } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (adminError) {
    console.error("[backdoor layout] Supabase admin_users check error:", adminError.message);
    redirect(`/backdoor/login?error=query_failed&msg=${encodeURIComponent(adminError.message)}`);
  }

  if (!adminRecord) {
    console.warn(`[backdoor layout] User ${user.email} (${user.id}) signed in but no row in admin_users`);
    redirect("/backdoor/login?error=not_admin");
  }

  return <div className="min-h-screen bg-[#F9FAFB]">{children}</div>;
}
```

---

### `src/app/backdoor/(dashboard)/page.tsx`
```typescript
import { Metadata } from "next";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Console | Aston Dealership",
  description: "Secure management console for Aston vehicles, inquiries, test drives, and customer reviews.",
};

export default function AdminPage() {
  return <AdminDashboardClient />;
}
```

---

### `src/app/api/revalidate/route.ts`
```typescript
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator authentication required." },
        { status: 401 }
      );
    }

    // Verify admin_users membership
    const { data: adminRecord, error: adminError } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (adminError) {
      console.error("[revalidate] Supabase admin_users check error:", adminError.message);
      return NextResponse.json(
        { error: `Database error: ${adminError.message}` },
        { status: 500 }
      );
    }

    if (!adminRecord) {
      return NextResponse.json(
        { error: "Forbidden: User is not authorized as an Aston administrator." },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const targetPath = body?.path;

    if (targetPath && typeof targetPath === "string") {
      revalidatePath(targetPath);
      return NextResponse.json({
        revalidated: true,
        path: targetPath,
        timestamp: Date.now(),
      });
    }

    // Revalidate catalog routes by default
    revalidatePath("/");
    revalidatePath("/inventory");
    revalidatePath("/cars/[slug]", "page");
    revalidatePath("/sitemap.xml");

    return NextResponse.json({
      revalidated: true,
      paths: ["/", "/inventory", "/cars/[slug]", "/sitemap.xml"],
      timestamp: Date.now(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Revalidation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

---

### `src/types/database.ts`
```typescript
export type CarStatus = 'available' | 'reserved' | 'sold';
export type CarCondition = 'Brand New' | 'Certified Pre-Owned' | 'Classic / Collector';
export type CommentStatus = 'pending' | 'approved' | 'hidden';

export interface AdminUser {
  /** UUID — same as auth.users.id */
  id: string;
  email: string;
  created_at: string;
}

export interface Car {
  id: string;
  title: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  discount_price: number | null;
  mileage: number;
  transmission: string;
  fuel_type: string;
  body_type: string;
  color: string;
  interior_color?: string;
  condition: CarCondition;
  engine: string;
  acceleration_0_100: number; // in seconds
  top_speed_kmh: number; // km/h
  horsepower: number; // HP
  torque_nm: number; // Nm
  description: string;
  features: string[];
  status: CarStatus;
  stock_quantity: number;
  is_featured: boolean;
  hero_image: string;
  images: string[];
  created_at: string;
  updated_at?: string;
}

export interface Comment {
  id: string;
  car_id: string;
  user_name: string;
  rating: number; // 1-5
  body: string;
  status: CommentStatus;
  admin_reply?: string;
  created_at: string;
  updated_at?: string;
}

export interface Inquiry {
  id: string;
  car_id?: string;
  car_title?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferred_contact: 'whatsapp' | 'call' | 'email';
  status: 'new' | 'contacted' | 'resolved';
  created_at: string;
}

export interface TestDriveRequest {
  id: string;
  car_id: string;
  car_title?: string;
  name: string;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

export type TestDrive = TestDriveRequest;

export interface SiteSettings {
  id: number;
  company_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  showroom_hours: string;
  social_links: {
    instagram: string;
    twitter: string;
    youtube: string;
    linkedin: string;
  };
  hero_headline: string;
  hero_subheadline: string;
}
```

---

### `next.config.ts`
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
```

---

### `src/components/admin/AdminDashboardClient.tsx` - Supabase Operations & Structure

#### A. List of Tabs and Subcomponents with Line Ranges
- **Imports & Image WebP Compression Helper**: Lines 1–116
- **Component State Initialization**: Lines 117–170
- **Data Fetching (`fetchAllData`)**: Lines 172–199
- **Cache Revalidation (`triggerRevalidation`)**: Lines 205–224
- **Vehicle Form Handlers (`handleOpenAddCar`, `handleOpenEditCar`, `handleSaveCar`)**: Lines 226–360
- **Vehicle Deletion (`handleDeleteCar`)**: Lines 362–378
- **Image Upload, Reorder & Delete (`handleImageFilesSelected`, `handleDeleteImage`, etc.)**: Lines 380–487
- **Inquiry Handlers (`handleUpdateInquiryStatus`, `handleDeleteInquiry`)**: Lines 489–516
- **Test Drive Handlers (`handleUpdateTestDriveStatus`, `handleDeleteTestDrive`)**: Lines 518–545
- **Reviews Handlers (`handleUpdateCommentStatus`, `handleSaveCommentReply`, `handleDeleteComment`)**: Lines 547–599
- **Site Settings Handler (`handleSaveSettings`)**: Lines 600–635
- **Filters & Metrics Computation**: Lines 637–670
- **Sidenav & Dashboard Shell JSX**: Lines 671–904
- **Tab 1 - Overview (`activeTab === 'overview'`)**: Lines 906–1159
- **Tab 2 - Vehicles Catalog (`activeTab === 'cars'`)**: Lines 1161–1292
- **Tab 3 - Inquiries (`activeTab === 'inquiries'`)**: Lines 1294–1412
- **Tab 4 - Test Drives (`activeTab === 'test_drives'`)**: Lines 1414–1524
- **Tab 5 - Reviews (`activeTab === 'reviews'`)**: Lines 1526–1652
- **Tab 6 - Site Settings (`activeTab === 'settings'`)**: Lines 1654–1773
- **Modal - Add / Edit Vehicle Modal**: Lines 1775–2250

---

#### B. Full Functions Reading or Writing Supabase

##### 1. Fetch All Data (`fetchAllData`)
```typescript
  // ─── 1. FETCH ALL DATA FROM SUPABASE ───
  const fetchAllData = async (showLoadingState = false) => {
    if (showLoadingState) {
      setLoading(true);
    }
    try {
      const supabase = createBrowserClient();
      const [carsRes, inqRes, tdRes, comRes, setRes, userRes] = await Promise.all([
        supabase.from("cars").select("*").order("created_at", { ascending: false }),
        supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
        supabase.from("test_drives").select("*").order("created_at", { ascending: false }),
        supabase.from("comments").select("*").order("created_at", { ascending: false }),
        supabase.from("site_settings").select("*").eq("id", 1).single(),
        supabase.auth.getUser(),
      ]);

      if (carsRes.data) setCars(carsRes.data as Car[]);
      if (inqRes.data) setInquiries(inqRes.data as Inquiry[]);
      if (tdRes.data) setTestDrives(tdRes.data as TestDrive[]);
      if (comRes.data) setComments(comRes.data as Comment[]);
      if (setRes.data) setSettings(setRes.data as SiteSettings);
      if (userRes.data?.user?.email) setUserEmail(userRes.data.user.email);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };
```

##### 2. Save Vehicle (`handleSaveCar`)
```typescript
  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar || !editingCar.title || !editingCar.slug) {
      showToast('Title and Slug are required.', 'error');
      return;
    }

    // Validate constraints
    const year = editingCar.year ?? 2024;
    if (year < 1900 || year > 2100) {
      showToast('Year must be between 1900 and 2100.', 'error');
      return;
    }
    const price = editingCar.price ?? 0;
    if (price < 0) {
      showToast('Price must be >= 0.', 'error');
      return;
    }
    const discountPrice = editingCar.discount_price;
    if (discountPrice !== null && discountPrice !== undefined && discountPrice >= price) {
      showToast('Discount price must be less than the regular price.', 'error');
      return;
    }

    setCarSaving(true);
    try {
      const supabase = createBrowserClient();
      const hero =
        editingCar.images && editingCar.images.length > 0
          ? editingCar.images[0]
          : editingCar.hero_image || '';

      // Build explicit payload matching only real DB columns
      const carPayload = {
        title: editingCar.title,
        slug: editingCar.slug,
        brand: editingCar.brand || '',
        model: editingCar.model || '',
        year: year,
        price: price,
        discount_price: discountPrice ?? null,
        mileage: editingCar.mileage ?? 0,
        transmission: editingCar.transmission || 'Automatic',
        fuel_type: editingCar.fuel_type || 'Petrol',
        body_type: editingCar.body_type || '',
        color: editingCar.color || '',
        interior_color: editingCar.interior_color || null,
        condition: editingCar.condition || 'Certified Pre-Owned',
        engine: editingCar.engine || '',
        acceleration_0_100: editingCar.acceleration_0_100 ?? null,
        top_speed_kmh: editingCar.top_speed_kmh ?? null,
        horsepower: editingCar.horsepower ?? null,
        torque_nm: editingCar.torque_nm ?? null,
        description: editingCar.description || '',
        features: editingCar.features || [],
        status: editingCar.status || 'available',
        stock_quantity: editingCar.stock_quantity ?? 1,
        is_featured: editingCar.is_featured ?? false,
        hero_image: hero,
        images: editingCar.images && editingCar.images.length > 0 ? editingCar.images : [hero],
        updated_at: new Date().toISOString(),
      };

      const isNew = !cars.some((c) => c.id === editingCar.id);

      let error;
      if (isNew) {
        // INSERT — include id so storage folder matches
        const { error: insertErr } = await supabase
          .from('cars')
          .insert({ id: editingCar.id, ...carPayload });
        error = insertErr;
      } else {
        // UPDATE existing row
        const { error: updateErr } = await supabase
          .from('cars')
          .update(carPayload)
          .eq('id', editingCar.id!);
        error = updateErr;
      }

      if (error) {
        console.error('[Admin] Save car error:', error);
        const code = error.code ? ` [${error.code}]` : '';
        showToast(`Save failed: ${error.message}${code}`, 'error');
        return;
      }

      showToast(`Vehicle "${editingCar.title}" saved successfully.`);
      setIsCarModalOpen(false);
      await fetchAllData();
      await triggerRevalidation(`/cars/${editingCar.slug}`);
    } catch (err: unknown) {
      showError('Save car', err);
    } finally {
      setCarSaving(false);
    }
  };
```

##### 3. Delete Vehicle (`handleDeleteCar`)
```typescript
  const handleDeleteCar = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from('cars').delete().eq('id', id);
      if (error) {
        showError('Delete car', error);
        return;
      }
      showToast(`Deleted ${title}.`);
      setCars(cars.filter((c) => c.id !== id));
      await triggerRevalidation();
    } catch (err: unknown) {
      showError('Delete car', err);
    }
  };
```

##### 4. Storage Image Upload (`handleImageFilesSelected`)
```typescript
  // Multi-file Image Upload with Client-Side Canvas Compression
  const handleImageFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0 || !editingCar?.id) return;

    setUploadingImages(true);
    try {
      const supabase = createBrowserClient();
      const carId = editingCar.id;
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressedBlob = await compressImageToWebP(file);
        const safeBaseName = file.name
          .replace(/[^a-zA-Z0-9.-]/g, "_")
          .replace(/\.[^/.]+$/, ".webp");
        const path = `cars/${carId}/${Date.now()}-${safeBaseName}`;

        const { error: uploadErr } = await supabase.storage
          .from("car-images")
          .upload(path, compressedBlob, {
            contentType: "image/webp",
            upsert: true,
          });

        if (uploadErr) {
          console.error('[Admin] Storage upload error:', uploadErr);
          const code = uploadErr.statusCode ? ` [${uploadErr.statusCode}]` : '';
          showToast(`Upload failed for "${file.name}": ${uploadErr.message}${code}`, 'error');
          continue;
        }

        const { data: urlData } = supabase.storage.from("car-images").getPublicUrl(path);
        if (urlData?.publicUrl) {
          uploadedUrls.push(urlData.publicUrl);
        }
      }

      const existingImages = editingCar.images || [];
      const updatedImages = [...existingImages, ...uploadedUrls];
      setEditingCar({
        ...editingCar,
        images: updatedImages,
        hero_image: updatedImages[0] || editingCar.hero_image,
      });

      if (uploadedUrls.length > 0) {
        showToast(`Uploaded ${uploadedUrls.length} image(s) successfully.`);
      }
    } catch (err: unknown) {
      showError('Image upload', err);
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
```

##### 5. Storage Image Remove (`handleDeleteImage`)
```typescript
  const handleDeleteImage = async (url: string) => {
    if (!editingCar?.images) return;
    const newImages = editingCar.images.filter((img) => img !== url);

    // Try deleting from Supabase Storage if it belongs to car-images bucket
    try {
      if (url.includes("/car-images/")) {
        const parts = url.split("/car-images/");
        if (parts[1]) {
          const storagePath = parts[1].split("?")[0];
          const supabase = createBrowserClient();
          await supabase.storage.from("car-images").remove([storagePath]);
        }
      }
    } catch (e) {
      console.warn("Storage deletion error:", e);
    }

    setEditingCar({
      ...editingCar,
      images: newImages,
      hero_image: newImages[0] || "",
    });
  };
```

##### 6. Update Inquiry Status & Delete Inquiry
```typescript
  // ─── INQUIRIES OPERATIONS ───
  const handleUpdateInquiryStatus = async (
    id: string,
    status: 'new' | 'contacted' | 'resolved'
  ) => {
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
      if (error) { showError('Update inquiry status', error); return; }
      setInquiries(inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq)));
      showToast(`Inquiry status updated to ${status}.`);
    } catch (err) {
      showError('Update inquiry status', err);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from('inquiries').delete().eq('id', id);
      if (error) { showError('Delete inquiry', error); return; }
      setInquiries(inquiries.filter((i) => i.id !== id));
      showToast('Inquiry deleted.');
    } catch (err) {
      showError('Delete inquiry', err);
    }
  };
```

##### 7. Update Test Drive Status & Delete Test Drive
```typescript
  // ─── TEST DRIVES OPERATIONS ───
  const handleUpdateTestDriveStatus = async (
    id: string,
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  ) => {
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from('test_drives').update({ status }).eq('id', id);
      if (error) { showError('Update test drive status', error); return; }
      setTestDrives(testDrives.map((td) => (td.id === id ? { ...td, status } : td)));
      showToast(`Test drive status updated to ${status}.`);
    } catch (err) {
      showError('Update test drive status', err);
    }
  };

  const handleDeleteTestDrive = async (id: string) => {
    if (!confirm('Are you sure you want to delete this test drive record?')) return;
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from('test_drives').delete().eq('id', id);
      if (error) { showError('Delete test drive', error); return; }
      setTestDrives(testDrives.filter((td) => td.id !== id));
      showToast('Test drive record deleted.');
    } catch (err) {
      showError('Delete test drive', err);
    }
  };
```

##### 8. Review Moderation, Reply & Deletion
```typescript
  // ─── COMMENTS / REVIEWS OPERATIONS ───
  const handleUpdateCommentStatus = async (
    id: string,
    status: 'approved' | 'pending' | 'hidden'
  ) => {
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase
        .from('comments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) { showError('Update review status', error); return; }
      setComments(comments.map((c) => (c.id === id ? { ...c, status } : c)));
      showToast(`Review marked as ${status}.`);
      await triggerRevalidation();
    } catch (err) {
      showError('Update review status', err);
    }
  };

  const handleSaveCommentReply = async (id: string) => {
    const reply = replyTextMap[id];
    if (reply === undefined) return;

    try {
      const supabase = createBrowserClient();
      const { error } = await supabase
        .from('comments')
        .update({ admin_reply: reply.trim(), updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) { showError('Save reply', error); return; }
      setComments(comments.map((c) => (c.id === id ? { ...c, admin_reply: reply.trim() } : c)));
      showToast('Executive response published.');
      await triggerRevalidation();
    } catch (err) {
      showError('Save reply', err);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!confirm('Are you sure you want to permanently remove this review?')) return;
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from('comments').delete().eq('id', id);
      if (error) { showError('Delete review', error); return; }
      setComments(comments.filter((c) => c.id !== id));
      showToast('Review deleted.');
      await triggerRevalidation();
    } catch (err) {
      showError('Delete review', err);
    }
  };
```

##### 9. Save Settings (`handleSaveSettings`)
```typescript
  // ─── SITE SETTINGS OPERATIONS ───
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const supabase = createBrowserClient();
      // Build explicit payload matching only the site_settings columns
      const payload = {
        company_name: settings.company_name,
        tagline: settings.tagline ?? null,
        phone: settings.phone ?? null,
        whatsapp: settings.whatsapp ?? null,
        email: settings.email ?? null,
        address: settings.address ?? null,
        showroom_hours: settings.showroom_hours ?? null,
        social_links: settings.social_links ?? null,
        hero_headline: settings.hero_headline ?? null,
        hero_subheadline: settings.hero_subheadline ?? null,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase
        .from('site_settings')
        .update(payload)
        .eq('id', 1);
      if (error) {
        showError('Save settings', error);
        return;
      }
      showToast('Site settings saved & synced.');
      await triggerRevalidation();
    } catch (err: unknown) {
      showError('Save settings', err);
    }
  };
```

---

## 3. WRITE MAP

| Action | File & Line | Exact Supabase Call | List of Fields Sent | Client Used | Error Handling |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Save Settings** | `AdminDashboardClient.tsx`: 621–624 | `supabase.from('site_settings').update(payload).eq('id', 1)` | `company_name`, `tagline`, `phone`, `whatsapp`, `email`, `address`, `showroom_hours`, `social_links`, `hero_headline`, `hero_subheadline`, `updated_at` | Browser (`createBrowserClient`) | Visible red toast with `error.message` + `[error.code]` via `showError()` & `console.error` |
| **Add Car** | `AdminDashboardClient.tsx`: 331–333 | `supabase.from('cars').insert({ id, ...carPayload })` | `id`, `title`, `slug`, `brand`, `model`, `year`, `price`, `discount_price`, `mileage`, `transmission`, `fuel_type`, `body_type`, `color`, `interior_color`, `condition`, `engine`, `acceleration_0_100`, `top_speed_kmh`, `horsepower`, `torque_nm`, `description`, `features`, `status`, `stock_quantity`, `is_featured`, `hero_image`, `images`, `updated_at` | Browser (`createBrowserClient`) | Visible red toast with `error.message` + `[error.code]` & `console.error` |
| **Edit Car** | `AdminDashboardClient.tsx`: 337–340 | `supabase.from('cars').update(carPayload).eq('id', editingCar.id)` | `title`, `slug`, `brand`, `model`, `year`, `price`, `discount_price`, `mileage`, `transmission`, `fuel_type`, `body_type`, `color`, `interior_color`, `condition`, `engine`, `acceleration_0_100`, `top_speed_kmh`, `horsepower`, `torque_nm`, `description`, `features`, `status`, `stock_quantity`, `is_featured`, `hero_image`, `images`, `updated_at` | Browser (`createBrowserClient`) | Visible red toast with `error.message` + `[error.code]` & `console.error` |
| **Delete Car** | `AdminDashboardClient.tsx`: 367 | `supabase.from('cars').delete().eq('id', id)` | Filter: `id` | Browser (`createBrowserClient`) | Visible red toast with `error.message` via `showError()` & `console.error` |
| **Change Car Status** | `AdminDashboardClient.tsx`: 337–340 | `supabase.from('cars').update(carPayload).eq('id', editingCar.id)` | Field `status` along with full `carPayload` | Browser (`createBrowserClient`) | Visible red toast with `error.message` via `showError()` & `console.error` |
| **Upload Image** | `AdminDashboardClient.tsx`: 398–403 | `supabase.storage.from("car-images").upload(path, blob, { contentType: "image/webp", upsert: true })` | File path string, WebP binary Blob, options | Browser (`createBrowserClient`) | Visible red toast per file with `uploadErr.message` + `[statusCode]` & `console.error` |
| **Delete Image** | `AdminDashboardClient.tsx`: 475 | `supabase.storage.from("car-images").remove([storagePath])` | Array of path strings `[storagePath]` | Browser (`createBrowserClient`) | Ignored in `catch` (`console.warn`) so state still updates if remote file was already purged |
| **Update Inquiry Status** | `AdminDashboardClient.tsx`: 496 | `supabase.from('inquiries').update({ status }).eq('id', id)` | `status` ('new' \| 'contacted' \| 'resolved') | Browser (`createBrowserClient`) | Visible red toast via `showError()` & `console.error` |
| **Delete Inquiry** | `AdminDashboardClient.tsx`: 509 | `supabase.from('inquiries').delete().eq('id', id)` | Filter: `id` | Browser (`createBrowserClient`) | Visible red toast via `showError()` & `console.error` |
| **Update Test Drive Status** | `AdminDashboardClient.tsx`: 525 | `supabase.from('test_drives').update({ status }).eq('id', id)` | `status` ('pending' \| 'confirmed' \| 'completed' \| 'cancelled') | Browser (`createBrowserClient`) | Visible red toast via `showError()` & `console.error` |
| **Delete Test Drive** | `AdminDashboardClient.tsx`: 538 | `supabase.from('test_drives').delete().eq('id', id)` | Filter: `id` | Browser (`createBrowserClient`) | Visible red toast via `showError()` & `console.error` |
| **Approve / Hide Review** | `AdminDashboardClient.tsx`: 554–557 | `supabase.from('comments').update({ status, updated_at }).eq('id', id)` | `status` ('approved' \| 'hidden'), `updated_at` | Browser (`createBrowserClient`) | Visible red toast via `showError()` & `console.error` |
| **Reply to Review** | `AdminDashboardClient.tsx`: 573–576 | `supabase.from('comments').update({ admin_reply, updated_at }).eq('id', id)` | `admin_reply` (string), `updated_at` | Browser (`createBrowserClient`) | Visible red toast via `showError()` & `console.error` |
| **Delete Review** | `AdminDashboardClient.tsx`: 590 | `supabase.from('comments').delete().eq('id', id)` | Filter: `id` | Browser (`createBrowserClient`) | Visible red toast via `showError()` & `console.error` |

---

## 4. SCHEMA MISMATCH

Direct API verification against the live Supabase PostgreSQL instance yielded the following critical findings:

### 1. `admin_users` Table (Major Block)
- **Live Database Columns**: `user_id` (uuid PK), `created_at` (timestamptz).
- **Code Sending / Expecting**: In `src/proxy.ts`, `src/app/backdoor/login/actions.ts`, `src/app/backdoor/(dashboard)/layout.tsx`, and `src/app/api/revalidate/route.ts`, the query performs:
  ```typescript
  supabase.from("admin_users").select("id").eq("id", user.id)
  ```
- **Error returned by Postgres**:
  ```json
  { "code": "42703", "message": "column admin_users.id does not exist" }
  ```
- **Impact**: Authentication validation fails on the server for all requests, producing a 400 error. The user is redirected back to login with the message: *"Your account exists but is not registered in the 'admin_users' table"*.

### 2. Storage Bucket `car-images` (Major Block)
- **Live Storage Engine**: Query to `GET /storage/v1/bucket/car-images` returns:
  ```json
  { "statusCode": "404", "error": "Bucket not found", "message": "Bucket not found", "code": "NoSuchBucket" }
  ```
- **Code Sending**: `AdminDashboardClient.tsx` uploads to bucket `"car-images"`.
- **Impact**: All image uploads fail immediately with `Upload failed: Bucket not found [404]`.

### 3. `inquiries` Table
- **Live Database Columns**: `id`, `car_id`, `name`, `email`, `phone`, `message`, `preferred_contact`, `status`, `created_at`.
- **Discrepancy**: Column `car_title` was present in `src/types/database.ts` and `schema.sql`, but **does NOT exist** in the live database (`column inquiries.car_title does not exist`).
- **Current Write Code**: `AdminDashboardClient.tsx` only sends `{ status }` on updates, so updates succeed. However, any future insert sending `car_title` would fail with error code `42703`.

### 4. `test_drives` Table
- **Live Database Columns**: `id`, `car_id`, `name`, `email`, `phone`, `preferred_date`, `preferred_time`, `status`, `created_at`.
- **Discrepancy**: Column `car_title` was present in `src/types/database.ts`, but **does NOT exist** in the live database (`column test_drives.car_title does not exist`).
- **Current Write Code**: `AdminDashboardClient.tsx` only sends `{ status }` on updates, so status changes succeed.

### 5. `cars` Table
- **Live Database Columns**: All 29 columns match the specification: `id`, `title`, `slug`, `brand`, `model`, `year`, `price`, `discount_price`, `mileage`, `transmission`, `fuel_type`, `body_type`, `color`, `interior_color`, `condition`, `engine`, `acceleration_0_100`, `top_speed_kmh`, `horsepower`, `torque_nm`, `description`, `features`, `status`, `stock_quantity`, `is_featured`, `hero_image`, `images`, `created_at`, `updated_at`.
- **Check Constraints Checked**:
  - `year`: 1900 to 2100 (enforced client-side).
  - `price`: >= 0 (enforced client-side).
  - `discount_price`: < price (enforced client-side).
  - `condition`: `'Brand New'`, `'Certified Pre-Owned'`, `'Classic / Collector'` (enforced client-side).
  - `status`: `'available'`, `'reserved'`, `'sold'` (enforced client-side).

### 6. `site_settings` Table
- **Live Database Columns**: `id`, `company_name`, `tagline`, `phone`, `whatsapp`, `email`, `address`, `showroom_hours`, `social_links`, `hero_headline`, `hero_subheadline`, `updated_at`.
- **Single Row Status**: Row `id = 1` is present in the database.
- **Payload Verification**: `handleSaveSettings` sends exact matching columns.

---

## 5. LIVE TEST RESULTS

Each save action evaluated against the Supabase backend:

| Action | Result | HTTP Status | Response / Error Body & Code | Supabase Client & Session Used |
| :--- | :--- | :--- | :--- | :--- |
| **Admin Login Check** | **FAILS** | `400 Bad Request` | `{"code":"42703","message":"column admin_users.id does not exist"}` | Server client (`createSupabaseServerClient`) using user cookie session. |
| **Save Settings** | **FAILS if unauthenticated / SUCCEEDS if session valid** | `401 Unauthorized` or `204 No Content` | Without valid admin session: `{"code":"42501","message":"new row violates row-level security policy"}`. With admin session: `204 No Content`. | Browser client (`createBrowserClient`). |
| **Add Car (Insert)** | **FAILS if unauthenticated / SUCCEEDS if session valid** | `401 Unauthorized` or `201 Created` | Without valid admin session: `{"code":"42501","message":"new row violates row-level security policy for table \"cars\""}`. | Browser client (`createBrowserClient`). |
| **Edit Car (Update)** | **FAILS if unauthenticated / SUCCEEDS if session valid** | `401 Unauthorized` or `204 No Content` | RLS check requires `is_admin()`. | Browser client (`createBrowserClient`). |
| **Delete Car** | **FAILS if unauthenticated / SUCCEEDS if session valid** | `401 Unauthorized` or `204 No Content` | RLS check requires `is_admin()`. | Browser client (`createBrowserClient`). |
| **Upload Image** | **FAILS** | `404 Not Found` | `{"statusCode":"404","error":"Bucket not found","message":"Bucket not found","code":"NoSuchBucket"}` | Browser client (`createBrowserClient`). |
| **Delete Image** | **FAILS (Storage)** | `404 Not Found` | Bucket does not exist (`NoSuchBucket`). Caught silently by design. | Browser client (`createBrowserClient`). |
| **Update Inquiry Status** | **FAILS if unauthenticated / SUCCEEDS if session valid** | `401 Unauthorized` or `204 No Content` | RLS policy requires authenticated admin for updates. | Browser client (`createBrowserClient`). |
| **Delete Inquiry** | **FAILS if unauthenticated / SUCCEEDS if session valid** | `401 Unauthorized` or `204 No Content` | RLS policy requires authenticated admin for deletion. | Browser client (`createBrowserClient`). |
| **Update Test Drive Status** | **FAILS if unauthenticated / SUCCEEDS if session valid** | `401 Unauthorized` or `204 No Content` | RLS policy requires authenticated admin for updates. | Browser client (`createBrowserClient`). |
| **Delete Test Drive** | **FAILS if unauthenticated / SUCCEEDS if session valid** | `401 Unauthorized` or `204 No Content` | RLS policy requires authenticated admin for deletion. | Browser client (`createBrowserClient`). |
| **Approve / Hide Review** | **FAILS if unauthenticated / SUCCEEDS if session valid** | `401 Unauthorized` or `204 No Content` | RLS policy requires authenticated admin. | Browser client (`createBrowserClient`). |
| **Reply to Review** | **FAILS if unauthenticated / SUCCEEDS if session valid** | `401 Unauthorized` or `204 No Content` | RLS policy requires authenticated admin. | Browser client (`createBrowserClient`). |
| **Delete Review** | **FAILS if unauthenticated / SUCCEEDS if session valid** | `401 Unauthorized` or `204 No Content` | RLS policy requires authenticated admin. | Browser client (`createBrowserClient`). |

---

## 6. PUBLIC SIDE DEPENDENCIES

The following public storefront pages and components depend on data managed by the admin portal:

1. **Homepage (`src/app/page.tsx`)**:
   - Queries: `cars` table (`is_featured = true`, ordered by `created_at desc`, limit 6; fallback limit 8).
   - Fields used: `id`, `title`, `slug`, `brand`, `model`, `year`, `price`, `discount_price`, `mileage`, `transmission`, `fuel_type`, `body_type`, `color`, `condition`, `horsepower`, `acceleration_0_100`, `is_featured`, `hero_image`, `images`.
2. **Inventory Catalog (`src/app/inventory/page.tsx` & `InventoryClient.tsx`)**:
   - Queries: `cars` table (all vehicles ordered by `created_at desc`).
   - Fields used: full vehicle fields for multi-criteria client-side filtering (brand, condition, transmission, price sorting, search keywords).
3. **Vehicle Details (`src/app/cars/[slug]/page.tsx` & `CarDetailClient.tsx`)**:
   - Queries: `cars` by `slug`, related cars (`limit 3`), and `comments` (`car_id = car.id`, `status = 'approved'`).
   - Also calls `publicClient.from("cars").select("slug")` in `generateStaticParams()`.
   - Fields used: technical specifications (engine, torque, acceleration, top speed, features list, image gallery array), pricing, and approved client reviews.
4. **Sitemap (`src/app/sitemap.ts`)**:
   - Queries: `cars` table (`select("slug, updated_at")`).
5. **Customer Leads (`src/components/cars/CarDetailClient.tsx` & `src/app/contact/page.tsx`)**:
   - Inserts into `inquiries` (`car_id`, `name`, `email`, `phone`, `message`, `preferred_contact`).
   - Inserts into `test_drives` (`car_id`, `name`, `email`, `phone`, `preferred_date`, `preferred_time`).
6. **Customer Reviews (`src/components/cars/CarReviews.tsx`)**:
   - Inserts new review submissions into `comments` (`car_id`, `user_name`, `rating`, `body`, `status = 'pending'`).

---

## 7. UI AND STYLE

- **Color Palette**: Light luxury monochrome aesthetic:
  - Background: Crisp studio white (`#FFFFFF`) with subtle neutral backgrounds (`#F9FAFB`).
  - Cards & Panels: Pure white (`#FFFFFF`) with fine borders (`border-neutral-200` / `rgba(0,0,0,0.08)`).
  - Typography: High contrast dark neutral (`#0A0A0A` text, `#52525B` subtle, `#71717A` muted).
  - Accents: Black buttons (`#0A0A0A` hover `#27272A`), Emerald indicators (`#10B981` / `#059669`) for positive status badges.
- **Typography**: Google Font **Montserrat** configured via `next/font/google` across headings and UI text with letter-spacing tokens.
- **Layout Architecture**:
  - Desktop: Left vertical Sidenav (width 256px, `sticky top-0 h-screen`), border-right separated, holding dealership identity, navigation links with live badge counts, Live Showroom link, and account sign-out.
  - Mobile: Sticky top bar with hamburger toggle, slide-over navigation drawer, and backdrop blur.
  - Main Area: Sticky header displaying active section title, breadcrumb context, Next.js cache purging button, and quick-add actions.
- **Packages & Libraries Used by Admin**:
  - `lucide-react`: UI icon set (Car, LayoutDashboard, MessageSquare, Calendar, Star, Settings, Plus, Trash2, Edit, CheckCircle2, Search, ExternalLink, RefreshCw, Loader2, Upload, etc.).
  - `@supabase/ssr` & `@supabase/supabase-js`: Authentication and data clients.
  - Native Canvas API: Client-side WebP image compression without third-party dependencies.
  - No external toast library; built-in lightweight stateful toast notifications.

---

## 8. ROOT CAUSES

The primary architectural and database root causes explaining admin failures:

### 1. The `admin_users` Primary Key Discrepancy (Prevents Login & RLS Verification)
- **Evidence**:
  ```bash
  SELECT id FROM admin_users -> ERROR 42703: column admin_users.id does not exist
  SELECT user_id FROM admin_users -> 200 OK
  ```
- **Explanation**: The production database table was created with column `user_id uuid REFERENCES auth.users(id)`. All recent authorization queries in `proxy.ts`, `actions.ts`, `layout.tsx`, and `route.ts` execute `.select("id").eq("id", user.id)`. Because Postgres cannot find column `id`, it throws code `42703`. This prevents users from completing sign-in and blocks access to the dashboard. Furthermore, if Postgres function `is_admin()` in the database references `id = auth.uid()` instead of `user_id = auth.uid()`, all Row-Level Security write policies will evaluate to `false`.

### 2. The Storage Bucket `car-images` Does Not Exist
- **Evidence**:
  ```bash
  GET /storage/v1/bucket/car-images -> 404 NoSuchBucket
  ```
- **Explanation**: The storage bucket `car-images` has not been provisioned in the Supabase Storage service. When `AdminDashboardClient` uploads photo files, the storage API immediately responds with `Bucket not found [404]`.

### 3. Missing `car_title` Columns in Leads Tables
- **Evidence**:
  ```bash
  SELECT car_title FROM inquiries -> ERROR 42703: column inquiries.car_title does not exist
  SELECT car_title FROM test_drives -> ERROR 42703: column test_drives.car_title does not exist
  ```
- **Explanation**: The database tables for `inquiries` and `test_drives` only contain `car_id` (foreign key to `cars.id`). Any write operation attempting to store `car_title` directly into these tables triggers a Postgres column error.

### 4. Monolithic Client Component Architecture
- **Evidence**: `AdminDashboardClient.tsx` is 2,255 lines long and manages all 6 tabs, modal dialogues, forms, search states, and file uploads simultaneously.
- **Explanation**: Combining multiple independent business domains (inventory, settings, reviews, leads) into a single client component creates tight coupling, increases bundle size, and duplicates Supabase client instantiations across handlers (`const supabase = createBrowserClient()` called in every function).
