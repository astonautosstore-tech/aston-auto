"use client";

import React from "react";
import Link from "next/link";
import { Phone, Calendar, MessageSquare, MapPin } from "lucide-react";

export default function HomeContactBanner() {
  return (
    <section className="w-full py-14 sm:py-16 bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-neutral-900 border border-neutral-800 rounded-2xl p-8 sm:p-10 shadow-xl">
          {/* Left Info */}
          <div className="flex flex-col max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
              <MapPin className="w-3.5 h-3.5 text-neutral-300" />
              Beverly Hills • Miami • New York
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Looking for a Specific Model or Custom Build?
            </h2>

            <p className="text-sm text-neutral-400 leading-relaxed">
              Our concierge team specializes in bespoke vehicle acquisitions, trade-ins, and door-to-door enclosed transport. Connect with our advisors today.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <a
              href="tel:+14482264666"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white text-neutral-950 font-bold text-sm rounded-xl hover:bg-neutral-100 transition-colors shadow-md"
            >
              <Phone className="w-4 h-4" />
              <span>+1 448 226 4666</span>
            </a>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm rounded-xl border border-neutral-700 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>

            <a
              href="https://wa.me/14482264666?text=Hello%2C%20I%20am%20interested%20in%20inquring%20about%20a%20vehicle%20at%20Aston."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm rounded-xl border border-neutral-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
