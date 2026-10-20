import { createBrowserClient as ssrCreateBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return ssrCreateBrowserClient(supabaseUrl, supabaseAnonKey);
}

export { createClient as createBrowserClient };
