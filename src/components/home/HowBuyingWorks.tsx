"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { soundEngine } from "@/lib/sound";

const STEPS = [
  {
    step: "01",
    title: "Discovery & Allocation Lock",
    description:
      "Explore our curated catalog. Secure your chosen vehicle immediately with an exclusive 10% reservation deposit lock, preventing competing acquisitions.",
  },
  {
    step: "02",
    title: "Private Consultation",
    description:
      "Experience the vehicle in our Ikoyi showroom or request a high-definition private video walkaround with our chief technical specialist.",
  },
  {
    step: "03",
    title: "Verified Documentation",
    description:
      "Our legal and concierge team oversees all title transfers, certified customs clearance documentation, and manufacturer warranty registrations.",
  },
  {
    step: "04",
    title: "White-Glove Handover",
    description:
      "Receive your vehicle via enclosed climate-controlled transporter at your private residence, or attend a celebratory red-carpet handover in our private salon.",
  },
];

export default function HowBuyingWorks() {
  return (
    <section className="py-24 bg-[#F7F7F8] border-b border-[#E4E4E7]" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#0D5C3A] mb-3 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#0D5C3A]" />
            <span>Seamless Acquisition Journey</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0A0A0A] tracking-tight">
            How Luxury Acquisition Works
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] mt-4 leading-relaxed">
            From initial digital selection to your estate driveway: precision, discretion, and perfection at every stage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {STEPS.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white border border-[#E4E4E7] shadow-sm flex flex-col justify-between relative group hover:border-[#0D5C3A] transition-colors"
            >
              <div>
                <div className="text-3xl font-mono font-bold text-[#0D5C3A]/20 group-hover:text-[#0D5C3A] transition-colors mb-4">
                  {item.step}
                </div>
                <h3 className="text-base font-bold text-[#0A0A0A] mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E4E4E7]/60 flex items-center gap-2 text-[11px] text-[#0D5C3A] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Concierge Managed</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/inventory"
            onMouseEnter={() => soundEngine.playHoverTick()}
            className="btn-luxury-primary text-xs py-3.5 px-8 rounded-full"
          >
            <span>Begin Your Vehicle Selection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
