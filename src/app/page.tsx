import HeroCarCarousel from "@/components/home/HeroCarCarousel";
import BrandMarquee from "@/components/home/BrandMarquee";
import HomeInventoryGrid from "@/components/home/HomeInventoryGrid";
import HomeTrustPillars from "@/components/home/HomeTrustPillars";
import HomeContactBanner from "@/components/home/HomeContactBanner";
import { createPublicClient } from "@/lib/supabase/public";
import { Car } from "@/types/database";

export const revalidate = 60;

export const metadata = {
  title: "Aston | Premier Luxury & Exotic Automotive Dealership",
  description:
    "Explore our verified inventory of luxury, exotic, and performance vehicles. Nationwide enclosed delivery, clean titles, and certified inspection. Beverly Hills Showroom: +1 448 226 4666.",
};

export default async function HomePage() {
  const publicClient = createPublicClient();
  const { data: rawCars } = await publicClient
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });

  const cars: Car[] = (rawCars as Car[]) || [];
  const featuredCars = cars.filter((c) => c.is_featured);
  const carouselCars = featuredCars.length > 0 ? featuredCars : cars.slice(0, 5);

  return (
    <main className="flex flex-col w-full bg-white text-neutral-900">
      {/* 1. Hero: Car Carousel Slider */}
      <HeroCarCarousel cars={carouselCars} />

      {/* 2. Official Brand Logos Marquee */}
      <BrandMarquee />

      {/* 3. Dealership Inventory Grid (Filters, Search, USD Pricing) */}
      <HomeInventoryGrid initialCars={cars} />

      {/* 4. Trust Pillars (Inspection, Enclosed Delivery, CARFAX, Financing) */}
      <HomeTrustPillars />

      {/* 5. Contact & Consultation Banner */}
      <HomeContactBanner />
    </main>
  );
}
