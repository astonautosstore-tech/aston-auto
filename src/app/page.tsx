import HeroCinematic from "@/components/home/HeroCinematic";
import BrandMarquee from "@/components/home/BrandMarquee";
import BrandStatement from "@/components/home/BrandStatement";
import ShowroomSplit from "@/components/home/ShowroomSplit";
import StackedFeaturedCars from "@/components/home/StackedFeaturedCars";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import PromoCards from "@/components/home/PromoCards";
import PeopleBehindUs from "@/components/home/PeopleBehindUs";
import FutureOnDisplay from "@/components/home/FutureOnDisplay";
import FaqSection from "@/components/home/FaqSection";
import NewsArticles from "@/components/home/NewsArticles";
import ClosingCta from "@/components/home/ClosingCta";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-[#050505]">
      {/* 1. Hero */}
      <HeroCinematic />

      {/* 2. Brand Logo Marquee */}
      <BrandMarquee />

      {/* 3. Brand Statement + Stats */}
      <BrandStatement />

      {/* 4. More Than a Showroom split */}
      <ShowroomSplit />

      {/* 5. Stacked Featured Cars */}
      <StackedFeaturedCars />

      {/* 6. Why Choose Us */}
      <WhyChooseUs />

      {/* 7. Testimonials */}
      <Testimonials />

      {/* 8. Promo Cards (Red sale + Financing) */}
      <PromoCards />

      {/* 9. People Behind Us */}
      <PeopleBehindUs />

      {/* 10. Future on Display Gallery */}
      <FutureOnDisplay />

      {/* 11. FAQ */}
      <FaqSection />

      {/* 12. News & Articles */}
      <NewsArticles />

      {/* 13. Closing CTA */}
      <ClosingCta />
    </div>
  );
}
