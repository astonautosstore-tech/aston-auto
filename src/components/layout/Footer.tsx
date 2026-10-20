"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import Container from "@/components/ui/Container";

const wordmark = "ASTON AUTO";

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <footer
      ref={ref}
      className="w-full bg-[#050505] text-white border-t border-white/10 relative overflow-hidden pt-20 sm:pt-28 pb-6 select-none"
      role="contentinfo"
    >
      <Container>
        {/* Top: Tagline (Left) & Nav Columns (Right) */}
        <div className="flex flex-col lg:flex-row items-start lg:items-start justify-between gap-12 lg:gap-16 pb-16 sm:pb-24">
          
          {/* Left: Tagline */}
          <div className="max-w-md sm:max-w-lg">
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-[2.6rem] uppercase tracking-tight text-white leading-[1.15]">
              Making your car-buying <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-[#8A8A8A]">
                experience transparent.
              </span>
            </h2>
          </div>

          {/* Right: 3 Nav Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-16 text-xs w-full lg:w-auto">
            
            {/* /Main Pages */}
            <div className="space-y-4">
              <span className="font-mono text-[#8A8A8A] text-xs font-medium block">
                /Main Pages
              </span>
              <ul className="space-y-3 font-medium">
                <li>
                  <Link href="/" className="text-white/80 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/inventory" className="text-white/80 hover:text-white transition-colors">
                    Inventory
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-white/80 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* /Social */}
            <div className="space-y-4">
              <span className="font-mono text-[#8A8A8A] text-xs font-medium block">
                /Social
              </span>
              <ul className="space-y-3 font-medium">
                <li>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white transition-colors">
                    X
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white transition-colors">
                    Linkedin
                  </a>
                </li>
                <li>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white transition-colors">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>

            {/* /Utility */}
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <span className="font-mono text-[#8A8A8A] text-xs font-medium block">
                /Utility
              </span>
              <ul className="space-y-3 font-medium">
                <li>
                  <Link href="/privacy" className="text-white/80 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-white/80 hover:text-white transition-colors">
                    Terms &amp; Conditions
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Middle: Copyright bar */}
        <div className="pt-8 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#777] font-mono">
          <span>&copy; {new Date().getFullYear()} Aston Auto. All rights reserved.</span>
          <span>West Africa &bull; North America &bull; Europe</span>
        </div>

        {/* Bottom: Giant Chrome Wordmark */}
        <div className="w-full overflow-hidden pt-4 pb-2 text-center pointer-events-none select-none">
          <div className="flex items-center justify-center overflow-hidden tracking-tighter">
            {wordmark.split("").map((letter, i) => (
              <motion.span
                key={i}
                initial={{ y: "80%", opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.03 * i + 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
                className="font-display font-black leading-none inline-block text-[14vw] sm:text-[15vw] drop-shadow-sm"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.02) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
