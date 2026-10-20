"use client";

import Link from "next/link";
import { ArrowRight, Search, FileCheck, CreditCard, ShieldCheck, Truck } from "lucide-react";
import { soundEngine } from "@/lib/sound";

const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Browse & Select",
    description: "Explore our verified inventory or submit a bespoke sourcing request.",
  },
  {
    number: "02",
    icon: FileCheck,
    title: "Vehicle Verification",
    description: "Review comprehensive 150-point inspection & battery health reports.",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Financing & Payment",
    description: "Choose secure escrow wire transfer or low-rate bank asset financing.",
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Customs & Paperwork",
    description: "All duty clearance, diplomatic paperwork, and title transfer handled.",
  },
  {
    number: "05",
    icon: Truck,
    title: "Doorstep Delivery",
    description: "Enclosed carrier transport with white-glove handover at your door.",
  },
];

export default function BuyingGuide() {
  return (
    <section className="py-24 bg-white border-b border-[#E4E4E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-2">
              SEAMLESS ACQUISITION PROCESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A0A0A] tracking-tight">
              Buying a Luxury Car? <span className="text-blue-600">We Guide You.</span>
            </h2>
          </div>

          <Link
            href="/inventory"
            onClick={() => soundEngine.playHoverTick()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider"
          >
            <span>View All Guides & Sourcing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 5 Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-[#F7F7F8] rounded-2xl p-6 border border-[#E4E4E7] hover:border-blue-300 hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {step.number}
                    </span>
                    <Icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0A0A0A] mb-1.5">{step.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
