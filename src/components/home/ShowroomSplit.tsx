"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Target, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import { soundEngine } from "@/lib/sound";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

const FEATURES = [
  {
    num: "01",
    icon: Target,
    title: "Precision Curation",
    desc: "Every vehicle is handpicked by our curation team for verifiable provenance, pristine condition, and ultra-rare specification.",
  },
  {
    num: "02",
    icon: Zap,
    title: "Discreet Acquisition",
    desc: "From initial enquiry to private doorstep delivery in Lagos or Abuja — zero friction, escrow security, and total discretion.",
  },
  {
    num: "03",
    icon: ShieldCheck,
    title: "Certified Integrity",
    desc: "Comprehensive 150-point mechanical inspection, complete Nigerian customs duty documentation, and extended warranty options.",
  },
];

export default function ShowroomSplit() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Section ref={ref} className="bg-[#050505] border-t border-white/[0.06]">
      <Container>
        {/* Main split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Text Details */}
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
                <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#E10600]">
                  About Aston Auto
                </span>
              </div>

              {/* Heading sized so words like DESTINATION never overflow or clip */}
              <h2 className="font-display font-black text-[clamp(1.75rem,3.2vw,2.75rem)] uppercase tracking-tight text-white leading-[1.15] mb-6 [text-wrap:balance] pb-[0.15em] pr-[0.1em]">
                More Than a Showroom—{" "}
                <span
                  style={{
                    background: "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.3) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                  className="inline-block"
                >
                  A Destination for True Driving Enthusiasts
                </span>
              </h2>

              <p className="text-sm sm:text-base text-[#8A8A8A] leading-relaxed mb-8 max-w-[55ch]">
                Our Victoria Island showroom is more than a sales floor. It is a sensory
                sanctuary where you experience each supercar&apos;s raw engineering, interior craftsmanship,
                and exhaust note before commitment — guided by master technicians and dedicated private concierges.
              </p>

              <Link
                href="/about"
                onClick={() => soundEngine.playHoverTick()}
                className="inline-flex items-center gap-3 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white border border-white/20 hover:border-white rounded-md bg-white/[0.03] hover:bg-white/[0.08] transition-all"
              >
                <span>Discover Our Heritage</span>
                <ArrowRight className="w-4 h-4 text-[#E10600]" />
              </Link>
            </motion.div>
          </div>

          {/* Right: Showroom image with reveal (about 4/3 aspect) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            className="relative w-full aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl group"
          >
            <Image
              src="https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1400&q=85"
              alt="Aston Auto Private Showroom - Ferrari 296 GTB"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />

            {/* Red bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E10600] to-transparent" />
          </motion.div>
        </div>

        {/* 3 Capability feature cards row, 64px below */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-16 md:mt-20">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.15 }}
              className="p-6 md:p-8 rounded-2xl bg-[#0D0D0D] border border-white/[0.08] hover:border-white/20 transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="w-10 h-10 rounded-lg bg-[#E10600]/10 border border-[#E10600]/30 flex items-center justify-center text-[#E10600]">
                  <f.icon className="w-5 h-5" />
                </span>
                <span className="font-display text-sm font-bold text-white/30 group-hover:text-[#E10600] transition-colors">
                  {f.num}
                </span>
              </div>

              <h3 className="font-display font-bold text-lg text-white mb-3">
                {f.title}
              </h3>
              <p className="text-sm text-[#8A8A8A] leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
