import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Car, Comment, Order, SiteSettings } from "@/types/database";
import { SEED_CARS, INITIAL_SITE_SETTINGS } from "@/lib/data/seed-cars";
import { BLOG_ARTICLES, BlogArticle } from "@/lib/data/blog-articles";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes("placeholder") && 
  supabaseUrl.startsWith("https://")
);

// Real client (null if unconfigured)
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Initial sample reviews for rich social proof
const INITIAL_COMMENTS: Comment[] = [
  {
    id: "comm-1",
    car_id: "col-aston-dbs",
    user_name: "Harrison Vance",
    rating: 5,
    body: "The specification and carbon aerokit on this DBS 770 Ultimate is astonishing. Delivery to our Beverly Hills residence was seamless and white-glove.",
    status: "approved",
    admin_reply: "A pleasure serving you, Harrison. May every journey with the V12 be extraordinary.",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "comm-2",
    car_id: "col-aston-dbs",
    user_name: "Dr. Jonathan Hayes",
    rating: 5,
    body: "Peerless grand touring. The British Racing Green paint depth under natural sunlight is breathtaking.",
    status: "approved",
    created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
  },
  {
    id: "comm-3",
    car_id: "col-porsche-911-gt3rs",
    user_name: "Marcus Sterling",
    rating: 5,
    body: "The downforce on the Weissach GT3 RS is mind-altering. The Aston concierge team arranged the private track inspection effortlessly.",
    status: "approved",
    admin_reply: "Thank you Marcus! Keep the revs singing to 9,000 RPM.",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

// In-memory / localStorage storage helpers for the fallback repository
const STORAGE_KEYS = {
  CARS: "aston_cars_data_v1",
  ORDERS: "aston_orders_data_v1",
  COMMENTS: "aston_comments_data_v1",
  SETTINGS: "aston_settings_data_v1",
  ARTICLES: "aston_articles_data_v1",
};

function getLocalStore<T>(key: string, defaultVal: T): T {
  if (typeof window === "undefined") return defaultVal;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocalStore<T>(key: string, val: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.warn("Local storage write error:", err);
  }
}

function notifyEvent(eventName: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(eventName));
  }
}

/**
 * Universal Store API: Works seamlessly with either live Supabase or local storage
 */
export const storeApi = {
  async getCars(): Promise<Car[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) return data as Car[];
    }
    return getLocalStore<Car[]>(STORAGE_KEYS.CARS, SEED_CARS);
  },

  async getCarBySlug(slug: string): Promise<Car | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("slug", slug)
        .single();
      if (!error && data) return data as Car;
    }
    const cars = getLocalStore<Car[]>(STORAGE_KEYS.CARS, SEED_CARS);
    return cars.find((c) => c.slug === slug) || null;
  },

  async getComments(carId?: string): Promise<Comment[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from("comments").select("*").eq("status", "approved");
      if (carId) query = query.eq("car_id", carId);
      const { data, error } = await query.order("created_at", { ascending: false });
      if (!error && data) return data as Comment[];
    }
    const comments = getLocalStore<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    if (carId) {
      return comments.filter((c) => c.car_id === carId && c.status === "approved");
    }
    return comments;
  },

  async addComment(comment: Omit<Comment, "id" | "created_at">): Promise<Comment> {
    const newRecord: Comment = {
      ...comment,
      id: `comm-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("comments")
        .insert([newRecord])
        .select()
        .single();
      if (!error && data) {
        notifyEvent("aston_comments_updated");
        return data as Comment;
      }
    }

    const current = getLocalStore<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    const updated = [newRecord, ...current];
    setLocalStore(STORAGE_KEYS.COMMENTS, updated);
    notifyEvent("aston_comments_updated");
    return newRecord;
  },

  async getAllCommentsForAdmin(): Promise<Comment[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data as Comment[];
    }
    return getLocalStore<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
  },

  async updateCommentStatus(id: string, status: "pending" | "approved" | "hidden", adminReply?: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from("comments")
        .update({ status, admin_reply: adminReply, updated_at: new Date().toISOString() })
        .eq("id", id);
      notifyEvent("aston_comments_updated");
      return;
    }
    const current = getLocalStore<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    const updated = current.map((c) => (c.id === id ? { ...c, status, admin_reply: adminReply || c.admin_reply } : c));
    setLocalStore(STORAGE_KEYS.COMMENTS, updated);
    notifyEvent("aston_comments_updated");
  },

  async deleteComment(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from("comments").delete().eq("id", id);
      notifyEvent("aston_comments_updated");
      return;
    }
    const current = getLocalStore<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    const updated = current.filter((c) => c.id !== id);
    setLocalStore(STORAGE_KEYS.COMMENTS, updated);
    notifyEvent("aston_comments_updated");
  },

  async createOrder(order: Order): Promise<Order> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from("orders").insert([order]).select().single();
      if (!error && data) {
        if (order.items && order.items.length > 0) {
          for (const item of order.items) {
            await supabase.from("cars").update({ status: "reserved" }).eq("id", item.car_id);
          }
        }
        notifyEvent("aston_orders_updated");
        notifyEvent("aston_cars_updated");
        return data as Order;
      }
    }

    const orders = getLocalStore<Order[]>(STORAGE_KEYS.ORDERS, []);
    setLocalStore(STORAGE_KEYS.ORDERS, [order, ...orders]);

    const cars = getLocalStore<Car[]>(STORAGE_KEYS.CARS, SEED_CARS);
    const carIdsToReserve = (order.items || []).map((i) => i.car_id);
    const updatedCars = cars.map((c) =>
      carIdsToReserve.includes(c.id) ? { ...c, status: "reserved" as const } : c
    );
    setLocalStore(STORAGE_KEYS.CARS, updatedCars);
    notifyEvent("aston_orders_updated");
    notifyEvent("aston_cars_updated");

    return order;
  },

  async getOrders(): Promise<Order[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data as Order[];
    }
    return getLocalStore<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  async updateOrderStatus(orderId: string, status: Order["status"]): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from("orders").update({ status }).eq("id", orderId);
      notifyEvent("aston_orders_updated");
      return;
    }
    const orders = getLocalStore<Order[]>(STORAGE_KEYS.ORDERS, []);
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setLocalStore(STORAGE_KEYS.ORDERS, updated);
    notifyEvent("aston_orders_updated");
  },

  async saveCar(car: Car): Promise<Car> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from("cars").upsert([car]).select().single();
      if (!error && data) {
        notifyEvent("aston_cars_updated");
        return data as Car;
      }
    }
    const cars = getLocalStore<Car[]>(STORAGE_KEYS.CARS, SEED_CARS);
    const exists = cars.some((c) => c.id === car.id);
    const updated = exists ? cars.map((c) => (c.id === car.id ? car : c)) : [car, ...cars];
    setLocalStore(STORAGE_KEYS.CARS, updated);
    notifyEvent("aston_cars_updated");
    return car;
  },

  async deleteCar(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from("cars").delete().eq("id", id);
      notifyEvent("aston_cars_updated");
      return;
    }
    const cars = getLocalStore<Car[]>(STORAGE_KEYS.CARS, SEED_CARS);
    const updated = cars.filter((c) => c.id !== id);
    setLocalStore(STORAGE_KEYS.CARS, updated);
    notifyEvent("aston_cars_updated");
  },

  async getSiteSettings(): Promise<SiteSettings> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
      if (!error && data) return data as SiteSettings;
    }
    return getLocalStore<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
  },

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSiteSettings();
    const updated = { ...current, ...settings };
    if (isSupabaseConfigured && supabase) {
      await supabase.from("site_settings").upsert([updated]);
    }
    setLocalStore(STORAGE_KEYS.SETTINGS, updated);
    notifyEvent("aston_settings_updated");
    return updated;
  },

  // ─── BLOG ARTICLES MANAGEMENT ───
  async getArticles(): Promise<BlogArticle[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          slug: d.slug,
          title: d.title,
          excerpt: d.excerpt,
          category: d.category,
          date: d.date,
          readTime: d.read_time || d.readTime || "5 min read",
          coverImage: d.cover_image || d.coverImage || "",
          featured: Boolean(d.featured),
          sections: d.sections || [],
        }));
      }
    }
    return getLocalStore<BlogArticle[]>(STORAGE_KEYS.ARTICLES, BLOG_ARTICLES);
  },

  async getArticleBySlug(slug: string): Promise<BlogArticle | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .single();
      if (!error && data) {
        return {
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt,
          category: data.category,
          date: data.date,
          readTime: data.read_time || data.readTime || "5 min read",
          coverImage: data.cover_image || data.coverImage || "",
          featured: Boolean(data.featured),
          sections: data.sections || [],
        };
      }
    }
    const articles = await this.getArticles();
    return articles.find((a) => a.slug === slug) || null;
  },

  async saveArticle(article: BlogArticle): Promise<BlogArticle> {
    if (isSupabaseConfigured && supabase) {
      const dbRow = {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        category: article.category,
        date: article.date,
        read_time: article.readTime,
        cover_image: article.coverImage,
        featured: Boolean(article.featured),
        sections: article.sections || [],
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("articles").upsert([dbRow]);
      if (!error) {
        notifyEvent("aston_articles_updated");
        return article;
      }
    }
    const articles = getLocalStore<BlogArticle[]>(STORAGE_KEYS.ARTICLES, BLOG_ARTICLES);
    const exists = articles.some((a) => a.slug === article.slug);
    const updated = exists
      ? articles.map((a) => (a.slug === article.slug ? article : a))
      : [article, ...articles];
    setLocalStore(STORAGE_KEYS.ARTICLES, updated);
    notifyEvent("aston_articles_updated");
    return article;
  },

  async deleteArticle(slug: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from("articles").delete().eq("slug", slug);
      notifyEvent("aston_articles_updated");
      return;
    }
    const articles = getLocalStore<BlogArticle[]>(STORAGE_KEYS.ARTICLES, BLOG_ARTICLES);
    const updated = articles.filter((a) => a.slug !== slug);
    setLocalStore(STORAGE_KEYS.ARTICLES, updated);
    notifyEvent("aston_articles_updated");
  },
};
