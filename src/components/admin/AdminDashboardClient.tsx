"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Car as CarIcon,
  MessageSquare,
  Calendar,
  Star,
  Settings,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Search,
  ExternalLink,
  Download,
  X,
  Save,
  RefreshCw,
  Loader2,
  LayoutDashboard,
  Menu,
  User,
  ChevronRight,
} from "lucide-react";
import { Car, Comment, Inquiry, TestDrive, SiteSettings } from "@/types/database";
import { createBrowserClient } from "@/lib/supabase/browser";
import { formatUSD } from "@/lib/utils";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

function exportToCSV(filename: string, rows: unknown[]) {
  if (!rows || rows.length === 0) return;
  const records = rows as Record<string, unknown>[];
  const headers = Object.keys(records[0]);
  const csvContent = [
    headers.join(","),
    ...records.map((row) =>
      headers
        .map((header) => {
          const val = row[header] ?? "";
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        })
        .join(",")
    ),
  ].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function AdminDashboardClient() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<
    "overview" | "cars" | "inquiries" | "test_drives" | "reviews" | "settings"
  >(() => {
    if (
      tabParam === "cars" ||
      tabParam === "inquiries" ||
      tabParam === "test_drives" ||
      tabParam === "reviews" ||
      tabParam === "settings"
    ) {
      return tabParam;
    }
    return "overview";
  });

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (
      tab === "cars" ||
      tab === "inquiries" ||
      tab === "test_drives" ||
      tab === "reviews" ||
      tab === "settings" ||
      tab === "overview"
    ) {
      setActiveTab(tab as typeof activeTab);
    }
  }, [searchParams]);

  // Live Data State
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<Car[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [testDrives, setTestDrives] = useState<TestDrive[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Search & Filter State
  const [carSearch, setCarSearch] = useState("");
  const [inquirySearch, setInquirySearch] = useState("");
  const [testDriveSearch, setTestDriveSearch] = useState("");
  const [reviewFilter, setReviewFilter] = useState<"all" | "pending" | "approved" | "hidden">("all");

  // Notifications / feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [revalidating, setRevalidating] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);



  // Review reply state
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  // Show Toast
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastType(type);
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const showError = (context: string, err: unknown) => {
    const e = err as { message?: string; code?: string };
    const msg = e?.message || String(err) || 'Unknown error';
    const code = e?.code ? ` [${e.code}]` : '';
    console.error(`[Admin] ${context}:`, err);
    showToast(`${context}: ${msg}${code}`, 'error');
  };

  // ─── 1. FETCH ALL DATA FROM SUPABASE ───
  const fetchAllData = async (showLoadingState = false) => {
    if (showLoadingState) {
      setLoading(true);
    }
    try {
      const supabase = createBrowserClient();
      const [carsRes, inqRes, tdRes, comRes, setRes, userRes] = await Promise.all([
        supabase.from("cars").select("*").order("created_at", { ascending: false }),
        supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
        supabase.from("test_drives").select("*").order("created_at", { ascending: false }),
        supabase.from("comments").select("*").order("created_at", { ascending: false }),
        supabase.from("site_settings").select("*").eq("id", 1).single(),
        supabase.auth.getUser(),
      ]);

      if (carsRes.data) setCars(carsRes.data as Car[]);
      if (inqRes.data) setInquiries(inqRes.data as Inquiry[]);
      if (tdRes.data) setTestDrives(tdRes.data as TestDrive[]);
      if (comRes.data) setComments(comRes.data as Comment[]);
      if (setRes.data) setSettings(setRes.data as SiteSettings);
      if (userRes.data?.user?.email) setUserEmail(userRes.data.user.email);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // ─── CACHE REVALIDATION ───
  const triggerRevalidation = async (path?: string) => {
    setRevalidating(true);
    try {
      const res = await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(path ? { path } : {}),
      });
      if (res.ok) {
        showToast("Next.js cache revalidated successfully!");
      } else {
        showToast("Revalidation failed: check console.");
      }
    } catch {
      showToast("Revalidation request failed.");
    } finally {
      setRevalidating(false);
    }
  };

  // ─── CAR OPERATIONS ───
  const handleDeleteCar = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from('cars').delete().eq('id', id);
      if (error) {
        showError('Delete car', error);
        return;
      }
      showToast(`Deleted ${title}.`);
      setCars(cars.filter((c) => c.id !== id));
      await triggerRevalidation();
    } catch (err: unknown) {
      showError('Delete car', err);
    }
  };

  // Multi-file Image Upload with Client-Side Canvas Compression
  const handleUpdateInquiryStatus = async (
    id: string,
    status: 'new' | 'contacted' | 'resolved'
  ) => {
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
      if (error) { showError('Update inquiry status', error); return; }
      setInquiries(inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq)));
      showToast(`Inquiry status updated to ${status}.`);
    } catch (err) {
      showError('Update inquiry status', err);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from('inquiries').delete().eq('id', id);
      if (error) { showError('Delete inquiry', error); return; }
      setInquiries(inquiries.filter((i) => i.id !== id));
      showToast('Inquiry deleted.');
    } catch (err) {
      showError('Delete inquiry', err);
    }
  };

  // ─── TEST DRIVES OPERATIONS ───
  const handleUpdateTestDriveStatus = async (
    id: string,
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  ) => {
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from('test_drives').update({ status }).eq('id', id);
      if (error) { showError('Update test drive status', error); return; }
      setTestDrives(testDrives.map((td) => (td.id === id ? { ...td, status } : td)));
      showToast(`Test drive status updated to ${status}.`);
    } catch (err) {
      showError('Update test drive status', err);
    }
  };

  const handleDeleteTestDrive = async (id: string) => {
    if (!confirm('Are you sure you want to delete this test drive record?')) return;
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from('test_drives').delete().eq('id', id);
      if (error) { showError('Delete test drive', error); return; }
      setTestDrives(testDrives.filter((td) => td.id !== id));
      showToast('Test drive record deleted.');
    } catch (err) {
      showError('Delete test drive', err);
    }
  };

  // ─── COMMENTS / REVIEWS OPERATIONS ───
  const handleUpdateCommentStatus = async (
    id: string,
    status: 'approved' | 'pending' | 'hidden'
  ) => {
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase
        .from('comments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) { showError('Update review status', error); return; }
      setComments(comments.map((c) => (c.id === id ? { ...c, status } : c)));
      showToast(`Review marked as ${status}.`);
      await triggerRevalidation();
    } catch (err) {
      showError('Update review status', err);
    }
  };

  const handleSaveCommentReply = async (id: string) => {
    const reply = replyTextMap[id];
    if (reply === undefined) return;

    try {
      const supabase = createBrowserClient();
      const { error } = await supabase
        .from('comments')
        .update({ admin_reply: reply.trim(), updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) { showError('Save reply', error); return; }
      setComments(comments.map((c) => (c.id === id ? { ...c, admin_reply: reply.trim() } : c)));
      showToast('Executive response published.');
      await triggerRevalidation();
    } catch (err) {
      showError('Save reply', err);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!confirm('Are you sure you want to permanently remove this review?')) return;
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from('comments').delete().eq('id', id);
      if (error) { showError('Delete review', error); return; }
      setComments(comments.filter((c) => c.id !== id));
      showToast('Review deleted.');
      await triggerRevalidation();
    } catch (err) {
      showError('Delete review', err);
    }
  };

  // ─── SITE SETTINGS OPERATIONS ───
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const supabase = createBrowserClient();
      // Build explicit payload matching only the site_settings columns
      const payload = {
        company_name: settings.company_name,
        tagline: settings.tagline ?? null,
        phone: settings.phone ?? null,
        whatsapp: settings.whatsapp ?? null,
        email: settings.email ?? null,
        address: settings.address ?? null,
        showroom_hours: settings.showroom_hours ?? null,
        social_links: settings.social_links ?? null,
        hero_headline: settings.hero_headline ?? null,
        hero_subheadline: settings.hero_subheadline ?? null,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase
        .from('site_settings')
        .update(payload)
        .eq('id', 1);
      if (error) {
        showError('Save settings', error);
        return;
      }
      showToast('Site settings saved & synced.');
      await triggerRevalidation();
    } catch (err: unknown) {
      showError('Save settings', err);
    }
  };

  // Filtered views
  const filteredCars = cars.filter(
    (c) =>
      c.title.toLowerCase().includes(carSearch.toLowerCase()) ||
      c.brand.toLowerCase().includes(carSearch.toLowerCase()) ||
      c.model.toLowerCase().includes(carSearch.toLowerCase())
  );

  const getCarTitle = (carId?: string | null) => {
    if (!carId) return null;
    const car = cars.find((c) => c.id === carId);
    return car ? `${car.year} ${car.brand} ${car.model}` : null;
  };

  const filteredInquiries = inquiries.filter((i) => {
    const carTitle = getCarTitle(i.car_id);
    return (
      i.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      i.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      i.phone.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      (carTitle ? carTitle.toLowerCase().includes(inquirySearch.toLowerCase()) : false)
    );
  });

  const filteredTestDrives = testDrives.filter((td) => {
    const carTitle = getCarTitle(td.car_id);
    return (
      td.name.toLowerCase().includes(testDriveSearch.toLowerCase()) ||
      td.email.toLowerCase().includes(testDriveSearch.toLowerCase()) ||
      td.phone.toLowerCase().includes(testDriveSearch.toLowerCase()) ||
      (carTitle ? carTitle.toLowerCase().includes(testDriveSearch.toLowerCase()) : false)
    );
  });

  const filteredComments = comments.filter((c) =>
    reviewFilter === "all" ? true : c.status === reviewFilter
  );

  // Overview metrics
  const availableCarsCount = cars.filter((c) => c.status === "available").length;
  const reservedCarsCount = cars.filter((c) => c.status === "reserved" || c.status === "sold").length;
  const newInquiriesCount = inquiries.filter((i) => i.status === "new").length;
  const pendingTestDrivesCount = testDrives.filter((td) => td.status === "pending").length;
  const pendingReviewsCount = comments.filter((c) => c.status === "pending").length;

  const navTabs = [
    { id: "overview" as const, label: "Overview", icon: LayoutDashboard, count: null, highlight: false },
    { id: "cars" as const, label: "Vehicles", icon: CarIcon, count: cars.length, highlight: false },
    {
      id: "inquiries" as const,
      label: "Inquiries",
      icon: MessageSquare,
      count: newInquiriesCount > 0 ? newInquiriesCount : null,
      highlight: newInquiriesCount > 0,
    },
    {
      id: "test_drives" as const,
      label: "Test Drives",
      icon: Calendar,
      count: pendingTestDrivesCount > 0 ? pendingTestDrivesCount : null,
      highlight: pendingTestDrivesCount > 0,
    },
    {
      id: "reviews" as const,
      label: "Reviews",
      icon: Star,
      count: pendingReviewsCount > 0 ? pendingReviewsCount : null,
      highlight: pendingReviewsCount > 0,
    },
    { id: "settings" as const, label: "Settings", icon: Settings, count: null, highlight: false },
  ];

  const tabMeta: Record<string, { title: string; subtitle: string }> = {
    overview: { title: "Executive Overview", subtitle: "Key performance metrics, showroom status, and recent activity" },
    cars: { title: "Vehicle Inventory", subtitle: "Manage showroom catalog, pricing, specs, and gallery photography" },
    inquiries: { title: "Customer Inquiries", subtitle: "Lead generation, prospective buyer questions, and direct messages" },
    test_drives: { title: "Test Drive Bookings", subtitle: "VIP appointment scheduling, client slots, and status management" },
    reviews: { title: "Showroom Reviews", subtitle: "Moderate client testimonials and publish verified feedback" },
    settings: { title: "Dealership Settings", subtitle: "Update showroom hours, contact coordinates, and homepage branding" },
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col md:flex-row text-neutral-900 font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl text-white text-xs font-semibold shadow-2xl flex items-center gap-3 animate-fade-in border max-w-sm ${
            toastType === 'error'
              ? 'bg-red-700 border-red-600'
              : 'bg-neutral-900 border-neutral-700'
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 shrink-0 ${toastType === 'error' ? 'text-red-300' : 'text-emerald-400'}`} />
          <span className="break-words">{toastMessage}</span>
        </div>
      )}

      {/* Mobile Top Header (only on screens < md) */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-200 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-extrabold tracking-tight text-lg text-neutral-950 font-display">
            ASTON
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-neutral-900 text-white">
            Console
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/backdoor/cars/new"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-950 text-white text-xs font-bold hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Car</span>
          </Link>
        </div>
      </div>

      {/* Backdrop for mobile drawer */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* ─── DESKTOP & MOBILE SIDENAV ─── */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 md:z-20 w-64 bg-white border-r border-neutral-200 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand & Dealership Info */}
        <div>
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-xl text-neutral-950 font-display">
                  ASTON
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-white">
                  Console
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 font-medium mt-1">
                Dealership Management
              </p>
            </div>
            <button
              onClick={() => setMobileNavOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-neutral-950 text-white shadow-sm font-bold"
                      : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-neutral-500"}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tab.highlight
                          ? isActive
                            ? "bg-emerald-500 text-white"
                            : "bg-emerald-100 text-emerald-800"
                          : isActive
                          ? "bg-neutral-800 text-neutral-300"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidenav Bottom / User & Tools */}
        <div className="p-4 border-t border-neutral-100 space-y-3 bg-neutral-50/50">
          {/* Live Showroom Link */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              <span>Live Showroom</span>
            </div>
            <ChevronRight className="w-3 h-3 text-neutral-400" />
          </Link>

          {/* User Email & Logout */}
          <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-neutral-200 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-neutral-600" />
              </div>
              <span className="text-xs text-neutral-700 font-medium truncate max-w-[110px]" title={userEmail || "Admin"}>
                {userEmail || "Administrator"}
              </span>
            </div>
            <AdminLogoutButton />
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Topbar */}
        <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-neutral-200 px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-neutral-950">
              {tabMeta[activeTab]?.title || "Dashboard"}
            </h1>
            <p className="text-xs text-neutral-500">
              {tabMeta[activeTab]?.subtitle || "Aston Auto Management"}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => triggerRevalidation()}
              disabled={revalidating}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
              title="Purge Next.js cache for storefront"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${revalidating ? "animate-spin" : ""}`} />
              <span>{revalidating ? "Revalidating..." : "Clear Cache"}</span>
            </button>

            <Link
              href="/backdoor/cars/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Vehicle</span>
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full">
          {/* Loading Spinner */}
          {loading && (
            <div className="py-24 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-neutral-400 mb-3" />
              <p className="text-xs text-neutral-500">Synchronizing Aston database...</p>
            </div>
          )}

        {/* ─── TAB 1: OVERVIEW ─── */}
        {!loading && activeTab === "overview" && (
          <div className="py-8 space-y-8">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Available Cars
                </span>
                <span className="text-2xl font-extrabold text-neutral-950">
                  {availableCarsCount}
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Reserved / Sold
                </span>
                <span className="text-2xl font-extrabold text-neutral-950">
                  {reservedCarsCount}
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  New Inquiries
                </span>
                <span className="text-2xl font-extrabold text-emerald-600">
                  {newInquiriesCount}
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Pending Drives
                </span>
                <span className="text-2xl font-extrabold text-amber-600">
                  {pendingTestDrivesCount}
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm col-span-2 md:col-span-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Pending Reviews
                </span>
                <span className="text-2xl font-extrabold text-neutral-950">
                  {pendingReviewsCount}
                </span>
              </div>
            </div>

            {/* 5 Latest Inquiries */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-neutral-950">
                    Latest Customer Inquiries
                  </h2>
                  <p className="text-xs text-neutral-500">
                    High-intent leads inquiring about showroom vehicles
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("inquiries")}
                  className="text-xs font-bold text-neutral-900 hover:text-neutral-600"
                >
                  View All ({inquiries.length}) →
                </button>
              </div>

              {inquiries.length === 0 ? (
                <p className="text-xs text-neutral-400 py-6 text-center">
                  No inquiries received yet.
                </p>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {inquiries.slice(0, 5).map((inq) => {
                    const carTitle = getCarTitle(inq.car_id);
                    const cleanPhone = inq.phone.replace(/[^0-9]/g, "");
                    const waText = encodeURIComponent(
                      `Hello ${inq.name}, thank you for contacting Aston regarding the ${
                        carTitle || "vehicle"
                      }. How may our private client concierge assist you today?`
                    );

                    return (
                      <div
                        key={inq.id}
                        className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-neutral-950">{inq.name}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                inq.status === "new"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : inq.status === "contacted"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-neutral-100 text-neutral-700"
                              }`}
                            >
                              {inq.status}
                            </span>
                            {carTitle && (
                              <span className="text-xs text-neutral-500">• {carTitle}</span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-600 line-clamp-1">{inq.message}</p>
                          <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                            <span>{inq.email}</span>
                            <span>•</span>
                            <span>{inq.phone}</span>
                            <span>•</span>
                            <span>{new Date(inq.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`https://wa.me/${cleanPhone}?text=${waText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                          >
                            <span>Reply on WhatsApp</span>
                          </a>

                          <select
                            value={inq.status}
                            onChange={(e) =>
                              handleUpdateInquiryStatus(
                                inq.id,
                                e.target.value as "new" | "contacted" | "resolved"
                              )
                            }
                            className="text-xs border border-neutral-200 rounded-lg px-2.5 py-1.5 bg-neutral-50 text-neutral-800"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 5 Latest Test Drives */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-neutral-950">
                    Upcoming VIP Test Drives
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Showroom appointments requested by prospective buyers
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("test_drives")}
                  className="text-xs font-bold text-neutral-900 hover:text-neutral-600"
                >
                  View All ({testDrives.length}) →
                </button>
              </div>

              {testDrives.length === 0 ? (
                <p className="text-xs text-neutral-400 py-6 text-center">
                  No test drives booked yet.
                </p>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {testDrives.slice(0, 5).map((td) => {
                    const carTitle = getCarTitle(td.car_id);
                    const cleanPhone = td.phone.replace(/[^0-9]/g, "");
                    const waText = encodeURIComponent(
                      `Hello ${td.name}, confirming your Aston test drive appointment for the ${
                        carTitle || "vehicle"
                      } on ${td.preferred_date} (${td.preferred_time}).`
                    );

                    return (
                      <div
                        key={td.id}
                        className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-neutral-950">{td.name}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                td.status === "pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : td.status === "confirmed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : td.status === "completed"
                                  ? "bg-neutral-100 text-neutral-700"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {td.status}
                            </span>
                            {carTitle && (
                              <span className="text-xs text-neutral-500">• {carTitle}</span>
                            )}
                          </div>
                          <div className="text-xs font-semibold text-neutral-700 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                            <span>
                              {td.preferred_date} • {td.preferred_time}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                            <span>{td.email}</span>
                            <span>•</span>
                            <span>{td.phone}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`https://wa.me/${cleanPhone}?text=${waText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                          >
                            <span>WhatsApp Confirm</span>
                          </a>

                          <select
                            value={td.status}
                            onChange={(e) =>
                              handleUpdateTestDriveStatus(
                                td.id,
                                e.target.value as "pending" | "confirmed" | "completed" | "cancelled"
                              )
                            }
                            className="text-xs border border-neutral-200 rounded-lg px-2.5 py-1.5 bg-neutral-50 text-neutral-800"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 2: CARS CATALOG ─── */}
        {!loading && activeTab === "cars" && (
          <div className="py-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search vehicles by name, brand, model..."
                  value={carSearch}
                  onChange={(e) => setCarSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-500">Showing {filteredCars.length} of {cars.length} cars</span>
                <Link
                  href="/backdoor/cars/new"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Vehicle</span>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F9FAFB] border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3.5 px-4">Vehicle</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Specs</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredCars.map((car) => (
                      <tr key={car.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-16 h-11 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                              <Image
                                src={car.hero_image}
                                alt={car.title}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-neutral-950 text-sm">
                                  {car.title}
                                </span>
                                {car.is_featured && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <span className="text-neutral-400 text-[11px]">
                                {car.year} • {car.brand} • {car.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-extrabold text-neutral-950">
                            {formatUSD(car.discount_price ?? car.price)}
                          </div>
                          {car.discount_price && (
                            <div className="text-[11px] line-through text-neutral-400">
                              {formatUSD(car.price)}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4 text-neutral-600">
                          <div>{car.horsepower} HP • {car.transmission}</div>
                          <div className="text-[11px] text-neutral-400">
                            {car.mileage ? `${car.mileage.toLocaleString()} mi` : "0 mi"} • {car.color}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              car.status === "available"
                                ? "bg-emerald-100 text-emerald-800"
                                : car.status === "reserved"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-neutral-200 text-neutral-700"
                            }`}
                          >
                            {car.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/cars/${car.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
                              title="View Live Listing"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            <Link
                              href={`/backdoor/cars/${car.id}/edit`}
                              className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
                              title="Edit Vehicle"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleDeleteCar(car.id, car.title)}
                              className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="Delete Vehicle"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: INQUIRIES ─── */}
        {!loading && activeTab === "inquiries" && (
          <div className="py-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search inquiries by name, phone, car..."
                  value={inquirySearch}
                  onChange={(e) => setInquirySearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => exportToCSV("aston_inquiries.csv", inquiries)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-700 hover:text-neutral-950 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F9FAFB] border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3.5 px-4">Client</th>
                      <th className="py-3.5 px-4">Vehicle</th>
                      <th className="py-3.5 px-4">Message</th>
                      <th className="py-3.5 px-4">Channel</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredInquiries.map((inq) => {
                      const carTitle = getCarTitle(inq.car_id);
                      const cleanPhone = inq.phone.replace(/[^0-9]/g, "");
                      const waText = encodeURIComponent(
                        `Hello ${inq.name}, thank you for reaching out to Aston regarding the ${
                          carTitle || "vehicle"
                        }.`
                      );

                      return (
                        <tr key={inq.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-bold text-neutral-950 block">{inq.name}</span>
                            <span className="text-[11px] text-neutral-500">{inq.email}</span>
                            <span className="text-[11px] text-neutral-400 block">{inq.phone}</span>
                          </td>

                          <td className="py-3 px-4 font-semibold text-neutral-900">
                            {carTitle || "General Showroom"}
                          </td>

                          <td className="py-3 px-4 text-neutral-600 max-w-xs">
                            <p className="line-clamp-2">{inq.message}</p>
                            <span className="text-[10px] text-neutral-400">
                              {new Date(inq.created_at).toLocaleString()}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700">
                              {inq.preferred_contact}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <select
                              value={inq.status}
                              onChange={(e) =>
                                handleUpdateInquiryStatus(
                                  inq.id,
                                  e.target.value as "new" | "contacted" | "resolved"
                                )
                              }
                              className="text-xs border border-neutral-200 rounded-lg px-2 py-1 bg-white text-neutral-800"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={`https://wa.me/${cleanPhone}?text=${waText}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                              >
                                WhatsApp
                              </a>

                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="p-1.5 rounded text-neutral-400 hover:text-red-600"
                                title="Delete Inquiry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 4: TEST DRIVES ─── */}
        {!loading && activeTab === "test_drives" && (
          <div className="py-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search test drives by name, phone, car..."
                  value={testDriveSearch}
                  onChange={(e) => setTestDriveSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => exportToCSV("aston_test_drives.csv", testDrives)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-700 hover:text-neutral-950 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F9FAFB] border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3.5 px-4">Client</th>
                      <th className="py-3.5 px-4">Vehicle</th>
                      <th className="py-3.5 px-4">Appointment Schedule</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredTestDrives.map((td) => {
                      const carTitle = getCarTitle(td.car_id);
                      const cleanPhone = td.phone.replace(/[^0-9]/g, "");
                      const waText = encodeURIComponent(
                        `Hello ${td.name}, this is Aston Auto Stores regarding your scheduled test drive of the ${
                          carTitle || "vehicle"
                        } on ${td.preferred_date}.`
                      );

                      return (
                        <tr key={td.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-bold text-neutral-950 block">{td.name}</span>
                            <span className="text-[11px] text-neutral-500">{td.email}</span>
                            <span className="text-[11px] text-neutral-400 block">{td.phone}</span>
                          </td>

                          <td className="py-3 px-4 font-semibold text-neutral-900">
                            {carTitle || "Showroom Fleet"}
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-bold text-neutral-900">{td.preferred_date}</div>
                            <div className="text-[11px] text-neutral-500">{td.preferred_time}</div>
                          </td>

                          <td className="py-3 px-4">
                            <select
                              value={td.status}
                              onChange={(e) =>
                                handleUpdateTestDriveStatus(
                                  td.id,
                                  e.target.value as "pending" | "confirmed" | "completed" | "cancelled"
                                )
                              }
                              className="text-xs border border-neutral-200 rounded-lg px-2 py-1 bg-white text-neutral-800"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={`https://wa.me/${cleanPhone}?text=${waText}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                              >
                                WhatsApp
                              </a>

                              <button
                                onClick={() => handleDeleteTestDrive(td.id)}
                                className="p-1.5 rounded text-neutral-400 hover:text-red-600"
                                title="Delete Test Drive"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 5: REVIEWS MODERATION ─── */}
        {!loading && activeTab === "reviews" && (
          <div className="py-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(["all", "pending", "approved", "hidden"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setReviewFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      reviewFilter === status
                        ? "bg-neutral-950 text-white"
                        : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {status} ({comments.filter((c) => (status === "all" ? true : c.status === status)).length})
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-neutral-950">
                          {comment.user_name}
                        </span>
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < comment.rating ? "fill-amber-400 text-amber-400" : "text-neutral-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            comment.status === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : comment.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-neutral-100 text-neutral-700"
                          }`}
                        >
                          {comment.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Vehicle ID: {comment.car_id} • {new Date(comment.created_at).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {comment.status !== "approved" && (
                        <button
                          onClick={() => handleUpdateCommentStatus(comment.id, "approved")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                      )}

                      {comment.status !== "hidden" && (
                        <button
                          onClick={() => handleUpdateCommentStatus(comment.id, "hidden")}
                          className="px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-50"
                        >
                          Hide
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-700 leading-relaxed bg-[#F9FAFB] p-4 rounded-xl border border-neutral-100">
                    &ldquo;{comment.body}&rdquo;
                  </p>

                  {/* Admin Reply Section */}
                  <div className="pt-2 border-t border-neutral-100">
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Dealership Response
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Write official Aston response..."
                        value={
                          replyTextMap[comment.id] !== undefined
                            ? replyTextMap[comment.id]
                            : comment.admin_reply || ""
                        }
                        onChange={(e) =>
                          setReplyTextMap({
                            ...replyTextMap,
                            [comment.id]: e.target.value,
                          })
                        }
                        className="flex-1 bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                      />
                      <button
                        onClick={() => handleSaveCommentReply(comment.id)}
                        className="px-4 py-2 bg-neutral-950 text-white text-xs font-bold rounded-lg hover:bg-neutral-800"
                      >
                        Save Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 6: SITE SETTINGS ─── */}
        {!loading && activeTab === "settings" && settings && (
          <div className="py-8 max-w-2xl">
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-neutral-950">Showroom Configuration</h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Manage core dealership contacts, address, and live announcement banner
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Dealership Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.company_name}
                    onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Desk Phone
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      WhatsApp Line
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.whatsapp}
                      onChange={(e) =>
                        setSettings({ ...settings, whatsapp: e.target.value })
                      }
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Showroom Physical Address
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Showroom Hours
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.showroom_hours}
                    onChange={(e) => setSettings({ ...settings, showroom_hours: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>

                <div className="pt-3 border-t border-neutral-100 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Dealership Tagline
                    </label>
                    <input
                      type="text"
                      value={settings.tagline || ""}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-sm flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Dealership Settings</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  );
}
