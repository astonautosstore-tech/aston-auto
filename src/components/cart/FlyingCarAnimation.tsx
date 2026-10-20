"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store/useStore";

export default function FlyingCarAnimation() {
  const { flyingCarAnimation, resetFlyingAnimation } = useStore();
  const [targetRect, setTargetRect] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!flyingCarAnimation?.active) return;

    // Locate the navbar cart button
    const cartButton = document.getElementById("navbar-cart-trigger");
    if (cartButton) {
      const rect = cartButton.getBoundingClientRect();
      setTargetRect({ top: rect.top + 10, left: rect.left + 10 });
    } else {
      // Default fallback top-right
      setTargetRect({ top: 20, left: window.innerWidth - 60 });
    }

    const timer = setTimeout(() => {
      resetFlyingAnimation();
    }, 900);

    return () => clearTimeout(timer);
  }, [flyingCarAnimation, resetFlyingAnimation]);

  if (!flyingCarAnimation?.active || !flyingCarAnimation.startRect || !targetRect) {
    return null;
  }

  const { startRect, imageUrl } = flyingCarAnimation;

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          top: startRect.top,
          left: startRect.left,
          width: Math.min(startRect.width, 240),
          height: Math.min(startRect.height, 140),
          opacity: 1,
          scale: 1,
          rotate: 0,
        }}
        animate={{
          top: targetRect.top,
          left: targetRect.left,
          width: 24,
          height: 24,
          opacity: 0.1,
          scale: 0.1,
          rotate: 15,
        }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="pointer-events-none fixed z-[99999] rounded-lg overflow-hidden shadow-2xl border border-[#0D5C3A]/50 bg-white"
      >
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="Adding to cart" className="w-full h-full object-cover" />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
