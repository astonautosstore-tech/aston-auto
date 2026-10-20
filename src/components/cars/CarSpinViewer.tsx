"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { RotateCw, MoveHorizontal, Compass } from "lucide-react";
import { soundEngine } from "@/lib/sound";

interface CarSpinViewerProps {
  images: string[];
  carTitle: string;
}

export default function CarSpinViewer({ images, carTitle }: CarSpinViewerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number>(0);
  const activeIdxRef = useRef<number>(0);

  const totalFrames = images.length > 0 ? images.length : 1;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    activeIdxRef.current = currentIdx;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    const threshold = 40; // Pixels per frame shift
    const frameShift = Math.floor(deltaX / threshold);
    const newIdx = (activeIdxRef.current - frameShift) % totalFrames;
    const normalizedIdx = newIdx < 0 ? totalFrames + newIdx : newIdx;
    setCurrentIdx(normalizedIdx);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const stepForward = () => {
    soundEngine.playHoverTick();
    setCurrentIdx((prev) => (prev + 1) % totalFrames);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-[#E4E4E7] shadow-xl select-none group">
      {/* 360 View Indicator */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 text-[11px] font-mono uppercase tracking-wider">
        <RotateCw className="w-3.5 h-3.5 text-[#C5A059] animate-spin [animation-duration:8s]" />
        <span>Interactive 360&deg; Studio Orbit</span>
      </div>

      {/* Frame Counter Angle */}
      <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 text-[10px] font-mono">
        Perspective {currentIdx + 1} / {totalFrames}
      </div>

      {/* Drag Canvas */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        data-cursor="DRAG"
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] cursor-grab active:cursor-grabbing"
      >
        <Image
          src={images[currentIdx] || images[0]}
          alt={`${carTitle} angle ${currentIdx + 1}`}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Bottom Orbit Control Bar */}
      <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 text-white text-xs font-mono bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/20">
          <MoveHorizontal className="w-4 h-4 text-[#C5A059]" />
          <span>Click & Drag to Rotate</span>
        </div>

        <button
          onClick={stepForward}
          aria-label="Rotate frame"
          className="btn-luxury-primary text-xs py-2 px-4 rounded-full bg-white text-black hover:bg-[#0D5C3A] hover:text-white"
        >
          <span>Next Angle</span>
        </button>
      </div>
    </div>
  );
}
