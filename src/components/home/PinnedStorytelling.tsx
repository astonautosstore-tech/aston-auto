"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Gauge, Zap, Wind, Shield, ChevronRight } from "lucide-react";
import { soundEngine } from "@/lib/sound";
import { formatNaira } from "@/lib/utils";

interface ShowcaseVehicle {
  id: string;
  name: string;
  tagline: string;
  price: number;
  slug: string;
  image: string;
  specs: {
    acceleration: string;
    topSpeed: string;
    power: string;
    torque: string;
  };
  features: string[];
}

const VEHICLES: ShowcaseVehicle[] = [
  {
    id: "dbs",
    name: "Aston Martin DBS 770 Ultimate",
    tagline: "The Zenith of Gaydon V12 Engineering",
    price: 520000000,
    slug: "aston-martin-dbs-770-ultimate",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1920&q=85",
    specs: {
      acceleration: "3.4s",
      topSpeed: "340 km/h",
      power: "770 HP",
      torque: "900 Nm",
    },
    features: [
      "Carbon Ceramic Braking System (CCB)",
      "Bespoke Quilted Semi-Aniline Leather",
      "Limited to 499 units globally",
    ],
  },
  {
    id: "spectre",
    name: "Rolls-Royce Spectre Bespoke",
    tagline: "Ultra-Luxury Electric Super Coupé",
    price: 640000000,
    slug: "rolls-royce-spectre-bespoke",
    image: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1920&q=85",
    specs: {
      acceleration: "4.5s",
      topSpeed: "250 km/h",
      power: "585 HP",
      torque: "900 Nm",
    },
    features: [
      "Planar Suspension 'Magic Carpet Ride'",
      "4,796 Illuminated Starlight Doors",
      "Chartreuse & Diamond Black Two-Tone",
    ],
  },
  {
    id: "gt3rs",
    name: "Porsche 911 GT3 RS (992)",
    tagline: "Aerodynamic Dominance with DRS",
    price: 380000000,
    slug: "porsche-911-gt3-rs-992",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1920&q=85",
    specs: {
      acceleration: "3.2s",
      topSpeed: "296 km/h",
      power: "525 HP",
      torque: "465 Nm",
    },
    features: [
      "860 kg Active Downforce at 285 km/h",
      "Weissach Package Carbon Weave",
      "Naturally Aspirated 9,000 RPM Boxer",
    ],
  },
];

export default function PinnedStorytelling() {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = VEHICLES[activeIdx];

  const handleSelect = (idx: number) => {
    soundEngine.playHoverTick();
    setActiveIdx(idx);
  };

  return (
    <section className="py-24 bg-[#FFFFFF] border-b border-[#E4E4E7] overflow-hidden" id="showcase">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#0D5C3A] mb-3 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#0D5C3A]" />
              <span>Flagship Automotive Storytelling</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0A0A0A] tracking-tight">
              Masterpieces in Motion.
            </h2>
          </div>

          {/* Model Switcher Tabs */}
          <div className="flex items-center gap-2 bg-[#F7F7F8] p-1.5 rounded-full border border-[#E4E4E7] overflow-x-auto no-scrollbar">
            {VEHICLES.map((vehicle, idx) => {
              const isSelected = idx === activeIdx;
              return (
                <button
                  key={vehicle.id}
                  onClick={() => handleSelect(idx)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? "bg-[#0A0A0A] text-white shadow-md"
                      : "text-[#64748B] hover:text-[#0A0A0A]"
                  }`}
                >
                  {vehicle.name.split(" ")[0]} {vehicle.name.split(" ")[1]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Card Stage */}
        <div className="relative rounded-3xl border border-[#E4E4E7] bg-[#F7F7F8] overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
            {/* Visual Canvas */}
            <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-full overflow-hidden bg-neutral-900 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={current.image}
                    alt={current.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                </motion.div>
              </AnimatePresence>

              {/* Floating watermark */}
              <div className="absolute top-6 left-6 z-10 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono uppercase tracking-wider">
                {current.tagline}
              </div>
            </div>

            {/* Technical Dossier Column */}
            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between bg-white">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                  Bespoke Allocation
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0A] tracking-tight mt-1 mb-2">
                  {current.name}
                </h3>
                <div className="text-2xl font-mono font-bold text-[#0D5C3A] mb-8">
                  {formatNaira(current.price)}
                </div>

                {/* Animated Specs Counters Grid */}
                <div className="grid grid-cols-2 gap-4 pb-8 border-b border-[#E4E4E7]">
                  <div className="p-4 rounded-xl bg-[#F7F7F8] border border-[#E4E4E7]">
                    <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1 font-mono">
                      <Zap className="w-3.5 h-3.5 text-[#0D5C3A]" />
                      <span>0 - 100 KM/H</span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-[#0A0A0A]">
                      {current.specs.acceleration}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F7F7F8] border border-[#E4E4E7]">
                    <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1 font-mono">
                      <Gauge className="w-3.5 h-3.5 text-[#0D5C3A]" />
                      <span>TOP SPEED</span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-[#0A0A0A]">
                      {current.specs.topSpeed}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F7F7F8] border border-[#E4E4E7]">
                    <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1 font-mono">
                      <Wind className="w-3.5 h-3.5 text-[#0D5C3A]" />
                      <span>HORSEPOWER</span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-[#0A0A0A]">
                      {current.specs.power}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F7F7F8] border border-[#E4E4E7]">
                    <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1 font-mono">
                      <Shield className="w-3.5 h-3.5 text-[#0D5C3A]" />
                      <span>PEAK TORQUE</span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-[#0A0A0A]">
                      {current.specs.torque}
                    </div>
                  </div>
                </div>

                {/* Key Features Bullet Points */}
                <div className="pt-6 space-y-2.5">
                  {current.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs text-[#64748B]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0D5C3A] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-8 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href={`/cars/${current.slug}`}
                  onMouseEnter={() => soundEngine.playHoverTick()}
                  className="btn-luxury-primary w-full text-center py-3.5 rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <span>Vehicle Dossier & Reserve</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/inventory"
                  className="btn-luxury-outline w-full sm:w-auto text-center py-3.5 px-6 rounded-xl text-xs"
                >
                  View All 12
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
