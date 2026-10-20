"use client";

import Link from "next/link";
import { Calculator, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function FinancingBanner() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#0A0A0A] to-[#171717] text-white p-8 sm:p-14 relative overflow-hidden shadow-2xl">
          {/* Subtle gold accent aura */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#0D5C3A]/20 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-[#C5A059]/15 blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#C5A059] text-xs font-mono uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailored Asset Solutions</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
              Bespoke Financing & <br />
              VIP Trade-In Appraisals.
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-8 max-w-xl">
              Structure your supercar acquisition with custom monthly amortization or trade in your current exotic vehicle with same-day certified valuation.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/sell-trade-in"
                className="btn-luxury-primary bg-white text-black hover:bg-[#0D5C3A] hover:text-white rounded-full py-4 px-8 text-xs w-full sm:w-auto text-center"
              >
                <span>Request Trade-In Valuation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/inventory"
                className="btn-luxury-outline border-white/30 text-white hover:bg-white/10 rounded-full py-4 px-8 text-xs w-full sm:w-auto text-center"
              >
                <Calculator className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Calculate Monthly Financing</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
