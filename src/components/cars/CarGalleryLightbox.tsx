"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface CarGalleryLightboxProps {
  images: string[];
  carTitle: string;
}

export default function CarGalleryLightbox({ images, carTitle }: CarGalleryLightboxProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const total = images.length > 0 ? images.length : 1;

  const next = () => {
    setSelectedIdx((prev) => (prev + 1) % total);
  };

  const prev = () => {
    setSelectedIdx((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  return (
    <div className="space-y-4">
      {/* Primary Display */}
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#FAFAFA] border border-[#E8E8E8] group">
        <Image
          src={images[selectedIdx] || images[0]}
          alt={`${carTitle} view ${selectedIdx + 1}`}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 800px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
        />

        {/* Expand Lightbox Button */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          aria-label="Expand photo gallery"
          className="absolute bottom-4 right-4 p-2.5 rounded-lg bg-white/90 hover:bg-white text-[#0A0A0A] border border-[#E8E8E8] transition-opacity opacity-0 group-hover:opacity-100"
        >
          <Maximize2 className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border transition-all ${
                idx === selectedIdx
                  ? "border-[#0A0A0A] ring-1 ring-[#0A0A0A]"
                  : "border-[#E8E8E8] opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`Thumbnail ${idx + 1}`} fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 sm:p-8">
          <div className="w-full flex items-center justify-between text-white text-xs font-mono">
            <span>
              {carTitle} &bull; Image {selectedIdx + 1} of {total}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              <X className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>

          <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center">
            <Image
              src={images[selectedIdx]}
              alt={carTitle}
              fill
              className="object-contain"
            />
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={prev}
              className="p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
            </button>
            <span className="text-white text-xs font-mono">
              {selectedIdx + 1} / {total}
            </span>
            <button
              onClick={next}
              className="p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
