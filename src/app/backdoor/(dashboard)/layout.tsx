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
    .select("user_id")
    .eq("user_id", user.id)
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
