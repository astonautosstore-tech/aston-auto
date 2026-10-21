"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  Upload,
  MoveLeft,
  MoveRight,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Car } from "@/types/database";
import { createBrowserClient } from "@/lib/supabase/browser";
import { formatUSD, ensureUUID } from "@/lib/utils";

// Client-side image compression using HTML5 canvas
async function compressImageToWebP(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      const maxDim = 1920;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
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
          if (blob) resolve(blob);
          else reject(new Error("Blob creation failed"));
        },
        "image/webp",
        0.85
      );
    };
    img.onerror = () => reject(new Error("Image load error"));
    img.src = url;
  });
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface CarEditorPageProps {
  carId?: string;
}

export default function CarEditorPage({ carId }: CarEditorPageProps) {
  const router = useRouter();
  const isEditing = Boolean(carId && carId !== "new");

  const [loading, setLoading] = useState<boolean>(isEditing);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploadingImages, setUploadingImages] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [car, setCar] = useState<Partial<Car>>(() => ({
    id: ensureUUID(carId && carId !== "new" ? carId : undefined),
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
  }));

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Fetch car details if editing existing car
  useEffect(() => {
    if (!isEditing || !carId) return;

    let isMounted = true;
    async function fetchCar() {
      try {
        setLoading(true);
        const supabase = createBrowserClient();
        const { data, error } = await supabase
          .from("cars")
          .select("*")
          .eq("id", carId)
          .single();

        if (error) {
          throw error;
        }

        if (data && isMounted) {
          setCar(data);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        showToast(`Failed to load vehicle: ${msg}`, "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchCar();
    return () => {
      isMounted = false;
    };
  }, [isEditing, carId]);

  // Handle multi-image upload
  const handleImageFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const supabase = createBrowserClient();
      const validCarId = ensureUUID(car.id);
      if (car.id !== validCarId) {
        setCar((prev) => ({ ...prev, id: validCarId }));
      }

      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressedBlob = await compressImageToWebP(file);
        const safeBaseName = file.name
          .replace(/[^a-zA-Z0-9.-]/g, "_")
          .replace(/\.[^/.]+$/, ".webp");
        const path = `cars/${validCarId}/${Date.now()}-${safeBaseName}`;

        const { error: uploadErr } = await supabase.storage
          .from("car-images")
          .upload(path, compressedBlob, {
            contentType: "image/webp",
            upsert: true,
          });

        if (uploadErr) {
          console.error("[Storage Upload Error]:", uploadErr);
          showToast(`Upload failed for "${file.name}": ${uploadErr.message}`, "error");
          continue;
        }

        const { data: urlData } = supabase.storage.from("car-images").getPublicUrl(path);
        if (urlData?.publicUrl) {
          uploadedUrls.push(urlData.publicUrl);
        }
      }

      const existingImages = car.images || [];
      const updatedImages = [...existingImages, ...uploadedUrls];
      setCar((prev) => ({
        ...prev,
        images: updatedImages,
        hero_image: updatedImages[0] || prev.hero_image,
      }));

      if (uploadedUrls.length > 0) {
        showToast(`Uploaded ${uploadedUrls.length} image(s) successfully.`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast(`Image upload failed: ${msg}`, "error");
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSetHeroImage = (url: string) => {
    if (!car.images) return;
    const remaining = car.images.filter((img) => img !== url);
    setCar({
      ...car,
      hero_image: url,
      images: [url, ...remaining],
    });
  };

  const handleMoveImage = (index: number, direction: "left" | "right") => {
    if (!car.images) return;
    const images = [...car.images];
    const targetIdx = direction === "left" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    const temp = images[index];
    images[index] = images[targetIdx];
    images[targetIdx] = temp;

    setCar({
      ...car,
      images,
      hero_image: images[0] || car.hero_image,
    });
  };

  const handleDeleteImage = async (url: string) => {
    if (!car.images) return;
    try {
      if (url.includes("/car-images/")) {
        const parts = url.split("/car-images/");
        if (parts[1]) {
          const storagePath = decodeURIComponent(parts[1]);
          const supabase = createBrowserClient();
          await supabase.storage.from("car-images").remove([storagePath]);
        }
      }
    } catch (err) {
      console.warn("Could not remove file from storage bucket:", err);
    }

    const updated = car.images.filter((img) => img !== url);
    setCar({
      ...car,
      images: updated,
      hero_image: updated[0] || "",
    });
    showToast("Photo removed.");
  };

  // Save vehicle
  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!car.title || !car.slug) {
      showToast("Vehicle Title and URL Slug are required.", "error");
      return;
    }

    const year = car.year ?? 2024;
    if (year < 1900 || year > 2100) {
      showToast("Year must be between 1900 and 2100.", "error");
      return;
    }

    const price = car.price ?? 0;
    if (price < 0) {
      showToast("Price must be greater than or equal to 0.", "error");
      return;
    }

    if (
      car.discount_price !== null &&
      car.discount_price !== undefined &&
      car.discount_price >= price
    ) {
      showToast("Discount price must be less than regular price.", "error");
      return;
    }

    setSaving(true);
    try {
      const supabase = createBrowserClient();
      const validCarId = ensureUUID(car.id);

      const hero =
        car.images && car.images.length > 0
          ? car.images[0]
          : car.hero_image || "";

      const carPayload = {
        title: car.title.trim(),
        slug: car.slug.trim(),
        brand: car.brand?.trim() || "Aston Martin",
        model: car.model?.trim() || "",
        year: year,
        price: price,
        discount_price: car.discount_price ?? null,
        mileage: car.mileage ?? 0,
        transmission: car.transmission || "Automatic",
        fuel_type: car.fuel_type || "Petrol",
        body_type: car.body_type || "Coupe",
        color: car.color?.trim() || "",
        interior_color: car.interior_color?.trim() || null,
        condition: car.condition || "Certified Pre-Owned",
        engine: car.engine?.trim() || "",
        acceleration_0_100: car.acceleration_0_100 ?? null,
        top_speed_kmh: car.top_speed_kmh ?? null,
        horsepower: car.horsepower ?? null,
        torque_nm: car.torque_nm ?? null,
        description: car.description?.trim() || "",
        features: car.features || [],
        status: car.status || "available",
        stock_quantity: car.stock_quantity ?? 1,
        is_featured: car.is_featured ?? false,
        hero_image: hero,
        images: car.images && car.images.length > 0 ? car.images : [hero],
        updated_at: new Date().toISOString(),
      };

      let saveError;
      if (isEditing) {
        const { error } = await supabase
          .from("cars")
          .update(carPayload)
          .eq("id", validCarId);
        saveError = error;
      } else {
        const { error } = await supabase
          .from("cars")
          .insert({ id: validCarId, ...carPayload });
        saveError = error;
      }

      if (saveError) {
        console.error("[Save Car Error]:", saveError);
        const code = saveError.code ? ` [${saveError.code}]` : "";
        showToast(`Save failed: ${saveError.message}${code}`, "error");
        return;
      }

      // Revalidate cache
      try {
        await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: `/cars/${car.slug}` }),
        });
        await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
      } catch (revErr) {
        console.warn("Revalidation error:", revErr);
      }

      showToast(`Vehicle "${car.title}" saved successfully.`);

      // Return to backdoor catalog tab
      setTimeout(() => {
        router.push("/backdoor?tab=cars");
        router.refresh();
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast(`Save failed: ${msg}`, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mb-3" />
        <p className="text-xs text-neutral-500 font-medium">Loading vehicle details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-neutral-900 pb-24">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold shadow-xl border animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === "success"
              ? "bg-neutral-950 text-white border-neutral-800"
              : "bg-red-950 text-red-100 border-red-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-neutral-200 px-6 sm:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/backdoor?tab=cars"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Vehicles</span>
            </Link>

            <div className="hidden sm:block h-4 w-px bg-neutral-200" />

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-0.5">
                {isEditing ? "Edit Catalog Vehicle" : "Create Catalog Listing"}
              </span>
              <h1 className="text-base sm:text-lg font-extrabold text-neutral-950 truncate max-w-md">
                {car.title ? car.title : "Add New Vehicle"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isEditing && car.slug && (
              <Link
                href={`/cars/${car.slug}`}
                target="_blank"
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50 transition-colors"
                title="View live public page"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live View</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </Link>
            )}

            <button
              type="button"
              onClick={() => router.push("/backdoor?tab=cars")}
              className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveCar}
              disabled={saving || uploadingImages}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Vehicle</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Form Body */}
      <main className="max-w-6xl mx-auto px-6 sm:px-10 pt-8">
        <form onSubmit={handleSaveCar} className="space-y-8">
          {/* SECTION 1: PRIMARY VEHICLE INFORMATION */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h2 className="text-base font-extrabold text-neutral-950">Primary Information</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Title, permalink URL slug, brand model identification, and vehicle classification.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Vehicle Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aston Martin DB12 Coupe"
                  value={car.title || ""}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setCar({
                      ...car,
                      title: newTitle,
                      slug: car.slug ? car.slug : generateSlug(newTitle),
                    });
                  }}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-shadow"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  placeholder="aston-martin-db12-coupe"
                  value={car.slug || ""}
                  onChange={(e) => setCar({ ...car, slug: generateSlug(e.target.value) })}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950 font-mono transition-shadow"
                />
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Public URL: /cars/{car.slug || "vehicle-slug"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-2">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Brand *
                </label>
                <input
                  type="text"
                  required
                  value={car.brand || ""}
                  onChange={(e) => setCar({ ...car, brand: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Model *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DB12, Vantage"
                  value={car.model || ""}
                  onChange={(e) => setCar({ ...car, model: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Model Year *
                </label>
                <input
                  type="number"
                  required
                  min={1900}
                  max={2100}
                  value={car.year || 2024}
                  onChange={(e) => setCar({ ...car, year: parseInt(e.target.value, 10) || 2024 })}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Condition Tier
                </label>
                <select
                  value={car.condition || "Certified Pre-Owned"}
                  onChange={(e) =>
                    setCar({
                      ...car,
                      condition: e.target.value as "Brand New" | "Certified Pre-Owned" | "Classic / Collector",
                    })
                  }
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                >
                  <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                  <option value="Brand New">Brand New</option>
                  <option value="Classic / Collector">Classic / Collector</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: PRICING & INVENTORY STATUS */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h2 className="text-base font-extrabold text-neutral-950">Pricing & Showroom Status</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Set active USD pricing, promotional discount price, and inventory availability status.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Regular Price (USD) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={car.price || 0}
                  onChange={(e) => setCar({ ...car, price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  Formatted: {formatUSD(car.price)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Discount Price (USD)
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="Optional discount"
                  value={car.discount_price ?? ""}
                  onChange={(e) =>
                    setCar({
                      ...car,
                      discount_price: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  {car.discount_price ? `Active: ${formatUSD(car.discount_price)}` : "No discount active"}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Inventory Status
                </label>
                <select
                  value={car.status || "available"}
                  onChange={(e) =>
                    setCar({
                      ...car,
                      status: e.target.value as "available" | "reserved" | "sold",
                    })
                  }
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                </select>
              </div>

              <div className="flex flex-col justify-center pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={!!car.is_featured}
                    onChange={(e) => setCar({ ...car, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-neutral-950 focus:ring-neutral-950"
                  />
                  <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Feature on Homepage
                  </span>
                </label>
                <span className="text-[11px] text-neutral-400 ml-7 mt-0.5">
                  Places vehicle in featured carousel
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 3: TECHNICAL SPECIFICATIONS */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h2 className="text-base font-extrabold text-neutral-950">Technical Specifications</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Drivetrain metrics, engine configuration, acceleration, transmission, and aesthetics.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Horsepower (HP)
                </label>
                <input
                  type="number"
                  min={0}
                  value={car.horsepower || 0}
                  onChange={(e) => setCar({ ...car, horsepower: parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  0-60 mph (seconds)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  value={car.acceleration_0_100 || 0}
                  onChange={(e) =>
                    setCar({ ...car, acceleration_0_100: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Mileage (miles)
                </label>
                <input
                  type="number"
                  min={0}
                  value={car.mileage || 0}
                  onChange={(e) => setCar({ ...car, mileage: parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Engine
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4.0L Twin-Turbo V8"
                  value={car.engine || ""}
                  onChange={(e) => setCar({ ...car, engine: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Transmission
                </label>
                <input
                  type="text"
                  placeholder="Automatic"
                  value={car.transmission || "Automatic"}
                  onChange={(e) => setCar({ ...car, transmission: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Body Style
                </label>
                <input
                  type="text"
                  placeholder="Coupe, Convertible, SUV"
                  value={car.body_type || "Coupe"}
                  onChange={(e) => setCar({ ...car, body_type: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Exterior Color
                </label>
                <input
                  type="text"
                  placeholder="e.g. Onyx Black"
                  value={car.color || ""}
                  onChange={(e) => setCar({ ...car, color: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Interior Color / Trim
                </label>
                <input
                  type="text"
                  placeholder="e.g. Obsidian Black Leather"
                  value={car.interior_color || ""}
                  onChange={(e) => setCar({ ...car, interior_color: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: MULTI-FILE IMAGE UPLOAD & GALLERY */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-neutral-950">Vehicle Photo Gallery</h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Upload high-resolution photography. Images are compressed to WebP and uploaded to the public &apos;car-images&apos; bucket.
                </p>
              </div>

              <div className="flex items-center gap-3">
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-sm"
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

            {(!car.images || car.images.length === 0) ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-200 rounded-2xl p-12 text-center hover:border-neutral-400 hover:bg-neutral-50/50 transition-colors cursor-pointer"
              >
                <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-neutral-800">No vehicle photos uploaded yet</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Click here or the button above to upload JPG, PNG, or WebP photography
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {car.images.map((imgUrl, idx) => {
                  const isHero = idx === 0 || imgUrl === car.hero_image;
                  return (
                    <div
                      key={idx}
                      className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 bg-neutral-100 group transition-all ${
                        isHero
                          ? "border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`Vehicle photo ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 240px"
                        className="object-cover"
                      />

                      {isHero && (
                        <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-600 text-white shadow-sm">
                          Hero Photo
                        </span>
                      )}

                      {/* Photo Action Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMoveImage(idx, "left")}
                            className="p-1.5 rounded-lg bg-white/90 text-neutral-900 hover:bg-white transition-colors"
                            title="Move Left"
                          >
                            <MoveLeft className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {!isHero && (
                          <button
                            type="button"
                            onClick={() => handleSetHeroImage(imgUrl)}
                            className="px-2.5 py-1.5 rounded-lg bg-white text-neutral-900 text-[10px] font-bold hover:bg-neutral-100 transition-colors shadow-sm"
                          >
                            Set Hero
                          </button>
                        )}

                        {idx < (car.images?.length ?? 0) - 1 && (
                          <button
                            type="button"
                            onClick={() => handleMoveImage(idx, "right")}
                            className="p-1.5 rounded-lg bg-white/90 text-neutral-900 hover:bg-white transition-colors"
                            title="Move Right"
                          >
                            <MoveRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteImage(imgUrl)}
                          className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION 5: DESCRIPTION */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="border-b border-neutral-100 pb-4">
              <h2 className="text-base font-extrabold text-neutral-950">Vehicle Description</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Detailed provenance, factory option packages, condition summary, and history.
              </p>
            </div>

            <textarea
              rows={6}
              placeholder="Provide a detailed description of the vehicle condition, maintenance records, and bespoke factory options..."
              value={car.description || ""}
              onChange={(e) => setCar({ ...car, description: e.target.value })}
              className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950 resize-y transition-shadow leading-relaxed"
            />
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 flex items-center justify-between gap-4 border-t border-neutral-200">
            <span className="text-xs text-neutral-400 font-mono">
              ID: {car.id}
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/backdoor?tab=cars")}
                className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving || uploadingImages}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-sm"
              >
                {saving ? (
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
          </div>
        </form>
      </main>
    </div>
  );
}
