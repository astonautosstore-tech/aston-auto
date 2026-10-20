import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ExternalLink, User } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import Container from "@/components/ui/Container";

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
    redirect("/admin/login");
  }

  const { data: adminRecord } = await supabase
    .from("admin_users")
    .select("id, email")
    .eq("id", user.id)
    .single();

  if (!adminRecord) {
    redirect("/admin/login?error=unauthorized");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      {/* ─── ADMIN HEADER ─── */}
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
        <Container>
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Brand + Portal Label */}
            <div className="flex items-center gap-3">
              <Link href="/admin" className="flex items-center gap-2 group">
                <span className="font-extrabold tracking-tight text-xl text-neutral-950 group-hover:text-neutral-700 transition-colors">
                  ASTON
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-white">
                  Console
                </span>
              </Link>

              <span className="hidden sm:inline-block h-4 w-px bg-neutral-200" />
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Beverly Hills Dealership</span>
              </span>
            </div>

            {/* Right: Public Site Link, User Info & Logout */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/"
                target="_blank"
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-950 transition-colors"
              >
                <span>Live Showroom</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-700">
                <User className="w-3.5 h-3.5 text-neutral-400" />
                <span className="hidden sm:inline font-medium max-w-[150px] truncate">
                  {user.email}
                </span>
              </div>

              <AdminLogoutButton />
            </div>
          </div>
        </Container>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 pb-16">{children}</main>
    </div>
  );
}
