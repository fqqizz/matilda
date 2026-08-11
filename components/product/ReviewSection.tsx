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

  // Rating distribution counts
  const totalReviews = reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => Math.round(r.rating) === stars).length,
    percentage: totalReviews > 0 ? (reviews.filter((r) => Math.round(r.rating) === stars).length / totalReviews) * 100 : 0,
  }));

  return (
    <div className="py-12 border-t border-[#EFE3D2]">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12">
        {/* Rating Summary Card */}
        <div className="space-y-4 max-w-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A15A] font-semibold">
              Verified Feedback
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A080C]">
              Customer Reviews
            </h3>
          </div>

          {totalReviews > 0 ? (
            <div className="flex items-center gap-4">
              <div className="font-serif text-5xl font-bold text-[#3A080C]">
                {averageRating.toFixed(1)}
              </div>
              <div className="space-y-1">
                <div className="flex text-[#C8A15A]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(averageRating)
                          ? "fill-[#C8A15A] text-[#C8A15A]"
                          : "text-[#EFE3D2]"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-[#7A7373]">
                  Based on {totalReviews} verified {totalReviews === 1 ? "review" : "reviews"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#7A7373]">No reviews yet — be the first to share your experience.</p>
          )}

          {/* Progress Bars */}
          <div className="space-y-2 pt-2">
            {ratingCounts.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-3 text-xs text-[#7A7373]">
                <span className="w-12 text-[11px] font-medium text-[#3A080C]">{stars} Stars</span>
                <div className="flex-1 h-2 bg-[#EFE3D2] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C8A15A] rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-6 text-right text-[11px]">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA to Write Review */}
        <div className="p-6 rounded-lg bg-[#FAF6F0] border border-[#EFE3D2] max-w-sm space-y-4">
          <div className="flex items-center gap-2 text-[#3A080C] font-serif text-lg font-semibold">
            <MessageSquare className="w-5 h-5 text-[#C8A15A]" />
            <span>Own this piece?</span>
          </div>
          <p className="text-xs text-[#7A7373] leading-relaxed">
            Share your styling tips and honest thoughts to help fellow jewellery lovers across India.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 px-4 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#5A1118] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Star Review</span>
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-[#FAF6F0] rounded border border-[#EFE3D2] text-[#7A7373] space-y-2">
            <Sparkles className="w-6 h-6 text-[#C8A15A] mx-auto" />
            <p className="font-serif text-base text-[#3A080C]">Be the first to review this piece</p>
            <p className="text-xs">Click above to submit your rating and review.</p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 sm:p-6 bg-[#FAF6F0]/70 rounded border border-[#F3ECE0] space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#3A080C] text-[#E4C98A] font-serif font-bold text-sm flex items-center justify-center">
                    {rev.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#3A080C]">
                        {rev.author}
                      </span>
                      {rev.verifiedPurchase && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#25D366] bg-[#25D366]/10 px-2 py-0.5 rounded-full font-medium">
                          <CheckCircle className="w-3 h-3" />
                          <span>Verified Buyer</span>
                        </span>
                      )}
                    </div>
                    {rev.location && (
                      <p className="text-[11px] text-[#7A7373]">{rev.location}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex text-[#C8A15A]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating ? "fill-[#C8A15A] text-[#C8A15A]" : "text-[#EFE3D2]"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#7A7373]">{rev.date}</span>
                </div>
              </div>

              <div>
                <h4 className="font-serif text-sm font-bold text-[#3A080C] mb-1">
                  {rev.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#4A4545] leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Write a Review Modal */}
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
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-lg bg-[#FFFDF9] rounded shadow-2xl border border-[#EFE3D2] p-6 sm:p-8"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-[#3A080C] hover:text-[#5A1118]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6 space-y-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A15A] font-semibold">
                  Share Your Experience
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#3A080C]">
                  Review &quot;{productName}&quot;
                </h3>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mx-auto">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif text-xl text-[#3A080C] font-semibold">Thank you for your review!</h4>
                  <p className="text-xs text-[#7A7373]">Your feedback is now live on MATILDA.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Interactive Star Rating Selector */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#3A080C] font-semibold block mb-1.5">
                      Your Rating *
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 text-2xl focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= (hoverRating || rating)
                                ? "fill-[#C8A15A] text-[#C8A15A]"
                                : "text-[#EFE3D2]"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-semibold text-[#3A080C] ml-2">
                        {rating} out of 5 Stars
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#3A080C] font-semibold block mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="e.g. Ayesha Khan"
                        className="w-full px-3 py-2 text-xs rounded border border-[#EFE3D2] bg-[#FAF6F0] text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                      />
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#3A080C] font-semibold block mb-1">
                        City / State
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Srinagar, Kashmir"
                        className="w-full px-3 py-2 text-xs rounded border border-[#EFE3D2] bg-[#FAF6F0] text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#3A080C] font-semibold block mb-1">
                      Review Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Elegant silhouette & exquisite finish!"
                      className="w-full px-3 py-2 text-xs rounded border border-[#EFE3D2] bg-[#FAF6F0] text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#3A080C] font-semibold block mb-1">
                      Detailed Review *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us about the craftsmanship, fit, packaging, and styling..."
                      className="w-full px-3 py-2 text-xs rounded border border-[#EFE3D2] bg-[#FAF6F0] text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#5A1118] transition-all shadow-md mt-2"
                  >
                    Submit Verified Review
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
