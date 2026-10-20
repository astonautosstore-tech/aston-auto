"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, PhoneCall } from "lucide-react";
import { soundEngine } from "@/lib/sound";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

export default function ClosingCta() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <Section ref={ref} className="bg-[#050505] border-t border-white/[0.06]">
      <Container>
        {/* Giant Faded Heading Centered Above Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="text-center mb-10 md:mb-14 select-none"
        >
          <span className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-tight text-white/10 block pb-1">
            Ready to Find
          </span>
        </motion.div>

        {/* Cinematic Card with Centered Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
          className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 min-h-[440px] md:min-h-[500px] flex flex-col items-center justify-center text-center p-6 sm:p-10 md:p-16 shadow-2xl group"
        >
          <Image
            src="https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=2000&q=85"
            alt="Aston Auto Supercar Collection"
            fill
            sizes="100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/40" />

          {/* Red top border glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E10600] to-transparent" />

          {/* Content Centered with 24px side padding and gap-4 */}
          <div className="relative z-10 max-w-2xl mx-auto space-y-6 md:space-y-8 px-6">
            <h3 className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-white leading-tight [text-wrap:balance]">
              Begin Your Journey to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#E10600]">
                Uncompromising Exclusivity
              </span>
            </h3>

            <p className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed max-w-[55ch] mx-auto">
              Making your automotive acquisition completely transparent, dignified, and
              extraordinary — from initial consultation to white-glove handover.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center flex-wrap gap-4 pt-2">
              <Link
                href="/inventory"
                onClick={() => soundEngine.playEngineRev()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white bg-[#E10600] hover:bg-[#FF1F14] rounded-md shadow-xl shadow-[#E10600]/30 transition-all hover:scale-105"
              >
                <span>Explore Inventory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/contact"
                onClick={() => soundEngine.playHoverTick()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white border border-white/20 hover:border-white rounded-md bg-white/[0.04] hover:bg-white/[0.1] transition-all"
              >
                <PhoneCall className="w-4 h-4 text-[#E10600]" />
                <span>Contact Private Concierge</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
