import HeroCarCarousel from "@/components/home/HeroCarCarousel";
import BrandMarquee from "@/components/home/BrandMarquee";
import HomeInventoryGrid from "@/components/home/HomeInventoryGrid";
import HomeTrustPillars from "@/components/home/HomeTrustPillars";
import HomeContactBanner from "@/components/home/HomeContactBanner";

export const metadata = {
  title: "Aston | Premier Luxury & Exotic Automotive Dealership",
  description:
    "Explore our verified inventory of luxury, exotic, and performance vehicles. Nationwide enclosed delivery, clean titles, and tailored financing. Contact our Beverly Hills showroom at +1 448 226 4666.",
};

export default function HomePage() {
  return (
    <main className="flex flex-col w-full bg-white text-neutral-900">
      {/* 1. Hero: Car Carousel Slider */}
      <HeroCarCarousel />

      {/* 2. Official Brand Logos Marquee */}
      <BrandMarquee />

      {/* 3. Dealership Inventory Grid (Filters, Search, USD Pricing) */}
      <HomeInventoryGrid />

      {/* 4. Trust Pillars (Inspection, Enclosed Delivery, CARFAX, Financing) */}
      <HomeTrustPillars />

      {/* 5. Contact & Consultation Banner */}
      <HomeContactBanner />
    </main>
  );
}
