"use client";

import { useEffect, useRef, useState } from "react";
import Container from "@/components/ui/Container";

// TODO: Confirm official statistics (years, cars sold, satisfaction rate) with the client
const STATS = [
  { target: 10, suffix: "+ Years", label: "Automotive Curation" },
  { target: 500, suffix: "+", label: "Vehicles Delivered" },
  { target: 98, suffix: "%", label: "Client Satisfaction" },
];

function CounterItem({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#0A0A0A]">
        {count}
        {suffix}
      </div>
      <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#6B6B6B]">
        {label}
      </p>
    </div>
  );
}

export default function HomeBrandStatement() {
  return (
    <section className="py-24 md:py-36 bg-[#FAFAFA] border-t border-[#E8E8E8]">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block mb-6">
            The Philosophy
          </span>
          <p className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#0A0A0A] leading-relaxed [text-wrap:balance]">
            We believe buying a high-caliber vehicle should be calm, completely transparent, and free of sales theatrics.
          </p>
        </div>

        {/* 3 Stats Counters */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 pt-12 border-t border-[#E8E8E8]">
          {STATS.map((stat, idx) => (
            <CounterItem key={idx} target={stat.target} suffix={stat.suffix} label={stat.label} />
          ))}
        </div>
      </Container>
    </section>
  );
}
