"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  ArrowRight,
  Phone,
  ShieldCheck,
  Gauge,
  Zap,
  Cog,
  Calendar,
  MessageSquare,
  Clock,
  Send,
  Loader2,
  Sparkles,
} from "lucide-react";
import { z } from "zod";
import { Car, Comment } from "@/types/database";
import Container from "@/components/ui/Container";
import { formatUSD } from "@/lib/utils";
import { createBrowserClient } from "@/lib/supabase/browser";
import CarReviews from "@/components/cars/CarReviews";

interface CarDetailClientProps {
  car: Car;
  similarCars: Car[];
  comments?: Comment[];
}

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Please provide a valid email address").max(120),
  phone: z.string().trim().min(7, "Please provide a valid phone number").max(30),
  message: z.string().trim().min(5, "Please enter your inquiry details").max(1000),
  preferredContact: z.enum(["whatsapp", "call", "email"]).default("whatsapp"),
});

const testDriveSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Please provide a valid email address").max(120),
  phone: z.string().trim().min(7, "Please provide a valid phone number").max(30),
  preferredDate: z.string().min(1, "Please choose a preferred date"),
  preferredTime: z.string().min(1, "Please choose a preferred time slot"),
});

export default function CarDetailClient({
  car,
  similarCars,
  comments = [],
}: CarDetailClientProps) {
  const images = car.images && car.images.length > 0 ? car.images : [car.hero_image];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Inquire Modal State
  const [inquireModalOpen, setInquireModalOpen] = useState(false);
  const [inquireLoading, setInquireLoading] = useState(false);
  const [inquireSubmitted, setInquireSubmitted] = useState(false);
  const [inquireError, setInquireError] = useState<string | null>(null);
  const [inquireForm, setInquireForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Hello, I would like more information and private acquisition details on the ${car.year} ${car.title} (${formatUSD(car.discount_price ?? car.price)}).`,
    preferredContact: "whatsapp" as "whatsapp" | "call" | "email",
    honeypot: "",
  });

  // Test Drive Modal State
  const [testDriveModalOpen, setTestDriveModalOpen] = useState(false);
  const [testDriveLoading, setTestDriveLoading] = useState(false);
  const [testDriveSubmitted, setTestDriveSubmitted] = useState(false);
  const [testDriveError, setTestDriveError] = useState<string | null>(null);
  const [testDriveForm, setTestDriveForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "Morning (10:00 AM - 1:00 PM)",
    honeypot: "",
  });

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleInquireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquireError(null);

    // Bot check
    if (inquireForm.honeypot) {
      setInquireSubmitted(true);
      return;
    }

    const validation = inquirySchema.safeParse({
      name: inquireForm.name,
      email: inquireForm.email,
      phone: inquireForm.phone,
      message: inquireForm.message,
      preferredContact: inquireForm.preferredContact,
    });

    if (!validation.success) {
      setInquireError(validation.error.issues[0]?.message || "Please check your inputs.");
      return;
    }

    setInquireLoading(true);
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from("inquiries").insert({
        car_id: car.id,
        car_title: car.title,
        name: validation.data.name,
        email: validation.data.email,
        phone: validation.data.phone,
        message: validation.data.message,
        preferred_contact: validation.data.preferredContact,
        status: "new",
      });

      if (error) {
        throw new Error(error.message);
      }

      setInquireSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit inquiry.";
      setInquireError(msg);
    } finally {
      setInquireLoading(false);
    }
  };

  const handleTestDriveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestDriveError(null);

    // Bot check
    if (testDriveForm.honeypot) {
      setTestDriveSubmitted(true);
      return;
    }

    const validation = testDriveSchema.safeParse({
      name: testDriveForm.name,
      email: testDriveForm.email,
      phone: testDriveForm.phone,
      preferredDate: testDriveForm.preferredDate,
      preferredTime: testDriveForm.preferredTime,
    });

    if (!validation.success) {
      setTestDriveError(validation.error.issues[0]?.message || "Please check your inputs.");
      return;
    }

    setTestDriveLoading(true);
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from("test_drives").insert({
        car_id: car.id,
        car_title: car.title,
        name: validation.data.name,
        email: validation.data.email,
        phone: validation.data.phone,
        preferred_date: validation.data.preferredDate,
        preferred_time: validation.data.preferredTime,
        status: "pending",
      });

      if (error) {
        throw new Error(error.message);
      }

      setTestDriveSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to book appointment.";
      setTestDriveError(msg);
    } finally {
      setTestDriveLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-white text-neutral-900 pt-20 sm:pt-24">
      {/* ─── 1. BREADCRUMBS & TOP BAR ─── */}
      <div className="bg-[#F9FAFB] border-b border-neutral-200 py-3.5">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-neutral-500">
              <Link href="/" className="hover:text-neutral-900">
                Home
              </Link>
              <span>/</span>
              <Link href="/inventory" className="hover:text-neutral-900">
                Inventory
              </Link>
              <span>/</span>
              <span className="text-neutral-900 font-semibold">{car.title}</span>
            </div>

            <a
              href="tel:+14482264666"
              className="inline-flex items-center gap-1.5 font-bold text-neutral-900 hover:text-neutral-600"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Concierge: +1 448 226 4666</span>
            </a>
          </div>
        </Container>
      </div>

      {/* ─── 2. MAIN VEHICLE GALLERY & SPECIFICATION DESK ─── */}
      <section className="py-8 sm:py-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Gallery (Main photo + thumbnails) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-sm">
                <Image
                  src={images[currentImageIndex]}
                  alt={`${car.title} - Photo ${currentImageIndex + 1}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center transition-all duration-500"
                />

                {/* Condition Tag */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-bold bg-black/75 backdrop-blur-md text-white">
                  {car.condition || "Certified In Stock"}
                </div>

                {/* Photo index counter */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-md text-xs font-bold bg-black/75 backdrop-blur-md text-white">
                  {currentImageIndex + 1} / {images.length}
                </div>

                {/* Left/Right controls */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-neutral-900 shadow-md transition-transform hover:scale-110"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-neutral-900 shadow-md transition-transform hover:scale-110"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails strip */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        currentImageIndex === idx
                          ? "border-neutral-950 ring-2 ring-neutral-950/20"
                          : "border-neutral-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Dealership Guarantee Cards */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="flex items-center gap-3 p-3.5 bg-[#F9FAFB] rounded-xl border border-neutral-200">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">
                      150-Point Certified
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Clean title & verified Carfax
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-[#F9FAFB] rounded-xl border border-neutral-200">
                  <Calendar className="w-5 h-5 text-neutral-800 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">
                      Nationwide Delivery
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Enclosed carrier directly to you
                    </span>
                  </div>
                </div>
              </div>

              {/* Vehicle Description */}
              <div className="pt-6 border-t border-neutral-200">
                <h2 className="text-xs font-bold text-neutral-950 mb-3 uppercase tracking-wider">
                  Vehicle Overview & Details
                </h2>
                <div className="text-sm text-neutral-600 leading-relaxed space-y-3">
                  <p>{car.description}</p>
                  <p>
                    Equipped with a {car.engine} powertrain, {car.color} exterior paint, and{" "}
                    {car.interior_color || "luxury full-leather interior"}. Complete with factory keys,
                    manuals, and verified title records.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Pricing, Specs & Actions */}
            <div className="lg:col-span-5 bg-[#F9FAFB] p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  {car.year} • {car.brand}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight leading-tight">
                  {car.title}
                </h1>
                <p className="text-xs text-neutral-500 mt-1">Model: {car.model}</p>
              </div>

              {/* Price */}
              <div className="p-4 bg-white rounded-xl border border-neutral-200">
                <span className="text-[11px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Verified Dealership Price
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-neutral-950">
                    {formatUSD(car.discount_price ?? car.price)}
                  </span>
                  <span className="text-xs font-bold text-neutral-500">USD</span>
                </div>
              </div>

              {/* 4 Specs Matrix */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border border-neutral-200">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500 mb-1">
                    <Zap className="w-3.5 h-3.5 text-neutral-700" /> Power
                  </span>
                  <span className="text-base font-bold text-neutral-900 block">
                    {car.horsepower} HP
                  </span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-neutral-200">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500 mb-1">
                    <Gauge className="w-3.5 h-3.5 text-neutral-700" /> 0-60 mph
                  </span>
                  <span className="text-base font-bold text-neutral-900 block">
                    {car.acceleration_0_100}s
                  </span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-neutral-200">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500 mb-1">
                    <Cog className="w-3.5 h-3.5 text-neutral-700" /> Transmission
                  </span>
                  <span className="text-base font-bold text-neutral-900 block truncate">
                    {car.transmission}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-neutral-200">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500 mb-1">
                    <Gauge className="w-3.5 h-3.5 text-neutral-700" /> Mileage
                  </span>
                  <span className="text-base font-bold text-neutral-900 block">
                    {car.mileage ? `${car.mileage.toLocaleString()} mi` : "Delivery mi"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setInquireSubmitted(false);
                    setInquireError(null);
                    setInquireModalOpen(true);
                  }}
                  className="w-full py-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Inquire Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTestDriveSubmitted(false);
                    setTestDriveError(null);
                    setTestDriveModalOpen(true);
                  }}
                  className="w-full py-3.5 rounded-xl bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-900 font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a Test Drive</span>
                </button>

                <a
                  href={`https://wa.me/14482264666?text=Hello%20Aston%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(
                    car.title
                  )}%20(${formatUSD(car.discount_price ?? car.price)}).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href="tel:+14482264666"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-neutral-600 font-medium text-xs hover:text-neutral-900 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Direct Desk: +1 448 226 4666</span>
                </a>
              </div>

              {/* Spec Breakdown Table */}
              <div className="pt-4 border-t border-neutral-200 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Body Type</span>
                  <span className="font-semibold text-neutral-900">{car.body_type}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Exterior Color</span>
                  <span className="font-semibold text-neutral-900">{car.color}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Engine</span>
                  <span className="font-semibold text-neutral-900">{car.engine}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Fuel</span>
                  <span className="font-semibold text-neutral-900">{car.fuel_type}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Showroom</span>
                  <span className="font-semibold text-neutral-900">450 N Rodeo Dr, Beverly Hills</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 3. APPROVED REVIEWS SECTION ─── */}
      <section className="py-12 sm:py-16 bg-[#FAFAFA] border-t border-neutral-200">
        <Container>
          <div className="max-w-4xl mx-auto">
            <CarReviews carId={car.id} initialComments={comments} />
          </div>
        </Container>
      </section>

      {/* ─── 4. SIMILAR VEHICLES ─── */}
      {similarCars.length > 0 && (
        <section className="py-14 sm:py-20 bg-white border-t border-neutral-200">
          <Container>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-1">
                  Explore Alternatives
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                  Similar Vehicles in Stock
                </h2>
              </div>

              <Link
                href="/inventory"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 hover:text-neutral-600"
              >
                <span>View Full Inventory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarCars.slice(0, 3).map((simCar) => (
                <div
                  key={simCar.id}
                  className="group flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                    <Image
                      src={simCar.hero_image}
                      alt={simCar.title}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/90 text-neutral-900">
                      {simCar.year}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      {simCar.brand}
                    </span>
                    <h3 className="text-base font-bold text-neutral-950 line-clamp-1 mb-2">
                      {simCar.title}
                    </h3>
                    <div className="mt-auto pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-base font-extrabold text-neutral-950">
                        {formatUSD(simCar.price)}
                      </span>
                      <Link
                        href={`/cars/${simCar.slug}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-950 text-white text-xs font-bold rounded-lg hover:bg-neutral-800"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ─── 5. INQUIRE MODAL ─── */}
      {inquireModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-neutral-200 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setInquireModalOpen(false);
                setInquireSubmitted(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {inquireSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-extrabold text-2xl tracking-tight text-neutral-950">
                  Inquiry Received
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto leading-relaxed">
                  Thank you. An Aston private client concierge has received your request for the{" "}
                  <span className="font-bold text-neutral-950">{car.title}</span> and will respond
                  shortly.
                </p>

                <div className="pt-3 flex flex-col gap-2">
                  <a
                    href={`https://wa.me/14482264666?text=Hello%20Aston%2C%20I%20just%20submitted%20an%20inquiry%20regarding%20the%20${encodeURIComponent(
                      car.title
                    )}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-lg bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 transition-colors"
                  >
                    Chat on WhatsApp Now
                  </a>
                  <button
                    onClick={() => {
                      setInquireModalOpen(false);
                      setInquireSubmitted(false);
                    }}
                    className="w-full py-2.5 rounded-lg border border-neutral-300 text-neutral-700 font-semibold text-xs hover:bg-neutral-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                    Direct Dealership Inquiry
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-950">
                    Acquisition & Details
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    {car.year} {car.title} • {formatUSD(car.discount_price ?? car.price)}
                  </p>
                </div>

                {inquireError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                    {inquireError}
                  </div>
                )}

                <form onSubmit={handleInquireSubmit} className="space-y-4">
                  {/* Honeypot field */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="website"
                      value={inquireForm.honeypot}
                      onChange={(e) => setInquireForm({ ...inquireForm, honeypot: e.target.value })}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={inquireForm.name}
                      onChange={(e) => setInquireForm({ ...inquireForm, name: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="eleanor@domain.com"
                        value={inquireForm.email}
                        onChange={(e) => setInquireForm({ ...inquireForm, email: e.target.value })}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={inquireForm.phone}
                        onChange={(e) => setInquireForm({ ...inquireForm, phone: e.target.value })}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                      Preferred Contact Channel
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["whatsapp", "call", "email"] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setInquireForm({ ...inquireForm, preferredContact: method })}
                          className={`py-2 text-xs font-semibold rounded-lg border capitalize transition-all ${
                            inquireForm.preferredContact === method
                              ? "bg-neutral-950 text-white border-neutral-950"
                              : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50"
                          }`}
                        >
                          {method === "call" ? "Phone Call" : method}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={inquireForm.message}
                      onChange={(e) => setInquireForm({ ...inquireForm, message: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={inquireLoading}
                      className="w-full py-3.5 rounded-lg bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      {inquireLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Inquiry</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* ─── 6. SCHEDULE TEST DRIVE MODAL ─── */}
      {testDriveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-neutral-200 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setTestDriveModalOpen(false);
                setTestDriveSubmitted(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {testDriveSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-extrabold text-2xl tracking-tight text-neutral-950">
                  Appointment Reserved
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto leading-relaxed">
                  Our private client concierge will contact you within 60 minutes to confirm your
                  viewing schedule for the <span className="font-bold text-neutral-950">{car.title}</span>.
                </p>
                <button
                  onClick={() => {
                    setTestDriveModalOpen(false);
                    setTestDriveSubmitted(false);
                  }}
                  className="mt-4 px-6 py-2.5 rounded-lg bg-neutral-950 text-white font-semibold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                    Private Showroom Appointment
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-950">
                    Schedule Test Drive
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Reserve a private session with the {car.title}.
                  </p>
                </div>

                {testDriveError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                    {testDriveError}
                  </div>
                )}

                <form onSubmit={handleTestDriveSubmit} className="space-y-4">
                  {/* Honeypot field */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="company"
                      value={testDriveForm.honeypot}
                      onChange={(e) =>
                        setTestDriveForm({ ...testDriveForm, honeypot: e.target.value })
                      }
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Michael Harris"
                      value={testDriveForm.name}
                      onChange={(e) => setTestDriveForm({ ...testDriveForm, name: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="michael@domain.com"
                        value={testDriveForm.email}
                        onChange={(e) =>
                          setTestDriveForm({ ...testDriveForm, email: e.target.value })
                        }
                        className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={testDriveForm.phone}
                        onChange={(e) =>
                          setTestDriveForm({ ...testDriveForm, phone: e.target.value })
                        }
                        className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        required
                        min={todayStr}
                        value={testDriveForm.preferredDate}
                        onChange={(e) =>
                          setTestDriveForm({ ...testDriveForm, preferredDate: e.target.value })
                        }
                        className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                        Preferred Time *
                      </label>
                      <select
                        value={testDriveForm.preferredTime}
                        onChange={(e) =>
                          setTestDriveForm({ ...testDriveForm, preferredTime: e.target.value })
                        }
                        className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                      >
                        <option value="Morning (10:00 AM - 1:00 PM)">
                          Morning (10:00 AM - 1:00 PM)
                        </option>
                        <option value="Afternoon (1:00 PM - 4:00 PM)">
                          Afternoon (1:00 PM - 4:00 PM)
                        </option>
                        <option value="Evening (4:00 PM - 7:00 PM)">
                          Evening (4:00 PM - 7:00 PM)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={testDriveLoading}
                      className="w-full py-3.5 rounded-lg bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      {testDriveLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Reserving Appointment...</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-4 h-4" />
                          <span>Confirm Test Drive Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
