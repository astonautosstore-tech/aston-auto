"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Car } from "@/types/database";
import Container from "@/components/ui/Container";
import { soundEngine } from "@/lib/sound";

interface InventoryClientProps {
  initialCars: Car[];
}

export default function InventoryClient({ initialCars }: InventoryClientProps) {
  const [cars] = useState<Car[]>(initialCars);
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedCondition, setSelectedCondition] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState<number>(9);

  // Extract unique filter dropdown values
  const brands = useMemo(() => {
    return ["All", ...Array.from(new Set(cars.map((c) => c.brand)))];
  }, [cars]);

  const bodyTypes = useMemo(() => {
    return ["All", ...Array.from(new Set(cars.map((c) => c.body_type)))];
  }, [cars]);

  const conditions = useMemo(() => {
    return ["All", ...Array.from(new Set(cars.map((c) => c.condition)))];
  }, [cars]);

  // Filtered cars
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchBrand = selectedBrand === "All" || car.brand === selectedBrand;
      const matchType = selectedType === "All" || car.body_type === selectedType;
      const matchCondition = selectedCondition === "All" || car.condition === selectedCondition;
      return matchBrand && matchType && matchCondition;
    });
  }, [cars, selectedBrand, selectedType, selectedCondition]);

  const displayedCars = filteredCars.slice(0, visibleCount);

  const formatPrice = (price: number) => {
    // If price is stored in NGN millions (e.g. 520,000,000), convert sensibly or display clean USD if under 10M
    if (price >= 10000000) {
      // Converted equivalent in USD (~$1 = ₦1,500)
      const usdEquivalent = Math.round(price / 1500 / 1000) * 1000;
      return `$${usdEquivalent.toLocaleString()}`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#E10600] selection:text-white pt-20 sm:pt-24">
      
      {/* ─── 1. HERO BANNER: "COLLECTION" ─── */}
      <section className="relative w-full h-[55vh] min-h-[380px] max-h-[560px] overflow-hidden flex items-center justify-center">
        {/* Background Showroom Fleet Lineup */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <Image
            src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=2400&q=90"
            alt="Aston Auto Luxury Fleet Collection"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-60"
          />
          {/* Gradients blending seamlessly into #050505 */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]/80" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050505]/30 to-[#050505]/90" />
        </div>

        {/* Giant "Collection" Display Wordmark */}
        <Container className="relative z-10 text-center select-none pt-8">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-[13vw] sm:text-[11vw] md:text-[9.5vw] lg:text-[8.5vw] tracking-tight uppercase leading-none drop-shadow-2xl"
            style={{
              background: "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0.15) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Collection
          </motion.h1>
        </Container>
      </section>

      {/* ─── 2. "OUR LUXURY CARS" & FILTER DROPDOWNS ─── */}
      <section className="py-10 sm:py-14 border-t border-white/5">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 sm:pb-12 border-b border-white/10">
            {/* Title */}
            <div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-white">
                Our Luxury Cars
              </h2>
            </div>

            {/* Right: 3 Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              
              {/* Brand Filter */}
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    soundEngine.playHoverTick();
                    setSelectedBrand(e.target.value);
                  }}
                  className="appearance-none bg-[#0D0D0D] border border-white/15 rounded-lg px-4 py-2.5 pr-9 text-xs font-medium text-white/90 hover:border-white/30 focus:outline-none focus:border-white/50 transition-colors cursor-pointer"
                  aria-label="Filter by Brand"
                >
                  <option value="All">Brand: All</option>
                  {brands.filter((b) => b !== "All").map((brand) => (
                    <option key={brand} value={brand} className="bg-[#0D0D0D] text-white">
                      {brand}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#8A8A8A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Type / Body Filter */}
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => {
                    soundEngine.playHoverTick();
                    setSelectedType(e.target.value);
                  }}
                  className="appearance-none bg-[#0D0D0D] border border-white/15 rounded-lg px-4 py-2.5 pr-9 text-xs font-medium text-white/90 hover:border-white/30 focus:outline-none focus:border-white/50 transition-colors cursor-pointer"
                  aria-label="Filter by Body Type"
                >
                  <option value="All">Type: All</option>
                  {bodyTypes.filter((t) => t !== "All").map((type) => (
                    <option key={type} value={type} className="bg-[#0D0D0D] text-white">
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#8A8A8A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Condition Filter */}
              <div className="relative">
                <select
                  value={selectedCondition}
                  onChange={(e) => {
                    soundEngine.playHoverTick();
                    setSelectedCondition(e.target.value);
                  }}
                  className="appearance-none bg-[#0D0D0D] border border-white/15 rounded-lg px-4 py-2.5 pr-9 text-xs font-medium text-white/90 hover:border-white/30 focus:outline-none focus:border-white/50 transition-colors cursor-pointer"
                  aria-label="Filter by Condition"
                >
                  <option value="All">Condition: All</option>
                  {conditions.filter((c) => c !== "All").map((condition) => (
                    <option key={condition} value={condition} className="bg-[#0D0D0D] text-white">
                      {condition}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#8A8A8A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

            </div>
          </div>

          {/* ─── 3. CAR CARDS 3-COLUMN GRID ─── */}
          {displayedCars.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="text-base text-[#8A8A8A]">No luxury vehicles match your selected filters.</p>
              <button
                onClick={() => {
                  setSelectedBrand("All");
                  setSelectedType("All");
                  setSelectedCondition("All");
                }}
                className="px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs uppercase tracking-wider font-semibold text-white transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
              {displayedCars.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % 6) * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={`/cars/${car.slug}`}
                    onClick={() => soundEngine.playHoverTick()}
                    className="group block relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0D0D0D] border border-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black"
                  >
                    {/* Top Badges (Automatic & Year) */}
                    <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                      <span className="px-3.5 py-1 rounded-full text-[11px] font-medium bg-black/60 backdrop-blur-md border border-white/10 text-white/90">
                        {car.transmission.includes("Manual") ? "Manual" : "Automatic"}
                      </span>
                      <span className="px-3.5 py-1 rounded-full text-[11px] font-medium bg-black/60 backdrop-blur-md border border-white/10 text-white/90">
                        {car.year}
                      </span>
                    </div>

                    {/* Car Image with aspect ratio */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#141414]">
                      <Image
                        src={car.hero_image}
                        alt={car.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      {/* Deep gradient overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/30 to-transparent" />
                    </div>

                    {/* Bottom Details Overlay */}
                    <div className="p-5 sm:p-6 bg-[#0D0D0D] space-y-1">
                      <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-[#E10600] transition-colors leading-snug">
                        {car.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#A0A0A0] font-mono">
                        {formatPrice(car.discount_price ?? car.price)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* ─── 4. "LOAD MORE" BUTTON ─── */}
          {visibleCount < filteredCars.length && (
            <div className="pt-12 sm:pt-16 pb-6 flex justify-center">
              <button
                onClick={() => {
                  soundEngine.playHoverTick();
                  setVisibleCount((prev) => prev + 6);
                }}
                className="px-8 py-3.5 rounded-md bg-white text-black font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:bg-neutral-200 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Load More
              </button>
            </div>
          )}
        </Container>
      </section>

      {/* ─── 5. "READY TO FIND YOUR PERFECT CAR?" BANNER ─── */}
      <section className="relative w-full overflow-hidden bg-[#070707] py-24 sm:py-32 border-t border-white/10 mt-12 sm:mt-16">
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
            <button
              onClick={() => {
                soundEngine.playEngineRev();
                window.scrollTo({ top: 400, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-md bg-[#E10600] text-white font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#E10600]/30 hover:bg-[#FF1F14] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <span>Browse Cars</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Container>
      </section>

      {/* Global layout Footer automatically provides the bottom tagline, links, and chrome wordmark */}
    </div>
  );
}
