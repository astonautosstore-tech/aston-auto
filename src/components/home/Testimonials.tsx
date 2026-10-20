"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

const TESTIMONIALS = [
  {
    quote: "Acquiring the Rolls-Royce Spectre through Aston Auto Stores was an effortless triumph. White-glove enclosed transport arrived in pristine showroom condition with all customs documentation impeccably prepared.",
    name: "Senator Adebayo Adeleke",
    city: "Ikoyi, Lagos",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
  },
  {
    quote: "Aston Auto sets the golden benchmark for luxury automotive acquisition in West Africa. Their concierge arranged private track testing for the GT3 RS before final settlement. Flawless discretion and speed.",
    name: "Folake Alakija",
    city: "Victoria Island, Lagos",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
  },
  {
    quote: "The DBS 770 Ultimate is a masterpiece. From initial consultation to Abuja delivery took under 48 hours. The team's mechanical knowledge and dedication to client privacy is truly peerless.",
    name: "Dr. Chuka Obi",
    city: "Maitama, Abuja",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  },
];

export default function TestimonialsDark() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const t = TESTIMONIALS[current];

  return (
    <Section className="bg-[#050505] border-t border-white/[0.06]">
      {/* Blurred background supercar atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=2000&q=60"
          alt="Atmospheric Supercar"
          fill
          sizes="100vw"
          className="object-cover opacity-15 blur-md"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/90 to-[#050505]" />
      </div>

      <Container className="relative z-10 text-center">
        {/* Star Rating */}
        <div className="flex items-center justify-center gap-1.5 mb-8 md:mb-10">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-[#E10600] text-[#E10600]" />
          ))}
        </div>

        {/* Testimonial Quote with max-w-[900px] */}
        <div className="max-w-[900px] mx-auto min-h-[160px] sm:min-h-[140px] flex items-center justify-center mb-10 md:mb-12">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={current}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
              className="font-display font-medium text-xl sm:text-2xl lg:text-3xl text-white leading-relaxed tracking-tight [text-wrap:balance]"
            >
              &ldquo;{t.quote}&rdquo;
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* Client Metadata */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current + "-name"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10 md:mb-12"
          >
            <p className="text-base sm:text-lg font-bold text-white tracking-wide">{t.name}</p>
            <p className="text-xs text-[#E10600] uppercase tracking-[0.2em] font-semibold mt-1">{t.city}</p>
          </motion.div>
        </AnimatePresence>

        {/* Indicator avatars */}
        <div className="flex items-center justify-center gap-4">
          {TESTIMONIALS.map((test, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Testimonial from ${test.name}`}
              className={`relative rounded-full transition-all duration-300 p-0.5 cursor-pointer ${
                i === current ? "ring-2 ring-[#E10600] scale-110" : "opacity-40 hover:opacity-80"
              }`}
            >
              <div className="relative w-11 h-11 rounded-full overflow-hidden">
                <Image
                  src={test.avatar}
                  alt={test.name}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      </Container>
    </Section>
  );
}
