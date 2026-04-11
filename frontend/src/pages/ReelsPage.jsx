import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { Heart, MessageCircle, Send, Plus, Store, X, CheckCircle, Bookmark, Play } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────
// Single Reel Card
// ─────────────────────────────────────────────
const Reel = ({ food, isActive }) => {
  const videoRef = useRef(null);
  const { user, fetchUser } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [isPaused, setIsPaused] = useState(false);
  const [likesCount, setLikesCount] = useState(food.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(food.comments || []);
  const [toast, setToast] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Auto-play / pause based on active state (passed from parent observer)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
        // Must use muted for autoplay policies across most browsers (we added it in markup),
        // catching the promise handles any blockages
        video.play().catch(e => console.log("Autoplay blocked/failed", e));
        setIsPaused(false);
    } else {
        video.pause();
        video.currentTime = 0; // reset
        setShowComments(false);
    }
  }, [isActive]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const handleTap = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  let tapTimer = useRef(null);
  const handleSingleOrDoubleTap = (e) => {
    e.preventDefault();
    if (tapTimer.current) {
      // double tap
      clearTimeout(tapTimer.current);
      tapTimer.current = null;
      if (!isLiked) toggleLike();
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 900);
    } else {
      tapTimer.current = setTimeout(() => {
        tapTimer.current = null;
        handleTap();
      }, 250);
    }
  };

  const toggleLike = async () => {
    try {
      await axios.post(`/api/foods/like/${food._id}`);
      setIsLiked(prev => !prev);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch {
      showToast("Error liking reel");
    }
  };

  const toggleSave = async (e) => {
    e.stopPropagation();
    try {
      await axios.post(`/api/auth/user/save/${food._id}`);
      setIsSaved(prev => !prev);
      showToast(isSaved ? "Removed from Saved" : "Reel Saved! 🔖");
      if (fetchUser) fetchUser();
    } catch {
      showToast("Error saving reel");
    }
  };

  const handleOrder = (e) => {
    e.stopPropagation();
    addToCart(food);
    showToast("Added to Cart! 🛒");
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: food.name, text: `Check out ${food.name} on ReelBite!`, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
      showToast("Link copied! 📎");
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(`/api/foods/comment/${food._id}`, { text: newComment });
      setComments(res.data);
      setNewComment("");
      showToast("Comment posted!");
    } catch {
      showToast("Failed to post comment");
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-0px)] sm:h-full max-w-[430px] mx-auto snap-center bg-black flex flex-col justify-center overflow-hidden flex-shrink-0 group">
      
      {/* ── Toast ── */}
      {toast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center space-x-2 border border-white/20 animate-fade-in shadow-lg">
          <CheckCircle className="w-4 h-4 text-brand-primary flex-shrink-0" />
          <span className="text-sm font-semibold whitespace-nowrap">{toast}</span>
        </div>
      )}

      {/* ── VIDEO CONTAINER (Forced Mobile Ratio via CSS) ── */}
      <div className="absolute inset-0 bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={food.videoUrl}
            loop
            muted // Muted required for auto-play policy on most devices initially
            playsInline
            preload={isActive ? "auto" : "metadata"}
            className="w-full h-full object-cover sm:rounded-none" // object-cover forces the horizontal web videos acting as vertical to crop
            onCanPlay={() => setVideoLoaded(true)}
            onClick={handleSingleOrDoubleTap}
          />
      </div>

      {/* Loading / poster image shown ONLY before video loads */}
      {!videoLoaded && food.imageUrl && (
        <img
          src={food.imageUrl}
          alt={food.name}
          className="absolute inset-0 w-full h-full object-cover blur-sm brightness-50 z-0 transition-opacity duration-500"
        />
      )}
      {!videoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
          <div className="w-10 h-10 border-2 border-[#FC8019]/30 border-t-[#FC8019] rounded-full animate-spin" />
        </div>
      )}

      {/* Pause overlay */}
      {isPaused && videoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-black/50 rounded-full p-6 backdrop-blur-sm animate-fade-in">
            <Play className="w-14 h-14 text-white fill-white ml-2" />
          </div>
        </div>
      )}

      {/* Double-tap heart */}
      {showHeart && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
          <Heart fill="#FC8019" className="w-32 h-32 text-[#FC8019] opacity-90 animate-like-pump drop-shadow-2xl" />
        </div>
      )}

      {/* Gradient overlays for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 pointer-events-none" />

      {/* ── Bottom Info ── */}
      {/* Changed bottom padding to avoid nav overlap (bottom-24 instead of bottom-6) */}
      <div className="absolute bottom-24 left-4 right-16 z-20 pointer-events-auto" onClick={e => e.stopPropagation()}>
        
        {/* Badges */}
        <div className="flex items-center space-x-2 mb-3">
          <div className={`w-5 h-5 rounded-sm border-[1.5px] flex items-center justify-center ${food.isVeg ? "border-[#3D9970] bg-[#3D9970]/10" : "border-[#E23744] bg-[#E23744]/10"}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${food.isVeg ? "bg-[#3D9970]" : "bg-[#E23744]"}`} />
          </div>
          {food.cuisine && food.cuisine !== "Other" && (
            <span className="text-[10px] uppercase font-extrabold tracking-wider bg-white/20 backdrop-blur-md px-2 py-1 rounded text-white shadow-sm">
              {food.cuisine}
            </span>
          )}
        </div>

        <h2 className="text-[22px] font-extrabold text-white mb-1 drop-shadow-lg leading-tight">{food.name}</h2>

        {/* Restaurant */}
        <button
          onClick={() => navigate(`/home?search=${encodeURIComponent(food.restaurant)}`)}
          className="flex items-center space-x-1 text-white/90 bg-white/10 border border-white/20 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] mb-3 hover:bg-white/20 transition-colors"
        >
          <Store className="w-3.5 h-3.5 text-[#FC8019]" />
          <span className="font-bold">{food.restaurant}</span>
        </button>

        <p className="text-[13px] text-white/80 line-clamp-2 mb-4 font-medium max-w-[90%]">
            {food.description || "Fresh and delicious food made with love."}
        </p>

        <div className="flex items-center space-x-3">
          <span className="text-xl font-black text-white drop-shadow-md">
            ₹{food.price}
          </span>
          <button
            onClick={handleOrder}
            className="bg-[#FC8019] text-white text-[13px] font-bold px-6 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-lg shadow-[#FC8019]/30 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" strokeWidth={3} />
            <span>ADD</span>
          </button>
        </div>
      </div>

      {/* ── Right Action Bar ── */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center space-y-4 z-20 pb-2">
        {/* Profile mock icon */}
        <button 
             onClick={() => navigate(`/home?search=${encodeURIComponent(food.restaurant)}`)}
             className="relative mb-2 shrink-0 group active:scale-95 transition-transform"
        >
             <div className="w-11 h-11 rounded-full border-2 border-white overflow-hidden bg-[#2A2A2A] shadow-lg">
                 {food.imageUrl ? <img src={food.imageUrl} className="w-full h-full object-cover" alt="creator" /> : <div className="bg-white" />}
             </div>
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FC8019] rounded-full w-4 h-4 flex items-center justify-center border border-white">
                 <Plus className="w-3 h-3 text-white" />
             </div>
        </button>

        {/* Like */}
        <button onClick={toggleLike} className="flex flex-col items-center group">
          <Heart className={`w-8 h-8 transition-all drop-shadow-lg ${isLiked ? "text-[#E23744] fill-[#E23744] scale-110" : "text-white"}`} />
          <span className="text-white text-[11px] font-bold mt-1 drop-shadow-md">{likesCount}</span>
        </button>

        {/* Comments */}
        <button onClick={() => setShowComments(v => !v)} className="flex flex-col items-center group">
          <MessageCircle className="w-8 h-8 text-white drop-shadow-lg" />
          <span className="text-white text-[11px] font-bold mt-1 drop-shadow-md">{comments.length}</span>
        </button>

        {/* Save */}
        <button onClick={toggleSave} className="flex flex-col items-center group">
          <Bookmark className={`w-7 h-7 transition-all drop-shadow-lg ${isSaved ? "text-yellow-400 fill-yellow-400" : "text-white"}`} />
          <span className="text-white text-[11px] font-bold mt-1 drop-shadow-md">Save</span>
        </button>

        {/* Share */}
        <button onClick={handleShare} className="flex flex-col items-center group">
          <Send className="w-7 h-7 text-white drop-shadow-lg transform -rotate-12" />
          <span className="text-white text-[11px] font-bold mt-1 drop-shadow-md">Share</span>
        </button>
      </div>

      {/* ── Comments Panel ── */}
      <div 
         className={`absolute bottom-0 w-full bg-[#1C1C1C] rounded-t-3xl border-t border-white/10 z-30 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${showComments ? 'translate-y-0 h-[65%]' : 'translate-y-full h-0'}`}
         onClick={e => e.stopPropagation()}
      >
        {showComments && (
           <>
          <div className="flex justify-between items-center p-4 border-b border-white/5 shrink-0">
            <h3 className="font-bold text-white">Comments <span className="text-xs text-gray-400">({comments.length})</span></h3>
            <button onClick={() => setShowComments(false)} className="p-1.5 bg-black/20 rounded-full hover:bg-white/10 transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4 no-scrollbar pb-20">
            {comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2 pb-10">
                  <MessageCircle className="w-8 h-8 opacity-20" />
                  <p className="text-sm font-medium">No comments yet. Start the conversation!</p>
              </div>
            ) : (
              comments.map((c, i) => (
                <div key={i} className="flex space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FC8019] to-[#E23744] flex-shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-md">
                    {(c.user?.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold mb-0.5">{c.user?.name || "Anonymous User"}</p>
                    <p className="text-[13px] text-white/90 bg-white/5 border border-white/5 px-3 py-2 rounded-2xl rounded-tl-none inline-block shadow-sm">{c.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={submitComment} className="absolute bottom-0 left-0 right-0 p-3 bg-[#1C1C1C] border-t border-white/5 flex items-center space-x-2 shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#3A3A3A] flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className="flex-grow bg-[#2A2A2A] border border-white/5 rounded-full py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#FC8019]/50 placeholder-gray-500 transition-colors"
            />
            <button type="submit" disabled={!newComment.trim()} className="p-2.5 text-white disabled:text-gray-500 bg-[#FC8019] disabled:bg-[#3A3A3A] rounded-full transition-colors disabled:cursor-not-allowed">
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
          </>
        )}
      </div>
    </div>
  );
};


// ─────────────────────────────────────────────
// Reels Page Container
// ─────────────────────────────────────────────
export default function ReelsPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [filter, setFilter] = useState("all");

  const containerRef = useRef(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await axios.get("/api/foods?limit=40");
      setFoods(res.data);
    } catch {
      console.error("Error loading foods");
    } finally {
      setLoading(false);
    }
  };

  // Setup Intersection Observer to detect which reel is active
  useEffect(() => {
    if (loading || foods.length === 0 || !containerRef.current) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                // Determine index via DOM child position
                const index = Array.from(containerRef.current.children).indexOf(entry.target);
                setActiveIndex(index);
            }
        });
    }, {
        root: containerRef.current,
        threshold: 0.6 // Trigger when 60% of the reel is visible
    });

    const elements = containerRef.current.children;
    for(let i=0; i<elements.length; i++) {
        observer.observe(elements[i]);
    }

    return () => observer.disconnect();
  }, [loading, foods]);

  if (loading) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-[3px] border-white/10 border-t-[#FC8019] rounded-full animate-spin" />
        <p className="text-gray-400 text-sm font-bold tracking-widest uppercase">Loading Reels</p>
      </div>
    );
  }

  const filteredFoods = foods.filter(food => {
      if (filter === "veg") return food.isVeg;
      if (filter === "nonveg") return !food.isVeg;
      return true;
  });

  return (
    // The container forces background to be black like Tiktok/IG
    // snap-container setup exists in global css
    <div className="bg-black w-full fixed inset-0 z-10 overflow-hidden sm:bg-[#121212]">
      
      {/* Top Filter Overlay (Instagram For You / Following Style) */}
      <div className="absolute top-12 md:top-20 left-0 right-0 z-50 flex justify-center space-x-6 items-center">
          <button onClick={() => setFilter("all")} className={`text-[15px] font-bold drop-shadow-md transition-all ${filter === "all" ? "text-white" : "text-white/50"}`}>For You</button>
          
          <div className="w-1 h-1 rounded-full bg-white/30 drop-shadow-md"></div>
          
          <button onClick={() => setFilter("veg")} className={`text-[15px] font-bold flex items-center drop-shadow-md transition-all ${filter === "veg" ? "text-[#3D9970]" : "text-white/50"}`}>
             Veg
          </button>
          
          <div className="w-1 h-1 rounded-full bg-white/30 drop-shadow-md"></div>
          
          <button onClick={() => setFilter("nonveg")} className={`text-[15px] font-bold flex items-center drop-shadow-md transition-all ${filter === "nonveg" ? "text-[#E23744]" : "text-white/50"}`}>
             Non-Veg
          </button>
      </div>

      <div 
         ref={containerRef}
         className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar sm:py-4 pt-4 md:pt-16"
      >
        {filteredFoods.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center bg-transparent pointer-events-none text-white/50">
            <div className="text-center">
              <p className="text-5xl mb-4">🎬</p>
              <h3 className="text-xl mb-2 font-bold text-white">No Reels Found</h3>
              <p className="text-sm">Cannot find any reels for this filter.</p>
            </div>
          </div>
        ) : (
          filteredFoods.map((food, index) => (
            <Reel key={food._id} food={food} isActive={index === activeIndex} />
          ))
        )}
      </div>
    </div>
  );
}