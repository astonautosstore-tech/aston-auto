import { Star } from "lucide-react";
import Container from "@/components/ui/Container";
import { Comment } from "@/types/database";

interface HomeReviewsProps {
  reviews?: Comment[];
}

export default function HomeReviews({ reviews = [] }: HomeReviewsProps) {
  // If there are no approved reviews, completely hide the section (do not invent testimonials)
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 bg-[#FAFAFA] border-t border-[#E8E8E8]">
      <Container>
        <div className="max-w-2xl mb-14">
          <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block mb-3">
            Client Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#0A0A0A]">
            Verified Client Reviews
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-white rounded-2xl border border-[#E8E8E8] flex flex-col justify-between"
            >
              <div>
                {/* Star rating */}
                <div className="flex items-center gap-1 mb-4 text-[#0A0A0A]">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" strokeWidth={1} />
                  ))}
                </div>
                <p className="text-sm text-[#0A0A0A] leading-relaxed line-clamp-4 mb-6">
                  &ldquo;{rev.body}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8E8E8] flex items-center justify-between text-xs text-[#6B6B6B]">
                <span className="font-medium text-[#0A0A0A]">{rev.user_name || "Client"}</span>
                <span>{new Date(rev.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
