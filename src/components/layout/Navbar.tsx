"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Phone } from "lucide-react";
import { soundEngine } from "@/lib/sound";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Inventory", href: "/inventory" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* ─── Main Navbar (Light Monochrome floating at top) ─── */}
      <header
        className="absolute top-0 left-0 right-0 z-40 w-full py-6 md:py-8 px-6 sm:px-10 lg:px-16 bg-transparent"
        role="banner"
      >
        <div className="relative mx-auto w-full max-w-[1440px] flex items-center justify-between">
          
          {/* Left: Brand Logo from /logo.png */}
          <Link
            href="/"
            aria-label="Aston Auto Stores"
            className="group flex items-center focus:outline-none"
            onMouseEnter={() => soundEngine.playHoverTick()}
          >
            <div className="relative h-9 sm:h-11 w-auto flex items-center transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Aston Auto"
                width={180}
                height={100}
                priority
                className="h-8 sm:h-10 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
              />
            </div>
          </Link>

          {/* Center: 4-Dot Menu Trigger (2x2 Grid) */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <button
              onClick={() => {
                soundEngine.playHoverTick();
                setMenuOpen(!menuOpen);
              }}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              className="group p-3 -m-3 flex items-center justify-center rounded-lg transition-transform duration-200 hover:scale-125 focus:outline-none cursor-pointer"
            >
              <div className="grid grid-cols-2 gap-1.5 w-4 h-4 transition-transform duration-300 group-hover:rotate-90">
                <span className="w-1.5 h-1.5 rounded-full bg-black group-hover:bg-neutral-600 transition-colors duration-200" />
                <span className="w-1.5 h-1.5 rounded-full bg-black group-hover:bg-neutral-600 transition-colors duration-200" />
                <span className="w-1.5 h-1.5 rounded-full bg-black group-hover:bg-neutral-600 transition-colors duration-200" />
                <span className="w-1.5 h-1.5 rounded-full bg-black group-hover:bg-neutral-600 transition-colors duration-200" />
              </div>
            </button>
          </div>

          {/* Right: Direct Phone / Contact Link */}
          <div className="flex items-center gap-6">
            <a
              href="tel:+14482264666"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-mono font-medium text-neutral-600 hover:text-black transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-black" />
              <span>+1 448 226 4666</span>
            </a>

            <Link
              href="/contact"
              onMouseEnter={() => soundEngine.playHoverTick()}
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black hover:text-neutral-600 transition-colors duration-200 focus:outline-none"
            >
              Contact
            </Link>
          </div>

        </div>
      </header>

      {/* ─── Full-Screen Overlay Navigation (Ultra-Clean Light Monochrome) ─── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-white/98 backdrop-blur-2xl flex flex-col justify-between p-8 sm:p-12 lg:p-20 overflow-y-auto text-black"
          >
            {/* Top Bar inside Menu */}
            <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between">
              <span className="font-display text-xs uppercase tracking-[0.25em] text-neutral-500 font-bold">
                Aston Auto Navigation
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-neutral-600 hover:text-black transition-colors p-2 -mr-2 cursor-pointer"
              >
                <span>Close</span>
                <X className="w-4 h-4 text-black" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="w-full max-w-[1440px] mx-auto my-auto py-10">
              <nav className="flex flex-col space-y-4 sm:space-y-6">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.08 + i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        onMouseEnter={() => soundEngine.playHoverTick()}
                        className={`group inline-flex items-center gap-4 font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-6xl uppercase tracking-tight transition-all duration-300 ${
                          isActive
                            ? "text-black translate-x-3 font-black"
                            : "text-neutral-400 hover:text-black hover:translate-x-3"
                        }`}
                      >
                        <span>{link.label}</span>
                        <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-black" />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Footer Info */}
            <div className="w-full max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-neutral-200 text-neutral-600 text-xs uppercase tracking-widest font-mono">
              <div className="flex items-center gap-4">
                <span>Miami &bull; Los Angeles &bull; New York</span>
                <span className="text-neutral-400">|</span>
                <a href="tel:+14482264666" className="text-black font-semibold hover:underline">
                  +1 448 226 4666
                </a>
              </div>
              <div className="flex items-center gap-6">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">Instagram</a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">X</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">LinkedIn</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
