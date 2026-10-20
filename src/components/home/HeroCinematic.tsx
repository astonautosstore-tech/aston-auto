"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { soundEngine } from "@/lib/sound";
import Container from "@/components/ui/Container";

export default function HeroCinematic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const wordmarkY = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const letterVariants: Variants = {
    hidden: { y: "100%", opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: 0.15 + i * 0.03, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    }),
  };

  const wordmark = "ASTON AUTO";

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] min-h-[640px] max-h-[960px] overflow-hidden bg-white flex flex-col justify-between"
      aria-label="Hero section"
    >
      {/* ─── Background Studio Car Image (Clean Light Aesthetic) ─── */}
      <motion.div
        style={{ scale: imgScale }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <Image
          src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2400&q=90"
          alt="Aston Auto Curated Luxury Supercar"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-95"
        />
        {/* Soft, clean studio gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-white/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-transparent to-white/70" />
      </motion.div>

      {/* ─── Hero Content ─── */}
      <Container className="relative z-10 h-full flex flex-col justify-between pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-12 md:pb-16">
        
        {/* 1. Giant Wordmark at Top — Apple/Porsche High Contrast Style */}
        <motion.div
          style={{ y: wordmarkY }}
          className="w-full text-center select-none overflow-hidden pt-2"
          aria-hidden="true"
        >
          <div className="flex items-center justify-center tracking-tight overflow-hidden pb-[0.1em]">
            {wordmark.split("").map((letter, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="font-display font-black text-[9.5vw] sm:text-[9vw] md:text-[8vw] lg:text-[7.5vw] leading-none inline-block text-black"
                style={{
                  background: "linear-gradient(180deg, #0A0A0A 0%, #27272A 70%, #52525B 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* 2. Bottom Row: Headline (Left) & Copy + CTA (Right) */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10">
          {/* Bottom Left: Headline */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/10 mb-3"
            >
              <span className="w-2 h-2 rounded-full bg-black" />
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] font-bold text-black">
                United States &bull; Miami &bull; Beverly Hills
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight leading-[1.08] text-black [text-wrap:balance]"
            >
              Find Your <br />
              <span className="text-neutral-500 font-bold">
                Dream Car Today
              </span>
            </motion.h1>
          </div>

          {/* Bottom Right: Description + Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8 }}
            className="max-w-md md:text-right flex flex-col md:items-end"
          >
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-5 max-w-[46ch]">
              North America&apos;s premier luxury salon for certified exotic supercars, limited-series grand tourers,
              and collector editions. Hand-inspected with nationwide enclosed white-glove delivery.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="tel:+14482264666"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-full border border-black/15 bg-white/80 hover:bg-neutral-100 text-black text-xs font-bold uppercase tracking-wider transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+1 448 226 4666</span>
              </a>

              <Link
                href="/inventory"
                onClick={() => soundEngine.playEngineRev()}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-black/10 hover:scale-105 active:scale-95"
              >
                <span>Browse Inventory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
