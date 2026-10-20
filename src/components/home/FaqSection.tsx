"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

const FAQS = [
  {
    q: "How does private vehicle acquisition and financing operate?",
    a: "We collaborate directly with Nigeria's premier tier-1 private wealth institutions including Stanbic IBTC Private Banking, Zenith Bank, and Access Private. Confidential pre-approval is arranged in under 24 hours, with bespoke repayment tenures up to 60 months and zero prepayment penalties.",
  },
  {
    q: "Can I arrange an exclusive track test before final settlement?",
    a: "Yes. For our high-performance models (such as the Porsche GT3 RS and Ferrari 296 GTB), our VIP concierge coordinates private track sessions and closed-circuit evaluations with professional telemetry support prior to financial close.",
  },
  {
    q: "What comprehensive warranty protections are provided?",
    a: "Every Aston Auto vehicle retains all active global manufacturer warranties plus our complimentary 12-month / 20,000 km comprehensive mechanical and electrical guarantee, extendable up to 36 months through partner certified marque centers.",
  },
  {
    q: "Do you facilitate luxury vehicle trade-in and equity exchange?",
    a: "Yes. Submit your current exotic vehicle details to our private valuation desk. We deliver verified market appraisals within 24 hours, and equity can be directly applied toward your acquisition with immediate title transfer.",
  },
  {
    q: "How does discreet enclosed nationwide delivery work?",
    a: "All long-distance transfers (Lagos to Abuja, Port Harcourt, Kano, etc.) are executed via unmarked, climate-controlled, air-suspension hydraulic enclosed transporters with dedicated armed security escorts and live satellite telemetry.",
  },
  {
    q: "Are all vehicles certified with 100% genuine Nigerian customs duties?",
    a: "Without exception. Every single vehicle in our portfolio carries fully verified, tamper-evident Nigerian Customs Service single goods declaration (SGD) documentation and genuine assessment receipts. We uphold zero compromise on regulatory integrity.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <Section ref={ref} className="bg-[#050505] border-t border-white/[0.06]">
      <Container>
        {/* Section Heading Centered */}
        <div className="text-center max-w-xl mx-auto mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#E10600]">
              Clear Answers
            </span>
          </div>

          <h2 className="font-display font-black text-[clamp(2rem,4.5vw,4rem)] uppercase tracking-tight text-white leading-[1.08] [text-wrap:balance]">
            Common Questions
          </h2>
          <p className="text-sm sm:text-base text-[#8A8A8A] mt-4 max-w-[60ch] mx-auto leading-relaxed">
            Everything you need to know regarding acquisition, title security, and delivery.
          </p>
        </div>

        {/* Centered Accordion: max-w-3xl mx-auto with 20-24px padding */}
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.05 + i * 0.05 }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-[#0D0D0D] border-white/20 shadow-lg"
                    : "bg-[#0A0A0A] border-white/[0.08] hover:border-white/15"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 px-6 md:py-6 md:px-8 text-left cursor-pointer transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-bold text-base md:text-lg text-white leading-snug pr-4">
                    {item.q}
                  </span>
                  <span
                    className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isOpen
                        ? "bg-[#E10600] text-white shadow-md shadow-[#E10600]/40 rotate-180"
                        : "bg-white/5 border border-white/10 text-[#8A8A8A]"
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 md:px-8 pb-6 pt-2 border-t border-white/[0.06]">
                        <p className="text-sm sm:text-base text-[#8A8A8A] leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
