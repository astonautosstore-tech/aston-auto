"use client";

import React from "react";
import { ShieldCheck, Truck, FileCheck, DollarSign } from "lucide-react";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "150-Point Inspection",
    description: "Every exotic and luxury vehicle undergoes rigorous mechanical, electrical, and aesthetic certification.",
  },
  {
    icon: Truck,
    title: "Nationwide Enclosed Delivery",
    description: "White-glove climate-controlled carrier transport direct to your driveway anywhere across the United States.",
  },
  {
    icon: FileCheck,
    title: "Clean CARFAX & Title",
    description: "Verified ownership history, clean titles, authentic mileage, and complete documented service records.",
  },
  {
    icon: DollarSign,
    title: "Tailored US Financing",
    description: "Competitive prime rates, flexible lease-to-own programs, and streamlined digital application approvals.",
  },
];

export default function HomeTrustPillars() {
  return (
    <section className="w-full py-14 sm:py-16 bg-[#F9FAFB] border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col p-6 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4 shrink-0">
                  <Icon className="w-6 h-6 text-neutral-900" />
                </div>
                <h3 className="text-base font-bold text-neutral-950 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
