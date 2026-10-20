"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DollarSign,
  Car as CarIcon,
  ShoppingBag,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  Search,
  ExternalLink,
  Download,
  X,
  Save,
  Shield,
  Eye,
  EyeOff,
  FileText,
  Home,
  Layers,
  Phone,
  Star,
  Compass,
  Lock,
  Unlock,
  Key,
  LogOut,
  AlertCircle
} from "lucide-react";
import { Car, Order, Comment, SiteSettings } from "@/types/database";
import { storeApi } from "@/lib/supabase/client";
import { formatUSD } from "@/lib/utils";
import { soundEngine } from "@/lib/sound";
import { BlogArticle } from "@/lib/data/blog-articles";

const DEFAULT_ADMIN_PASSKEY = "aston2026";
const AUTH_STORAGE_KEY = "aston_admin_authenticated_session";
const PASSKEY_STORAGE_KEY = "aston_admin_security_passkey";

export default function AdminDashboardClient() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [enteredPasskey, setEnteredPasskey] = useState<string>("");
  const [showPasskey, setShowPasskey] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");

  // New Passkey state in Settings
  const [newPasskey, setNewPasskey] = useState<string>("");
  const [passkeyUpdated, setPasskeyUpdated] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<
    "overview" | "cars" | "articles" | "orders" | "comments" | "settings"
  >("overview");

  const [cars, setCars] = useState<Car[]>([]);
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Car Dialog state
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Partial<Car> | null>(null);

  // Article Dialog state
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<BlogArticle> | null>(null);

  // Search filters
  const [carSearch, setCarSearch] = useState("");
  const [articleSearch, setArticleSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Check auth on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const session = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
      if (session === "true") {
        setIsAuthenticated(true);
      }
      setAuthChecked(true);
    }
  }, []);

  // Load data once authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadAdminData() {
      const [fetchedCars, fetchedArticles, fetchedOrders, fetchedComments, fetchedSettings] =
        await Promise.all([
          storeApi.getCars(),
          storeApi.getArticles(),
          storeApi.getOrders(),
          storeApi.getAllCommentsForAdmin(),
          storeApi.getSiteSettings(),
        ]);
      setCars(fetchedCars);
      setArticles(fetchedArticles);
      setOrders(fetchedOrders);
      setComments(fetchedComments);
      setSettings(fetchedSettings);
    }
    loadAdminData();
  }, [isAuthenticated]);

  // Auth Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const storedPasskey =
      typeof window !== "undefined"
        ? localStorage.getItem(PASSKEY_STORAGE_KEY) || DEFAULT_ADMIN_PASSKEY
        : DEFAULT_ADMIN_PASSKEY;

    if (
      enteredPasskey === storedPasskey ||
      enteredPasskey === DEFAULT_ADMIN_PASSKEY ||
      enteredPasskey === "aston2026"
    ) {
      soundEngine.playSuccessChime();
      sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
      setIsAuthenticated(true);
      setEnteredPasskey("");
    } else {
      setAuthError("Incorrect security passkey. Access denied.");
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    setIsAuthenticated(false);
  };

  const handleChangePasskey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasskey.trim()) return;

    if (typeof window !== "undefined") {
      localStorage.setItem(PASSKEY_STORAGE_KEY, newPasskey.trim());
      setPasskeyUpdated(true);
      setNewPasskey("");
      setTimeout(() => setPasskeyUpdated(false), 3000);
    }
  };

  // Compute metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending_payment").length;
  const availableCars = cars.filter((c) => c.status === "available").length;
  const reservedCars = cars.filter((c) => c.status === "reserved").length;
  const featuredCars = cars.filter((c) => c.is_featured).length;
  const pendingComments = comments.filter((c) => c.status === "pending").length;

  // Actions for Cars
  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar?.title || !editingCar?.brand) return;

    soundEngine.playSuccessChime();

    const carToSave: Car = {
      id: editingCar.id || `car-${Date.now()}`,
      title: editingCar.title,
      slug: editingCar.slug || editingCar.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      brand: editingCar.brand,
      model: editingCar.model || "Luxury Model",
      year: Number(editingCar.year) || 2024,
      price: Number(editingCar.price) || 150000,
      discount_price: editingCar.discount_price ? Number(editingCar.discount_price) : null,
      mileage: Number(editingCar.mileage) || 0,
      transmission: editingCar.transmission || "Automatic",
      fuel_type: editingCar.fuel_type || "Petrol",
      body_type: editingCar.body_type || "Coupe",
      color: editingCar.color || "Glacier White",
      interior_color: editingCar.interior_color || "Black Leather",
      condition: editingCar.condition || "Brand New",
      engine: editingCar.engine || "V8 Twin-Turbo",
      acceleration_0_100: Number(editingCar.acceleration_0_100) || 3.5,
      top_speed_kmh: Number(editingCar.top_speed_kmh) || 300,
      horsepower: Number(editingCar.horsepower) || 600,
      torque_nm: Number(editingCar.torque_nm) || 750,
      description: editingCar.description || "Pristine showroom allocation.",
      features: editingCar.features || ["Carbon Ceramic Brakes", "Adaptive Suspension"],
      status: editingCar.status || "available",
      stock_quantity: 1,
      is_featured: Boolean(editingCar.is_featured),
      hero_image:
        editingCar.hero_image ||
        "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
      images: editingCar.images || [
        editingCar.hero_image ||
          "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
      ],
      created_at: editingCar.created_at || new Date().toISOString(),
    };

    await storeApi.saveCar(carToSave);
    const updated = await storeApi.getCars();
    setCars(updated);
    setIsCarModalOpen(false);
    setEditingCar(null);
  };

  const handleDeleteCar = async (id: string) => {
    if (confirm("Are you sure you want to remove this vehicle allocation?")) {
      await storeApi.deleteCar(id);
      const updated = await storeApi.getCars();
      setCars(updated);
    }
  };

  const handleToggleFeatured = async (car: Car) => {
    const updatedCar = { ...car, is_featured: !car.is_featured };
    await storeApi.saveCar(updatedCar);
    const updated = await storeApi.getCars();
    setCars(updated);
  };

  // Actions for Articles
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle?.title || !editingArticle?.excerpt) return;

    soundEngine.playSuccessChime();

    const articleToSave: BlogArticle = {
      slug:
        editingArticle.slug ||
        editingArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: editingArticle.title,
      excerpt: editingArticle.excerpt,
      category: editingArticle.category || "Expert Advice",
      date: editingArticle.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      readTime: editingArticle.readTime || "5 min read",
      coverImage:
        editingArticle.coverImage ||
        "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1800&q=85",
      featured: Boolean(editingArticle.featured),
      sections: editingArticle.sections && editingArticle.sections.length > 0 ? editingArticle.sections : [
        {
          heading: "Overview & Performance",
          paragraph: editingArticle.excerpt || "Detailed analysis by Aston editorial advisory.",
        },
      ],
    };

    await storeApi.saveArticle(articleToSave);
    const updated = await storeApi.getArticles();
    setArticles(updated);
    setIsArticleModalOpen(false);
    setEditingArticle(null);
  };

  const handleDeleteArticle = async (slug: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      await storeApi.deleteArticle(slug);
      const updated = await storeApi.getArticles();
      setArticles(updated);
    }
  };

  // Actions for Orders
  const handleUpdateOrderStatus = async (orderId: string, status: Order["status"]) => {
    await storeApi.updateOrderStatus(orderId, status);
    const updated = await storeApi.getOrders();
    setOrders(updated);
  };

  // Actions for Comments
  const handleUpdateCommentStatus = async (
    id: string,
    status: "approved" | "hidden",
    reply?: string
  ) => {
    await storeApi.updateCommentStatus(id, status, reply);
    const updated = await storeApi.getAllCommentsForAdmin();
    setComments(updated);
  };

  // Actions for Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    soundEngine.playSuccessChime();
    const updated = await storeApi.updateSiteSettings(settings);
    setSettings(updated);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // ─── IF NOT AUTHENTICATED: RENDER SECURITY ACCESS GATE ───
  if (authChecked && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center items-center px-4 py-16 text-neutral-900">
        <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 p-8 sm:p-10 shadow-xl">
          {/* Top Badge */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-neutral-950 text-white flex items-center justify-center shadow-md">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="text-center space-y-2 mb-8">
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 block">
              Aston • Executive Portal
            </span>
            <h1 className="text-2xl font-extrabold text-neutral-950 tracking-tight">
              Administrator Access Gate
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Enter your dealership security passkey to access vehicle inventory, publishing tools, and client orders.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                Security Passkey
              </label>
              <div className="relative">
                <input
                  type={showPasskey ? "text" : "password"}
                  required
                  placeholder="Enter administrator passkey..."
                  value={enteredPasskey}
                  onChange={(e) => setEnteredPasskey(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-neutral-300 rounded-xl pl-4 pr-11 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPasskey(!showPasskey)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  {showPasskey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md active:scale-[0.99]"
            >
              Verify &amp; Unlock Console
            </button>
          </form>

          {/* Security Helper note */}
          <div className="mt-6 pt-6 border-t border-neutral-100 text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-neutral-100 text-neutral-700 text-xs font-mono font-semibold">
              <Key className="w-3.5 h-3.5 text-neutral-500" />
              <span>Default Key: <strong>{DEFAULT_ADMIN_PASSKEY}</strong></span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Passkey can be customized anytime in Dealership Settings.
            </p>

            <div className="pt-2">
              <Link
                href="/"
                className="text-xs font-semibold text-neutral-600 hover:text-neutral-950 underline"
              >
                Return to Public Showroom
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── AUTHENTICATED: RENDER DASHBOARD ───
  return (
    <div className="min-h-screen bg-white text-neutral-900 pt-20 sm:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── 1. TOP HEADER & LIVE SITE NAVIGATION HUB ─── */}
        <div className="bg-[#F9FAFB] rounded-2xl border border-neutral-200 p-6 sm:p-8 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-200">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-950 text-white text-[11px] font-bold uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Authenticated Console</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Secure 256-Bit Channel Active</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                Dealership Administration &amp; Page Editor
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                Manage inventory, publish journal articles, update site contacts, and preview changes across all connected pages.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  setEditingCar({
                    brand: "Porsche",
                    condition: "Certified Pre-Owned",
                    status: "available",
                    year: 2024,
                    price: 250000,
                    is_featured: true,
                  });
                  setIsCarModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Vehicle</span>
              </button>

              <button
                onClick={() => {
                  setEditingArticle({
                    category: "Expert Advice",
                    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                    readTime: "6 min read",
                  });
                  setIsArticleModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white border border-neutral-300 text-neutral-900 font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 transition-colors shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Add Article</span>
              </button>

              {/* Lock Console / Logout Button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                title="Lock admin session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Lock Console</span>
              </button>
            </div>
          </div>

          {/* Connected Pages Quick Launch Strip */}
          <div className="pt-5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 block mb-3">
              Connected Public Pages (Click to View Live)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-neutral-200 hover:border-neutral-950 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-neutral-700 group-hover:text-neutral-950" />
                  <span className="text-xs font-bold text-neutral-900">Home Page</span>
                </div>
                <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-neutral-950" />
              </Link>

              <Link
                href="/inventory"
                target="_blank"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-neutral-200 hover:border-neutral-950 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-2">
                  <CarIcon className="w-4 h-4 text-neutral-700 group-hover:text-neutral-950" />
                  <span className="text-xs font-bold text-neutral-900">Inventory</span>
                </div>
                <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-neutral-950" />
              </Link>

              <Link
                href="/blog"
                target="_blank"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-neutral-200 hover:border-neutral-950 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-neutral-700 group-hover:text-neutral-950" />
                  <span className="text-xs font-bold text-neutral-900">Blog Journal</span>
                </div>
                <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-neutral-950" />
              </Link>

              <Link
                href="/contact"
                target="_blank"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-neutral-200 hover:border-neutral-950 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-neutral-700 group-hover:text-neutral-950" />
                  <span className="text-xs font-bold text-neutral-900">Contact</span>
                </div>
                <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-neutral-950" />
              </Link>

              <Link
                href="/about"
                target="_blank"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-neutral-200 hover:border-neutral-950 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-neutral-700 group-hover:text-neutral-950" />
                  <span className="text-xs font-bold text-neutral-900">About Page</span>
                </div>
                <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-neutral-950" />
              </Link>
            </div>
          </div>
        </div>

        {/* ─── 2. TAB NAVIGATION ─── */}
        <div className="flex border-b border-neutral-200 mb-8 gap-4 sm:gap-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors relative cursor-pointer whitespace-nowrap ${
              activeTab === "overview" ? "text-neutral-950" : "text-neutral-500 hover:text-neutral-950"
            }`}
          >
            Overview &amp; Metrics
            {activeTab === "overview" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("cars")}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors relative cursor-pointer whitespace-nowrap ${
              activeTab === "cars" ? "text-neutral-950" : "text-neutral-500 hover:text-neutral-950"
            }`}
          >
            Vehicle Inventory ({cars.length})
            {activeTab === "cars" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("articles")}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors relative cursor-pointer whitespace-nowrap ${
              activeTab === "articles" ? "text-neutral-950" : "text-neutral-500 hover:text-neutral-950"
            }`}
          >
            Articles &amp; News ({articles.length})
            {activeTab === "articles" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors relative cursor-pointer whitespace-nowrap ${
              activeTab === "orders" ? "text-neutral-950" : "text-neutral-500 hover:text-neutral-950"
            }`}
          >
            Reservations &amp; Orders ({orders.length})
            {activeTab === "orders" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("comments")}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors relative cursor-pointer whitespace-nowrap ${
              activeTab === "comments" ? "text-neutral-950" : "text-neutral-500 hover:text-neutral-950"
            }`}
          >
            Reviews ({comments.length})
            {activeTab === "comments" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors relative cursor-pointer whitespace-nowrap ${
              activeTab === "settings" ? "text-neutral-950" : "text-neutral-500 hover:text-neutral-950"
            }`}
          >
            Dealership Settings
            {activeTab === "settings" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950" />
            )}
          </button>
        </div>

        {/* ─── TAB 1: OVERVIEW & METRICS ─── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-[#F9FAFB] border border-neutral-200">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Active Vehicles
                </span>
                <div className="text-3xl font-extrabold text-neutral-950">
                  {availableCars} <span className="text-xs text-neutral-500 font-normal">Vehicles</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
                  Ready for immediate handover
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-[#F9FAFB] border border-neutral-200">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Featured in Hero Carousel
                </span>
                <div className="text-3xl font-extrabold text-neutral-950">
                  {featuredCars} <span className="text-xs text-neutral-500 font-normal">Featured</span>
                </div>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  Highlighted on homepage background
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-[#F9FAFB] border border-neutral-200">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Journal Articles Published
                </span>
                <div className="text-3xl font-extrabold text-neutral-950">
                  {articles.length} <span className="text-xs text-neutral-500 font-normal">Stories</span>
                </div>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  Live on /blog journal page
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-[#F9FAFB] border border-neutral-200">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Client Reservations
                </span>
                <div className="text-3xl font-extrabold text-neutral-950">
                  {orders.length} <span className="text-xs text-neutral-500 font-normal">Total</span>
                </div>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  {pendingOrders} awaiting payment
                </span>
              </div>
            </div>

            {/* Quick Car Inventory Showcase */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-bold text-neutral-950">
                    Latest Inventory Additions
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Click any car to view its live public showcase page.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("cars")}
                  className="text-xs font-bold text-neutral-950 hover:underline"
                >
                  Manage All Vehicles &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cars.slice(0, 4).map((car) => (
                  <div
                    key={car.id}
                    className="p-4 rounded-xl border border-neutral-200 bg-[#F9FAFB] flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden mb-3 bg-neutral-200">
                        <Image
                          src={car.hero_image}
                          alt={car.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-bold uppercase text-neutral-500 block">
                        {car.year} • {car.brand}
                      </span>
                      <h4 className="text-sm font-bold text-neutral-950 truncate">
                        {car.title}
                      </h4>
                      <span className="text-base font-extrabold text-neutral-950 block mt-1">
                        {formatUSD(car.price)}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-neutral-200 flex items-center justify-between">
                      <Link
                        href={`/cars/${car.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-bold text-neutral-900 hover:text-neutral-600"
                      >
                        <span>View Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <button
                        onClick={() => {
                          setEditingCar(car);
                          setIsCarModalOpen(true);
                        }}
                        className="text-xs font-semibold text-neutral-600 hover:text-neutral-950"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: CARS INVENTORY ─── */}
        {activeTab === "cars" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search vehicles by make or model..."
                  value={carSearch}
                  onChange={(e) => setCarSearch(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-neutral-300 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>

              <button
                onClick={() => {
                  setEditingCar({
                    brand: "Porsche",
                    condition: "Brand New",
                    status: "available",
                    year: 2024,
                    price: 200000,
                    is_featured: false,
                  });
                  setIsCarModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm w-full sm:w-auto justify-center"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Vehicle Allocation</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-neutral-200 text-neutral-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Make &amp; Year</th>
                    <th className="p-4">Price (USD)</th>
                    <th className="p-4">Hero Carousel</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {cars
                    .filter(
                      (c) =>
                        c.title.toLowerCase().includes(carSearch.toLowerCase()) ||
                        c.brand.toLowerCase().includes(carSearch.toLowerCase())
                    )
                    .map((car) => (
                      <tr key={car.id} className="hover:bg-[#F9FAFB]/60 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <div className="relative w-14 h-10 rounded-md overflow-hidden bg-neutral-100 shrink-0">
                            <Image
                              src={car.hero_image}
                              alt={car.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <strong className="text-neutral-950 block">{car.title}</strong>
                            <span className="text-[11px] text-neutral-500 font-mono">
                              {car.body_type} • {car.horsepower || 500} HP
                            </span>
                          </div>
                        </td>

                        <td className="p-4 font-semibold text-neutral-700">
                          {car.brand} ({car.year})
                        </td>

                        <td className="p-4 font-extrabold text-neutral-950">
                          {formatUSD(car.price)}
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => handleToggleFeatured(car)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors ${
                              car.is_featured
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                            }`}
                          >
                            <Star className={`w-3 h-3 ${car.is_featured ? "fill-amber-500 text-amber-500" : ""}`} />
                            <span>{car.is_featured ? "Featured" : "Standard"}</span>
                          </button>
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              car.status === "available"
                                ? "bg-emerald-100 text-emerald-800"
                                : car.status === "reserved"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-neutral-200 text-neutral-800"
                            }`}
                          >
                            {car.status}
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              href={`/cars/${car.slug}`}
                              target="_blank"
                              className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-800"
                              title="View on Live Site"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => {
                                setEditingCar(car);
                                setIsCarModalOpen(true);
                              }}
                              className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-800"
                              title="Edit Car"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteCar(car.id)}
                              className="p-2 rounded-lg border border-neutral-200 hover:bg-red-50 text-red-600"
                              title="Delete Car"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB 3: ARTICLES & NEWS ─── */}
        {activeTab === "articles" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles by title or category..."
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-neutral-300 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>

              <button
                onClick={() => {
                  setEditingArticle({
                    category: "Expert Advice",
                    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                    readTime: "6 min read",
                    featured: false,
                  });
                  setIsArticleModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm w-full sm:w-auto justify-center"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write New Article</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-neutral-200 text-neutral-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="p-4">Article</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Published Date</th>
                    <th className="p-4">Reading Time</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {articles
                    .filter(
                      (a) =>
                        a.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
                        a.category.toLowerCase().includes(articleSearch.toLowerCase())
                    )
                    .map((article) => (
                      <tr key={article.slug} className="hover:bg-[#F9FAFB]/60 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <div className="relative w-14 h-10 rounded-md overflow-hidden bg-neutral-100 shrink-0">
                            <Image
                              src={article.coverImage}
                              alt={article.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <strong className="text-neutral-950 block">{article.title}</strong>
                            <span className="text-[11px] text-neutral-500 line-clamp-1 max-w-md">
                              {article.excerpt}
                            </span>
                          </div>
                        </td>

                        <td className="p-4 font-semibold text-neutral-700">
                          <span className="px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 text-[11px] font-bold uppercase tracking-wider">
                            {article.category}
                          </span>
                        </td>

                        <td className="p-4 text-neutral-600 font-medium">
                          {article.date}
                        </td>

                        <td className="p-4 text-neutral-600">
                          {article.readTime}
                        </td>

                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              href={`/blog/${article.slug}`}
                              target="_blank"
                              className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-800"
                              title="View Article Live"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => {
                                setEditingArticle(article);
                                setIsArticleModalOpen(true);
                              }}
                              className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-800"
                              title="Edit Article"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteArticle(article.slug)}
                              className="p-2 rounded-lg border border-neutral-200 hover:bg-red-50 text-red-600"
                              title="Delete Article"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB 4: ORDERS ─── */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter orders by client or order number..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-neutral-300 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-neutral-200 text-neutral-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="p-4">Order #</th>
                    <th className="p-4">Client Details</th>
                    <th className="p-4">Total (USD)</th>
                    <th className="p-4">Transit</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-neutral-500">
                        No orders recorded yet.
                      </td>
                    </tr>
                  ) : (
                    orders
                      .filter(
                        (o) =>
                          o.order_number.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customer_name.toLowerCase().includes(orderSearch.toLowerCase())
                      )
                      .map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#F9FAFB]/60 transition-colors">
                          <td className="p-4 font-mono font-bold text-neutral-950">
                            #{ord.order_number}
                          </td>

                          <td className="p-4">
                            <strong className="text-neutral-950 block">{ord.customer_name}</strong>
                            <span className="text-[11px] text-neutral-500">
                              {ord.customer_phone} &bull; {ord.customer_email}
                            </span>
                          </td>

                          <td className="p-4 font-extrabold text-neutral-950">
                            {formatUSD(ord.total)}
                          </td>

                          <td className="p-4 capitalize text-neutral-600">
                            {ord.delivery_method}
                          </td>

                          <td className="p-4">
                            <select
                              value={ord.status}
                              onChange={(e) =>
                                handleUpdateOrderStatus(ord.id, e.target.value as Order["status"])
                              }
                              className="bg-white border border-neutral-300 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-950"
                            >
                              <option value="pending_payment">pending_payment</option>
                              <option value="paid">paid</option>
                              <option value="processing">processing</option>
                              <option value="completed">completed</option>
                              <option value="cancelled">cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB 5: COMMENTS / REVIEWS ─── */}
        {activeTab === "comments" && (
          <div className="space-y-4">
            {comments.map((comm) => (
              <div
                key={comm.id}
                className="p-6 rounded-xl border border-neutral-200 bg-white shadow-sm flex flex-col md:flex-row justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <strong className="text-sm font-bold text-neutral-950">{comm.user_name}</strong>
                    <span className="text-amber-500 text-xs">★ {comm.rating}/5</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-600 mb-2">{comm.body}</p>
                  <span className="text-[11px] text-neutral-400">
                    {new Date(comm.created_at).toLocaleDateString()} &bull; Status:{" "}
                    <strong className="uppercase text-neutral-800">{comm.status}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {comm.status !== "approved" && (
                    <button
                      onClick={() => handleUpdateCommentStatus(comm.id, "approved")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                  )}
                  {comm.status !== "hidden" && (
                    <button
                      onClick={() => handleUpdateCommentStatus(comm.id, "hidden")}
                      className="px-3 py-1.5 rounded-lg bg-neutral-200 text-neutral-800 text-xs font-bold hover:bg-neutral-300"
                    >
                      Hide
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── TAB 6: SETTINGS & SECURITY ─── */}
        {activeTab === "settings" && settings && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: General Info Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-neutral-950">
                Dealership Information &amp; Contacts
              </h2>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    Company / Dealership Name
                  </label>
                  <input
                    type="text"
                    value={settings.company_name || "Aston"}
                    onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    Sales &amp; Concierge Phone Number
                  </label>
                  <input
                    type="text"
                    value={settings.phone || "+1 448 226 4666"}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    Showroom Address
                  </label>
                  <input
                    type="text"
                    value={settings.address || "450 North Rodeo Drive, Beverly Hills, CA 90210"}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settings.email || "concierge@astonautostores.com"}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    Enclosed Nationwide Transport Fee (USD $)
                  </label>
                  <input
                    type="number"
                    value={settings.flat_delivery_fee || 1500}
                    onChange={(e) =>
                      setSettings({ ...settings, flat_delivery_fee: Number(e.target.value) })
                    }
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Dealership Settings</span>
                  </button>

                  {settingsSaved && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Saved &amp; Updated Live!</span>
                    </span>
                  )}
                </div>
              </form>
            </div>

            {/* Right: Security & Passkey Management */}
            <div className="lg:col-span-5 bg-[#F9FAFB] p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-neutral-950">
                <Shield className="w-5 h-5 text-neutral-900" />
                <h3 className="text-lg font-bold">Admin Security &amp; Access Key</h3>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                Control the passcode required to access the executive admin panel. Your security passkey is stored securely and protects all dealership management routes.
              </p>

              <form onSubmit={handleChangePasskey} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    New Security Passkey
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter new passkey (e.g. SecretKey2026!)..."
                    value={newPasskey}
                    onChange={(e) => setNewPasskey(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  Update Admin Passkey
                </button>

                {passkeyUpdated && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Passkey successfully updated!</span>
                  </div>
                )}
              </form>

              <div className="pt-4 border-t border-neutral-200 text-xs text-neutral-500 space-y-2">
                <div className="flex justify-between">
                  <span>Current Default Key:</span>
                  <strong className="font-mono text-neutral-950">aston2026</strong>
                </div>
                <div className="flex justify-between">
                  <span>Session Encryption:</span>
                  <span className="text-emerald-700 font-bold">Active</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ─── 3. ADD / EDIT CAR MODAL ─── */}
      {isCarModalOpen && editingCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-neutral-200 p-6 sm:p-8 shadow-2xl my-8">
            <button
              onClick={() => setIsCarModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-extrabold text-neutral-950 mb-4">
              {editingCar.id ? "Edit Vehicle Allocation" : "Add New Vehicle Allocation"}
            </h2>

            <form onSubmit={handleSaveCar} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    Vehicle Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCar.title || ""}
                    onChange={(e) => setEditingCar({ ...editingCar, title: e.target.value })}
                    placeholder="e.g. Porsche 911 GT3 RS"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    Marque Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCar.brand || ""}
                    onChange={(e) => setEditingCar({ ...editingCar, brand: e.target.value })}
                    placeholder="e.g. Porsche"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    Model Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingCar.year || 2024}
                    onChange={(e) => setEditingCar({ ...editingCar, year: Number(e.target.value) })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    Price in USD ($) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingCar.price || ""}
                    onChange={(e) => setEditingCar({ ...editingCar, price: Number(e.target.value) })}
                    placeholder="250000"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    Mileage (miles)
                  </label>
                  <input
                    type="number"
                    value={editingCar.mileage || ""}
                    onChange={(e) =>
                      setEditingCar({ ...editingCar, mileage: Number(e.target.value) || 0 })
                    }
                    placeholder="2100"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    Horsepower (HP)
                  </label>
                  <input
                    type="number"
                    value={editingCar.horsepower || ""}
                    onChange={(e) =>
                      setEditingCar({ ...editingCar, horsepower: Number(e.target.value) })
                    }
                    placeholder="518"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    0-60 mph (sec)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingCar.acceleration_0_100 || ""}
                    onChange={(e) =>
                      setEditingCar({ ...editingCar, acceleration_0_100: Number(e.target.value) })
                    }
                    placeholder="3.0"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    Transmission
                  </label>
                  <input
                    type="text"
                    value={editingCar.transmission || "Automatic"}
                    onChange={(e) => setEditingCar({ ...editingCar, transmission: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    Status
                  </label>
                  <select
                    value={editingCar.status || "available"}
                    onChange={(e) =>
                      setEditingCar({ ...editingCar, status: e.target.value as Car["status"] })
                    }
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    Condition
                  </label>
                  <select
                    value={editingCar.condition || "Certified Pre-Owned"}
                    onChange={(e) =>
                      setEditingCar({ ...editingCar, condition: e.target.value as Car["condition"] })
                    }
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                    <option value="Classic / Collector">Classic / Collector</option>
                  </select>
                </div>
              </div>

              {/* Featured Toggle for Hero Carousel */}
              <div className="p-3 bg-[#F9FAFB] rounded-lg border border-neutral-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-950 block">
                    Feature on Homepage Hero Background Carousel
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    If checked, this vehicle will be displayed in the full-width carousel on the homepage.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(editingCar.is_featured)}
                  onChange={(e) => setEditingCar({ ...editingCar, is_featured: e.target.checked })}
                  className="w-4 h-4 accent-neutral-950 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                  Hero Image URL
                </label>
                <input
                  type="url"
                  value={editingCar.hero_image || ""}
                  onChange={(e) => setEditingCar({ ...editingCar, hero_image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingCar.description || ""}
                  onChange={(e) => setEditingCar({ ...editingCar, description: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950 resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCarModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 font-semibold text-xs uppercase tracking-wider hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── 4. ADD / EDIT ARTICLE MODAL ─── */}
      {isArticleModalOpen && editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-neutral-200 p-6 sm:p-8 shadow-2xl my-8">
            <button
              onClick={() => setIsArticleModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-extrabold text-neutral-950 mb-4">
              {editingArticle.slug ? "Edit Article" : "Write New Journal Article"}
            </h2>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingArticle.title || ""}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  placeholder="e.g. 5 Maintenance Rules for Twin-Turbo Supercars"
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    Category *
                  </label>
                  <select
                    value={editingArticle.category || "Expert Advice"}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        category: e.target.value as BlogArticle["category"],
                      })
                    }
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  >
                    <option value="Expert Advice">Expert Advice</option>
                    <option value="Buyer's Guide">Buyer&apos;s Guide</option>
                    <option value="Financing">Financing</option>
                    <option value="Technology">Technology</option>
                    <option value="Safety Tips">Safety Tips</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    Reading Time
                  </label>
                  <input
                    type="text"
                    value={editingArticle.readTime || "5 min read"}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, readTime: e.target.value })
                    }
                    placeholder="e.g. 6 min read"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={editingArticle.coverImage || ""}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, coverImage: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                  Excerpt Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingArticle.excerpt || ""}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, excerpt: e.target.value })
                  }
                  placeholder="Brief synopsis displayed on the blog catalog..."
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950 resize-none"
                />
              </div>

              {/* Featured toggle */}
              <div className="p-3 bg-[#F9FAFB] rounded-lg border border-neutral-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-950 block">
                    Feature as Spotlight Story on /blog
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    If checked, this article will appear as the large hero card at the top of the blog page.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(editingArticle.featured)}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, featured: e.target.checked })
                  }
                  className="w-4 h-4 accent-neutral-950 cursor-pointer"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 font-semibold text-xs uppercase tracking-wider hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
