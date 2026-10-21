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
      .select("user_id")
      .eq("user_id", user.id)
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
