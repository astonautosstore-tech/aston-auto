"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { soundEngine } from "@/lib/sound";
import Container from "@/components/ui/Container";

export default function HeroCinematic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const wordmarkY = useTransform(scrollYProgress, [0, 1], [0, -25]);

  const letterVariants: Variants = {
    hidden: { y: "100%", opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: 0.2 + i * 0.04, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    }),
  };

  const wordmark = "ASTON AUTO";

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] min-h-[640px] max-h-[960px] overflow-hidden bg-[#050505] flex flex-col justify-between"
      aria-label="Hero section"
    >
      {/* ─── Background Cinematic Car Image (Full bleed) ─── */}
      <motion.div
        style={{ scale: imgScale }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <Image
          src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=2400&q=90"
          alt="Aston Auto Supercar Collection - DBS 770 Ultimate"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Contrast Gradients: deep black at top & bottom, soft transparent center */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/45 to-[#050505]/85" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050505]/35 to-[#050505]/85" />
      </motion.div>

      {/* ─── Hero Content inside Standard Container ─── */}
      <Container className="relative z-10 h-full flex flex-col justify-between pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-10 md:pb-12">
        {/* 1. Giant Wordmark at Top — carefully sized to never overflow or collide */}
        <motion.div
          style={{ y: wordmarkY }}
          className="w-full text-center select-none overflow-hidden pt-1 sm:pt-2"
          aria-hidden="true"
        >
          <div className="flex items-center justify-center tracking-tight overflow-hidden pb-[0.1em] pr-[0.1em]">
            {wordmark.split("").map((letter, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="font-display font-black text-[9vw] sm:text-[8.5vw] md:text-[7.8vw] lg:text-[7.2vw] leading-none inline-block drop-shadow-md"
                style={{
                  background: "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.6) 55%, rgba(255,255,255,0.08) 100%)",
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
          <div className="max-w-lg">
            

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-6xl uppercase tracking-tight leading-[1.1] text-white [text-wrap:balance]"
            >
              Find Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#9A9A9A]">
                Dream Car Today
              </span>
            </motion.h1>
          </div>

          {/* Bottom Right: Description + Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="max-w-md md:text-right flex flex-col md:items-end"
          >
            <p className="text-xs sm:text-sm text-[#8A8A8A] leading-relaxed mb-4 sm:mb-5 max-w-[44ch]">
              West Africa&apos;s apex dealership for ultra-luxury supercars, limited-series grand tourers,
              and rare collector editions. Hand-inspected and delivered white-glove.
            </p>

            <Link
              href="/inventory"
              onClick={() => soundEngine.playEngineRev()}
              className="btn-primary inline-flex items-center gap-2.5 px-7 py-3 text-xs font-bold uppercase tracking-widest text-white bg-[#E10600] hover:bg-[#FF1F14] rounded-md shadow-lg shadow-[#E10600]/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>Book a Test Drive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
