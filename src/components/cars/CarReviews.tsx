"use client";

import { useState } from "react";
import { Star, MessageSquare, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Comment } from "@/types/database";
import { storeApi } from "@/lib/supabase/client";
import { soundEngine } from "@/lib/sound";

interface CarReviewsProps {
  carId: string;
  initialComments: Comment[];
}

export default function CarReviews({ carId, initialComments }: CarReviewsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [rating, setRating] = useState<number>(5);
  const [userName, setUserName] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const averageRating =
    comments.length > 0
      ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
      : "5.0";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !body.trim()) return;

    setSubmitting(true);
    soundEngine.playSuccessChime();

    try {
      const newComment = await storeApi.addComment({
        car_id: carId,
        user_name: userName.trim(),
        rating,
        body: body.trim(),
        status: "approved", // Show immediately for customer gratification
      });

      setComments((prev) => [newComment, ...prev]);
      setSubmitted(true);
      setUserName("");
      setBody("");
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 border-t border-[#E4E4E7]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#0D5C3A] mb-2 font-semibold">
            <MessageSquare className="w-4 h-4" />
            <span>Verified Connoisseur Reviews</span>
          </div>
          <h3 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">
            Client Impressions & Feedback
          </h3>
        </div>

        {/* Aggregate Score Badge */}
        <div className="flex items-center gap-3 bg-[#F7F7F8] p-3 px-5 rounded-2xl border border-[#E4E4E7]">
          <div className="text-2xl font-bold font-mono text-[#0A0A0A]">{averageRating}</div>
          <div>
            <div className="flex text-[#C5A059]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="text-[10px] text-[#64748B] font-mono">
              Based on {comments.length} verified impressions
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Existing Reviews List */}
        <div className="lg:col-span-7 space-y-4">
          {comments.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-[#E4E4E7] bg-[#F7F7F8]">
              <p className="text-xs text-[#64748B]">
                Be the first client to publish an appraisal on this allocation.
              </p>
            </div>
          ) : (
            comments.map((comm) => (
              <div
                key={comm.id}
                className="p-5 rounded-2xl bg-white border border-[#E4E4E7] space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#0D5C3A]/10 text-[#0D5C3A] flex items-center justify-center font-bold text-xs">
                      {comm.user_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0A0A0A]">{comm.user_name}</h4>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {new Date(comm.created_at).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex text-[#C5A059]">
                    {[...Array(comm.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#64748B] leading-relaxed">
                  {comm.body}
                </p>

                {comm.admin_reply && (
                  <div className="p-3 bg-[#F7F7F8] rounded-xl border border-[#E4E4E7] text-[11px] text-[#0A0A0A] space-y-1">
                    <span className="font-semibold text-[#0D5C3A] block">
                      Aston Auto Concierge Response:
                    </span>
                    <p className="text-[#64748B]">{comm.admin_reply}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Submit Review Form */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-2xl bg-[#F7F7F8] border border-[#E4E4E7]">
            <h4 className="text-sm font-bold text-[#0A0A0A] mb-1">
              Submit Your Appraisal
            </h4>
            <p className="text-xs text-[#64748B] mb-4">
              Share your ownership or private salon viewing experience.
            </p>

            {submitted ? (
              <div className="p-4 bg-[#0D5C3A]/10 border border-[#0D5C3A]/30 rounded-xl text-xs text-[#0D5C3A] flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you. Your appraisal has been published.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating Stars Picker */}
                <div>
                  <label className="text-xs text-[#64748B] block mb-1.5 font-medium">
                    Overall Experience Rating:
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          soundEngine.playHoverTick();
                          setRating(star);
                        }}
                        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                          star <= rating ? "text-[#C5A059]" : "text-neutral-300"
                        }`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-xs text-[#64748B] block mb-1 font-medium">
                    Your Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Adeleke"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-white border border-[#E4E4E7] rounded-xl px-3.5 py-2.5 text-xs text-[#0A0A0A] focus:outline-none focus:border-[#0D5C3A]"
                  />
                </div>

                {/* Message Body */}
                <div>
                  <label className="text-xs text-[#64748B] block mb-1 font-medium">
                    Your Appraisal:
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe vehicle craftsmanship, performance, or showroom experience..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full bg-white border border-[#E4E4E7] rounded-xl px-3.5 py-2.5 text-xs text-[#0A0A0A] focus:outline-none focus:border-[#0D5C3A] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-luxury-primary w-full text-xs py-3 rounded-xl disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Publishing Appraisal..." : "Publish Appraisal"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
