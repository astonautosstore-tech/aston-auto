"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ShieldCheck } from "lucide-react";
import { soundEngine } from "@/lib/sound";

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const consent = localStorage.getItem("aston_cookie_consent");
    if (!consent) {
      // Show banner after brief delay
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    soundEngine.playHoverTick();
    localStorage.setItem("aston_cookie_consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    soundEngine.playHoverTick();
    localStorage.setItem("aston_cookie_consent", "declined");
    setVisible(false);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-auto sm:max-w-md z-[9999]"
          role="region"
          aria-label="Cookie consent banner"
        >
          <div className="relative rounded-2xl bg-[#0D0D0D]/95 backdrop-blur-2xl border border-white/15 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-4">
            
            {/* Top row with icon & close */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E10600]/15 text-[#E10600] flex items-center justify-center shrink-0">
                  <Cookie className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white uppercase tracking-tight">
                    Cookie Preferences
                  </h4>
                  <span className="text-[10px] font-mono text-[#8A8A8A] uppercase">
                    Privacy &amp; Data Control
                  </span>
                </div>
              </div>

              <button
                onClick={handleDecline}
                className="text-[#8A8A8A] hover:text-white transition-colors p-1 -mr-1"
                aria-label="Dismiss cookie banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              We use essential and analytics cookies to personalize your supercar browsing experience, remember your favorite vehicles, and measure gallery engagement. Review our{" "}
              <Link href="/privacy" className="text-white underline hover:text-[#E10600] transition-colors">
                Privacy Policy
              </Link>{" "}
              for complete details.
            </p>

            {/* Actions: Accept or Refuse */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={handleAccept}
                className="flex-1 py-2.5 px-4 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 active:scale-95 transition-all cursor-pointer shadow-md"
              >
                Accept All
              </button>

              <button
                onClick={handleDecline}
                className="flex-1 py-2.5 px-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 hover:text-white font-medium text-xs uppercase tracking-wider active:scale-95 transition-all cursor-pointer"
              >
                Refuse
              </button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
