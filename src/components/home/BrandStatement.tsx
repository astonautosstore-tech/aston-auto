"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

interface StatItem {
  target: number;
  prefix?: string;
  suffix: string;
  label: string;
}

const STATS: StatItem[] = [
  { target: 120, prefix: "₦", suffix: "B+", label: "Luxury Car Sales" },
  { target: 10, prefix: "", suffix: "+", label: "Years of Experience" },
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
      // easeOutExpo for a premium deceleration feel
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

export default function BrandStatement() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Section ref={ref} className="bg-[#050505] border-t border-white/[0.06]">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#E10600]/5 blur-[140px] pointer-events-none rounded-full" />

      <Container className="text-center relative z-10">
        {/* Real Brand Logo Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="relative w-14 h-14 mx-auto mb-8 md:mb-10 p-2.5 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-md shadow-2xl shadow-[#E10600]/25 flex items-center justify-center group"
        >
          <div className="absolute inset-0 rounded-2xl bg-[#E10600]/10 blur-md pointer-events-none group-hover:bg-[#E10600]/20 transition-colors" />
          <Image
            src="/logo.png"
            alt="Aston Auto Logo"
            width={40}
            height={40}
            className="object-contain relative z-10 transition-transform duration-300 group-hover:scale-110"
          />
        </motion.div>

        {/* Main statement with 2-tone typography */}
        <div className="max-w-[900px] mx-auto overflow-hidden pb-1">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
            className="font-display font-black text-[clamp(2rem,4.5vw,4rem)] uppercase tracking-tight text-white leading-[1.08] [text-wrap:balance]"
          >
            We don&apos;t just sell cars
          </motion.h2>
        </div>

        <div className="max-w-[900px] mx-auto overflow-hidden pb-2 mb-8 md:mb-10">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            className="font-display font-black text-[clamp(2rem,4.5vw,4rem)] uppercase tracking-tight leading-[1.08] [text-wrap:balance]"
            style={{
              background: "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.3) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            We craft experiences
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-base md:text-lg text-[#8A8A8A] max-w-[640px] mx-auto leading-relaxed mb-16 md:mb-20"
        >
          From the moment you first explore our curated portfolio to the day
          your dream machine is delivered white-glove to your private garage,
          Aston Auto Stores redefines what high-tier automotive ownership feels like.
        </motion.p>

        {/* Countable Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12 md:gap-16 lg:gap-20 sm:divide-x sm:divide-white/10 pt-12 md:pt-16 border-t border-white/10"
        >
          {STATS.map((s, i) => (
            <div key={i} className="px-4 text-center">
              <div className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white mb-2 md:mb-3 tracking-tight flex items-center justify-center">
                {s.prefix && <span>{s.prefix}</span>}
                <CountUpNumber target={s.target} trigger={inView} duration={2200} />
                <span className="text-[#E10600]">{s.suffix}</span>
              </div>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8A8A8A]">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
