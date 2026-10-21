import { createPublicClient } from "@/lib/supabase/public";
import { Car, Comment } from "@/types/database";
import HomeHero from "@/components/home/HomeHero";
import HomeFeaturedCars from "@/components/home/HomeFeaturedCars";
import HomeBrandStatement from "@/components/home/HomeBrandStatement";
import HomeWhyChooseUs from "@/components/home/HomeWhyChooseUs";
import HomeHowItWorks from "@/components/home/HomeHowItWorks";
import HomeFinancingBanner from "@/components/home/HomeFinancingBanner";
import HomeReviews from "@/components/home/HomeReviews";
import HomeFaq from "@/components/home/HomeFaq";
import HomeContactCta from "@/components/home/HomeContactCta";

export const revalidate = 60;

export const metadata = {
  title: "Aston Auto Stores | Curated Automotive Dealership",
  description:
    "Curated collection of performance, luxury, and exotic motorcars. Transparent pricing, nationwide delivery, and dedicated client service in the United States.",
};

export default async function HomePage() {
  const publicClient = createPublicClient();

  // 1. Fetch cars from Supabase
  const { data: rawCars } = await publicClient
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });

  const cars: Car[] = (rawCars as Car[]) || [];

  // Filter featured cars (up to 6); if none are featured, use 6 newest
  const featuredCars = cars.filter((c) => c.is_featured);
  const displayCars = (featuredCars.length > 0 ? featuredCars : cars).slice(0, 6);

  // Newest featured car for hero (or newest car if none featured)
  const heroCar = featuredCars.length > 0 ? featuredCars[0] : cars[0] || null;

  // 2. Fetch approved reviews from comments table
  const { data: rawComments } = await publicClient
    .from("comments")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(6);

  const reviews: Comment[] = (rawComments as Comment[]) || [];

  return (
    <div className="flex flex-col w-full bg-white text-[#0A0A0A]">
      {/* 2. Hero */}
      <HomeHero heroCar={heroCar} />

      {/* 3. Featured Cars */}
      <HomeFeaturedCars cars={displayCars} />

      {/* 4. Brand Statement with 3 Counter Stats */}
      <HomeBrandStatement />

      {/* 5. Why Choose Us */}
      <HomeWhyChooseUs />

      {/* 6. How It Works (4 numbered steps) */}
      <HomeHowItWorks />

      {/* 7. Financing Banner */}
      <HomeFinancingBanner />

      {/* 8. Reviews (approved only, hidden if none) */}
      <HomeReviews reviews={reviews} />

      {/* 9. FAQ Accordion */}
      <HomeFaq />

      {/* 10. Contact CTA */}
      <HomeContactCta />
    </div>
  );
}
