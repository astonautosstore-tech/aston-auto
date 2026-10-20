"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ArrowRight, Gauge, Zap, Cog, Search } from "lucide-react";
import { Car } from "@/types/database";
import Container from "@/components/ui/Container";
import { formatUSD } from "@/lib/utils";

import { storeApi } from "@/lib/supabase/client";
import { useEffect } from "react";

interface InventoryClientProps {
  initialCars: Car[];
}

export default function InventoryClient({ initialCars }: InventoryClientProps) {
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedCondition, setSelectedCondition] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(12);

  useEffect(() => {
    async function refreshCars() {
      try {
        const live = await storeApi.getCars();
        if (live && live.length > 0) {
          setCars(live);
        }
      } catch (err) {
        console.warn("Failed to load live cars:", err);
      }
    }

    refreshCars();

    const handleUpdate = () => {
      refreshCars();
    };

    window.addEventListener("aston_cars_updated", handleUpdate);
    return () => window.removeEventListener("aston_cars_updated", handleUpdate);
  }, []);

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
      
      let matchSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        matchSearch =
          car.title.toLowerCase().includes(q) ||
          car.brand.toLowerCase().includes(q) ||
          car.model.toLowerCase().includes(q);
      }

      return matchBrand && matchType && matchCondition && matchSearch;
    });
  }, [cars, selectedBrand, selectedType, selectedCondition, searchQuery]);

  const displayedCars = filteredCars.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-white text-neutral-900 pt-20 sm:pt-24">
      {/* ─── 1. HEADER BANNER ─── */}
      <section className="relative w-full bg-[#F9FAFB] border-b border-neutral-200 py-12 sm:py-16">
        <Container>
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">
              Direct Dealership Inventory
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 tracking-tight mb-3">
              Vehicle Inventory
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Explore our verified selection of luxury, exotic, and high-performance automobiles. Every vehicle includes clean CARFAX verification and available enclosed nationwide delivery.
            </p>
          </div>
        </Container>
      </section>

      {/* ─── 2. FILTER CONTROLS ─── */}
      <section className="py-8 bg-white border-b border-neutral-100">
        <Container>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#F9FAFB] p-4 rounded-xl border border-neutral-200">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search inventory by make, model, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white rounded-lg border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950"
              />
            </div>

            {/* Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Brand Filter */}
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="appearance-none bg-white border border-neutral-300 rounded-lg px-4 py-2.5 pr-9 text-xs sm:text-sm font-semibold text-neutral-800 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-colors cursor-pointer shadow-sm"
                  aria-label="Filter by Brand"
                >
                  <option value="All">All Makes</option>
                  {brands.filter((b) => b !== "All").map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Type / Body Filter */}
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="appearance-none bg-white border border-neutral-300 rounded-lg px-4 py-2.5 pr-9 text-xs sm:text-sm font-semibold text-neutral-800 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-colors cursor-pointer shadow-sm"
                  aria-label="Filter by Body Type"
                >
                  <option value="All">All Body Types</option>
                  {bodyTypes.filter((t) => t !== "All").map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Condition Filter */}
              <div className="relative">
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="appearance-none bg-white border border-neutral-300 rounded-lg px-4 py-2.5 pr-9 text-xs sm:text-sm font-semibold text-neutral-800 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-colors cursor-pointer shadow-sm"
                  aria-label="Filter by Condition"
                >
                  <option value="All">All Conditions</option>
                  {conditions.filter((c) => c !== "All").map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 3. CAR CARDS 3-COLUMN GRID ─── */}
      <section className="py-12 sm:py-16">
        <Container>
          {/* Results count */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-xs sm:text-sm font-semibold text-neutral-600">
              Showing {displayedCars.length} of {filteredCars.length} vehicles
            </span>

            {(selectedBrand !== "All" || selectedType !== "All" || selectedCondition !== "All" || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedBrand("All");
                  setSelectedType("All");
                  setSelectedCondition("All");
                  setSearchQuery("");
                }}
                className="text-xs font-bold text-neutral-900 hover:text-neutral-600 underline"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {displayedCars.length === 0 ? (
            <div className="py-20 text-center bg-[#F9FAFB] rounded-2xl border border-dashed border-neutral-300 space-y-3">
              <p className="text-base font-semibold text-neutral-800">
                No vehicles matched your current filters.
              </p>
              <p className="text-xs text-neutral-500">
                Try widening your search or clearing your active filters.
              </p>
              <button
                onClick={() => {
                  setSelectedBrand("All");
                  setSelectedType("All");
                  setSelectedCondition("All");
                  setSearchQuery("");
                }}
                className="mt-2 px-5 py-2.5 rounded-lg bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayedCars.map((car) => (
                <div
                  key={car.id}
                  className="group flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Car Image with aspect ratio */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                    <Image
                      src={car.hero_image}
                      alt={car.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-black/75 backdrop-blur-md text-white">
                      {car.condition || "Available"}
                    </div>

                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/90 backdrop-blur-md text-neutral-900 shadow-sm">
                      {car.year}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-col flex-1 p-5">
                    <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      {car.brand} • {car.body_type}
                    </div>

                    <h3 className="text-lg font-bold text-neutral-950 group-hover:text-neutral-700 transition-colors line-clamp-1 mb-2">
                      {car.title}
                    </h3>

                    <p className="text-xs text-neutral-500 line-clamp-1 mb-4">
                      {car.model}
                    </p>

                    {/* Specs Row */}
                    <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-[#F9FAFB] rounded-lg border border-neutral-100 text-xs text-neutral-600 mb-5">
                      <div className="flex items-center gap-1.5 truncate">
                        <Gauge className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span className="font-semibold text-neutral-900">
                          {car.mileage ? `${car.mileage.toLocaleString()} mi` : "Delivery mi"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 truncate">
                        <Zap className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span className="font-semibold text-neutral-900">
                          {car.horsepower ? `${car.horsepower} HP` : "High Output"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 truncate">
                        <Cog className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span className="font-semibold text-neutral-900 truncate">
                          {car.transmission === "Automatic" ? "Auto" : "Manual"}
                        </span>
                      </div>
                    </div>

                    {/* Price and Action Button */}
                    <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                          Price (USD)
                        </span>
                        <span className="text-xl font-extrabold text-neutral-950">
                          {formatUSD(car.discount_price ?? car.price)}
                        </span>
                      </div>

                      <Link
                        href={`/cars/${car.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-sm"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── 4. "LOAD MORE" BUTTON ─── */}
          {visibleCount < filteredCars.length && (
            <div className="pt-12 sm:pt-16 flex justify-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-8 py-3.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
              >
                Load More Vehicles
              </button>
            </div>
          )}
        </Container>
      </section>

      {/* ─── 5. SIMPLE DEALERSHIP CONTACT STRIP ─── */}
      <section className="w-full py-14 sm:py-16 bg-[#F9FAFB] border-t border-neutral-200">
        <Container className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
            Can&apos;t Find the Exact Vehicle You&apos;re Looking For?
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Our luxury acquisition desk accesses private off-market collections across the United States. Call our advisors today at <strong className="text-neutral-950">+1 448 226 4666</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:+14482264666"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-sm"
            >
              <span>Call +1 448 226 4666</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white border border-neutral-300 text-neutral-900 font-bold text-xs uppercase tracking-wider hover:bg-neutral-50 transition-all shadow-sm"
            >
              <span>Inquire Online</span>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
