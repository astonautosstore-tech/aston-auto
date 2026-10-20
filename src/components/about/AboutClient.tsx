"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ShieldCheck, 
  Award, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Gauge,
  FileCheck2,
  Lock,
  Phone
} from "lucide-react";
import Container from "@/components/ui/Container";

interface StatItem {
  target: number;
  prefix?: string;
  suffix: string;
  label: string;
}

const STATS: StatItem[] = [
  { target: 250, prefix: "$", suffix: "M+", label: "Verified Acquisitions" },
  { target: 1200, prefix: "", suffix: "+", label: "Vehicles Delivered" },
  { target: 100, prefix: "", suffix: "%", label: "Clean CARFAX & Titles" },
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
    title: "150-Point Certified Inspection",
    desc: "Every exotic and luxury vehicle undergoes paint-depth acoustic sensor verification, factory ECU analysis, and full provenance documentation before entering our showroom.",
  },
  {
    icon: Lock,
    tag: "02 / INTEGRITY",
    title: "Transparent Market Pricing",
    desc: "We eliminated arbitrary dealership markups. Our valuations reflect real-time North American market indices and clean certified book values with zero undisclosed fees.",
  },
  {
    icon: Compass,
    tag: "03 / NATIONWIDE",
    title: "Enclosed Carrier Handover",
    desc: "Dedicated enclosed, climate-controlled transport delivers zero-road-wear transit directly to private residences in Beverly Hills, Miami, New York, Dallas, and across the US.",
  },
];

const TIMELINE = [
  {
    year: "2018",
    title: "Private Collector Advisory",
    desc: "Founded as an exclusive private advisory for high-net-worth automotive enthusiasts seeking limited-production hypercars and certified exotics.",
  },
  {
    year: "2021",
    title: "Beverly Hills Flagship Salon",
    desc: "Opened our premier showcase gallery on Rodeo Drive, featuring a dedicated multi-vehicle display lounge and white-glove client delivery suite.",
  },
  {
    year: "2024",
    title: "Nationwide Logistics Network",
    desc: "Partnered with premier enclosed transport carriers to guarantee door-to-door insured transport anywhere in the continental United States.",
  },
  {
    year: "2026",
    title: "Digital Automotive Showroom",
    desc: "Setting the contemporary benchmark for luxury motoring: real-time inventory discovery, transparent USD pricing, and seamless concierge reservations.",
  },
];

export default function AboutClient() {
  const [statsTriggered, setStatsTriggered] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsTriggered(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-neutral-900 pt-20 sm:pt-24">
      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative w-full bg-[#F9FAFB] border-b border-neutral-200 py-14 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">
              About Aston
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 tracking-tight mb-4">
              Driven by Authenticity. <br />
              Curated for Excellence.
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl">
              We rebuilt the luxury automotive dealership experience around absolute transparency, certified multipoint inspection, and white-glove nationwide delivery for discerning drivers and collectors.
            </p>
          </div>
        </Container>
      </section>

      {/* ─── 2. STATS BAR ─── */}
      <section ref={statsRef} className="py-12 bg-white border-b border-neutral-200">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="flex flex-col p-4 bg-[#F9FAFB] rounded-xl border border-neutral-200 text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-neutral-950 mb-1">
                  {stat.prefix}
                  <CountUpNumber target={stat.target} trigger={statsTriggered} />
                  {stat.suffix}
                </div>
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── 3. THREE CORE PILLARS ─── */}
      <section className="py-16 sm:py-24 bg-white">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-2">
              The Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
              Why Discerning Clients Choose Aston
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PILLARS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col p-8 bg-[#F9FAFB] rounded-2xl border border-neutral-200 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-neutral-950 text-white flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    {item.tag}
                  </span>
                  <h3 className="text-xl font-bold text-neutral-950 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ─── 4. SHOWROOM & LOGISTICS IMAGE STRIP ─── */}
      <section className="py-12 bg-[#F9FAFB] border-y border-neutral-200">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=85"
                alt="Aston Showroom Fleet"
                fill
                className="object-cover"
              />
            </div>

            <div className="lg:col-span-6 space-y-4 lg:pl-6">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 block">
                Coast-to-Coast Reach
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                White-Glove Enclosed Delivery Across North America
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Whether purchasing in person at our Beverly Hills showroom or transacting remotely from New York, Miami, or Chicago, our clients enjoy seamless doorstep transport in dedicated climate-controlled carriers.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/inventory"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <span>Explore Inventory</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="tel:+14482264666"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-neutral-300 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>+1 448 226 4666</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 5. TIMELINE ─── */}
      <section className="py-16 sm:py-24 bg-white">
        <Container>
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-2">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
              The Evolution of Aston
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIMELINE.map((item, i) => (
              <div
                key={i}
                className="p-6 bg-[#F9FAFB] rounded-xl border border-neutral-200 flex flex-col"
              >
                <span className="text-2xl font-extrabold text-neutral-950 mb-2">
                  {item.year}
                </span>
                <h3 className="text-base font-bold text-neutral-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
