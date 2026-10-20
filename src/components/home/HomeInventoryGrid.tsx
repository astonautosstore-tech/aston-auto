"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Gauge, Zap, Cog, ArrowRight, CheckCircle2 } from "lucide-react";
import { SEED_CARS } from "@/lib/data/seed-cars";
import { formatUSD } from "@/lib/utils";
import { storeApi } from "@/lib/supabase/client";
import { Car } from "@/types/database";

const CATEGORIES = [
  { id: "all", label: "All Inventory" },
  { id: "supercar", label: "Supercars & Exotics" },
  { id: "suv", label: "Luxury SUVs" },
  { id: "sedan", label: "Sedans & Coupes" },
];

export default function HomeInventoryGrid() {
  const [cars, setCars] = useState<Car[]>(SEED_CARS);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadLiveCars() {
      try {
        const live = await storeApi.getCars();
        if (live && live.length > 0) {
          setCars(live);
        }
      } catch (err) {
        console.warn("Inventory grid fallback to seed:", err);
      }
    }

    loadLiveCars();

    const handleUpdate = () => {
      loadLiveCars();
    };

    window.addEventListener("aston_cars_updated", handleUpdate);
    return () => window.removeEventListener("aston_cars_updated", handleUpdate);
  }, []);

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      // Category filter
      if (selectedCategory === "supercar") {
        const isSuper =
          car.body_type === "Coupe" ||
          car.brand === "Ferrari" ||
          car.brand === "Lamborghini" ||
          car.brand === "Porsche" ||
          car.brand === "McLaren" ||
          car.brand === "Aston Martin" ||
          car.horsepower >= 500;
        if (!isSuper) return false;
      } else if (selectedCategory === "suv") {
        if (car.body_type !== "SUV") return false;
      } else if (selectedCategory === "sedan") {
        if (car.body_type !== "Sedan" && car.body_type !== "Coupe") return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = car.title.toLowerCase().includes(query);
        const matchBrand = car.brand.toLowerCase().includes(query);
        const matchModel = car.model.toLowerCase().includes(query);
        return matchTitle || matchBrand || matchModel;
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Display top 9 vehicles on the homepage for clean loading
  const displayCars = filteredCars.slice(0, 9);

  return (
    <section id="inventory" className="w-full py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-neutral-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified In-Stock Showroom
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
              Current Vehicle Inventory
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-1 max-w-xl">
              Every vehicle has completed our 150-point inspection and is available for immediate nationwide delivery or showroom collection.
            </p>
          </div>

          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 text-sm font-bold text-neutral-900 hover:text-neutral-600 transition-colors group shrink-0"
          >
            <span>View All 21 Vehicles</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Filter Controls (WordPress Dealership Style) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 bg-[#F9FAFB] p-3 sm:p-4 rounded-xl border border-neutral-200">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-neutral-950 text-white shadow-sm"
                    : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Search Input */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search make or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white rounded-lg border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Vehicle Cards Grid */}
        {displayCars.length === 0 ? (
          <div className="py-16 text-center bg-[#F9FAFB] rounded-2xl border border-dashed border-neutral-300">
            <p className="text-base font-semibold text-neutral-800">
              No vehicles matched your search.
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayCars.map((car) => (
              <div
                key={car.id}
                className="group flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                  <Image
                    src={car.hero_image}
                    alt={car.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Condition Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold rounded-md">
                    {car.condition || "Available"}
                  </div>

                  {/* Body Type Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-md text-neutral-900 text-[11px] font-bold rounded-md shadow-sm">
                    {car.body_type}
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-col flex-1 p-5">
                  {/* Make and Year */}
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    {car.year} • {car.brand}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-neutral-950 group-hover:text-neutral-700 transition-colors line-clamp-1 mb-2">
                    {car.title}
                  </h3>

                  {/* Short description or model */}
                  <p className="text-xs text-neutral-500 line-clamp-1 mb-4">
                    {car.model}
                  </p>

                  {/* Specs Matrix */}
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
                        {car.horsepower ? `${car.horsepower} HP` : "V8/V12"}
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
                        {formatUSD(car.price)}
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

        {/* View All CTA Strip */}
        <div className="mt-12 text-center">
          <Link
            href="/inventory"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <span>Explore All 21 Vehicles in Stock</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-neutral-500 mt-2">
            Can&apos;t find what you&apos;re looking for? Call our acquisition desk at +1 448 226 4666.
          </p>
        </div>
      </div>
    </section>
  );
}
