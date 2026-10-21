"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { Car } from "@/types/database";
import { formatUSD } from "@/lib/utils";

interface HomeFeaturedCarsProps {
  cars: Car[];
}

function getStatusBadge(status: Car["status"]) {
  switch (status) {
    case "available":
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
          Available
        </span>
      );
    case "reserved":
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
          Reserved
        </span>
      );
    case "sold":
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F5F5F5] text-[#525252] border border-[#E5E5E5]">
          Sold
        </span>
      );
    default:
      return null;
  }
}

export default function HomeFeaturedCars({ cars }: HomeFeaturedCarsProps) {
  if (!cars || cars.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-white border-t border-[#E8E8E8]">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block mb-2">
              Featured Selection
            </span>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#0A0A0A]">
              Currently on the Floor
            </h2>
          </div>
          <Link
            href="/inventory"
            className="group inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[#0A0A0A] hover:text-[#6B6B6B] transition-colors"
          >
            <span>View all inventory</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
        </div>

        {/* 3-column Grid (2 tablet, 1 mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {cars.map((car) => {
            const displayPrice = car.discount_price ?? car.price;
            return (
              <Link
                key={car.id}
                href={`/cars/${car.slug}`}
                className="group flex flex-col bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden transition-all duration-300 hover:border-[#D4D4D4] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
              >
                {/* Photo */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FAFAFA]">
                  {car.hero_image ? (
                    <Image
                      src={car.hero_image}
                      alt={`${car.year} ${car.title}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-[#6B6B6B]">
                      No Image
                    </div>
                  )}

                  {/* Top Status Badge */}
                  <div className="absolute top-3.5 left-3.5">
                    {getStatusBadge(car.status)}
                  </div>

                  {/* Thin View Arrow on hover */}
                  <div className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/90 backdrop-blur-sm text-[#0A0A0A] opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                    <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between text-xs text-[#6B6B6B] mb-1.5">
                    <span>{car.year} &bull; {car.brand}</span>
                    <span>{car.mileage ? `${car.mileage.toLocaleString()} mi` : "0 mi"}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-medium text-[#0A0A0A] line-clamp-1 mb-4">
                    {car.title}
                  </h3>

                  <div className="mt-auto pt-4 border-t border-[#E8E8E8] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#6B6B6B] block">
                        Price
                      </span>
                      <span className="text-lg font-medium text-[#0A0A0A]">
                        {formatUSD(displayPrice)}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-[#6B6B6B] group-hover:text-[#0A0A0A] transition-colors flex items-center gap-1">
                      View details
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
