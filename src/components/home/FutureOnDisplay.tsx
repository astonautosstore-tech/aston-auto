"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

const GALLERY = [
  { img: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=85", title: "Porsche 911 GT3 RS", h: "h-[320px] md:h-[360px]" },
  { img: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=85", title: "Aston Martin DBS 770", h: "h-[360px] md:h-[410px]" },
  { img: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1000&q=85", title: "Ferrari 296 GTB", h: "h-[420px] md:h-[480px]" }, // Center tallest
  { img: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1000&q=85", title: "Rolls-Royce Spectre", h: "h-[360px] md:h-[410px]" },
  { img: "https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1000&q=85", title: "Lamborghini Revuelto", h: "h-[320px] md:h-[360px]" },
];

export default function FutureOnDisplay() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <Section ref={ref} className="bg-[#050505] border-t border-white/[0.06]">
      <Container>
        {/* Header row: Left heading, Right max-w-[360px] paragraph */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-12 mb-12 md:mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#E10600]">
                Atmosphere &amp; Detail
              </span>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
              className="font-display font-black text-[clamp(2rem,4.5vw,4rem)] uppercase tracking-tight text-white leading-[1.08] [text-wrap:balance]"
            >
              Future on{" "}
              <span
                style={{
                  background: "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.3) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Display
              </span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm sm:text-base text-[#8A8A8A] max-w-[360px] leading-relaxed"
          >
            Every vehicle in our collection photographed in studio and location lighting, capturing the raw sculptural poetry of modern hyper-engineering.
          </motion.p>
        </div>

        {/* Gallery row spanning full container width */}
        <div className="flex items-end gap-3 sm:gap-4 w-full overflow-x-auto no-scrollbar pb-4 pt-2">
          {GALLERY.map((item, i) => {
            const isHovered = hovered === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shrink-0 md:shrink cursor-pointer shadow-xl group transition-all duration-500 ease-out ${item.h} ${
                  isHovered
                    ? "w-[260px] md:flex-[1.8]"
                    : hovered !== null
                    ? "w-[140px] md:flex-[0.8]"
                    : "w-[180px] md:flex-1"
                }`}
              >
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 200px, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

                {/* Overlaid title details */}
                <div className="absolute bottom-5 left-5 right-5 overflow-hidden">
                  <p className="text-[10px] uppercase tracking-widest text-[#E10600] font-bold mb-1 truncate">
                    Exotic Archive
                  </p>
                  <h4 className="text-xs sm:text-sm font-bold text-white font-display uppercase tracking-wide truncate">
                    {item.title}
                  </h4>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
