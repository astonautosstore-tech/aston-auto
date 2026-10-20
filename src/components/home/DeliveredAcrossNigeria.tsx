"use client";

import { Truck, Navigation, ShieldCheck, CheckCircle2, MapPin } from "lucide-react";

export default function DeliveredAcrossNigeria() {
  const points = [
    {
      title: "Enclosed Carrier Transport",
      desc: "Transported inside weather-sealed hydraulic carriers to prevent road debris and mileage accrual.",
    },
    {
      title: "Real-Time GPS Tracking",
      desc: "Receive private live telemetry and continuous driver updates directly to your WhatsApp or phone.",
    },
    {
      title: "White-Glove Handover at Your Door",
      desc: "Personal handover specialist conducts vehicle walk-around and assists with tech orientation.",
    },
  ];

  return (
    <section className="py-24 bg-[#F7F7F8] border-b border-[#E4E4E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Delivery Graphic / Card */}
          <div className="lg:col-span-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 sm:p-12 rounded-3xl border border-slate-800 text-white relative shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Graphic Elements */}
              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-mono">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>LIVE CONCIERGE LOGISTICS</span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-slate-400 block font-mono">
                    ESTIMATED TRANSIT TIME
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white">
                    24 - 48 Hours
                  </div>
                  <p className="text-xs text-slate-300">
                    To Victoria Island, Ikoyi, Maitama Abuja, or Port Harcourt.
                  </p>
                </div>

                {/* Route visualization card */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-4 backdrop-blur-md">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      Lagos Showroom Hub
                    </span>
                    <span className="text-blue-400 font-mono font-semibold">Ready for Transit</span>
                  </div>

                  <div className="relative flex items-center justify-between">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 z-10" />
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-400 mx-2" />
                    <div className="w-3 h-3 rounded-full bg-blue-400 z-10 animate-ping" />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Ikoyi &bull; VI &bull; Abuja &bull; PH</span>
                    <span className="text-white font-mono font-bold">100% Insured</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 text-xs text-slate-300">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Full comprehensive marine & transit cargo insurance included.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Text & Feature Bullets */}
          <div className="lg:col-span-6 space-y-6">
            <div className="w-12 h-1 bg-red-600 rounded-full" />

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A0A0A] tracking-tight leading-tight">
              Delivered Across <br />
              <span className="text-blue-600">Nigeria & West Africa</span>
            </h2>

            <p className="text-sm text-[#64748B] leading-relaxed">
              We eliminate the stress of automotive transport. Whether you are expanding your collection in Lagos, Abuja, or across regional hubs, our dedicated enclosed carriers ensure your vehicle arrives in pristine, factory-fresh condition.
            </p>

            <div className="space-y-4 pt-2">
              {points.map((pt, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0A0A0A]">{pt.title}</h4>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{pt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
