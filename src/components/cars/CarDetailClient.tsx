"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X, CheckCircle2, ArrowRight, Phone, ShieldCheck, Gauge, Zap, Cog, Calendar } from "lucide-react";
import { Car, Comment } from "@/types/database";
import Container from "@/components/ui/Container";
import { formatUSD } from "@/lib/utils";

interface CarDetailClientProps {
  car: Car;
  similarCars: Car[];
  comments?: Comment[];
}

export default function CarDetailClient({ car, similarCars }: CarDetailClientProps) {
  const images = car.images && car.images.length > 0 ? car.images : [car.hero_image];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [testDriveModalOpen, setTestDriveModalOpen] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
  });

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 pt-20 sm:pt-24">
      {/* ─── 1. BREADCRUMBS & TOP BAR ─── */}
      <div className="bg-[#F9FAFB] border-b border-neutral-200 py-3.5">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-neutral-500">
              <Link href="/" className="hover:text-neutral-900">Home</Link>
              <span>/</span>
              <Link href="/inventory" className="hover:text-neutral-900">Inventory</Link>
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

      {/* ─── 2. MAIN VEHICLE GALLERY & PURCHASE DESK ─── */}
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
                    <span className="text-xs font-bold text-neutral-900 block">150-Point Certified</span>
                    <span className="text-[11px] text-neutral-500">Includes clean title guarantee</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-[#F9FAFB] rounded-xl border border-neutral-200">
                  <Calendar className="w-5 h-5 text-neutral-800 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">Nationwide Delivery</span>
                    <span className="text-[11px] text-neutral-500">Enclosed carrier to your home</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Description */}
              <div className="pt-6 border-t border-neutral-200">
                <h2 className="text-base font-bold text-neutral-950 mb-3 uppercase tracking-wider text-xs">
                  Vehicle Overview & Details
                </h2>
                <div className="text-sm text-neutral-600 leading-relaxed space-y-3">
                  <p>{car.description}</p>
                  <p>
                    Equipped with a {car.engine} powertrain, {car.color} exterior paint, and {car.interior_color || "luxury full-leather interior"}. Complete with factory keys, manuals, and verified title records.
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
                <p className="text-xs text-neutral-500 mt-1">
                  Model: {car.model}
                </p>
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
                  onClick={() => setTestDriveModalOpen(true)}
                  className="w-full py-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
                >
                  Schedule Showroom Test Drive
                </button>

                <a
                  href="tel:+14482264666"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 font-bold text-xs uppercase tracking-wider hover:bg-neutral-50 transition-colors shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Dealership: +1 448 226 4666</span>
                </a>

                <a
                  href={`https://wa.me/14482264666?text=Hello%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(
                    car.title
                  )}%20(${formatUSD(car.price)}).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  <span>Chat on WhatsApp</span>
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
                  <span className="text-neutral-500">Location</span>
                  <span className="font-semibold text-neutral-900">Beverly Hills Showroom</span>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ─── 3. SIMILAR VEHICLES ─── */}
      {similarCars.length > 0 && (
        <section className="py-14 sm:py-20 bg-[#F9FAFB] border-t border-neutral-200">
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

      {/* ─── 4. SCHEDULE TEST DRIVE MODAL ─── */}
      {testDriveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-neutral-200 p-6 sm:p-8 shadow-2xl space-y-5">
            <button
              onClick={() => {
                setTestDriveModalOpen(false);
                setBookingSubmitted(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-extrabold text-2xl tracking-tight text-neutral-950">
                  Appointment Reserved
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto leading-relaxed">
                  Our private client concierge will contact you within 60 minutes to confirm your viewing schedule for the <span className="font-bold text-neutral-950">{car.title}</span>.
                </p>
                <button
                  onClick={() => {
                    setTestDriveModalOpen(false);
                    setBookingSubmitted(false);
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
                    Reserve a session with the {car.title}.
                  </p>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Michael Harris"
                      value={bookingData.name}
                      onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
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
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
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
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={bookingData.preferredDate}
                      onChange={(e) => setBookingData({ ...bookingData, preferredDate: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-lg bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-sm"
                    >
                      Confirm Test Drive Request
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
