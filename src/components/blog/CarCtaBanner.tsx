"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function CarCtaBanner() {
  return (
    <section className="relative w-full overflow-hidden py-14 sm:py-20 bg-[#F9FAFB] border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-white border border-neutral-200 text-center pt-12 sm:pt-16 shadow-sm">
          {/* Text Content */}
          <div className="relative z-10 max-w-2xl mx-auto px-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 block">
              Direct Dealership Concierge
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight leading-tight">
              Ready to Find Your <br />
              Perfect Vehicle?
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto leading-relaxed">
              Curated inventory, certified 150-point inspection, and enclosed nationwide delivery. Connect with our Beverly Hills showroom today.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/inventory"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
              >
                <span>Browse Inventory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="tel:+14482264666"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-900 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>+1 448 226 4666</span>
              </a>
            </div>
          </div>

          {/* Car Image Banner */}
          <div className="relative w-full aspect-[21/9] sm:aspect-[2.35/1] mt-8 sm:mt-10 overflow-hidden">
            <Image
              src="/images/red_supercar_banner.jpg"
              alt="Ready to Find Your Perfect Car"
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
