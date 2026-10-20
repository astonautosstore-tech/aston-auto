"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { soundEngine } from "@/lib/sound";

interface CarGalleryLightboxProps {
  images: string[];
  carTitle: string;
}

export default function CarGalleryLightbox({ images, carTitle }: CarGalleryLightboxProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const total = images.length > 0 ? images.length : 1;

  const next = () => {
    soundEngine.playHoverTick();
    setSelectedIdx((prev) => (prev + 1) % total);
  };

  const prev = () => {
    soundEngine.playHoverTick();
    setSelectedIdx((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  return (
    <div className="space-y-4">
      {/* Primary Display */}
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100 border border-[#E4E4E7] group shadow-sm">
        <Image
          src={images[selectedIdx] || images[0]}
          alt={`${carTitle} view ${selectedIdx + 1}`}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 800px"
          className="object-cover"
        />

        {/* Expand Lightbox Button */}
        <button
          onClick={() => {
            soundEngine.playHoverTick();
            setIsLightboxOpen(true);
          }}
          aria-label="Expand photo gallery"
          className="absolute bottom-4 right-4 p-3 rounded-full bg-white/90 hover:bg-white text-[#0A0A0A] backdrop-blur-md shadow-md transition-all cursor-pointer opacity-0 group-hover:opacity-100"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                soundEngine.playHoverTick();
                setSelectedIdx(idx);
              }}
              className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                idx === selectedIdx
                  ? "border-[#0D5C3A] scale-102 shadow-sm"
                  : "border-[#E4E4E7] opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100000] bg-black/95 flex flex-col items-center justify-between p-4 sm:p-8">
          {/* Top Bar */}
          <div className="w-full flex items-center justify-between text-white text-xs font-mono">
            <span>
              {carTitle} &bull; Image {selectedIdx + 1} of {total}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Enlarged Image */}
          <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center">
            <Image
              src={images[selectedIdx]}
              alt={carTitle}
              fill
              className="object-contain"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            <button
              onClick={prev}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="text-white text-xs font-mono">
              {selectedIdx + 1} / {total}
            </span>
            <button
              onClick={next}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
