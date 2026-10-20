"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles, Percent } from "lucide-react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

export default function PromoCards() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Section ref={ref} className="bg-[#050505] border-t border-white/[0.06]">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

          {/* Left card — Year-End Clearance (Solid Red) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="relative rounded-[24px] overflow-hidden bg-gradient-to-br from-[#E10600] to-[#A60400] flex flex-col justify-between p-8 md:p-12 shadow-2xl group min-h-[380px]"
          >
            {/* Background car silhouette contained inside */}
            <div className="absolute -bottom-6 -right-6 w-3/4 h-3/4 opacity-35 pointer-events-none group-hover:scale-105 transition-transform duration-700">
              <Image
                src="https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=800&q=80"
                alt="Exotic Car Promo"
                fill
                sizes="500px"
                className="object-contain object-bottom-right"
              />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm text-[11px] uppercase tracking-widest font-bold text-white mb-6">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Special Acquisition Privilege</span>
              </div>

              <h3 className="font-display font-black text-3xl sm:text-4xl uppercase text-white leading-tight mb-4 [text-wrap:balance]">
                Year-End <br />Clearance
              </h3>

              <p className="text-sm sm:text-base text-white/90 max-w-sm leading-relaxed">
                Enjoy preferential pricing and complimentary 2-year maintenance packaging on select 2024 showroom units.
              </p>
            </div>

            <div className="relative z-10 pt-8">
              <Link
                href="/inventory"
                className="inline-flex items-center gap-3 px-8 py-4 text-xs font-bold uppercase tracking-widest text-[#E10600] bg-white hover:bg-white/90 rounded-md shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <span>View Qualifying Models</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Right card — 0% APR Financing (Dark) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
            className="relative rounded-[24px] overflow-hidden bg-[#0D0D0D] border border-white/10 flex flex-col justify-between p-8 md:p-12 shadow-2xl group min-h-[380px]"
          >
            {/* Subtle decorative concentric circles */}
            <div className="absolute right-0 top-0 w-80 h-80 opacity-10 pointer-events-none">
              <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
                <circle cx="150" cy="50" r="120" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="150" cy="50" r="80" stroke="white" strokeWidth="1" />
                <circle cx="150" cy="50" r="40" stroke="#E10600" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] uppercase tracking-widest font-bold text-[#E10600] mb-6">
                <Percent className="w-3.5 h-3.5" />
                <span>Bespoke Financial Structuring</span>
              </div>

              <h3 className="font-display font-black text-3xl sm:text-4xl uppercase text-white leading-tight mb-4 [text-wrap:balance]">
                0% APR <br />Financing
              </h3>

              <p className="text-sm sm:text-base text-[#8A8A8A] max-w-sm leading-relaxed">
                Confidential asset-backed leasing, competitive interest structures, and swift 24-hour credit approval via private banking partners.
              </p>
            </div>

            <div className="relative z-10 pt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white bg-[#E10600] hover:bg-[#FF1F14] rounded-md shadow-lg shadow-[#E10600]/30 transition-all transform hover:-translate-y-0.5"
              >
                <span>Calculate Your Plan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

        </div>
      </Container>
    </Section>
  );
}
