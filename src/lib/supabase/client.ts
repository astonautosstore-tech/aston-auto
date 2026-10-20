import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Car, Comment, Order, SiteSettings } from "@/types/database";
import { SEED_CARS, INITIAL_SITE_SETTINGS } from "@/lib/data/seed-cars";

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
    car_id: "11111111-1111-4111-8111-111111111111",
    user_name: "Adekunle Gold",
    rating: 5,
    body: "The specification and carbon aerokit on this DBS 770 Ultimate is astonishing. Delivery to our Ikoyi residence was seamless and white-glove.",
    status: "approved",
    admin_reply: "A pleasure serving you, Sir Adekunle. May every journey with the V12 be extraordinary.",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "comm-2",
    car_id: "11111111-1111-4111-8111-111111111111",
    user_name: "Dr. Femi Otedola",
    rating: 5,
    body: "Peerless grand touring. The British Racing Green paint depth under natural sunlight is breathtaking.",
    status: "approved",
    created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
  },
  {
    id: "comm-3",
    car_id: "33333333-3333-4333-8333-333333333333",
    user_name: "Chukwudi Nnamdi",
    rating: 5,
    body: "The downforce on the Weissach GT3 RS is mind-altering. Aston Auto Stores' concierge team arranged the private track inspection effortlessly.",
    status: "approved",
    admin_reply: "Thank you Chukwudi! Keep the revs singing to 9,000 RPM.",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

// In-memory / localStorage storage helpers for the fallback repository
const STORAGE_KEYS = {
  CARS: "aston_cars_data_v1",
  ORDERS: "aston_orders_data_v1",
  COMMENTS: "aston_comments_data_v1",
  SETTINGS: "aston_settings_data_v1",
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

/**
 * Universal Store API: Works seamlessly with either live Supabase or local mock storage
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
      if (!error && data) return data as Comment;
    }

    const current = getLocalStore<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    const updated = [newRecord, ...current];
    setLocalStore(STORAGE_KEYS.COMMENTS, updated);
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
      return;
    }
    const current = getLocalStore<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    const updated = current.map((c) => (c.id === id ? { ...c, status, admin_reply: adminReply || c.admin_reply } : c));
    setLocalStore(STORAGE_KEYS.COMMENTS, updated);
  },

  async deleteComment(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from("comments").delete().eq("id", id);
      return;
    }
    const current = getLocalStore<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    const updated = current.filter((c) => c.id !== id);
    setLocalStore(STORAGE_KEYS.COMMENTS, updated);
  },

  async createOrder(order: Order): Promise<Order> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from("orders").insert([order]).select().single();
      if (!error && data) {
        // Mark cars as reserved
        if (order.items && order.items.length > 0) {
          for (const item of order.items) {
            await supabase.from("cars").update({ status: "reserved" }).eq("id", item.car_id);
          }
        }
        return data as Order;
      }
    }

    // Fallback store
    const orders = getLocalStore<Order[]>(STORAGE_KEYS.ORDERS, []);
    setLocalStore(STORAGE_KEYS.ORDERS, [order, ...orders]);

    // Update car status to reserved
    const cars = getLocalStore<Car[]>(STORAGE_KEYS.CARS, SEED_CARS);
    const carIdsToReserve = (order.items || []).map((i) => i.car_id);
    const updatedCars = cars.map((c) =>
      carIdsToReserve.includes(c.id) ? { ...c, status: "reserved" as const } : c
    );
    setLocalStore(STORAGE_KEYS.CARS, updatedCars);

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
      return;
    }
    const orders = getLocalStore<Order[]>(STORAGE_KEYS.ORDERS, []);
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setLocalStore(STORAGE_KEYS.ORDERS, updated);
  },

  async saveCar(car: Car): Promise<Car> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from("cars").upsert([car]).select().single();
      if (!error && data) return data as Car;
    }
    const cars = getLocalStore<Car[]>(STORAGE_KEYS.CARS, SEED_CARS);
    const exists = cars.some((c) => c.id === car.id);
    const updated = exists ? cars.map((c) => (c.id === car.id ? car : c)) : [car, ...cars];
    setLocalStore(STORAGE_KEYS.CARS, updated);
    return car;
  },

  async deleteCar(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from("cars").delete().eq("id", id);
      return;
    }
    const cars = getLocalStore<Car[]>(STORAGE_KEYS.CARS, SEED_CARS);
    const updated = cars.filter((c) => c.id !== id);
    setLocalStore(STORAGE_KEYS.CARS, updated);
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
    return updated;
  },
};
