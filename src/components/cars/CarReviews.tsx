"use client";

import { useState } from "react";
import { z } from "zod";
import { Star, MessageSquare, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { Comment } from "@/types/database";
import { storeApi } from "@/lib/supabase/client";
import { soundEngine } from "@/lib/sound";

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

      soundEngine.playSuccessChime();
      setSubmitted(true);
      setName("");
      setBody("");
    } catch (err: any) {
      console.error("Error submitting review:", err);
      setErrorMessage(err?.message || "Unable to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 border-t border-neutral-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 mb-2 font-semibold">
            <MessageSquare className="w-4 h-4 text-neutral-900" />
            <span>Verified Connoisseur Reviews</span>
          </div>
          <h3 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-neutral-950 uppercase">
            Client Impressions
          </h3>
        </div>

        <div className="flex items-center gap-3 bg-neutral-50 px-4 py-2.5 rounded-xl border border-neutral-200">
          <div className="flex text-amber-500">
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
      <div className="p-6 sm:p-8 rounded-2xl bg-[#F9FAFB] border border-neutral-200">
        {submitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-neutral-950">
              Thanks, your review will appear after approval.
            </h4>
            <p className="text-xs text-neutral-600 max-w-sm mx-auto">
              Our editorial moderation desk reviews submissions to ensure authentic verified feedback.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                Share Your Provenance Experience
              </span>
              <h4 className="font-display font-bold text-lg text-neutral-950 uppercase tracking-tight">
                Leave a Verified Review
              </h4>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
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
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Your Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 text-neutral-300 hover:text-amber-500 transition-colors focus:outline-none"
                    aria-label={`Rate ${s} out of 5 stars`}
                  >
                    <Star
                      className={`w-6 h-6 transition-all ${
                        s <= rating
                          ? "fill-amber-500 text-amber-500 scale-110"
                          : "text-neutral-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Your Name *
              </label>
              <input
                type="text"
                required
                maxLength={100}
                placeholder="e.g. Sterling Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950"
              />
            </div>

            {/* Review Body */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Review Details *
              </label>
              <textarea
                required
                rows={3}
                maxLength={1000}
                placeholder="Describe vehicle specification, condition assessment, or delivery handover..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-xl p-4 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="py-3 px-6 rounded-xl bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
            >
              {submitting ? "Submitting..." : "Submit Review for Verification"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
