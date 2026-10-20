"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
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
  ShieldCheck,
  RefreshCw,
  Loader2,
  Upload,
  ArrowUpDown,
  MoveLeft,
  MoveRight,
  Phone,
  Mail,
  AlertCircle,
  Eye,
  Check,
} from "lucide-react";
import { Car, Comment, Inquiry, TestDrive, SiteSettings } from "@/types/database";
import { createBrowserClient } from "@/lib/supabase/browser";
import { formatUSD } from "@/lib/utils";
import Container from "@/components/ui/Container";

// Client-side image compression using canvas
async function compressImageToWebP(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      const MAX_DIM = 2000;
      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Image compression failed"));
          }
        },
        "image/webp",
        0.82
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for compression"));
    };
    img.src = url;
  });
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
  const [activeTab, setActiveTab] = useState<
    "overview" | "cars" | "inquiries" | "test_drives" | "reviews" | "settings"
  >("overview");

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
  const [revalidating, setRevalidating] = useState(false);

  // Car Edit / Add Modal State
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Partial<Car> | null>(null);
  const [carSaving, setCarSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Review reply state
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ─── 1. FETCH ALL DATA FROM SUPABASE ───
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const supabase = createBrowserClient();
      const [carsRes, inqRes, tdRes, comRes, setRes] = await Promise.all([
        supabase.from("cars").select("*").order("created_at", { ascending: false }),
        supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
        supabase.from("test_drives").select("*").order("created_at", { ascending: false }),
        supabase.from("comments").select("*").order("created_at", { ascending: false }),
        supabase.from("site_settings").select("*").eq("id", 1).single(),
      ]);

      if (carsRes.data) setCars(carsRes.data as Car[]);
      if (inqRes.data) setInquiries(inqRes.data as Inquiry[]);
      if (tdRes.data) setTestDrives(tdRes.data as TestDrive[]);
      if (comRes.data) setComments(comRes.data as Comment[]);
      if (setRes.data) setSettings(setRes.data as SiteSettings);
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
  const handleOpenAddCar = () => {
    const newId = `car-${Date.now()}`;
    setEditingCar({
      id: newId,
      title: "",
      slug: "",
      brand: "Aston Martin",
      model: "",
      year: new Date().getFullYear(),
      price: 150000,
      discount_price: null,
      mileage: 0,
      fuel_type: "Petrol",
      transmission: "Automatic",
      body_type: "Coupe",
      engine: "4.0L Twin-Turbo V8",
      horsepower: 503,
      acceleration_0_100: 3.6,
      color: "Onyx Black",
      interior_color: "Obsidian Black Leather",
      condition: "Certified Pre-Owned",
      status: "available",
      is_featured: false,
      hero_image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1200",
      images: [],
      features: ["Carbon Ceramic Brakes", "Bang & Olufsen Audio", "Sport Exhaust"],
      description: "Exceptional specification, single-owner vehicle maintained to the highest standards.",
    });
    setIsCarModalOpen(true);
  };

  const handleOpenEditCar = (car: Car) => {
    setEditingCar({ ...car });
    setIsCarModalOpen(true);
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar || !editingCar.title || !editingCar.slug) {
      alert("Title and Slug are required.");
      return;
    }

    setCarSaving(true);
    try {
      const supabase = createBrowserClient();
      const hero = editingCar.images && editingCar.images.length > 0
        ? editingCar.images[0]
        : editingCar.hero_image || "";

      const carPayload = {
        ...editingCar,
        hero_image: hero,
        images: editingCar.images || [hero],
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("cars").upsert(carPayload);
      if (error) throw error;

      showToast(`Vehicle "${editingCar.title}" saved successfully.`);
      setIsCarModalOpen(false);
      await fetchAllData();
      await triggerRevalidation(`/cars/${editingCar.slug}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving vehicle.";
      alert(msg);
    } finally {
      setCarSaving(false);
    }
  };

  const handleDeleteCar = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from("cars").delete().eq("id", id);
      if (error) throw error;

      showToast(`Deleted ${title}.`);
      setCars(cars.filter((c) => c.id !== id));
      await triggerRevalidation();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete vehicle.";
      alert(msg);
    }
  };

  // Multi-file Image Upload with Client-Side Canvas Compression
  const handleImageFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0 || !editingCar?.id) return;

    setUploadingImages(true);
    try {
      const supabase = createBrowserClient();
      const carId = editingCar.id;
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressedBlob = await compressImageToWebP(file);
        const safeBaseName = file.name
          .replace(/[^a-zA-Z0-9.-]/g, "_")
          .replace(/\.[^/.]+$/, ".webp");
        const path = `cars/${carId}/${Date.now()}-${safeBaseName}`;

        const { error: uploadErr } = await supabase.storage
          .from("car-images")
          .upload(path, compressedBlob, {
            contentType: "image/webp",
            upsert: true,
          });

        if (uploadErr) {
          console.error("Storage upload error:", uploadErr);
          continue;
        }

        const { data: urlData } = supabase.storage.from("car-images").getPublicUrl(path);
        if (urlData?.publicUrl) {
          uploadedUrls.push(urlData.publicUrl);
        }
      }

      const existingImages = editingCar.images || [];
      const updatedImages = [...existingImages, ...uploadedUrls];
      setEditingCar({
        ...editingCar,
        images: updatedImages,
        hero_image: updatedImages[0] || editingCar.hero_image,
      });

      showToast(`Uploaded ${uploadedUrls.length} image(s) to Aston storage.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Image upload failed.";
      alert(msg);
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSetHeroImage = (url: string) => {
    if (!editingCar?.images) return;
    const remaining = editingCar.images.filter((img) => img !== url);
    setEditingCar({
      ...editingCar,
      hero_image: url,
      images: [url, ...remaining],
    });
  };

  const handleMoveImage = (index: number, direction: "left" | "right") => {
    if (!editingCar?.images) return;
    const images = [...editingCar.images];
    const targetIdx = direction === "left" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    const temp = images[index];
    images[index] = images[targetIdx];
    images[targetIdx] = temp;

    setEditingCar({
      ...editingCar,
      images,
      hero_image: images[0],
    });
  };

  const handleDeleteImage = async (url: string) => {
    if (!editingCar?.images) return;
    const newImages = editingCar.images.filter((img) => img !== url);

    // Try deleting from Supabase Storage if it belongs to car-images bucket
    try {
      if (url.includes("/car-images/")) {
        const parts = url.split("/car-images/");
        if (parts[1]) {
          const storagePath = parts[1].split("?")[0];
          const supabase = createBrowserClient();
          await supabase.storage.from("car-images").remove([storagePath]);
        }
      }
    } catch (e) {
      console.warn("Storage deletion error:", e);
    }

    setEditingCar({
      ...editingCar,
      images: newImages,
      hero_image: newImages[0] || "",
    });
  };

  // ─── INQUIRIES OPERATIONS ───
  const handleUpdateInquiryStatus = async (
    id: string,
    status: "new" | "contacted" | "resolved"
  ) => {
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
      if (error) throw error;

      setInquiries(
        inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq))
      );
      showToast(`Inquiry status updated to ${status}.`);
    } catch {
      alert("Failed to update inquiry status.");
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from("inquiries").delete().eq("id", id);
      if (error) throw error;
      setInquiries(inquiries.filter((i) => i.id !== id));
      showToast("Inquiry deleted.");
    } catch {
      alert("Failed to delete inquiry.");
    }
  };

  // ─── TEST DRIVES OPERATIONS ───
  const handleUpdateTestDriveStatus = async (
    id: string,
    status: "pending" | "confirmed" | "completed" | "cancelled"
  ) => {
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from("test_drives").update({ status }).eq("id", id);
      if (error) throw error;

      setTestDrives(
        testDrives.map((td) => (td.id === id ? { ...td, status } : td))
      );
      showToast(`Test drive status updated to ${status}.`);
    } catch {
      alert("Failed to update appointment status.");
    }
  };

  const handleDeleteTestDrive = async (id: string) => {
    if (!confirm("Are you sure you want to delete this test drive record?")) return;
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from("test_drives").delete().eq("id", id);
      if (error) throw error;
      setTestDrives(testDrives.filter((td) => td.id !== id));
      showToast("Test drive record deleted.");
    } catch {
      alert("Failed to delete test drive.");
    }
  };

  // ─── COMMENTS / REVIEWS OPERATIONS ───
  const handleUpdateCommentStatus = async (
    id: string,
    status: "approved" | "pending" | "hidden"
  ) => {
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase
        .from("comments")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;

      setComments(
        comments.map((c) => (c.id === id ? { ...c, status } : c))
      );
      showToast(`Review marked as ${status}.`);
      await triggerRevalidation();
    } catch {
      alert("Failed to update review status.");
    }
  };

  const handleSaveCommentReply = async (id: string) => {
    const reply = replyTextMap[id];
    if (reply === undefined) return;

    try {
      const supabase = createBrowserClient();
      const { error } = await supabase
        .from("comments")
        .update({ admin_reply: reply.trim(), updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;

      setComments(
        comments.map((c) => (c.id === id ? { ...c, admin_reply: reply.trim() } : c))
      );
      showToast("Executive response published.");
      await triggerRevalidation();
    } catch {
      alert("Failed to save reply.");
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!confirm("Are you sure you want to permanently remove this review?")) return;
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from("comments").delete().eq("id", id);
      if (error) throw error;
      setComments(comments.filter((c) => c.id !== id));
      showToast("Review deleted.");
      await triggerRevalidation();
    } catch {
      alert("Failed to delete review.");
    }
  };

  // ─── SITE SETTINGS OPERATIONS ───
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const supabase = createBrowserClient();
      const { error } = await supabase
        .from("site_settings")
        .upsert({ ...settings, id: 1, updated_at: new Date().toISOString() });
      if (error) throw error;

      showToast("Site settings saved & synced.");
      await triggerRevalidation();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save settings.";
      alert(msg);
    }
  };

  // Filtered views
  const filteredCars = cars.filter(
    (c) =>
      c.title.toLowerCase().includes(carSearch.toLowerCase()) ||
      c.brand.toLowerCase().includes(carSearch.toLowerCase()) ||
      c.model.toLowerCase().includes(carSearch.toLowerCase())
  );

  const filteredInquiries = inquiries.filter(
    (i) =>
      i.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      i.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      i.phone.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      (i.car_title && i.car_title.toLowerCase().includes(inquirySearch.toLowerCase()))
  );

  const filteredTestDrives = testDrives.filter(
    (td) =>
      td.name.toLowerCase().includes(testDriveSearch.toLowerCase()) ||
      td.email.toLowerCase().includes(testDriveSearch.toLowerCase()) ||
      td.phone.toLowerCase().includes(testDriveSearch.toLowerCase()) ||
      (td.car_title && td.car_title.toLowerCase().includes(testDriveSearch.toLowerCase()))
  );

  const filteredComments = comments.filter((c) =>
    reviewFilter === "all" ? true : c.status === reviewFilter
  );

  // Overview metrics
  const availableCarsCount = cars.filter((c) => c.status === "available").length;
  const reservedCarsCount = cars.filter((c) => c.status === "reserved" || c.status === "sold").length;
  const newInquiriesCount = inquiries.filter((i) => i.status === "new").length;
  const pendingTestDrivesCount = testDrives.filter((td) => td.status === "pending").length;
  const pendingReviewsCount = comments.filter((c) => c.status === "pending").length;

  return (
    <div className="pt-6">
      <Container>
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-neutral-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-3 animate-fade-in border border-neutral-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ─── TAB NAVIGATION & QUICK ACTIONS ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "overview", label: "Overview", icon: ShieldCheck },
              { id: "cars", label: `Cars (${cars.length})`, icon: CarIcon },
              {
                id: "inquiries",
                label: `Inquiries ${newInquiriesCount > 0 ? `(${newInquiriesCount})` : ""}`,
                icon: MessageSquare,
              },
              {
                id: "test_drives",
                label: `Test Drives ${
                  pendingTestDrivesCount > 0 ? `(${pendingTestDrivesCount})` : ""
                }`,
                icon: Calendar,
              },
              {
                id: "reviews",
                label: `Reviews ${pendingReviewsCount > 0 ? `(${pendingReviewsCount})` : ""}`,
                icon: Star,
              },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? "bg-neutral-950 text-white shadow-sm"
                      : "bg-white text-neutral-600 hover:text-neutral-950 border border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerRevalidation()}
              disabled={revalidating}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 shadow-sm disabled:opacity-50"
              title="Purge and revalidate Next.js cache for showroom pages"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${revalidating ? "animate-spin" : ""}`} />
              <span>{revalidating ? "Revalidating..." : "Clear Cache"}</span>
            </button>

            <button
              onClick={handleOpenAddCar}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>

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
                    const cleanPhone = inq.phone.replace(/[^0-9]/g, "");
                    const waText = encodeURIComponent(
                      `Hello ${inq.name}, thank you for contacting Aston regarding the ${
                        inq.car_title || "vehicle"
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
                            {inq.car_title && (
                              <span className="text-xs text-neutral-500">• {inq.car_title}</span>
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
                    const cleanPhone = td.phone.replace(/[^0-9]/g, "");
                    const waText = encodeURIComponent(
                      `Hello ${td.name}, confirming your Aston test drive appointment for the ${
                        td.car_title || "vehicle"
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
                            {td.car_title && (
                              <span className="text-xs text-neutral-500">• {td.car_title}</span>
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

              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <span>Showing {filteredCars.length} of {cars.length} cars</span>
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

                            <button
                              onClick={() => handleOpenEditCar(car)}
                              className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
                              title="Edit Vehicle"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

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
                      const cleanPhone = inq.phone.replace(/[^0-9]/g, "");
                      const waText = encodeURIComponent(
                        `Hello ${inq.name}, thank you for reaching out to Aston regarding the ${
                          inq.car_title || "vehicle"
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
                            {inq.car_title || "General Showroom"}
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
                      const cleanPhone = td.phone.replace(/[^0-9]/g, "");
                      const waText = encodeURIComponent(
                        `Hello ${td.name}, this is Aston Beverly Hills regarding your scheduled test drive of the ${
                          td.car_title || "vehicle"
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
                            {td.car_title || "Showroom Fleet"}
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

        {/* ─── CAR ADD / EDIT MODAL ─── */}
        {isCarModalOpen && editingCar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-2xl space-y-6">
              <button
                onClick={() => setIsCarModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Catalog Inventory
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-950">
                  {editingCar.title ? `Edit: ${editingCar.title}` : "Add New Vehicle"}
                </h3>
              </div>

              <form onSubmit={handleSaveCar} className="space-y-6">
                {/* 1. Title & Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Vehicle Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aston Martin DB12 Coupe"
                      value={editingCar.title || ""}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setEditingCar({
                          ...editingCar,
                          title: newTitle,
                          slug: editingCar.slug ? editingCar.slug : generateSlug(newTitle),
                        });
                      }}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="aston-martin-db12-coupe"
                      value={editingCar.slug || ""}
                      onChange={(e) =>
                        setEditingCar({ ...editingCar, slug: generateSlug(e.target.value) })
                      }
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950 font-mono"
                    />
                  </div>
                </div>

                {/* 2. Brand, Model, Year, Condition */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Brand *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingCar.brand || ""}
                      onChange={(e) => setEditingCar({ ...editingCar, brand: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Model *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingCar.model || ""}
                      onChange={(e) => setEditingCar({ ...editingCar, model: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Year *
                    </label>
                    <input
                      type="number"
                      required
                      value={editingCar.year || 2024}
                      onChange={(e) =>
                        setEditingCar({ ...editingCar, year: parseInt(e.target.value) || 2024 })
                      }
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Condition
                    </label>
                    <select
                      value={editingCar.condition || "Certified Pre-Owned"}
                      onChange={(e) =>
                        setEditingCar({
                          ...editingCar,
                          condition: e.target.value as "Brand New" | "Certified Pre-Owned" | "Classic / Collector",
                        })
                      }
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                    >
                      <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                      <option value="Brand New">Brand New</option>
                      <option value="Classic / Collector">Classic / Collector</option>
                    </select>
                  </div>
                </div>

                {/* 3. Pricing & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-[#F9FAFB] rounded-xl border border-neutral-200">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Price (USD) *
                    </label>
                    <input
                      type="number"
                      required
                      value={editingCar.price || 0}
                      onChange={(e) =>
                        setEditingCar({ ...editingCar, price: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Discount Price (USD)
                    </label>
                    <input
                      type="number"
                      placeholder="Optional"
                      value={editingCar.discount_price ?? ""}
                      onChange={(e) =>
                        setEditingCar({
                          ...editingCar,
                          discount_price: e.target.value ? parseFloat(e.target.value) : null,
                        })
                      }
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Inventory Status
                    </label>
                    <select
                      value={editingCar.status || "available"}
                      onChange={(e) =>
                        setEditingCar({
                          ...editingCar,
                          status: e.target.value as "available" | "reserved" | "sold",
                        })
                      }
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                    >
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 pt-5">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={!!editingCar.is_featured}
                      onChange={(e) =>
                        setEditingCar({ ...editingCar, is_featured: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-neutral-950 focus:ring-neutral-950"
                    />
                    <label
                      htmlFor="is_featured"
                      className="text-xs font-bold text-neutral-900 uppercase tracking-wider"
                    >
                      Show in Featured
                    </label>
                  </div>
                </div>

                {/* 4. Specifications */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Horsepower (HP)
                    </label>
                    <input
                      type="number"
                      value={editingCar.horsepower || 0}
                      onChange={(e) =>
                        setEditingCar({ ...editingCar, horsepower: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      0-60 mph (sec)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingCar.acceleration_0_100 || 0}
                      onChange={(e) =>
                        setEditingCar({
                          ...editingCar,
                          acceleration_0_100: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Mileage (mi)
                    </label>
                    <input
                      type="number"
                      value={editingCar.mileage || 0}
                      onChange={(e) =>
                        setEditingCar({ ...editingCar, mileage: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Engine
                    </label>
                    <input
                      type="text"
                      value={editingCar.engine || ""}
                      onChange={(e) => setEditingCar({ ...editingCar, engine: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Transmission
                    </label>
                    <input
                      type="text"
                      value={editingCar.transmission || "Automatic"}
                      onChange={(e) =>
                        setEditingCar({ ...editingCar, transmission: e.target.value })
                      }
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Body Type
                    </label>
                    <input
                      type="text"
                      value={editingCar.body_type || "Coupe"}
                      onChange={(e) => setEditingCar({ ...editingCar, body_type: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Exterior Color
                    </label>
                    <input
                      type="text"
                      value={editingCar.color || ""}
                      onChange={(e) => setEditingCar({ ...editingCar, color: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Interior Color
                    </label>
                    <input
                      type="text"
                      value={editingCar.interior_color || ""}
                      onChange={(e) =>
                        setEditingCar({ ...editingCar, interior_color: e.target.value })
                      }
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                    />
                  </div>
                </div>

                {/* 5. MULTI-FILE IMAGE UPLOAD & GALLERY MANAGER */}
                <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
                        Vehicle Images & Supabase Storage
                      </h4>
                      <p className="text-[11px] text-neutral-500">
                        Images are resized on the fly and saved directly to the public &apos;car-images&apos; bucket.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageFilesSelected(e.target.files)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImages}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 disabled:opacity-50"
                      >
                        {uploadingImages ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading & Compressing...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Photos</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Image Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {(editingCar.images || []).map((imgUrl, idx) => {
                      const isHero = idx === 0 || imgUrl === editingCar.hero_image;
                      return (
                        <div
                          key={idx}
                          className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 bg-neutral-200 group ${
                            isHero ? "border-emerald-600 ring-2 ring-emerald-600/20" : "border-neutral-200"
                          }`}
                        >
                          <Image src={imgUrl} alt={`Car photo ${idx + 1}`} fill className="object-cover" />

                          {isHero && (
                            <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-600 text-white">
                              Hero Photo
                            </span>
                          )}

                          {/* Hover Controls */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(idx, "left")}
                                className="p-1 rounded bg-white/90 text-neutral-900 hover:bg-white"
                                title="Move Left"
                              >
                                <MoveLeft className="w-3 h-3" />
                              </button>
                            )}

                            {!isHero && (
                              <button
                                type="button"
                                onClick={() => handleSetHeroImage(imgUrl)}
                                className="px-2 py-1 rounded bg-white text-neutral-900 text-[10px] font-bold hover:bg-neutral-100"
                              >
                                Set Hero
                              </button>
                            )}

                            {idx < (editingCar.images?.length || 0) - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(idx, "right")}
                                className="p-1 rounded bg-white/90 text-neutral-900 hover:bg-white"
                                title="Move Right"
                              >
                                <MoveRight className="w-3 h-3" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteImage(imgUrl)}
                              className="p-1 rounded bg-red-600 text-white hover:bg-red-700"
                              title="Delete Photo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Description */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Vehicle Description
                  </label>
                  <textarea
                    rows={4}
                    value={editingCar.description || ""}
                    onChange={(e) => setEditingCar({ ...editingCar, description: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950 resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCarModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={carSaving || uploadingImages}
                    className="px-6 py-2.5 rounded-xl bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-2"
                  >
                    {carSaving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Vehicle...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Vehicle Listing</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
