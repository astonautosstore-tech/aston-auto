"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Container from "@/components/ui/Container";

const FAQS = [
  {
    q: "How does financing work?",
    a: "We work with top tier private and commercial automotive lenders to secure competitive loan rates. Please ask our team about customized down payment structures and term options for the vehicle you are considering.",
  },
  {
    q: "How can I book a test drive?",
    a: "Private test drive appointments can be arranged directly with our team either through our website, phone, or WhatsApp. We prepare the vehicle in advance to ensure an uninterrupted, personalized experience.",
  },
  {
    q: "Do you accept vehicle trade-ins and offer warranties?",
    a: "Yes. We offer professional valuation for qualified performance and luxury vehicles. Extended service contracts and comprehensive warranty packages are also available—ask our team for tailored options.",
  },
  {
    q: "Are the vehicles inspected before purchase?",
    a: "Every motorcar undergoes a meticulous multi-point technical inspection covering mechanical condition, electrical systems, body integrity, and onboard diagnostics before joining our active inventory.",
  },
  {
    q: "How are delivery and payment handled?",
    a: "We arrange insured, enclosed nationwide transport directly to your residence or private garage. All vehicle transactions and payments are settled directly with our licensed United States dealership via verified wire transfer or bank draft.",
  },
];

export default function HomeFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-20 md:py-28 bg-white border-t border-[#E8E8E8]">
      <Container>
        <div className="max-w-2xl mb-14">
          <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block mb-3">
            Common Inquiries
          </span>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#0A0A0A]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl divide-y divide-[#E8E8E8]">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="py-5">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-medium text-[#0A0A0A]">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6B6B6B] transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    strokeWidth={1.5}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm text-[#6B6B6B] leading-relaxed pr-6 animate-in fade-in duration-200">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
