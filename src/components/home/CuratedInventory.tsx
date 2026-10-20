"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap, Gauge, Compass, Eye, ShieldCheck } from "lucide-react";
import { SEED_CARS } from "@/lib/data/seed-cars";
import { soundEngine } from "@/lib/sound";

export default function CuratedInventory() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filterOptions = [
    { label: "All Vehicles", value: "all" },
    { label: "Electric & Hybrid", value: "electric" },
    { label: "Coupes & GTs", value: "coupe" },
    { label: "Luxury SUVs", value: "suv" },
  ];

  const filteredCars = SEED_CARS.filter((car) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "electric") return car.fuel_type === "Electric" || car.fuel_type === "Hybrid";
    if (selectedFilter === "coupe") return car.body_type === "Coupe";
    if (selectedFilter === "suv") return car.body_type === "SUV";
    return true;
  }).slice(0, 3);

  return (
    <section className="py-24 bg-white border-b border-[#E4E4E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>HANDPICKED COLLECTION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A0A0A] tracking-tight">
              Curated <span className="text-blue-600">Inventory</span>
            </h2>
            <p className="text-sm text-[#64748B] mt-2 max-w-xl">
              Browse our hand-selected inventory of top-rated luxury and electric vehicles, fully inspected and ready for immediate delivery across Nigeria.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  soundEngine.playHoverTick();
                  setSelectedFilter(opt.value);
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedFilter === opt.value
                    ? "bg-[#0A0A0A] text-white shadow-md"
                    : "bg-[#F7F7F8] text-[#64748B] hover:text-[#0A0A0A] border border-[#E4E4E7]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Prominent Vehicle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car, index) => {
            const formattedPrice = `₦${(car.discount_price || car.price).toLocaleString("en-NG")}`;
            const monthlyEst = `₦${Math.round((car.discount_price || car.price) / 120).toLocaleString("en-NG")}/mo`;

            return (
              <div
                key={car.id}
                className="group bg-white rounded-3xl border border-[#E4E4E7] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Container with Badge */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                  <Image
                    src={car.hero_image}
                    alt={car.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[#0A0A0A] text-[11px] font-semibold rounded-full shadow-sm border border-black/5">
                      {index === 0 ? "Featured" : index === 1 ? "Low Mileage" : "Bespoke Edition"}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono rounded-full">
                      {car.year}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div>
                    <h3 className="text-lg font-bold text-[#0A0A0A] group-hover:text-blue-600 transition-colors line-clamp-1">
                      {car.title}
                    </h3>
                    <div className="flex items-baseline justify-between mt-2">
                      <span className="text-xl font-extrabold text-[#0A0A0A]">{formattedPrice}</span>
                      <span className="text-xs text-blue-600 font-medium">{monthlyEst}</span>
                    </div>
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#F0F0F2] text-xs text-[#64748B]">
                    <div className="flex items-center gap-1.5 bg-[#F7F7F8] p-2 rounded-lg">
                      <Gauge className="w-3.5 h-3.5 text-blue-600" />
                      <span>{car.mileage.toLocaleString()} km</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#F7F7F8] p-2 rounded-lg">
                      <Zap className="w-3.5 h-3.5 text-blue-600" />
                      <span>{car.horsepower} HP &bull; {car.fuel_type}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <Link
                      href={`/cars/${car.slug}`}
                      onClick={() => soundEngine.playHoverTick()}
                      className="w-full py-3 px-4 bg-[#0A0A0A] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Vehicle Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Centered Bottom Link */}
        <div className="text-center mt-12">
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A0A0A] hover:text-blue-600 transition-colors group"
          >
            <span>Explore Full Inventory (12+ Available in Stock)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
