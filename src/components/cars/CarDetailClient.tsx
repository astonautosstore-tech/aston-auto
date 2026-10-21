"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MessageSquare,
  Phone,
  ArrowUpRight,
  X,
  Loader2,
  CheckCircle2,
  Calculator,
} from "lucide-react";
import { z } from "zod";
import { Car, Comment } from "@/types/database";
import Container from "@/components/ui/Container";
import { formatUSD, calculateFinancing, getWhatsAppUrl, getTelUrl } from "@/lib/utils";
import { createBrowserClient } from "@/lib/supabase/browser";
import CarReviews from "@/components/cars/CarReviews";
import CarGalleryLightbox from "@/components/cars/CarGalleryLightbox";

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().min(7, "Phone number is too short").max(30),
  message: z.string().trim().min(5, "Message must be at least 5 characters").max(2000),
  preferredContact: z.enum(["whatsapp", "call", "email"]),
});

const testDriveSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().min(7, "Phone number is too short").max(30),
  preferredDate: z.string().min(1, "Please select an appointment date"),
  preferredTime: z.string().min(1, "Please select an appointment window"),
});

interface CarDetailClientProps {
  car: Car;
  similarCars: Car[];
  comments?: Comment[];
}

function getStatusBadge(status: Car["status"]) {
  switch (status) {
    case "available":
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
          Available
        </span>
      );
    case "reserved":
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
          Reserved
        </span>
      );
    case "sold":
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F5F5F5] text-[#525252] border border-[#E5E5E5]">
          Sold
        </span>
      );
    default:
      return null;
  }
}

export default function CarDetailClient({
  car,
  similarCars,
  comments = [],
}: CarDetailClientProps) {
  const images = car.images && car.images.length > 0 ? car.images : [car.hero_image];
  const displayPrice = car.discount_price ?? car.price;

  // Inquire Modal State
  const [inquireModalOpen, setInquireModalOpen] = useState(false);
  const [inquireLoading, setInquireLoading] = useState(false);
  const [inquireSubmitted, setInquireSubmitted] = useState(false);
  const [inquireError, setInquireError] = useState<string | null>(null);
  const [inquireForm, setInquireForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Hello, I would like more information and private acquisition details on the ${car.year} ${car.title} (${formatUSD(displayPrice)}).`,
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
    preferredTime: "Morning (10:00 AM – 1:00 PM)",
    honeypot: "",
  });

  // Financing Calculator State
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [tenureMonths, setTenureMonths] = useState(60);
  const interestRate = 5.9; // Prime luxury auto rate

  const financeCalculation = calculateFinancing(
    displayPrice,
    downPaymentPercent,
    tenureMonths,
    interestRate
  );

  const handleInquireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquireError(null);

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
        name: validation.data.name,
        email: validation.data.email,
        phone: validation.data.phone,
        message: validation.data.message,
        preferred_contact: validation.data.preferredContact,
        status: "new",
      });

      if (error) throw error;
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
        name: validation.data.name,
        email: validation.data.email,
        phone: validation.data.phone,
        preferred_date: validation.data.preferredDate,
        preferred_time: validation.data.preferredTime,
        status: "pending",
      });

      if (error) throw error;
      setTestDriveSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to schedule test drive.";
      setTestDriveError(msg);
    } finally {
      setTestDriveLoading(false);
    }
  };

  const whatsAppMessage = `Hello Aston Auto Stores, I am interested in acquiring the ${car.year} ${car.title} (${formatUSD(displayPrice)}).`;

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] pt-28 pb-24">
      <Container>
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#6B6B6B]">
          <Link href="/inventory" className="hover:text-[#0A0A0A] transition-colors">
            Inventory
          </Link>
          <span>/</span>
          <span>{car.brand}</span>
          <span>/</span>
          <span className="text-[#0A0A0A]">{car.title}</span>
        </div>

        {/* ─── Main 2-Column Product Layout ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Gallery, Specs Table, Description, Features */}
          <div className="lg:col-span-7 space-y-10">
            {/* Gallery with Lightbox */}
            <CarGalleryLightbox images={images} carTitle={`${car.year} ${car.title}`} />

            {/* Description */}
            <div className="space-y-3 pt-4 border-t border-[#E8E8E8]">
              <h2 className="text-xl font-medium tracking-tight text-[#0A0A0A]">
                Vehicle Overview
              </h2>
              <div className="text-sm text-[#6B6B6B] leading-relaxed whitespace-pre-line space-y-3">
                <p>{car.description}</p>
                <p>
                  Equipped with a {car.engine} powertrain, {car.color} exterior finish, and{" "}
                  {car.interior_color || "luxury full-leather interior"}. Complete with factory keys, books, service documentation, and clean title records.
                </p>
              </div>
            </div>

            {/* Two-Column Clean Specs Table */}
            <div className="space-y-4 pt-6 border-t border-[#E8E8E8]">
              <h2 className="text-xl font-medium tracking-tight text-[#0A0A0A]">
                Technical Specifications
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm divide-y sm:divide-y-0 divide-[#E8E8E8]">
                <div className="flex justify-between py-2 border-b border-[#E8E8E8]">
                  <span className="text-[#6B6B6B]">Year</span>
                  <span className="font-medium text-[#0A0A0A]">{car.year}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E8E8E8]">
                  <span className="text-[#6B6B6B]">Make &bull; Model</span>
                  <span className="font-medium text-[#0A0A0A]">{car.brand} {car.model}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E8E8E8]">
                  <span className="text-[#6B6B6B]">Power</span>
                  <span className="font-medium text-[#0A0A0A]">{car.horsepower} HP</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E8E8E8]">
                  <span className="text-[#6B6B6B]">Acceleration (0-60 mph)</span>
                  <span className="font-medium text-[#0A0A0A]">{car.acceleration_0_100}s</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E8E8E8]">
                  <span className="text-[#6B6B6B]">Mileage</span>
                  <span className="font-medium text-[#0A0A0A]">{car.mileage ? `${car.mileage.toLocaleString()} mi` : "Delivery mi"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E8E8E8]">
                  <span className="text-[#6B6B6B]">Transmission</span>
                  <span className="font-medium text-[#0A0A0A]">{car.transmission}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E8E8E8]">
                  <span className="text-[#6B6B6B]">Body Type</span>
                  <span className="font-medium text-[#0A0A0A]">{car.body_type}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E8E8E8]">
                  <span className="text-[#6B6B6B]">Fuel System</span>
                  <span className="font-medium text-[#0A0A0A]">{car.fuel_type}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E8E8E8]">
                  <span className="text-[#6B6B6B]">Exterior Color</span>
                  <span className="font-medium text-[#0A0A0A]">{car.color}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E8E8E8]">
                  <span className="text-[#6B6B6B]">Interior Trim</span>
                  <span className="font-medium text-[#0A0A0A]">{car.interior_color || "Factory Specification"}</span>
                </div>
              </div>
            </div>

            {/* Features List */}
            {car.features && car.features.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-[#E8E8E8]">
                <h2 className="text-xl font-medium tracking-tight text-[#0A0A0A]">
                  Features &amp; Options
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {car.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#FAFAFA] rounded-lg border border-[#E8E8E8] text-xs font-medium text-[#0A0A0A]"
                    >
                      &bull; {feat}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Title, Price, Status, CTAs, Financing Calculator */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="p-6 sm:p-8 rounded-2xl border border-[#E8E8E8] bg-white space-y-6">
              {/* Header Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B]">
                    {car.year} &bull; {car.brand}
                  </span>
                  {getStatusBadge(car.status)}
                </div>
                <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#0A0A0A]">
                  {car.title}
                </h1>
              </div>

              {/* Price */}
              <div className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E8E8E8]">
                <span className="text-[10px] uppercase tracking-wider text-[#6B6B6B] block">
                  Dealership Asking Price
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-medium text-[#0A0A0A]">
                    {formatUSD(displayPrice)}
                  </span>
                  {car.discount_price && (
                    <span className="text-sm line-through text-[#6B6B6B]">
                      {formatUSD(car.price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {/* Inquire Now */}
                <button
                  type="button"
                  onClick={() => {
                    setInquireSubmitted(false);
                    setInquireError(null);
                    setInquireModalOpen(true);
                  }}
                  className="w-full py-3.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium tracking-wide transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
                  <span>Inquire Now</span>
                </button>

                {/* Book a Test Drive */}
                <button
                  type="button"
                  onClick={() => {
                    setTestDriveSubmitted(false);
                    setTestDriveError(null);
                    setTestDriveModalOpen(true);
                  }}
                  className="w-full py-3.5 rounded-lg bg-white border border-[#E8E8E8] text-[#0A0A0A] text-xs font-medium tracking-wide transition-colors hover:border-[#0A0A0A] hover:bg-[#FAFAFA] flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" strokeWidth={1.5} />
                  <span>Book a Test Drive</span>
                </button>

                {/* WhatsApp Consultation */}
                <a
                  href={getWhatsAppUrl("+1 448 226 4666", whatsAppMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-lg bg-white border border-[#E8E8E8] text-[#0A0A0A] text-xs font-medium tracking-wide transition-colors hover:border-[#0A0A0A] hover:bg-[#FAFAFA] flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
                  <span>Chat on WhatsApp</span>
                </a>

                {/* Phone Link */}
                <a
                  href={getTelUrl("+1 448 226 4666")}
                  className="w-full py-2.5 text-center text-xs font-medium text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Call Concierge: +1 448 226 4666</span>
                </a>
              </div>

              {/* ─── Financing Calculator ─── */}
              <div className="pt-6 border-t border-[#E8E8E8] space-y-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#0A0A0A] font-medium">
                  <Calculator className="w-4 h-4" strokeWidth={1.5} />
                  <span>Estimated Financing</span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E8E8E8] space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-[#6B6B6B]">Estimated Payment</span>
                    <span className="text-xl font-medium text-[#0A0A0A]">
                      {formatUSD(financeCalculation.monthlyPayment)} / mo
                    </span>
                  </div>

                  {/* Down payment control */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-[#6B6B6B]">
                      <span>Down Payment ({downPaymentPercent}%)</span>
                      <span>{formatUSD(financeCalculation.downPayment)}</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      step="5"
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      className="w-full accent-[#0A0A0A]"
                    />
                  </div>

                  {/* Term select */}
                  <div className="flex items-center justify-between text-xs text-[#6B6B6B]">
                    <span>Term Length</span>
                    <div className="flex gap-1.5">
                      {[36, 48, 60, 72].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setTenureMonths(m)}
                          className={`px-2.5 py-1 rounded text-xs transition-colors ${
                            tenureMonths === m
                              ? "bg-[#0A0A0A] text-white"
                              : "bg-white border border-[#E8E8E8] text-[#6B6B6B] hover:text-[#0A0A0A]"
                          }`}
                        >
                          {m}m
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-[11px] text-[#6B6B6B] leading-relaxed pt-1">
                    Based on prime 5.9% APR. Subject to credit approval. Ask our team for customized rates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Approved Reviews Section ─── */}
        <div className="mt-20 pt-16 border-t border-[#E8E8E8]">
          <CarReviews carId={car.id} initialComments={comments} />
        </div>

        {/* ─── Similar Vehicles ─── */}
        {similarCars && similarCars.length > 0 && (
          <div className="mt-20 pt-16 border-t border-[#E8E8E8]">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block mb-2">
                  Alternative Curation
                </span>
                <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#0A0A0A]">
                  Similar Motorcars
                </h2>
              </div>
              <Link
                href="/inventory"
                className="text-xs font-medium uppercase tracking-wider text-[#0A0A0A] hover:text-[#6B6B6B] transition-colors"
              >
                View all &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {similarCars.slice(0, 3).map((simCar) => (
                <Link
                  key={simCar.id}
                  href={`/cars/${simCar.slug}`}
                  className="group flex flex-col bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden transition-all duration-300 hover:border-[#D4D4D4] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FAFAFA]">
                    {simCar.hero_image ? (
                      <Image
                        src={simCar.hero_image}
                        alt={`${simCar.year} ${simCar.title}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-[#6B6B6B]">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-3.5 left-3.5">
                      {getStatusBadge(simCar.status)}
                    </div>
                    <div className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/90 backdrop-blur-sm text-[#0A0A0A] opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                      <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between text-xs text-[#6B6B6B] mb-1.5">
                      <span>{simCar.year} &bull; {simCar.brand}</span>
                      <span>{simCar.mileage ? `${simCar.mileage.toLocaleString()} mi` : "0 mi"}</span>
                    </div>

                    <h3 className="text-base font-medium text-[#0A0A0A] line-clamp-1 mb-4">
                      {simCar.title}
                    </h3>

                    <div className="mt-auto pt-4 border-t border-[#E8E8E8] flex items-center justify-between">
                      <span className="text-base font-medium text-[#0A0A0A]">
                        {formatUSD(simCar.discount_price ?? simCar.price)}
                      </span>
                      <span className="text-xs text-[#6B6B6B] group-hover:text-[#0A0A0A] transition-colors flex items-center gap-1">
                        Details &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>

      {/* ─── Inquire Modal ─── */}
      {inquireModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E8E8] shadow-xl">
            <button
              onClick={() => setInquireModalOpen(false)}
              className="absolute top-5 right-5 text-[#6B6B6B] hover:text-[#0A0A0A]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {inquireSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" strokeWidth={1.5} />
                <h3 className="text-xl font-medium text-[#0A0A0A]">Inquiry Received</h3>
                <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed max-w-sm mx-auto">
                  Thank you for your interest in the {car.year} {car.title}. Our private client concierge will contact you shortly.
                </p>
                <button
                  onClick={() => setInquireModalOpen(false)}
                  className="mt-4 px-6 py-2.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#6B6B6B] block mb-1">
                    Direct Inquiry
                  </span>
                  <h3 className="text-xl font-medium text-[#0A0A0A]">
                    {car.year} {car.title}
                  </h3>
                  <p className="text-xs text-[#6B6B6B] mt-1">
                    Asking: {formatUSD(displayPrice)}
                  </p>
                </div>

                {inquireError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                    {inquireError}
                  </div>
                )}

                <form onSubmit={handleInquireSubmit} className="space-y-3.5">
                  <div className="hidden">
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={inquireForm.honeypot}
                      onChange={(e) => setInquireForm({ ...inquireForm, honeypot: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#6B6B6B] block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={inquireForm.name}
                      onChange={(e) => setInquireForm({ ...inquireForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white rounded-lg border border-[#E8E8E8] text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#6B6B6B] block mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={inquireForm.email}
                        onChange={(e) => setInquireForm({ ...inquireForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white rounded-lg border border-[#E8E8E8] text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#6B6B6B] block mb-1">Phone</label>
                      <input
                        type="tel"
                        required
                        value={inquireForm.phone}
                        onChange={(e) => setInquireForm({ ...inquireForm, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3.5 py-2.5 text-xs bg-white rounded-lg border border-[#E8E8E8] text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#6B6B6B] block mb-1">Message</label>
                    <textarea
                      rows={3}
                      value={inquireForm.message}
                      onChange={(e) => setInquireForm({ ...inquireForm, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white rounded-lg border border-[#E8E8E8] text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#6B6B6B] block mb-1">Preferred Contact</label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {(["whatsapp", "call", "email"] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setInquireForm({ ...inquireForm, preferredContact: method })}
                          className={`py-2 rounded-lg border text-center capitalize transition-colors ${
                            inquireForm.preferredContact === method
                              ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                              : "bg-white border-[#E8E8E8] text-[#6B6B6B] hover:text-[#0A0A0A]"
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={inquireLoading}
                    className="w-full py-3 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {inquireLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Submit Acquisition Inquiry</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Test Drive Modal ─── */}
      {testDriveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E8E8] shadow-xl">
            <button
              onClick={() => setTestDriveModalOpen(false)}
              className="absolute top-5 right-5 text-[#6B6B6B] hover:text-[#0A0A0A]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {testDriveSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" strokeWidth={1.5} />
                <h3 className="text-xl font-medium text-[#0A0A0A]">Appointment Requested</h3>
                <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed max-w-sm mx-auto">
                  Thank you, {testDriveForm.name}. We will confirm your test drive appointment for the {car.year} {car.title} shortly.
                </p>
                <button
                  onClick={() => setTestDriveModalOpen(false)}
                  className="mt-4 px-6 py-2.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#6B6B6B] block mb-1">
                    Showroom Appointment
                  </span>
                  <h3 className="text-xl font-medium text-[#0A0A0A]">
                    Book a Test Drive
                  </h3>
                  <p className="text-xs text-[#6B6B6B] mt-1">
                    {car.year} {car.title}
                  </p>
                </div>

                {testDriveError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                    {testDriveError}
                  </div>
                )}

                <form onSubmit={handleTestDriveSubmit} className="space-y-3.5">
                  <div className="hidden">
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={testDriveForm.honeypot}
                      onChange={(e) => setTestDriveForm({ ...testDriveForm, honeypot: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#6B6B6B] block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={testDriveForm.name}
                      onChange={(e) => setTestDriveForm({ ...testDriveForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white rounded-lg border border-[#E8E8E8] text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#6B6B6B] block mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={testDriveForm.email}
                        onChange={(e) => setTestDriveForm({ ...testDriveForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white rounded-lg border border-[#E8E8E8] text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#6B6B6B] block mb-1">Phone</label>
                      <input
                        type="tel"
                        required
                        value={testDriveForm.phone}
                        onChange={(e) => setTestDriveForm({ ...testDriveForm, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3.5 py-2.5 text-xs bg-white rounded-lg border border-[#E8E8E8] text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#6B6B6B] block mb-1">Preferred Date</label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={testDriveForm.preferredDate}
                        onChange={(e) => setTestDriveForm({ ...testDriveForm, preferredDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white rounded-lg border border-[#E8E8E8] text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#6B6B6B] block mb-1">Time Window</label>
                      <select
                        value={testDriveForm.preferredTime}
                        onChange={(e) => setTestDriveForm({ ...testDriveForm, preferredTime: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white rounded-lg border border-[#E8E8E8] text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
                      >
                        <option>Morning (10:00 AM – 1:00 PM)</option>
                        <option>Afternoon (1:00 PM – 4:00 PM)</option>
                        <option>Late Afternoon (4:00 PM – 6:30 PM)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={testDriveLoading}
                    className="w-full py-3 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {testDriveLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Confirm Test Drive Appointment</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
