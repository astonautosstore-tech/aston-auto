"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { soundEngine } from "@/lib/sound";
import Container from "@/components/ui/Container";

export default function NotFound() {
  return (
    <div className="relative min-h-[92vh] sm:min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center overflow-hidden pt-24 pb-16">
      
      {/* ─── Background Cinematic Car with Glowing Headlights & Atmospheric Smoke ─── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Image
          src="https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=2400&q=90"
          alt="Aston Auto Performance Car"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-45"
        />
        {/* Dark Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-[#050505]" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050505]/40 to-[#050505]/95" />
      </div>

      {/* ─── Giant 404 Watermark in Background ─── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
      >
        <span
          className="font-display font-black text-[28vw] sm:text-[32vw] leading-none tracking-tighter opacity-15"
          style={{
            background: "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.05) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </span>
      </div>

      {/* ─── Main Content ─── */}
      <Container className="relative z-10 text-center max-w-2xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 sm:space-y-5"
        >
          {/* Main Heading */}
          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-tight">
            OOPS! PAGE NOT FOUND
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on the right road.
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              onClick={() => soundEngine.playEngineRev()}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-md bg-[#E10600] text-white font-bold text-xs uppercase tracking-[0.16em] shadow-lg shadow-[#E10600]/30 hover:bg-[#FF1F14] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Back to Home
            </Link>

            <Link
              href="/inventory"
              onClick={() => soundEngine.playHoverTick()}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-md bg-transparent text-white font-bold text-xs uppercase tracking-[0.16em] border border-white/30 hover:border-white hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Browse Inventory
            </Link>
          </div>
        </motion.div>
      </Container>

    </div>
  );
}
