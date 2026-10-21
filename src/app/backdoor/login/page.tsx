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
    <div className="w-full max-w-sm mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Back to Showroom</span>
        </Link>

        <h1 className="text-2xl font-medium tracking-tight text-[#0A0A0A]">
          Aston Auto Stores
        </h1>
        <p className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] mt-1">
          Backdoor Administration
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-xl border border-[#E8E8E8] p-7">
        <div className="pb-5 border-b border-[#E8E8E8] mb-6">
          <h2 className="text-sm font-medium text-[#0A0A0A]">Administrator Sign In</h2>
          <p className="text-xs text-[#6B6B6B] mt-0.5">Enter authorized credentials to continue</p>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed break-words">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@aston.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-white border border-[#E8E8E8] rounded-lg text-[#0A0A0A] placeholder:text-[#6B6B6B]/60 focus:outline-none focus:border-[#0A0A0A] transition-colors"
              />
              <Mail className="w-3.5 h-3.5 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-white border border-[#E8E8E8] rounded-lg text-[#0A0A0A] placeholder:text-[#6B6B6B]/60 focus:outline-none focus:border-[#0A0A0A] transition-colors"
              />
              <Lock className="w-3.5 h-3.5 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#0A0A0A] cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" strokeWidth={1.5} /> : <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#0A0A0A] text-white font-medium text-xs tracking-wide hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Sign In to Console</span>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-[#E8E8E8] flex items-center justify-center gap-1.5 text-[11px] text-[#6B6B6B]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0A0A0A]" strokeWidth={1.5} />
          <span>Role-Based Authentication Protected</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center items-center p-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20 text-[#6B6B6B] text-xs">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Loading portal...
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
