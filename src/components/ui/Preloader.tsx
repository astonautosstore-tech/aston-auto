"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only show once per session for lightning fast subsequent navigation
    const hasLoaded = sessionStorage.getItem("aston_preloader_seen");
    if (hasLoaded) {
      setLoading(false);
      return;
    }

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setLoading(false);
            sessionStorage.setItem("aston_preloader_seen", "true");
          }, 400);
          return 100;
        }
        return prev + 4;
      });
    }, 28);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
          exit={{
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-between bg-[#0A0A0A] text-white p-8 md:p-16 select-none"
        >
          {/* Top Tagline */}
          <div className="w-full flex items-center justify-between text-xs tracking-[0.25em] text-neutral-400 uppercase font-sans">
            <span>Aston Auto Stores</span>
            <span>Lagos &bull; London &bull; Dubai</span>
          </div>

          {/* Central Logo & Monogram */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-10 h-10 border border-[#0D5C3A] rounded-full flex items-center justify-center bg-[#0D5C3A]/20">
                <span className="font-serif font-bold text-lg text-[#C5A059]">A</span>
              </div>
              <span className="font-sans font-semibold tracking-[0.3em] text-2xl uppercase">
                ASTON AUTO
              </span>
            </motion.div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#C5A059]">
              Curators of Extraordinary Motoring
            </p>
          </div>

          {/* Bottom Progress Bar & Percentage */}
          <div className="w-full max-w-md flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
              <span>PREPARING SHOWROOM</span>
              <span>{progress}%</span>
            </div>
            <div className="h-[2px] w-full bg-neutral-800 overflow-hidden relative rounded-full">
              <motion.div
                className="h-full bg-gradient-to-r from-[#0D5C3A] via-[#C5A059] to-[#0D5C3A]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
