import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import { Car, Comment, Inquiry, TestDriveRequest, SiteSettings } from "@/types/database";
import { BLOG_ARTICLES, BlogArticle } from "@/lib/data/blog-articles";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("placeholder") &&
  supabaseUrl.startsWith("https://")
);

function getClient(): SupabaseClient {
  if (!isSupabaseConfigured) {
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        "Supabase is not configured. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file."
      );
    }
  }
  return createBrowserClient(supabaseUrl || "", supabaseAnonKey || "");
}

// Client singleton for client-side interactions
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createBrowserClient(supabaseUrl!, supabaseAnonKey!)
  : null;

function notifyEvent(eventName: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(eventName));
  }
}

/**
 * Universal Store API: backed strictly by live Supabase.
 * No mock data or localStorage fallbacks.
 */
export const storeApi = {
  // ─── CARS ───
  async getCars(): Promise<Car[]> {
    const client = getClient();
    const { data, error } = await client
      .from("cars")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching cars from Supabase:", error.message);
      return [];
    }
    return (data || []) as Car[];
  },

  async getCarBySlug(slug: string): Promise<Car | null> {
    const client = getClient();
    const { data, error } = await client
      .from("cars")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return null;
    }
    return data as Car;
  },

  async saveCar(car: Partial<Car>): Promise<Car> {
    const client = getClient();
    const { data, error } = await client
      .from("cars")
      .upsert([car])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save car: ${error.message}`);
    }
    notifyEvent("aston_cars_updated");
    return data as Car;
  },

  async deleteCar(id: string): Promise<void> {
    const client = getClient();
    const { error } = await client.from("cars").delete().eq("id", id);
    if (error) {
      throw new Error(`Failed to delete car: ${error.message}`);
    }
    notifyEvent("aston_cars_updated");
  },

  // ─── REVIEWS / COMMENTS ───
  async getComments(carId?: string): Promise<Comment[]> {
    const client = getClient();
    let query = client.from("comments").select("*").eq("status", "approved");
    if (carId) query = query.eq("car_id", carId);
    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error.message);
      return [];
    }
    return (data || []) as Comment[];
  },

  async addComment(comment: {
    car_id: string;
    user_name: string;
    rating: number;
    body: string;
  }): Promise<void> {
    const client = getClient();
    // Insert with status: 'pending' without calling .select()
    // Anon users cannot read pending rows under RLS
    const { error } = await client.from("comments").insert([
      {
        car_id: comment.car_id,
        user_name: comment.user_name,
        rating: comment.rating,
        body: comment.body,
        status: "pending",
      },
    ]);

    if (error) {
      throw new Error(`Failed to submit review: ${error.message}`);
    }
    notifyEvent("aston_comments_updated");
  },

  async getAllCommentsForAdmin(): Promise<Comment[]> {
    const client = getClient();
    const { data, error } = await client
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching admin comments:", error.message);
      return [];
    }
    return (data || []) as Comment[];
  },

  async updateCommentStatus(
    id: string,
    status: "pending" | "approved" | "hidden",
    adminReply?: string
  ): Promise<void> {
    const client = getClient();
    const updates: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (adminReply !== undefined) {
      updates.admin_reply = adminReply;
    }
    const { error } = await client.from("comments").update(updates).eq("id", id);
    if (error) {
      throw new Error(`Failed to update review status: ${error.message}`);
    }
    notifyEvent("aston_comments_updated");
  },

  async deleteComment(id: string): Promise<void> {
    const client = getClient();
    const { error } = await client.from("comments").delete().eq("id", id);
    if (error) {
      throw new Error(`Failed to delete comment: ${error.message}`);
    }
    notifyEvent("aston_comments_updated");
  },

  // ─── INQUIRIES ───
  async submitInquiry(inquiry: {
    car_id?: string;
    car_title?: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    preferred_contact?: "whatsapp" | "call" | "email";
  }): Promise<void> {
    const client = getClient();
    // Insert without .select()
    const { error } = await client.from("inquiries").insert([
      {
        ...inquiry,
        preferred_contact: inquiry.preferred_contact || "whatsapp",
        status: "new",
      },
    ]);

    if (error) {
      throw new Error(`Failed to submit inquiry: ${error.message}`);
    }
    notifyEvent("aston_inquiries_updated");
  },

  async getInquiries(): Promise<Inquiry[]> {
    const client = getClient();
    const { data, error } = await client
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching inquiries:", error.message);
      return [];
    }
    return (data || []) as Inquiry[];
  },

  async updateInquiryStatus(id: string, status: Inquiry["status"]): Promise<void> {
    const client = getClient();
    const { error } = await client.from("inquiries").update({ status }).eq("id", id);
    if (error) {
      throw new Error(`Failed to update inquiry status: ${error.message}`);
    }
    notifyEvent("aston_inquiries_updated");
  },

  async deleteInquiry(id: string): Promise<void> {
    const client = getClient();
    const { error } = await client.from("inquiries").delete().eq("id", id);
    if (error) {
      throw new Error(`Failed to delete inquiry: ${error.message}`);
    }
    notifyEvent("aston_inquiries_updated");
  },

  // ─── TEST DRIVES ───
  async submitTestDrive(testDrive: {
    car_id: string;
    car_title?: string;
    name: string;
    email: string;
    phone: string;
    preferred_date: string;
    preferred_time: string;
  }): Promise<void> {
    const client = getClient();
    // Insert without .select()
    const { error } = await client.from("test_drives").insert([
      {
        ...testDrive,
        status: "pending",
      },
    ]);

    if (error) {
      throw new Error(`Failed to submit test drive request: ${error.message}`);
    }
    notifyEvent("aston_test_drives_updated");
  },

  async getTestDrives(): Promise<TestDriveRequest[]> {
    const client = getClient();
    const { data, error } = await client
      .from("test_drives")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching test drives:", error.message);
      return [];
    }
    return (data || []) as TestDriveRequest[];
  },

  async updateTestDriveStatus(id: string, status: TestDriveRequest["status"]): Promise<void> {
    const client = getClient();
    const { error } = await client.from("test_drives").update({ status }).eq("id", id);
    if (error) {
      throw new Error(`Failed to update test drive status: ${error.message}`);
    }
    notifyEvent("aston_test_drives_updated");
  },

  async deleteTestDrive(id: string): Promise<void> {
    const client = getClient();
    const { error } = await client.from("test_drives").delete().eq("id", id);
    if (error) {
      throw new Error(`Failed to delete test drive request: ${error.message}`);
    }
    notifyEvent("aston_test_drives_updated");
  },

  // ─── SITE SETTINGS ───
  async getSiteSettings(): Promise<SiteSettings | null> {
    const client = getClient();
    const { data, error } = await client
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error || !data) {
      return null;
    }
    return data as SiteSettings;
  },

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
    const client = getClient();
    const { error } = await client
      .from("site_settings")
      .update({
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    if (error) {
      throw new Error(`Failed to update site settings: ${error.message}`);
    }
    notifyEvent("aston_settings_updated");
  },

  // ─── EDITORIAL ARTICLES ───
  async getArticles(): Promise<BlogArticle[]> {
    return BLOG_ARTICLES;
  },

  async getArticleBySlug(slug: string): Promise<BlogArticle | null> {
    return BLOG_ARTICLES.find((a) => a.slug === slug) || null;
  },
};
