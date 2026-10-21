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
      .select("user_id")
      .eq("user_id", user.id)
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
