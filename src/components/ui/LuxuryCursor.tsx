"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function LuxuryCursor() {
  const [cursorText, setCursorText] = useState("");
  const [cursorVariant, setCursorVariant] = useState<"default" | "hover" | "action">("default");
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 400, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on fine pointer devices (desktop)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const onPointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("a, button, [role='button'], input, select, textarea");
      const customCursorEl = target.closest("[data-cursor]") as HTMLElement | null;

      if (customCursorEl) {
        const text = customCursorEl.getAttribute("data-cursor") || "";
        setCursorText(text);
        setCursorVariant("action");
      } else if (interactive) {
        setCursorText("");
        setCursorVariant("hover");
      } else {
        setCursorText("");
        setCursorVariant("default");
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseover", onPointerOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseover", onPointerOver);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  const variants = {
    default: {
      width: 12,
      height: 12,
      backgroundColor: "#0d5c3a",
      border: "1px solid rgba(13, 92, 58, 0.4)",
    },
    hover: {
      width: 44,
      height: 44,
      backgroundColor: "rgba(13, 92, 58, 0.12)",
      border: "1.5px solid rgba(13, 92, 58, 0.6)",
      backdropFilter: "blur(2px)",
    },
    action: {
      width: 80,
      height: 80,
      backgroundColor: "#0a0a0a",
      color: "#ffffff",
      border: "none",
    },
  };

  return (
    <motion.div
      className="pointer-events-none fixed z-[9999] hidden -translate-x-1/2 -translate-y-1/2 rounded-full lg:flex items-center justify-center font-mono text-[10px] tracking-wider uppercase"
      style={{
        left: smoothX,
        top: smoothY,
      }}
      animate={cursorVariant}
      variants={variants}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {cursorText && (
        <span className="text-white text-center font-sans font-semibold px-2 leading-none">
          {cursorText}
        </span>
      )}
    </motion.div>
  );
}
