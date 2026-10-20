"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#FAFAFA] border-t border-neutral-200 text-[#0A0A0A] overflow-hidden selection:bg-black selection:text-white">
      {/* Upper Footer: Tagline & Links */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-16 sm:pt-20 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Big Brand Statement & Contact */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-black leading-tight [text-wrap:balance]">
              Making your car-buying <br />
              <span className="text-neutral-500">experience transparent.</span>
            </h3>
            
            <p className="text-xs sm:text-sm text-neutral-600 max-w-md leading-relaxed font-sans">
              Founded on the principle of absolute clarity. From documented DME telemetry to enclosed 
              doorstep delivery across North America, we curate automotive perfection.
            </p>

            <div className="pt-2 space-y-2.5 text-xs font-mono text-neutral-700">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-black" />
                <a href="tel:+14482264666" className="font-bold hover:underline">
                  +1 448 226 4666
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-black" />
                <a href="mailto:concierge@astonautostores.com" className="hover:underline">
                  concierge@astonautostores.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-black" />
                <span>Miami Beach &bull; Beverly Hills &bull; Manhattan</span>
              </div>
            </div>
          </div>

          {/* Right Columns: 3 Navigation Lists */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 text-xs font-sans">
            
            {/* /Main Pages */}
            <div className="space-y-4">
              <span className="font-mono text-neutral-400 text-xs font-bold uppercase tracking-wider block">
                /Main Pages
              </span>
              <ul className="space-y-3 font-medium text-neutral-700">
                <li>
                  <Link href="/" className="hover:text-black transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/inventory" className="hover:text-black transition-colors">
                    Inventory
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-black transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-black transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-black transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* /Social */}
            <div className="space-y-4">
              <span className="font-mono text-neutral-400 text-xs font-bold uppercase tracking-wider block">
                /Social
              </span>
              <ul className="space-y-3 font-medium text-neutral-700">
                <li>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                    X (Twitter)
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                    YouTube
                  </a>
                </li>
              </ul>
            </div>

            {/* /Utility */}
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <span className="font-mono text-neutral-400 text-xs font-bold uppercase tracking-wider block">
                /Utility
              </span>
              <ul className="space-y-3 font-medium text-neutral-700">
                <li>
                  <Link href="/privacy" className="hover:text-black transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-black transition-colors">
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-black transition-colors">
                    Support Desk
                  </Link>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Legal Micro-Row */}
        <div className="mt-14 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <p>&copy; {new Date().getFullYear()} Aston Auto. All Rights Reserved.</p>
          <p>Curators of Extraordinary Motoring &bull; United States</p>
        </div>
      </div>

      {/* Massive Brand Wordmark in Monochrome Light Style */}
      <div className="relative w-full overflow-hidden select-none pointer-events-none -mb-4 sm:-mb-8 md:-mb-12">
        <h2 className="font-display font-black text-[clamp(4.5rem,18vw,19rem)] tracking-tighter text-center leading-none text-neutral-200/60 uppercase">
          Aston
        </h2>
      </div>
    </footer>
  );
}
