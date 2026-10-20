"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Gauge, Heart, ShoppingBag } from "lucide-react";
import { SEED_CARS } from "@/lib/data/seed-cars";
import { formatNaira } from "@/lib/utils";
import { useStore } from "@/lib/store/useStore";
import { soundEngine } from "@/lib/sound";

export default function HorizontalShowcase() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const showcaseCars = SEED_CARS.slice(0, 6);

  const scroll = (direction: "left" | "right") => {
    soundEngine.playHoverTick();
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-[#F7F7F8] border-b border-[#E4E4E7] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#0D5C3A] mb-2 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#0D5C3A]" />
              <span>Curated Showroom Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A0A0A] tracking-tight">
              Flagship Allocations
            </h2>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-full border border-[#E4E4E7] bg-white flex items-center justify-center text-[#0A0A0A] hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-full border border-[#E4E4E7] bg-white flex items-center justify-center text-[#0A0A0A] hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-6 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {showcaseCars.map((car) => {
            const isSaved = isInWishlist(car.id);
            const price = car.discount_price ?? car.price;

            return (
              <div
                key={car.id}
                className="w-[320px] sm:w-[380px] shrink-0 glass-card rounded-2xl overflow-hidden flex flex-col group bg-white"
              >
                {/* Visual Stage */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                  <Image
                    src={car.hero_image}
                    alt={car.title}
                    fill
                    sizes="(max-width: 640px) 320px, 380px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0A0A0A] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#E4E4E7]">
                      {car.year}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#0D5C3A] text-white text-[10px] font-mono uppercase tracking-wider font-semibold">
                      {car.condition}
                    </span>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(car.id);
                    }}
                    aria-label="Save vehicle"
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                      isSaved
                        ? "bg-[#0D5C3A] text-white"
                        : "bg-white/80 text-[#0A0A0A] hover:bg-white"
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] mb-1">
                      {car.brand} &bull; {car.body_type}
                    </div>
                    <Link
                      href={`/cars/${car.slug}`}
                      className="text-base font-bold text-[#0A0A0A] group-hover:text-[#0D5C3A] transition-colors line-clamp-1"
                    >
                      {car.title}
                    </Link>

                    {/* Quick Specs Pill */}
                    <div className="flex items-center gap-4 mt-3 text-xs text-[#64748B] font-mono">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-[#0D5C3A]" />
                        <span>{car.acceleration_0_100}s</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5 text-[#0D5C3A]" />
                        <span>{car.horsepower} HP</span>
                      </div>
                      <span>{car.top_speed_kmh} km/h</span>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="mt-6 pt-4 border-t border-[#E4E4E7] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#94a3b8] block">
                        Acquisition Price
                      </span>
                      <span className="text-base font-bold text-[#0A0A0A] font-mono">
                        {formatNaira(price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => addToCart(car, true, e.currentTarget)}
                        title="Reserve with 10% deposit hold"
                        aria-label="Reserve vehicle"
                        className="p-2.5 rounded-lg border border-[#E4E4E7] hover:border-[#0D5C3A] text-[#0A0A0A] hover:text-[#0D5C3A] hover:bg-[#F7F7F8] transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>

                      <Link
                        href={`/cars/${car.slug}`}
                        className="btn-luxury-primary text-xs py-2 px-3.5 rounded-lg"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#0D5C3A] hover:text-[#0A0A0A] transition-colors"
          >
            <span>View All 12 Vehicles in Lagos & Abuja Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
