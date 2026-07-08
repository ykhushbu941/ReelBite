import { useState, useEffect, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { Star, Send, User, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReviewSection({ foodId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchReviews();
  }, [foodId]);

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/food/${foodId}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to leave a review!");
    if (!comment.trim()) return;

    setLoading(true);
    try {
      const res = await API.post("/reviews", { foodId, rating, comment });
      setReviews([ { ...res.data, user: { name: user.name } }, ...reviews]);
      setComment("");
      setRating(5);
    } catch (err) {
      alert("Failed to post review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full text-[var(--text-primary)]">
      <div className="flex items-center gap-2 mb-6 p-4 border-b border-white/10">
        <MessageSquare className="w-5 h-5 text-[var(--brand-orange)]" />
        <h3 className="font-black uppercase tracking-widest text-sm">Ratings & Reviews</h3>
      </div>

      {/* Review List */}
      <div className="flex-grow overflow-y-auto px-4 space-y-6 custom-scrollbar">
        {fetching ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-[var(--brand-orange)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <Star className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-xs font-bold uppercase tracking-widest">No reviews yet. Be the first!</p>
          </div>
        ) : (
          reviews.map((rev, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={rev._id || i} 
              className="bg-white/5 rounded-2xl p-4 border border-white/5"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--brand-orange)] to-[var(--brand-yellow)] flex items-center justify-center text-[10px] font-black text-white">
                    {rev.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-black">{rev.user?.name}</p>
                    <p className="text-[9px] opacity-40 uppercase tracking-tighter">{new Date(rev.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < rev.rating ? "text-[var(--brand-orange)] fill-[var(--brand-orange)]" : "text-white/10"}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm font-medium leading-relaxed opacity-90">{rev.comment}</p>
            </motion.div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/5 backdrop-blur-xl border-t border-white/10">
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Rate this dish</span>
               <div className="flex gap-1">
                 {[1, 2, 3, 4, 5].map((s) => (
                   <button 
                    key={s} 
                    type="button" 
                    onClick={() => setRating(s)}
                    className="focus:outline-none transition-transform active:scale-125"
                   >
                     <Star className={`w-5 h-5 ${s <= rating ? "text-[var(--brand-orange)] fill-[var(--brand-orange)]" : "text-white/20"}`} />
                   </button>
                 ))}
               </div>
            </div>
            <div className="relative">
              <input 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your feedback..."
                className="w-full bg-white/10 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-sm font-medium focus:outline-none focus:border-[var(--brand-orange)]/50 transition-all"
              />
              <button 
                type="submit" 
                disabled={loading || !comment.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[var(--brand-orange)] rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white/50 border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4 text-white" />}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-center py-4 text-xs font-bold uppercase tracking-widest opacity-50">Login to leave a review</p>
        )}
      </div>
    </div>
  );
}
