"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Calculator, ShieldCheck, Zap } from "lucide-react";
import { soundEngine } from "@/lib/sound";

export default function EasyFinancing() {
  const perks = [
    "Fast online pre-approval in under 15 minutes",
    "Competitive rates tailored to executive buyers",
    "Flexible down payment structures (from 10%)",
    "No hidden prepayment penalties or surprises",
  ];

  return (
    <section className="py-24 bg-white border-b border-[#E4E4E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Financing Benefits & CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5" />
              <span>FLEXIBLE CAPITAL & ACQUISITION</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A0A0A] tracking-tight leading-tight">
              Easy Financing for <br />
              <span className="text-blue-600">Luxury & Electric Vehicles</span>
            </h2>

            <p className="text-sm text-[#64748B] leading-relaxed max-w-lg">
              Acquiring your dream automobile has never been more straightforward. We partner with Nigeria’s foremost tier-1 private banks and asset financiers to deliver custom-tailored, discreet acquisition plans.
            </p>

            {/* Checklist */}
            <div className="space-y-3.5 pt-2">
              {perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-[#0A0A0A]">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/cars/aston-martin-dbs-770-ultimate"
                onClick={() => soundEngine.playHoverTick()}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#0A0A0A] hover:bg-blue-600 text-white font-semibold text-xs tracking-wider uppercase transition-colors"
              >
                <span>Calculate Financing</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs text-[#94a3b8] flex items-center gap-1.5 justify-center sm:justify-start">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Zero impact on credit score
              </span>
            </div>
          </div>

          {/* Right Column: Car Image with Floating Badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-[#E4E4E7]">
              <Image
                src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=85"
                alt="Financing Luxury Aston Auto Vehicle"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Floating Badge in Top Right */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md border border-white/50 rounded-2xl p-4 shadow-xl max-w-[220px]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-[#0A0A0A]">98% Approval Rate</span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">
                  Instant digital preliminary decision with white-glove closing.
                </p>
              </div>

              {/* Bottom tag on image */}
              <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-md text-white text-xs px-4 py-2 rounded-xl flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>Zero Down Payment Options Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
