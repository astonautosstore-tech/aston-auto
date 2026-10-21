"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function CarCtaBanner() {
  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-24 bg-[#FAFAFA] border-t border-[#E8E8E8]">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="relative rounded-2xl overflow-hidden bg-white border border-[#E8E8E8] text-center pt-12 sm:pt-16">
          {/* Text Content */}
          <div className="relative z-10 max-w-2xl mx-auto px-6 space-y-4">
            <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block">
              Direct Concierge
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#0A0A0A] tracking-tight leading-tight">
              Ready to find your motorcar?
            </h2>

            <p className="text-sm text-[#6B6B6B] max-w-lg mx-auto leading-relaxed">
              Curated inventory, 150-point diagnostic inspection, and enclosed nationwide carrier delivery across the United States.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/inventory"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#0A0A0A] hover:opacity-90 text-white font-medium text-xs tracking-wide transition-opacity"
              >
                <span>Browse Inventory</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>

              <a
                href="tel:+14482264666"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white border border-[#E8E8E8] hover:bg-[#FAFAFA] text-[#0A0A0A] font-medium text-xs tracking-wide transition-colors"
              >
                <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>+1 448 226 4666</span>
              </a>
            </div>
          </div>

          {/* Car Image Banner */}
          <div className="relative w-full aspect-[21/9] sm:aspect-[2.35/1] mt-10 overflow-hidden">
            <Image
              src="/images/red_supercar_banner.jpg"
              alt="Aston Auto Motorcars"
              fill
              priority
              sizes="(max-width: 1320px) 100vw, 1320px"
              className="object-cover object-center"
            />
            {/* Top gradient fade into white */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent h-20 sm:h-28 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
