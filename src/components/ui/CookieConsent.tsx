"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { soundEngine } from "@/lib/sound";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("aston_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1500);
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
          <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-neutral-300 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] space-y-4 text-neutral-900">
            
            {/* Top row with icon & close */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-900 flex items-center justify-center shrink-0">
                  <Cookie className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-neutral-950 uppercase tracking-tight">
                    Cookie Preferences
                  </h4>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">
                    Privacy &amp; Data Control
                  </span>
                </div>
              </div>

              <button
                onClick={handleDecline}
                className="text-neutral-400 hover:text-neutral-900 transition-colors p-1 -mr-1"
                aria-label="Dismiss cookie banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-neutral-600 leading-relaxed">
              We use essential and analytics cookies to personalize your browsing experience and measure inventory engagement. Review our{" "}
              <Link href="/privacy" className="text-neutral-950 underline hover:text-neutral-600 transition-colors font-medium">
                Privacy Policy
              </Link>{" "}
              for complete details.
            </p>

            {/* Actions: Accept or Refuse */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={handleAccept}
                className="flex-1 py-2.5 px-4 rounded-lg bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                Accept All
              </button>

              <button
                onClick={handleDecline}
                className="flex-1 py-2.5 px-4 rounded-lg bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-medium text-xs uppercase tracking-wider active:scale-95 transition-all cursor-pointer"
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
