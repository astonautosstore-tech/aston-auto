"use client";

import Link from "next/link";
import { ArrowRight, MessageSquare, ShieldCheck, Check } from "lucide-react";
import { soundEngine } from "@/lib/sound";

export default function CtaBanner() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-16 text-center text-white shadow-2xl">
          {/* Subtle glow / pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Your Next Luxury Car <br className="hidden sm:inline" />
              Is Waiting.
            </h2>

            <p className="text-base sm:text-lg text-blue-100 max-w-xl mx-auto leading-relaxed">
              Step into our Victoria Island showroom or reserve online with a 10% fully refundable deposit. White-glove delivery guaranteed.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/inventory"
                onClick={() => soundEngine.playEngineRev()}
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-100 transition-all shadow-lg hover:scale-105"
              >
                Explore Inventory
              </Link>
              <Link
                href="/contact"
                onClick={() => soundEngine.playHoverTick()}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all backdrop-blur-md"
              >
                Contact Concierge
              </Link>
            </div>

            {/* Guarantee Pills */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-blue-100/90 font-medium">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-300" />
                <span>100% Refundable Deposit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Enclosed Carrier Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-300" />
                <span>7-Day Vehicle Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
