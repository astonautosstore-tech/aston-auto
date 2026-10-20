"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, CheckCircle2, ArrowRight } from "lucide-react";
import { Car, Comment } from "@/types/database";
import Container from "@/components/ui/Container";
import { soundEngine } from "@/lib/sound";

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
    soundEngine.playHoverTick();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    soundEngine.playHoverTick();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      const usdEquivalent = Math.round(price / 1500 / 1000) * 1000;
      return `$${usdEquivalent.toLocaleString()}`;
    }
    return `$${price.toLocaleString()}`;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playSuccessChime();
    setBookingSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#E10600] selection:text-white pt-24 sm:pt-28">
      
      {/* ─── 1. HERO CAR GALLERY CAROUSEL ─── */}
      <section className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pb-12 sm:pb-16">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0D0D0D] border border-white/10 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-full"
            >
              <Image
                src={images[currentImageIndex]}
                alt={`${car.title} - View ${currentImageIndex + 1}`}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/70 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Left / Right Carousel Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                aria-label="Previous photo"
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-20 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={nextImage}
                aria-label="Next photo"
                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-20 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* Carousel Dot Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentImageIndex === idx ? "w-6 bg-[#E10600]" : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── 2. SPECS & DETAILS (2-COLUMN GRID) ─── */}
      <section className="pb-24 sm:pb-32 border-b border-white/10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: 4 Key Specs & Description */}
            <div className="lg:col-span-7 space-y-10">
              
              {/* 4 Specs (2x2 Grid) */}
              <div className="grid grid-cols-2 gap-8 sm:gap-10 pb-10 border-b border-white/10">
                {/* Power */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#8A8A8A]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
                    <span>Power</span>
                  </div>
                  <span className="font-display font-bold text-2xl sm:text-3xl text-white block">
                    {car.horsepower} HP
                  </span>
                </div>

                {/* 0-100 km/h */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#8A8A8A]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
                    <span>0-100 km/h</span>
                  </div>
                  <span className="font-display font-bold text-2xl sm:text-3xl text-white block">
                    {car.acceleration_0_100} sec
                  </span>
                </div>

                {/* Transmission */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#8A8A8A]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
                    <span>Transmission</span>
                  </div>
                  <span className="font-display font-bold text-2xl sm:text-3xl text-white block">
                    {car.transmission.includes("Manual") ? "Manual" : "Automatic"}
                  </span>
                </div>

                {/* Top Speed */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#8A8A8A]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
                    <span>Top Speed</span>
                  </div>
                  <span className="font-display font-bold text-2xl sm:text-3xl text-white block">
                    {car.top_speed_kmh} km/h
                  </span>
                </div>
              </div>

              {/* Car Description */}
              <div className="space-y-4">
                <span className="text-xs font-mono uppercase tracking-[0.2em] font-semibold text-[#8A8A8A] block">
                  Car Description
                </span>
                <div className="text-sm text-[#A0A0A0] leading-relaxed space-y-4 font-sans">
                  <p>{car.description}</p>
                  <p>
                    Engineered to deliver exceptional driving dynamics and effortless grand touring poise. Features a {car.engine} powertrain, {car.color} exterior specification with {car.interior_color || "bespoke handcrafted luxury interior"}.
                  </p>
                  <p>
                    Hand-inspected to our rigorous 150-point standards with verified title and guaranteed mechanical certification.
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: Title, Subtitle, Price & CTA */}
            <div className="lg:col-span-5 space-y-6 lg:pl-6">
              {/* Title */}
              <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white leading-tight">
                {car.title}
              </h1>

              {/* Subtitle / Summary */}
              <p className="text-xs sm:text-sm text-[#8A8A8A] leading-relaxed">
                Seamless luxury {car.body_type.toLowerCase()} designed for comfort, technology, and practicality. Premium performance and handcrafted refinement for both city streets and long-distance travel.
              </p>

              {/* Price */}
              <div className="pt-2">
                <span className="font-display font-bold text-3xl sm:text-4xl text-white block tracking-tight">
                  {formatPrice(car.discount_price ?? car.price)}
                </span>
              </div>

              {/* Schedule Test Drive Button */}
              <div className="pt-3">
                <button
                  onClick={() => {
                    soundEngine.playEngineRev();
                    setTestDriveModalOpen(true);
                  }}
                  className="w-full py-4 rounded-md bg-[#E10600] text-white font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#E10600]/30 hover:bg-[#FF1F14] hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer text-center"
                >
                  Schedule Test Drive
                </button>
              </div>

              {/* Quick Specs List */}
              <div className="pt-6 border-t border-white/10 space-y-2 text-xs font-mono text-[#8A8A8A]">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Year</span>
                  <span className="text-white">{car.year}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Condition</span>
                  <span className="text-white">{car.condition}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Mileage</span>
                  <span className="text-white">{car.mileage.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Fuel Type</span>
                  <span className="text-white">{car.fuel_type}</span>
                </div>
              </div>

            </div>

          </div>
        </Container>
      </section>

      {/* ─── 3. "YOU MIGHT ALSO LIKE" SECTION ─── */}
      <section className="py-20 sm:py-28 border-b border-white/10">
        <Container>
          <div className="flex items-center justify-between pb-10 sm:pb-12">
            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-white">
              You Might Also Like
            </h2>
            <Link
              href="/inventory"
              onClick={() => soundEngine.playHoverTick()}
              className="text-xs uppercase tracking-[0.16em] font-bold text-white/80 hover:text-white px-4 py-2.5 rounded-md border border-white/20 hover:border-white transition-colors"
            >
              View All Inventory
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {similarCars.slice(0, 3).map((similarCar) => (
              <Link
                key={similarCar.id}
                href={`/cars/${similarCar.slug}`}
                onClick={() => soundEngine.playHoverTick()}
                className="group block relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0D0D0D] border border-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black"
              >
                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                  <span className="px-3.5 py-1 rounded-full text-[11px] font-medium bg-black/60 backdrop-blur-md border border-white/10 text-white/90">
                    {similarCar.transmission.includes("Manual") ? "Manual" : "Automatic"}
                  </span>
                  <span className="px-3.5 py-1 rounded-full text-[11px] font-medium bg-black/60 backdrop-blur-md border border-white/10 text-white/90">
                    {similarCar.year}
                  </span>
                </div>

                {/* Car Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#141414]">
                  <Image
                    src={similarCar.hero_image}
                    alt={similarCar.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/30 to-transparent" />
                </div>

                {/* Bottom Details */}
                <div className="p-5 sm:p-6 bg-[#0D0D0D] space-y-1">
                  <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-[#E10600] transition-colors leading-snug">
                    {similarCar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A0A0A0] font-mono">
                    {formatPrice(similarCar.discount_price ?? similarCar.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── 4. "READY TO FIND YOUR PERFECT CAR?" BANNER ─── */}
      <section className="relative w-full overflow-hidden bg-[#070707] py-24 sm:py-32">
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2400&q=90"
            alt="Aston Auto Red Supercar"
            fill
            className="object-cover object-center opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/90" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050505]/40 to-[#050505]/90" />
        </div>

        <Container className="relative z-10 text-center max-w-2xl mx-auto space-y-6">
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-tight">
            Ready to Find Your <br />
            Perfect Car?
          </h2>

          <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed max-w-lg mx-auto">
            Premium vehicles, exceptional service, unleashed speeds. Experience automotive excellence tailored for the discerning driver.
          </p>

          <div className="pt-2">
            <Link
              href="/inventory"
              onClick={() => soundEngine.playEngineRev()}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-md bg-[#E10600] text-white font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#E10600]/30 hover:bg-[#FF1F14] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span>Browse Cars</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ─── 5. SCHEDULE TEST DRIVE MODAL ─── */}
      <AnimatePresence>
        {testDriveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-lg rounded-3xl bg-[#0D0D0D] border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <button
                onClick={() => {
                  setTestDriveModalOpen(false);
                  setBookingSubmitted(false);
                }}
                className="absolute top-5 right-5 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {bookingSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#E10600]/10 text-[#E10600] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-white">
                    Test Drive Reserved
                  </h3>
                  <p className="text-xs text-[#8A8A8A] max-w-sm mx-auto leading-relaxed">
                    Our Senior Concierge will contact you within 60 minutes to finalize the schedule and transport arrangements for the <span className="text-white font-medium">{car.title}</span>.
                  </p>
                  <button
                    onClick={() => {
                      setTestDriveModalOpen(false);
                      setBookingSubmitted(false);
                    }}
                    className="mt-4 px-6 py-3 rounded-lg bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#E10600] block mb-1">
                      VIP Appointment
                    </span>
                    <h3 className="font-display font-bold text-2xl text-white">
                      Schedule a Test Drive
                    </h3>
                    <p className="text-xs text-[#8A8A8A] mt-1">
                      Reserve a private session with the {car.title}.
                    </p>
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Smith"
                        value={bookingData.name}
                        onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                        className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white/40"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="john@domain.com"
                          value={bookingData.email}
                          onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                          className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white/40"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+1 (555) 123 4567"
                          value={bookingData.phone}
                          onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                          className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={bookingData.preferredDate}
                        onChange={(e) => setBookingData({ ...bookingData, preferredDate: e.target.value })}
                        className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white/40"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-md bg-[#E10600] text-white font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#E10600]/30 hover:bg-[#FF1F14] transition-all cursor-pointer"
                      >
                        Confirm VIP Reservation
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global layout Footer automatically provides the bottom tagline, links, and chrome wordmark */}
    </div>
  );
}
