"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import { Car } from "@/types/database";

interface HomeHeroProps {
  heroCar?: Car | null;
}

export default function HomeHero({ heroCar }: HomeHeroProps) {
  return (
    <section className="relative pt-32 sm:pt-40 md:pt-44 pb-16 md:pb-24 bg-white overflow-hidden">
      <Container>
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block mb-4"
          >
            Aston Auto Stores &bull; United States
          </motion.span>

          {/* Large Two-line Headline */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.5rem,6vw,5.5rem)] font-medium tracking-[-0.03em] leading-[1.08] text-[#0A0A0A] [text-wrap:balance]"
            >
              Find your next car.
              <br />
              Without the noise.
            </motion.h1>
          </div>

          {/* Calm Sentence */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-base sm:text-lg text-[#6B6B6B] leading-relaxed max-w-2xl"
          >
            A curated portfolio of pristine performance, exotic, and luxury motorcars.
            Transparent pricing, clean titles, and private door-to-door nationwide delivery.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3.5"
          >
            <Link
              href="/inventory"
              className="px-6 py-3.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium tracking-wide transition-opacity hover:opacity-90"
            >
              Browse Inventory
            </Link>
            <Link
              href="/contact?topic=test-drive"
              className="px-6 py-3.5 rounded-lg bg-white border border-[#E8E8E8] text-[#0A0A0A] text-xs font-medium tracking-wide transition-colors hover:border-[#0A0A0A] hover:bg-[#FAFAFA]"
            >
              Book a Test Drive
            </Link>
          </motion.div>
        </div>

        {/* Featured Car Photo cropped wide */}
        <div className="mt-12 sm:mt-16 md:mt-20">
          {heroCar && heroCar.hero_image ? (
            <motion.div
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-[#FAFAFA] border border-[#E8E8E8]"
            >
              <Image
                src={heroCar.hero_image}
                alt={`${heroCar.year} ${heroCar.title}`}
                fill
                priority
                sizes="(max-width: 1320px) 100vw, 1320px"
                className="object-cover object-center"
              />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 px-3.5 py-1.5 rounded-lg bg-white/90 backdrop-blur-md border border-[#E8E8E8] text-xs font-medium text-[#0A0A0A]">
                Featured &bull; {heroCar.year} {heroCar.title}
              </div>
            </motion.div>
          ) : (
            <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden bg-[#FAFAFA] border border-[#E8E8E8] flex items-center justify-center text-xs text-[#6B6B6B] uppercase tracking-widest">
              Showroom Inventory In Preparation
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
