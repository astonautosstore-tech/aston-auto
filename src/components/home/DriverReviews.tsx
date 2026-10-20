"use client";

import { Star, Quote, CheckCircle2 } from "lucide-react";

const REVIEWS = [
  {
    name: "Adebayo Adeleke",
    location: "Ikoyi, Lagos",
    car: "Rolls-Royce Spectre",
    stars: 5,
    quote: "The entire acquisition was seamless. The bespoke Spectre arrived in Ikoyi in immaculate showroom condition with all diplomatic documentation prepared.",
  },
  {
    name: "Folake Alakija",
    location: "Victoria Island, Lagos",
    car: "Porsche Taycan Turbo S",
    stars: 5,
    quote: "Aston Auto made purchasing an electric vehicle completely stress-free. The battery health diagnostic was 100% transparent and verified.",
  },
  {
    name: "Dr. Chuka Obi",
    location: "Maitama, Abuja",
    car: "Aston Martin DBS 770",
    stars: 5,
    quote: "Unbeatable concierge service. Enclosed delivery to Abuja within 48 hours. The team’s mechanical knowledge and care is peerless.",
  },
  {
    name: "Ibrahim Danjuma",
    location: "Lekki Phase 1, Lagos",
    car: "Lamborghini Urus",
    stars: 5,
    quote: "Best luxury dealership experience in Nigeria. Zero hidden fees, crystal-clear customs documents, and white-glove doorstep delivery.",
  },
];

export default function DriverReviews() {
  return (
    <section className="py-24 bg-[#F7F7F8] border-b border-[#E4E4E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs font-bold text-[#0A0A0A] ml-2 tracking-wider">
              4.9 OUT OF 5.0 RATING &bull; 250+ CLIENTS
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A0A0A] tracking-tight">
            What Our <span className="text-blue-600">Drivers Say</span>
          </h2>
          <p className="text-sm text-[#64748B] mt-2">
            Read firsthand accounts from our distinguished clients across Nigeria.
          </p>
        </div>

        {/* 4 Testimonial Cards in a row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((rev, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-[#E4E4E7] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-4 h-4 text-slate-300" />
                </div>
                <p className="text-xs text-[#0A0A0A] leading-relaxed italic">
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#F0F0F2]">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-[#0A0A0A]">{rev.name}</h4>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <p className="text-[11px] text-[#64748B]">{rev.location}</p>
                <span className="text-[10px] text-blue-600 font-medium block mt-1">
                  Acquired: {rev.car}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
