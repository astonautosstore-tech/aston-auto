"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/browser";

export default function AdminLogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
      router.push("/backdoor/login");
      router.refresh();
    } catch {
      router.push("/backdoor/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 transition-colors shadow-sm disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <LogOut className="w-3.5 h-3.5" />
      )}
      <span>Log Out</span>
    </button>
  );
}
