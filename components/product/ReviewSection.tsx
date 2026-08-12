"use client";

import React, { useState } from "react";
import { ProductReview } from "@/lib/types";
import { useStore } from "@/lib/context/StoreContext";
import { Star, CheckCircle, Plus, X, MessageSquare, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ReviewSectionProps {
  productId: string;
  productName: string;
  reviews: ProductReview[];
  averageRating: number;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  productName,
  reviews,
  averageRating,
}) => {
  const { addReview } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Form State
  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim() || !title.trim()) return;

    addReview(productId, {
      author,
      rating,
      title,
      comment,
      location: location.trim() || "India",
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsModalOpen(false);
      // Reset form
      setAuthor("");
      setLocation("");
      setTitle("");
      setComment("");
      setRating(5);
    }, 1500);
  };

  const totalReviews = reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => Math.round(r.rating) === stars).length,
    percentage: totalReviews > 0 ? (reviews.filter((r) => Math.round(r.rating) === stars).length / totalReviews) * 100 : 0,
  }));

  return (
    <div className="py-12 border-t border-[#EFE3D2] font-sans">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12">
        {/* Rating Summary Card */}
        <div className="space-y-4 max-w-sm">
          <div className="space-y-1">
            <span className="text-[9.5px] uppercase tracking-[0.18em] text-[#C8A15A] font-medium">
              Verified Feedback
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A0205]">
              Customer Reviews
            </h3>
          </div>

          {totalReviews > 0 ? (
            <div className="flex items-center gap-4">
              <div className="font-serif text-4xl sm:text-5xl font-normal text-[#1A0205]">
                {averageRating.toFixed(1)}
              </div>
              <div className="space-y-1">
                <div className="flex text-[#C8A15A]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= Math.round(averageRating)
                          ? "fill-[#C8A15A] text-[#C8A15A]"
                          : "text-[#EFE3D2]"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-[#7A7373] font-light">
                  Based on {totalReviews} verified {totalReviews === 1 ? "review" : "reviews"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#7A7373] font-light">No reviews yet — be the first to share your experience.</p>
          )}

          {/* Progress Bars */}
          <div className="space-y-1.5 pt-1">
            {ratingCounts.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-3 text-xs text-[#7A7373]">
                <span className="w-12 text-[11px] font-normal text-[#1A0205]">{stars} Stars</span>
                <div className="flex-1 h-1.5 bg-[#EFE3D2] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C8A15A] rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-6 text-right text-[11px] font-light">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA to Write Review */}
        <div className="p-6 rounded bg-[#FAF6F0] border border-[#EFE3D2] max-w-sm space-y-3">
          <div className="flex items-center gap-2 text-[#1A0205] font-serif text-lg font-normal">
            <MessageSquare className="w-4 h-4 text-[#C8A15A]" />
            <span>Own this piece?</span>
          </div>
          <p className="text-xs text-[#7A7373] leading-relaxed font-light">
            Share your styling tips and thoughts to help fellow jewellery lovers.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 px-4 bg-[#1A0205] text-[#E4C98A] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#3A080C] transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Write a Star Review</span>
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-[#FAF6F0] rounded border border-[#EFE3D2] text-[#7A7373] space-y-2">
            <Sparkles className="w-6 h-6 text-[#C8A15A] mx-auto" />
            <p className="font-serif text-base text-[#1A0205]">Be the first to review this piece</p>
            <p className="text-xs font-light">Click above to submit your rating and review.</p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 sm:p-6 bg-[#FAF6F0]/70 rounded border border-[#F3ECE0] space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1A0205] text-[#E4C98A] font-serif text-sm flex items-center justify-center">
                    {rev.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-[#1A0205]">
                        {rev.author}
                      </span>
                      {rev.verifiedPurchase && (
                        <span className="inline-flex items-center gap-1 text-[9.5px] text-[#25D366] bg-[#25D366]/10 px-2 py-0.5 rounded-full font-medium">
                          <CheckCircle className="w-3 h-3" />
                          <span>Verified Buyer</span>
                        </span>
                      )}
                    </div>
                    {rev.location && (
                      <p className="text-[10.5px] text-[#7A7373] font-light">{rev.location}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex text-[#C8A15A]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= rev.rating ? "fill-[#C8A15A] text-[#C8A15A]" : "text-[#EFE3D2]"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#7A7373] font-light">{rev.date}</span>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="font-serif text-base text-[#1A0205] font-normal">{rev.title}</h4>
                <p className="text-xs text-[#4A4545] leading-relaxed font-light">{rev.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="relative z-10 w-full max-w-lg bg-[#FFFDF9] rounded shadow-2xl border border-[#EFE3D2] p-6 sm:p-8 space-y-4"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-[#1A0205] hover:text-[#5A1118]"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="border-b border-[#EFE3D2] pb-3">
                <span className="text-[9.5px] uppercase tracking-[0.18em] text-[#C8A15A] font-medium">
                  Reviewing Piece
                </span>
                <h3 className="font-serif text-xl font-normal text-[#1A0205]">{productName}</h3>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mx-auto">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-lg font-normal text-[#1A0205]">Review Shared</h4>
                  <p className="text-xs text-[#7A7373] font-light">Thank you for contributing to the MATILDA community.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                  {/* Rating Stars Input */}
                  <div>
                    <label className="uppercase tracking-[0.12em] font-medium text-[#1A0205] block mb-1.5">
                      Your Rating *
                    </label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="p-1 text-[#C8A15A] transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= (hoverRating || rating)
                                ? "fill-[#C8A15A] text-[#C8A15A]"
                                : "text-[#EFE3D2]"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="uppercase tracking-[0.12em] font-medium text-[#1A0205] block mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="e.g. Sara M."
                        className="w-full p-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                      />
                    </div>

                    <div>
                      <label className="uppercase tracking-[0.12em] font-medium text-[#1A0205] block mb-1">
                        Location (Optional)
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Mumbai, MH"
                        className="w-full p-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="uppercase tracking-[0.12em] font-medium text-[#1A0205] block mb-1">
                      Review Headline *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Gorgeous delicate shine"
                      className="w-full p-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  <div>
                    <label className="uppercase tracking-[0.12em] font-medium text-[#1A0205] block mb-1">
                      Your Thoughts *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="How do you style this piece? How does the weight and luster feel?"
                      className="w-full p-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#1A0205] text-[#E4C98A] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#3A080C] transition-all shadow-luxury"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
