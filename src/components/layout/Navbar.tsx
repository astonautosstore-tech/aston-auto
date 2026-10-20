"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
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
      {/* ─── Main Navbar (Not fixed: sits absolute at top of page) ─── */}
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
                className="h-8 sm:h-10 w-auto object-contain brightness-0 invert drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]"
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
              className="group p-3 -m-3 flex items-center justify-center rounded-lg transition-transform duration-200 hover:scale-125 focus:outline-none"
            >
              <div className="grid grid-cols-2 gap-1.5 w-4 h-4 transition-transform duration-300 group-hover:rotate-90">
                <span className="w-1.5 h-1.5 rounded-full bg-white group-hover:bg-[#E10600] transition-colors duration-200" />
                <span className="w-1.5 h-1.5 rounded-full bg-white group-hover:bg-[#E10600] transition-colors duration-200" />
                <span className="w-1.5 h-1.5 rounded-full bg-white group-hover:bg-[#E10600] transition-colors duration-200" />
                <span className="w-1.5 h-1.5 rounded-full bg-white group-hover:bg-[#E10600] transition-colors duration-200" />
              </div>
            </button>
          </div>

          {/* Right: Contact Link */}
          <Link
            href="/contact"
            onMouseEnter={() => soundEngine.playHoverTick()}
            className="text-sm font-medium text-white/90 hover:text-white transition-colors duration-200 tracking-wide focus:outline-none"
          >
            Contact
          </Link>

        </div>
      </header>

      {/* ─── Full-Screen Overlay Navigation (Opened by 4-dot design) ─── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[#050505]/98 backdrop-blur-2xl flex flex-col justify-between p-8 sm:p-12 lg:p-20 overflow-y-auto"
          >
            {/* Top Bar inside Menu */}
            <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between">
              <span className="font-display text-xs uppercase tracking-[0.25em] text-[#8A8A8A]">
                Aston Auto Navigation
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#8A8A8A] hover:text-white transition-colors p-2 -mr-2"
              >
                <span>Close</span>
                <X className="w-4 h-4 text-[#E10600]" />
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
                      transition={{ delay: 0.1 + i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        onMouseEnter={() => soundEngine.playHoverTick()}
                        className={`group inline-flex items-center gap-4 font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-6xl uppercase tracking-tight transition-all duration-300 ${
                          isActive
                            ? "text-[#E10600] translate-x-3"
                            : "text-white/80 hover:text-white hover:translate-x-3"
                        }`}
                      >
                        <span>{link.label}</span>
                        <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#E10600]" />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Quick Access Badges (Wishlist & Cart) */}
              
            </div>

            {/* Bottom Footer Info */}
            <div className="w-full max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-white/10 text-[#8A8A8A] text-xs uppercase tracking-widest font-mono">
              <span>Lagos &bull; Abuja &bull; London</span>
              <div className="flex items-center gap-6">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">X</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
