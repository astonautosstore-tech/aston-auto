"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Gauge, Zap, Cog, ArrowRight, Phone } from "lucide-react";
import { Car } from "@/types/database";
import { formatUSD } from "@/lib/utils";

interface HeroCarCarouselProps {
  cars?: Car[];
}

export default function HeroCarCarousel({ cars = [] }: HeroCarCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = cars.length > 0 ? cars : [];

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-slide every 6 seconds unless paused
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const currentCar = slides[currentIndex] || slides[0];

  return (
    <section
      className="relative w-full bg-[#F8F9FA] border-b border-neutral-200 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Featured Vehicles Carousel"
    >
      {/* Background soft grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">

        {/* Carousel Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[500px]">
          {/* Left Column: Car Details & Pricing */}
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 z-10">
            {/* Year & Brand Tag */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-bold tracking-widest text-neutral-500 uppercase">
                {currentCar.year} {currentCar.brand}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-neutral-200 text-neutral-800">
                {currentCar.condition || "In Stock"}
              </span>
            </div>

            {/* Vehicle Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 tracking-tight leading-tight mb-3">
              {currentCar.title}
            </h1>

            {/* Price Badge */}
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Price:
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold text-neutral-950">
                {formatUSD(currentCar.price)}
              </span>
              <span className="text-xs text-neutral-500 font-medium">USD</span>
            </div>

            {/* Key Specs Row */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-white rounded-xl border border-neutral-200 shadow-sm mb-8">
              <div className="flex flex-col">
                <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 mb-1">
                  <Zap className="w-3.5 h-3.5 text-neutral-700" /> Power
                </span>
                <span className="text-base sm:text-lg font-bold text-neutral-900">
                  {currentCar.horsepower ? `${currentCar.horsepower} HP` : "High Output"}
                </span>
              </div>

              <div className="flex flex-col border-x border-neutral-100 px-3">
                <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 mb-1">
                  <Gauge className="w-3.5 h-3.5 text-neutral-700" /> 0-60 mph
                </span>
                <span className="text-base sm:text-lg font-bold text-neutral-900">
                  {currentCar.acceleration_0_100 ? `${currentCar.acceleration_0_100}s` : "3.5s"}
                </span>
              </div>

              <div className="flex flex-col pl-1">
                <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 mb-1">
                  <Cog className="w-3.5 h-3.5 text-neutral-700" /> Trans
                </span>
                <span className="text-base sm:text-lg font-bold text-neutral-900 truncate">
                  {currentCar.transmission || "Automatic"}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/cars/${currentCar.slug}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-neutral-950 text-white font-semibold text-sm hover:bg-neutral-800 transition-all shadow-sm hover:shadow"
              >
                <span>View Vehicle Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="#inventory"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-white border border-neutral-300 text-neutral-900 font-semibold text-sm hover:bg-neutral-100 transition-colors shadow-sm"
              >
                <span>Browse Inventory</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Large Car Image & Navigation Overlays */}
          <div className="lg:col-span-7 relative order-1 lg:order-2 flex flex-col justify-center">
            <div className="relative w-full h-[280px] sm:h-[400px] lg:h-[480px] rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-md">
              <Image
                src={currentCar.hero_image}
                alt={currentCar.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                className="object-cover object-center transition-all duration-700 hover:scale-105"
              />

              {/* Gradient edge overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* Slide Counter on photo */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-md text-white text-xs font-bold rounded-full">
                {currentIndex + 1} / {slides.length}
              </div>

              {/* Next & Prev Arrows */}
              <div className="absolute inset-y-0 left-3 flex items-center">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  className="p-2.5 rounded-full bg-white/90 hover:bg-white text-neutral-900 shadow-md hover:shadow-lg transition-transform hover:scale-110 focus:outline-none"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>

              <div className="absolute inset-y-0 right-3 flex items-center">
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="p-2.5 rounded-full bg-white/90 hover:bg-white text-neutral-900 shadow-md hover:shadow-lg transition-transform hover:scale-110 focus:outline-none"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Bottom Thumbnail Switcher strip on image */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/60 backdrop-blur-md rounded-xl p-2 px-3">
                <div className="flex items-center gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentIndex ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>

                <span className="text-white text-xs font-medium truncate max-w-[200px]">
                  {currentCar.brand} • {currentCar.model}
                </span>
              </div>
            </div>

            {/* Quick Car Preview Thumbnails below slider */}
            <div className="hidden sm:grid grid-cols-5 gap-2 mt-4">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex flex-col text-left p-2 rounded-lg border transition-all ${
                    idx === currentIndex
                      ? "border-neutral-950 bg-white shadow-sm ring-1 ring-neutral-950"
                      : "border-neutral-200 bg-white/60 hover:bg-white text-neutral-500"
                  }`}
                >
                  <span className="text-[11px] font-bold text-neutral-900 truncate">
                    {slide.title}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-medium">
                    {formatUSD(slide.price)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
