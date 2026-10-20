"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { 
  ShieldCheck, 
  Award, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Gauge,
  FileCheck2,
  Lock
} from "lucide-react";
import Container from "@/components/ui/Container";
import { soundEngine } from "@/lib/sound";
import CarCtaBanner from "@/components/blog/CarCtaBanner";

interface StatItem {
  target: number;
  prefix?: string;
  suffix: string;
  label: string;
}

const STATS: StatItem[] = [
  { target: 120, prefix: "₦", suffix: "B+", label: "Luxury Transactions" },
  { target: 500, prefix: "", suffix: "+", label: "Supercars Handed Over" },
  { target: 100, prefix: "", suffix: "%", label: "Documented Provenance" },
  { target: 99, prefix: "", suffix: "%", label: "Client Satisfaction" },
];

function CountUpNumber({
  target,
  duration = 2000,
  trigger = false,
}: {
  target: number;
  duration?: number;
  trigger?: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let startTimestamp: number | null = null;
    let animFrame: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * target));

      if (progress < 1) {
        animFrame = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [trigger, target, duration]);

  return <span>{count}</span>;
}

const PILLARS = [
  {
    icon: FileCheck2,
    tag: "01 / VERIFICATION",
    title: "150-Point Certified Provenance",
    desc: "Every vehicle is inspected with paint-depth acoustic sensors, factory DME ECU over-rev analysis, and complete international auction pedigree documentation before inclusion in our salon.",
  },
  {
    icon: Lock,
    tag: "02 / INTEGRITY",
    title: "Zero Speculative Markups",
    desc: "We eliminated arbitrary dealership pricing. Our valuations reflect global auction indices, transparent customs tariffs, and real market capital metrics with zero undisclosed fees.",
  },
  {
    icon: Compass,
    tag: "03 / DISCRETION",
    title: "Pan-African White-Glove Handover",
    desc: "Dedicated enclosed climate-controlled transporters deliver zero-kilometer transit directly to private residences in Lagos, Abuja, Port Harcourt, Accra, and London.",
  },
];

const TIMELINE = [
  {
    year: "2018",
    title: "Private Collector Syndicate",
    desc: "Founded in Victoria Island as an exclusive private advisory for West Africa's foremost exotic automotive connoisseurs seeking allocation of limited-production hypercars.",
  },
  {
    year: "2021",
    title: "Acoustic Diagnostic Chamber",
    desc: "Commissioned our flagship acoustic inspection salon equipped with specialized four-wheel hub dyno and multi-spectrum optical paint analysis booths.",
  },
  {
    year: "2024",
    title: "Enclosed Logistics Fleet",
    desc: "Expanded our internal fleet of climate-controlled, air-ride enclosed transport carriers, offering discreet nationwide doorstep deliveries with zero road exposure.",
  },
  {
    year: "2026",
    title: "The Digital Sanctuary",
    desc: "Setting the contemporary benchmark for luxury motoring: real-time asset discovery, transparent pricing integrity, and seamless concierge reservations.",
  },
];

const LEADERSHIP = [
  {
    name: "Tunde Oyelaran",
    role: "Founder & Managing Director",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    bio: "Two decades in private capital and rare marquee acquisition across Geneva, London, and Lagos.",
  },
  {
    name: "Amaka Chibueze",
    role: "Director of International Acquisition",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    bio: "Direct liaison with European factory bespoke departments, RM Sotheby’s, and private marque collectors.",
  },
  {
    name: "Emeka Eze",
    role: "Head of VIP Concierge & Handover",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    bio: "Orchestrating bespoke white-glove handovers, inter-state transit security, and private client track days.",
  },
  {
    name: "Sade Balogun",
    role: "Lead Master Diagnostic Engineer",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    bio: "Certified by Aston Martin, Porsche Motorsport, and Ferrari Corso Pilota technical academies.",
  },
];

export default function AboutClient() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#E10600] selection:text-white pt-28 sm:pt-36 pb-0">
      
      {/* ─── 1. EDITORIAL HERO SECTION ─── */}
      <section className="relative overflow-hidden pb-16 sm:pb-24">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#E10600]/8 blur-[160px] pointer-events-none rounded-full" />

        <Container>
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            {/* Tag Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-[#E10600] animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#A0A0A0]">
                The Heritage of Aston Auto
              </span>
            </motion.div>

            {/* Giant Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-white leading-[1.05]"
            >
              Driven by Truth. <br />
              <span
                style={{
                  background: "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.4) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Curated for Perfection.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-[#8A8A8A] max-w-2xl mx-auto leading-relaxed"
            >
              We dismantled the archaic, opaque dealership model to create a sanctuary of authenticity, 
              absolute transparency, and certified engineering excellence for the discerning automotive collector.
            </motion.p>

            {/* Quick trust metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono uppercase tracking-wider text-[#A0A0A0]"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E10600]" />
                <span>100% Provenance Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E10600]" />
                <span>Acoustic Diagnostic Chamber</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E10600]" />
                <span>Enclosed Zero-KM Handover</span>
              </div>
            </motion.div>

          </div>
        </Container>
      </section>

      {/* ─── 2. CINEMATIC FULL-BLEED SHOWROOM IMAGE ─── */}
      <section className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 mb-20 sm:mb-28">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=2200&q=85"
            alt="Aston Auto Flagship Inspection Suite"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Subtle vignette and bottom dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-black/30" />
          
          {/* Floating Location Card */}
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-10 bg-black/60 backdrop-blur-md border border-white/15 px-5 py-3.5 rounded-xl flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E10600]" />
            <div>
              <p className="font-display text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                Flagship Acoustic Inspection Suite
              </p>
              <p className="font-mono text-[11px] text-[#8A8A8A]">
                Victoria Island &bull; Lagos, Nigeria
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. OUR CORE PHILOSOPHY & PILLARS ─── */}
      <section className="py-16 sm:py-24 border-t border-white/[0.06] bg-[#070707]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Story */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
                <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#E10600]">
                  The Philosophy
                </span>
              </div>

              <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-tight">
                Making Car-Buying <br />
                <span
                  style={{
                    background: "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.3) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Transparent.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-[#8A8A8A] leading-relaxed">
                For too long, the high-performance car market was cloaked in uncertainty: undisclosed structural repairs, 
                wound-back instrument clusters, and speculative broker fees. 
              </p>

              <p className="text-sm sm:text-base text-[#8A8A8A] leading-relaxed">
                Aston Auto was founded to establish a gold standard of verifiable truth. We believe that acquiring a bespoke grand tourer 
                or numbered hypercar should be as reassuring and celebratory as commanding it on an open coastal highway.
              </p>

              <div className="pt-4">
                <Link
                  href="/inventory"
                  onClick={() => soundEngine.playEngineRev()}
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-sm bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all shadow-md hover:scale-105 active:scale-95"
                >
                  <span>Explore The Portfolio</span>
                  <ArrowRight className="w-4 h-4 text-[#E10600]" />
                </Link>
              </div>
            </div>

            {/* Right: 3 Pillar Cards */}
            <div className="lg:col-span-7 space-y-6">
              {PILLARS.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-8 sm:p-10 rounded-2xl bg-[#0D0D0D] border border-white/10 hover:border-white/25 transition-all duration-300 group shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs text-[#E10600] font-semibold tracking-widest">
                        {pillar.tag}
                      </span>
                      <IconComponent className="w-5 h-5 text-white/40 group-hover:text-[#E10600] transition-colors" />
                    </div>

                    <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-3 group-hover:text-white">
                      {pillar.title}
                    </h3>

                    <p className="text-sm text-[#8A8A8A] leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </Container>
      </section>

      {/* ─── 4. ANIMATED COUNTABLE STATS ─── */}
      <section ref={statsRef} className="py-16 sm:py-24 border-t border-white/[0.06] bg-[#050505]">
        <Container>
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            {STATS.map((s, i) => (
              <div key={i} className="pt-6 md:pt-0 px-4">
                <div className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white mb-2 tracking-tight flex items-center justify-center">
                  {s.prefix && <span>{s.prefix}</span>}
                  <CountUpNumber target={s.target} trigger={statsInView} duration={2400} />
                  <span className="text-[#E10600]">{s.suffix}</span>
                </div>
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-[#8A8A8A]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── 5. THE TIMELINE OF EXCELLENCE ─── */}
      <section className="py-20 sm:py-28 border-t border-white/[0.06] bg-[#080808]">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-16 sm:mb-20">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#E10600] font-bold block mb-3">
              Chronicles
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-tight">
              A Journey of Uncompromising Standards
            </h2>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {TIMELINE.map((item, idx) => (
              <div
                key={idx}
                className="relative p-8 rounded-2xl bg-[#0D0D0D] border border-white/10 hover:border-white/30 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display font-black text-2xl sm:text-3xl text-[#E10600]">
                    {item.year}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-[#E10600] transition-colors" />
                </div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#8A8A8A] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── 6. THE LEADERSHIP & MASTER TECHNICIANS ─── */}
      <section className="py-20 sm:py-28 border-t border-white/[0.06] bg-[#050505]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#E10600]">
                The Craftsmen
              </span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-tight">
              People Behind the Standard
            </h2>
            <p className="text-sm text-[#8A8A8A] mt-4">
              Lifelong automotive purists, certified diagnostic engineers, and concierge specialists dedicated to perfection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEADERSHIP.map((member, i) => (
              <div
                key={i}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#0D0D0D] shadow-xl flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={member.img}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />
                </div>

                <div className="p-6 pt-2 space-y-2">
                  <h3 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-wide">
                    {member.name}
                  </h3>
                  <p className="text-xs text-[#E10600] uppercase tracking-wider font-semibold">
                    {member.role}
                  </p>
                  <p className="text-xs text-[#8A8A8A] leading-relaxed pt-1">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── 7. READY TO FIND YOUR PERFECT CAR BANNER ─── */}
      <CarCtaBanner />

      {/* Note: The global layout Footer in layout.tsx automatically provides the bottom tagline, columns, and chrome Levrix wordmark */}
    </div>
  );
}
