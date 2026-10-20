"use client";

import Image from "next/image";
import Link from "next/link";
import { soundEngine } from "@/lib/sound";

export default function CarCtaBanner() {
  return (
    <section className="relative w-full overflow-hidden pt-12 sm:pt-16 pb-0">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#0A0A0A] border border-white/10 text-center pt-14 sm:pt-20">
          {/* Subtle top spotlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-white/[0.03] blur-3xl pointer-events-none" />

          {/* Text Content */}
          <div className="relative z-10 max-w-2xl mx-auto px-6 space-y-4 sm:space-y-5">
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-tight">
              Ready to Find Your <br />
              Perfect Car?
            </h2>

            <p className="text-xs sm:text-sm text-[#8A8A8A] max-w-xl mx-auto leading-relaxed">
              Premium service, exceptional vehicles, unbeatable quality. Experience automotive
              excellence created for the discerning driver.
            </p>

            <div className="pt-2">
              <Link
                href="/inventory"
                onClick={() => soundEngine.playEngineRev()}
                className="inline-block px-8 py-3.5 rounded-sm bg-[#E10600] hover:bg-[#FF1F14] text-white font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#E10600]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Browse Cars
              </Link>
            </div>
          </div>

          {/* Car Image with subtle top fade into background */}
          <div className="relative w-full aspect-[21/9] sm:aspect-[2.35/1] mt-8 sm:mt-10 overflow-hidden">
            <Image
              src="/images/red_supercar_banner.jpg"
              alt="Ready to Find Your Perfect Car"
              fill
              priority
              sizes="(max-width: 1320px) 100vw, 1320px"
              className="object-cover object-center"
            />
            {/* Top gradient fade */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-transparent h-20 sm:h-28 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
