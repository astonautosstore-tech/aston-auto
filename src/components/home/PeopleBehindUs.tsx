"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

const TEAM = [
  { name: "Tunde Oyelaran", role: "Founder & Managing Director", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80" },
  { name: "Amaka Chibueze", role: "Director of International Acquisition", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80" },
  { name: "Emeka Eze", role: "Head of VIP Concierge & Delivery", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80" },
  { name: "Sade Balogun", role: "Lead Master Technician & Quality", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80" },
];

export default function PeopleBehindUs() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Section ref={ref} className="bg-[#050505] border-t border-white/[0.06]">
      {/* Background alloy wheel artwork */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=2000&q=70"
          alt="Exotic car wheel and carbon-ceramic brake disc"
          fill
          sizes="100vw"
          className="object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-[#050505]" />
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#E10600]">
              The Leadership
            </span>
          </div>

          <h2 className="font-display font-black text-[clamp(2rem,4.5vw,4rem)] uppercase tracking-tight text-white leading-[1.08] [text-wrap:balance]">
            People Behind Us
          </h2>
          <p className="text-sm sm:text-base text-[#8A8A8A] mt-4 max-w-[60ch] mx-auto leading-relaxed">
            Lifelong automotive purists, certified engineers, and concierge specialists dedicated to perfection.
          </p>
        </div>

        {/* 4 Team Member Cards inside Container */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
              className="group relative rounded-2xl overflow-hidden border border-white/10 aspect-[3/4] shadow-xl bg-[#0D0D0D]"
            >
              <Image
                src={member.img}
                alt={member.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

              {/* Identity Details with 20px padding */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-sm sm:text-base font-bold text-white font-display uppercase tracking-wide truncate">
                  {member.name}
                </h3>
                <p className="text-xs text-[#E10600] uppercase tracking-wider font-semibold mt-1 truncate">
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
