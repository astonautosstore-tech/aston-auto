"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Gauge, Zap, Calendar } from "lucide-react";
import { SEED_CARS } from "@/lib/data/seed-cars";
import Container from "@/components/ui/Container";

const FEATURED = SEED_CARS.filter((c) => c.is_featured).slice(0, 3);

function CarSlide({ car, index }: { car: (typeof FEATURED)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.95, 1, 1, 0.95]);
  const brightness = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.6, 1, 1, 0.5]);

  const specs = [
    { icon: Zap, label: `${car.horsepower} HP` },
    { icon: Gauge, label: car.top_speed_kmh ? `${car.top_speed_kmh} km/h` : "340+ km/h" },
    { icon: Calendar, label: `Year ${car.year}` },
  ];

  return (
    <div
      ref={ref}
      className="sticky top-0 w-full h-[100svh] min-h-[640px] flex items-center justify-center overflow-hidden"
      style={{ zIndex: 10 + index }}
    >
      {/* Background full-bleed car photo */}
      <motion.div className="absolute inset-0" style={{ scale }}>
        <Image
          src={car.hero_image}
          alt={car.title}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={index === 0}
        />
        <motion.div
          className="absolute inset-0 bg-black"
          style={{ opacity: useTransform(brightness, (v) => 1 - v) }}
        />
        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />
      </motion.div>

      {/* Centered Glass Card inside safe container */}
      <Container className="relative z-10 flex items-center justify-center px-6">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="glass-card p-6 sm:p-10 md:p-12 text-center max-w-xl w-full mx-auto rounded-3xl border border-white/15 bg-black/65 backdrop-blur-2xl shadow-2xl"
        >
          {/* Badge */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-[11px] text-[#E10600] font-display font-bold uppercase tracking-[0.2em] block">
              #{String(index + 1).padStart(2, "0")} Featured // {car.brand}
            </span>
          </div>

          {/* Car Name */}
          <h3 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase text-white leading-tight mb-6 pb-[0.1em] [text-wrap:balance]">
            {car.title}
          </h3>

          {/* Spec chips */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-8">
            {specs.map((s, si) => {
              const Icon = s.icon;
              return (
                <div
                  key={si}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 text-xs text-[#A0A0A0]"
                >
                  <Icon className="w-3.5 h-3.5 text-[#E10600]" />
                  <span>{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* Price */}
          <p className="text-2xl sm:text-3xl font-display font-black text-white mb-6 tracking-tight">
            ₦{((car.discount_price || car.price) / 1_000_000).toFixed(0)}M
          </p>

          <Link
            href={`/cars/${car.slug}`}
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white bg-[#E10600] hover:bg-[#FF1F14] rounded-md shadow-lg shadow-[#E10600]/30 transition-all hover:scale-105"
          >
            <span>Explore Vehicle</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </Container>
    </div>
  );
}

export default function StackedFeaturedCars() {
  return (
    <section className="relative w-full bg-[#050505] border-t border-white/[0.06]">
      {/* Centered Heading with 48px below */}
      <div className="pt-20 md:pt-28 pb-12">
        <Container className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#E10600]">
              Curated Collection
            </span>
          </div>

          <h2 className="font-display font-black text-[clamp(2rem,4.5vw,4rem)] uppercase tracking-tight text-white leading-[1.08] [text-wrap:balance]">
            Featured Vehicles
          </h2>
          <p className="text-sm sm:text-base text-[#8A8A8A] mt-4 max-w-[60ch] mx-auto leading-relaxed">
            A small glimpse into our currently available flagship inventory in Lagos and Abuja.
          </p>
        </Container>
      </div>

      {/* Sticky Stacking Slides */}
      <div className="relative w-full">
        {FEATURED.map((car, idx) => (
          <CarSlide key={car.id} car={car} index={idx} />
        ))}
      </div>
    </section>
  );
}
