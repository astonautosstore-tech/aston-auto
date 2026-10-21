"use client";

import { useState } from "react";
import { z } from "zod";
import { Star, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { Comment } from "@/types/database";
import { storeApi } from "@/lib/supabase/client";

const reviewSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters"),
  rating: z.number().int().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
  comment: z.string().trim().min(5, "Review must be at least 5 characters").max(1000, "Review cannot exceed 1,000 characters"),
  honeypot: z.string().max(0, "Bot submission detected"),
});

interface CarReviewsProps {
  carId: string;
  initialComments?: Comment[];
}

const COOLDOWN_KEY = "aston_review_cooldown_timestamp";
const COOLDOWN_SECONDS = 60;

export default function CarReviews({ carId, initialComments = [] }: CarReviewsProps) {
  const [comments] = useState<Comment[]>(initialComments);
  const [rating, setRating] = useState<number>(5);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const averageRating =
    comments.length > 0
      ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
      : "5.0";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // 1. Check 60-second cooldown
    if (typeof window !== "undefined") {
      const lastSubmit = localStorage.getItem(COOLDOWN_KEY);
      if (lastSubmit) {
        const elapsed = Math.floor((Date.now() - parseInt(lastSubmit, 10)) / 1000);
        if (elapsed < COOLDOWN_SECONDS) {
          setErrorMessage(`Please wait ${COOLDOWN_SECONDS - elapsed}s before submitting another review.`);
          return;
        }
      }
    }

    // 2. Validate with Zod
    const validation = reviewSchema.safeParse({
      name,
      rating,
      comment: body,
      honeypot,
    });

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Invalid review data.";
      setErrorMessage(firstError);
      return;
    }

    setSubmitting(true);

    try {
      // 3. Insert row with status 'pending' WITHOUT .select()
      await storeApi.addComment({
        car_id: carId,
        user_name: name.trim(),
        rating,
        body: body.trim(),
      });

      if (typeof window !== "undefined") {
        localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
      }

      setSubmitted(true);
      setName("");
      setBody("");
    } catch (err: unknown) {
      console.error("Error submitting review:", err);
      const msg = err instanceof Error ? err.message : "Unable to submit review. Please try again.";
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block mb-2">
            Client Feedback
          </span>
          <h3 className="text-2xl font-medium tracking-tight text-[#0A0A0A]">
            Vehicle Reviews &amp; Impressions
          </h3>
        </div>

        <div className="flex items-center gap-2.5 bg-[#FAFAFA] px-3.5 py-2 rounded-lg border border-[#E8E8E8]">
          <div className="flex text-[#0A0A0A]">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= Math.round(Number(averageRating))
                    ? "fill-amber-500 text-amber-500"
                    : "text-neutral-300"
                }`}
              />
            ))}
          </div>
          <span className="font-bold text-sm text-neutral-950">{averageRating} / 5.0</span>
          <span className="text-xs text-neutral-400">({comments.length} verified)</span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4 mb-10">
        {comments.length === 0 ? (
          <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-neutral-200 text-neutral-500 text-xs sm:text-sm">
            Be the first connoisseur to review this vehicle upon viewing.
          </div>
        ) : (
          comments.map((rev) => (
            <div
              key={rev.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-neutral-950">{rev.user_name}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Acquisition
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {new Date(rev.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating ? "fill-amber-500 text-amber-500" : "text-neutral-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-sans">{rev.body}</p>

              {rev.admin_reply && (
                <div className="mt-3 pl-4 border-l-2 border-neutral-950 bg-neutral-50 p-3 rounded-r-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-900 block font-mono">
                    Aston Concierge Response:
                  </span>
                  <p className="text-xs text-neutral-600 italic leading-relaxed">{rev.admin_reply}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Review Submission Form */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#FAFAFA] border border-[#E8E8E8]">
        {submitted ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" strokeWidth={1.5} />
            <h4 className="text-base font-medium text-[#0A0A0A]">
              Thank you. Your review has been submitted for verification.
            </h4>
            <p className="text-xs text-[#6B6B6B] max-w-sm mx-auto">
              Our moderation desk reviews submissions to ensure authentic verified feedback before publication.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#6B6B6B] block mb-1">
                Client Feedback
              </span>
              <h4 className="text-lg font-medium text-[#0A0A0A]">
                Submit a Review
              </h4>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Honeypot field (hidden from real users) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website_hp">Do not fill this</label>
              <input
                id="website_hp"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Rating Selector */}
            <div>
              <label className="block text-xs text-[#6B6B6B] mb-1.5">
                Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-0.5 text-[#0A0A0A] focus:outline-none"
                    aria-label={`Rate ${s} out of 5 stars`}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        s <= rating ? "fill-current text-[#0A0A0A]" : "text-[#CCCCCC]"
                      }`}
                      strokeWidth={1}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs text-[#6B6B6B] mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                maxLength={100}
                placeholder="e.g. David Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-[#E8E8E8] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#0A0A0A] placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#0A0A0A]"
              />
            </div>

            {/* Review Body */}
            <div>
              <label className="block text-xs text-[#6B6B6B] mb-1.5">
                Review Comments *
              </label>
              <textarea
                required
                rows={3}
                maxLength={1000}
                placeholder="Describe vehicle condition, acquisition service, or handover experience..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-white border border-[#E8E8E8] rounded-lg p-3.5 text-xs sm:text-sm text-[#0A0A0A] placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#0A0A0A]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="py-3 px-6 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
