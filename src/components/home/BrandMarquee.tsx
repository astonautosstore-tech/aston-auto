"use client";

import React from "react";

interface BrandItem {
  name: string;
  svg: React.ReactNode;
}

const BRANDS: BrandItem[] = [
  {
    name: "Aston Martin",
    svg: (
      <svg viewBox="0 0 100 32" className="h-6 sm:h-7 w-auto fill-current text-white/70 group-hover:text-white transition-colors">
        {/* Aston Martin Wings */}
        <path d="M50 8C38 8 26 12 10 18C15 17 22 15 32 15C22 17 14 21 2 24C12 22 24 20 38 19C28 22 20 25 12 28C24 25 38 23 50 23C62 23 76 25 88 28C80 25 72 22 62 19C76 20 88 22 98 24C86 21 78 17 68 15C78 15 85 17 90 18C74 12 62 8 50 8Z" opacity="0.9" />
        <rect x="36" y="13" width="28" height="6" rx="2" fill="currentColor" />
        <text x="50" y="17.5" textAnchor="middle" fontSize="3.5" fontWeight="900" fill="#000" letterSpacing="0.6">ASTON MARTIN</text>
      </svg>
    ),
  },
  {
    name: "Ferrari",
    svg: (
      <svg viewBox="0 0 32 32" className="h-7 sm:h-8 w-auto fill-current text-white/70 group-hover:text-[#E10600] transition-colors">
        {/* Ferrari Prancing Horse silhouette */}
        <path d="M19.5 4.5C19.2 4.8 18.5 5.5 18.5 6C18.5 6.4 19 6.8 19.3 7.2C19.8 7.8 19.8 8.6 19.4 9.3C18.8 10.3 17.6 11 16.5 11.2C15.8 11.3 15.2 11.1 14.5 11.4C13.8 11.7 13.5 12.3 13.2 13C12.8 14 12.5 15.2 12.8 16.2C13.1 17.2 13.9 17.8 14.5 18.6C15 19.3 15.2 20.3 14.8 21.2C14.4 22 13.6 22.5 12.8 23C12 23.5 11.1 24.1 10.5 25C9.8 26 9.5 27.2 9.2 28.5H11.5C12 27.2 12.8 26.2 13.8 25.4C14.8 24.6 15.8 24 16.8 23.2C17.8 22.4 18.4 21.2 18.7 20C19 18.8 18.8 17.5 18.5 16.3C18.2 15.2 18.2 14.1 18.8 13.1C19.3 12.2 20.2 11.6 20.8 10.7C21.4 9.8 21.5 8.7 21.2 7.7C20.9 6.7 20.2 5.8 19.5 4.5Z" />
      </svg>
    ),
  },
  {
    name: "Porsche",
    svg: (
      <svg viewBox="0 0 32 32" className="h-7 sm:h-8 w-auto fill-none stroke-current text-white/70 group-hover:text-white transition-colors" strokeWidth="1.5">
        {/* Porsche Shield Crest */}
        <path d="M7 6H25C25 6 24.5 17 21 22C18.5 25.5 16 27.5 16 27.5C16 27.5 13.5 25.5 11 22C7.5 17 7 6 7 6Z" fill="currentColor" fillOpacity="0.1" />
        <line x1="16" y1="6" x2="16" y2="27" />
        <line x1="7" y1="14" x2="25" y2="14" />
        <circle cx="16" cy="15.5" r="3.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Rolls-Royce",
    svg: (
      <svg viewBox="0 0 32 32" className="h-7 sm:h-8 w-auto fill-current text-white/70 group-hover:text-white transition-colors">
        {/* Rolls-Royce Monogram */}
        <rect x="5" y="4" width="22" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 9H17C18.5 9 19.5 9.8 19.5 11.2C19.5 12.4 18.7 13.1 17.5 13.3L20 18H17.8L15.6 13.8H13.8V18H12V9ZM13.8 10.5V12.3H16.8C17.4 12.3 17.8 11.9 17.8 11.4C17.8 10.9 17.4 10.5 16.8 10.5H13.8Z" />
        <path d="M15 13H20C21.5 13 22.5 13.8 22.5 15.2C22.5 16.4 21.7 17.1 20.5 17.3L23 22H20.8L18.6 17.8H16.8V22H15V13ZM16.8 14.5V16.3H19.8C20.4 16.3 20.8 15.9 20.8 15.4C20.8 14.9 20.4 14.5 19.8 14.5H16.8Z" opacity="0.65" />
      </svg>
    ),
  },
  {
    name: "Lamborghini",
    svg: (
      <svg viewBox="0 0 32 32" className="h-7 sm:h-8 w-auto fill-none stroke-current text-white/70 group-hover:text-white transition-colors" strokeWidth="1.5">
        {/* Lamborghini Shield */}
        <path d="M16 4L26 8V18C26 23 16 28 16 28C16 28 6 23 6 18V8L16 4Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M12 17C13 15 15 14 17 14C19 14 20 15 21 17L19 18C18 17 17 16.5 16 16.5C15 16.5 14 17 13 18L12 17Z" fill="currentColor" stroke="none" />
        <circle cx="16" cy="14" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "Bentley",
    svg: (
      <svg viewBox="0 0 64 28" className="h-6 sm:h-7 w-auto fill-current text-white/70 group-hover:text-white transition-colors">
        {/* Bentley Wings + B */}
        <path d="M32 7C22 7 12 10 2 15C8 14 15 13 22 13C14 15 7 18 0 21C10 19 20 17 30 16L32 16L34 16C44 17 54 19 64 21C57 18 50 15 42 13C49 13 56 14 62 15C52 10 42 7 32 7Z" />
        <circle cx="32" cy="16" r="6" fill="#000" stroke="currentColor" strokeWidth="1.5" />
        <text x="32" y="19" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor" fontFamily="serif">B</text>
      </svg>
    ),
  },
  {
    name: "McLaren",
    svg: (
      <svg viewBox="0 0 36 24" className="h-5 sm:h-6 w-auto fill-current text-white/70 group-hover:text-[#E10600] transition-colors">
        {/* McLaren Speedmark Chevron */}
        <path d="M34 18C24 16 12 10 2 2C8 6 18 10 26 11C20 8 14 5 8 2C18 7 28 12 34 18Z" />
        <path d="M26 11C30 13 34 15 36 18C33 17 29 15 26 11Z" opacity="0.7" />
      </svg>
    ),
  },
  {
    name: "Mercedes-Benz",
    svg: (
      <svg viewBox="0 0 32 32" className="h-7 sm:h-8 w-auto fill-none stroke-current text-white/70 group-hover:text-white transition-colors" strokeWidth="1.5">
        {/* Mercedes 3-pointed Star */}
        <circle cx="16" cy="16" r="13" />
        <line x1="16" y1="16" x2="16" y2="3.5" />
        <line x1="16" y1="16" x2="5.5" y2="22.5" />
        <line x1="16" y1="16" x2="26.5" y2="22.5" />
      </svg>
    ),
  },
  {
    name: "BMW",
    svg: (
      <svg viewBox="0 0 32 32" className="h-7 sm:h-8 w-auto fill-none stroke-current text-white/70 group-hover:text-white transition-colors" strokeWidth="1.5">
        {/* BMW Roundel */}
        <circle cx="16" cy="16" r="13" />
        <circle cx="16" cy="16" r="8.5" />
        <path d="M16 7.5V24.5" />
        <path d="M7.5 16H24.5" />
        <path d="M16 7.5A8.5 8.5 0 0 1 24.5 16H16Z" fill="currentColor" fillOpacity="0.4" stroke="none" />
        <path d="M7.5 16A8.5 8.5 0 0 1 16 24.5V16Z" fill="currentColor" fillOpacity="0.4" stroke="none" />
      </svg>
    ),
  },
  {
    name: "Bugatti",
    svg: (
      <svg viewBox="0 0 40 24" className="h-6 sm:h-7 w-auto fill-current text-white/70 group-hover:text-[#E10600] transition-colors">
        {/* Bugatti Oval & EB */}
        <ellipse cx="20" cy="12" rx="19" ry="10.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <text x="20" y="15" textAnchor="middle" fontSize="9" fontWeight="900" fill="currentColor" letterSpacing="1">EB</text>
      </svg>
    ),
  },
];

const ALL = [...BRANDS, ...BRANDS];

export default function BrandMarquee() {
  return (
    <div className="relative py-10 sm:py-14 border-y border-white/[0.08] bg-[#070707] overflow-hidden marquee-fade my-4">
      <div className="marquee-track flex items-center">
        {ALL.map((brand, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-8 sm:px-12 shrink-0 group transition-all cursor-default"
          >
            <div className="flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
              {brand.svg}
            </div>
            <span className="text-xs sm:text-sm uppercase tracking-[0.25em] font-medium text-white/50 group-hover:text-white whitespace-nowrap transition-colors">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
