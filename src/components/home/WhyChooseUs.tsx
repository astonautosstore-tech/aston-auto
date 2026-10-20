"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Star, ShieldCheck, Clock, CreditCard } from "lucide-react";
import Container from "@/components/ui/Container";

const REASONS = [
  {
    num: "01",
    icon: Star,
    title: "Curated Ultra-Exotic Portfolio",
    desc: "Direct access to hypercars, numbered editions, and ultra-rare grand tourers with documented provenance.",
    img: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
  },
  {
    num: "02",
    icon: ShieldCheck,
    title: "150-Point Factory Diagnostics",
    desc: "Rigorous optical, chassis, dyno, and electronics screening performed by marque-certified master technicians.",
    img: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    num: "03",
    icon: Clock,
    title: "Comprehensive Bespoke Warranty",
    desc: "Up to 36 months bumper-to-bumper protection backed by authorized regional repair facilities and rapid parts dispatch.",
    img: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&q=80",
  },
  {
    num: "04",
    icon: CreditCard,
    title: "Bespoke VIP Financing & Trade-In",
    desc: "Discreet structured financing and competitive equity valuations for trade-in of your current exotic machinery.",
    img: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function WhyChooseUsDark() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });

  return (
    <section
      ref={ref}
      className="relative w-full py-20 md:py-28 lg:py-36 bg-[#050505] border-t border-white/[0.06] overflow-visible"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative">

          {/* Left: Fixed/Sticky on Desktop while right content scrolls */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
                <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#E10600]">
                  Why Choose Us
                </span>
              </div>

              <h2 className="font-display font-black text-[clamp(2.2rem,4vw,3.6rem)] uppercase tracking-tight text-white leading-[1.08] mb-6 [text-wrap:balance]">
                Your Trust, <br />
                <span
                  style={{
                    background: "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.3) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                  className="inline-block"
                >
                  Our Standard
                </span>
              </h2>

              <p className="text-sm sm:text-base text-[#8A8A8A] leading-relaxed max-w-[46ch] mb-8">
                Every transaction at Aston Auto Stores is engineered around your absolute confidence.
                From verifiable provenance to post-acquisition track days, we hold ourselves to the
                highest standards in African luxury motoring.
              </p>

              {/* Progress indicator or trust accent */}
              <div className="hidden lg:flex items-center gap-3 pt-4 border-t border-white/10">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#A0A0A0]">
                  04 Core Pillars of Excellence
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right: 4 Tall Image Cards that scroll past the sticky left column */}
          <div className="lg:col-span-7 flex flex-col gap-8 pb-8">
            {REASONS.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
                className="relative rounded-[22px] md:rounded-[26px] overflow-hidden border border-white/10 group min-h-[360px] md:min-h-[420px] shadow-2xl hover:border-white/25 transition-all duration-500"
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <Image
                    src={r.img}
                    alt={r.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Dark gradients for high contrast text readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/35" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent" />
                </div>

                {/* Overlaid card content */}
                <div className="relative z-10 p-7 md:p-10 flex flex-col justify-between h-full min-h-[360px] md:min-h-[420px]">
                  <div className="flex items-center justify-between">
                    <span className="w-11 h-11 rounded-xl bg-[#E10600] flex items-center justify-center text-xs font-display font-black text-white shadow-xl shadow-[#E10600]/40">
                      {r.num}
                    </span>
                  </div>

                  <div className="pt-16">
                    <h3 className="font-display font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-tight text-white mb-3 [text-wrap:balance]">
                      {r.title}
                    </h3>
                    <p className="text-sm text-[#B0B0B0] leading-relaxed max-w-[50ch]">
                      {r.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}
