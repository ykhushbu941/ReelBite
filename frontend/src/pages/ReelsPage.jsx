import { useEffect, useState, useRef, useContext } from "react";
import { Heart, MessageCircle, Send, Plus, Store, X, CheckCircle, Bookmark, Play, Star, ShieldCheck, Activity, Wifi, Cpu, MapPin, Sparkles } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/api";
import ReviewSection from "../components/ReviewSection";

// ─────────────────────────────────────────────
// Single Reel Card
// ─────────────────────────────────────────────
const Reel = ({ food, isActive, isNext, index, activeIndex }) => {
  const videoRef = useRef(null);
  const { user, fetchUser } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Default to unmuted as requested
  const [likesCount, setLikesCount] = useState(food.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(food.comments || []);
  const [toast, setToast] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [viewCounted, setViewCounted] = useState(false);

  // IPR States
  const [avopMode, setAvopMode] = useState("HD"); // "HD" or "Transact"
  const [showPoovvModal, setShowPoovvModal] = useState(false);
  
  // Dwell Tracker refs
  const startTimeRef = useRef(null);
  const loopCountRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Reset/Start Dwell Time tracking on active change
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      if (!viewCounted) {
        API.put(`/foods/view/${food._id}`).catch(() => {});
        setViewCounted(true);
      }
      
      // Play Video
      video.muted = isMuted;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        });
      }
      setIsPaused(false);

      // Start Tracking Dwell & Loops
      startTimeRef.current = Date.now();
      loopCountRef.current = 0;
      lastTimeRef.current = 0;

    } else {
      video.pause();
      video.currentTime = 0;
      setShowComments(false);

      // Log Dwell Time if we have spent meaningful time watching
      if (startTimeRef.current) {
        const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
        if (elapsed > 1) {
          API.post("/ipr/log-dwell", {
            foodId: food._id,
            dwellTime: elapsed,
            loops: loopCountRef.current
          }).catch((err) => console.warn("Failed to log engagement dwell:", err));
        }
        startTimeRef.current = null;
      }
    }
  }, [isActive, food._id]);

  // Track Video Loops dynamically via timeupdate
  const handleTimeUpdate = (e) => {
    const current = e.target.currentTime;
    if (current < lastTimeRef.current - 1.5) {
      loopCountRef.current += 1;
    }
    lastTimeRef.current = current;
  };

  // Trigger AVOP "Transact" mode when comments panel is active
  useEffect(() => {
    if (showComments) {
      setAvopMode("Transact");
    } else {
      setAvopMode("HD");
    }
  }, [showComments]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const handleTap = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted) {
      video.muted = false;
      setIsMuted(false);
      return;
    }
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
      await API.post(`/foods/like/${food._id}`);
      setIsLiked(prev => !prev);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch {
      showToast("Error liking reel");
    }
  };

  const toggleSave = async (e) => {
    e.stopPropagation();
    try {
      await API.post(`/auth/user/save/${food._id}`);
      setIsSaved(prev => !prev);
      showToast(isSaved ? "Removed from Saved" : "Reel Saved! 🔖");
      if (fetchUser) fetchUser();
    } catch {
      showToast("Error saving reel");
    }
  };

  const handleOrder = (e) => {
    e.stopPropagation();
    
    // AVOP priority override
    setAvopMode("Transact");
    addToCart(food);
    showToast("Added to Cart! 🛒");
    
    // Hold transaction priority mode briefly to prioritize checkout packets
    setTimeout(() => {
      if (!showComments) setAvopMode("HD");
    }, 4000);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: food.name, text: `Check out ${food.name} on QuickBites!`, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
      showToast("Link copied! 📎");
    }
  };

  // Setup POOVV coordinates & signature display
  const verification = food.verificationMetadata || {
    isVerified: true,
    latitude: 12.9716,
    longitude: 77.5946,
    timestamp: food.createdAt || new Date(),
    signature: "c2VjLXNpZ19sYXQ6MTIuOTcxNl9sbmc6NzcuNTk0Nl9kZXY6QTM4Rl9oYXNoOmFkOGY5YTIx",
    deviceId: "DEV-MAC-B5F2A8D9",
    networkBssid: "Kitchen_Staff_5G"
  };

  return (
    <div className="relative w-full h-[100dvh] sm:h-[95vh] max-w-[400px] mx-auto snap-center bg-black flex flex-col justify-center overflow-hidden flex-shrink-0 group shadow-[0_20px_100px_rgba(0,0,0,0.8)] border-x border-white/10 ring-1 ring-white/5">
      
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="absolute top-16 left-1/2 z-50 bg-[var(--glass-bg)] backdrop-blur-md text-[var(--text-primary)] px-4 py-2 rounded-full flex items-center space-x-2 border border-[var(--border-color)] shadow-lg"
          >
            <CheckCircle className="w-4 h-4 text-[var(--brand-orange)] flex-shrink-0" />
            <span className="text-sm font-semibold whitespace-nowrap">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src={food.videoUrl}
            loop
            muted={isMuted}
            playsInline
            autoPlay
            poster={food.imageUrl}
            preload={(isActive || (index > activeIndex && index <= activeIndex + 2)) ? "auto" : "metadata"}
            className={`w-full h-full object-cover transition-all duration-500 ${avopMode === "Transact" ? "blur-[2px] brightness-75 scale-95" : ""}`}
            onTimeUpdate={handleTimeUpdate}
            onLoadedData={e => {
              setVideoLoaded(true);
              if (isActive) {
                e.target.muted = isMuted;
                e.target.play().catch(() => {
                    e.target.muted = true;
                    setIsMuted(true);
                    e.target.play().catch(() => {});
                });
              }
            }}
            onClick={handleSingleOrDoubleTap}
          />
      </div>

      {/* 📡 AVOP Network Bandwidth Optimizer Status */}
      <div 
        className={`absolute top-20 right-4 z-20 bg-black/70 backdrop-blur-md border rounded-2xl p-3 max-w-[150px] space-y-1.5 shadow-lg select-none transition-all duration-300 ${
          avopMode === "Transact" ? "border-emerald-500/40 shadow-emerald-500/10" : "border-white/10"
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-1">
          <span className="text-[7px] font-black text-white/50 uppercase tracking-widest flex items-center gap-1">
            <Activity className="w-2.5 h-2.5 text-[var(--brand-orange)]" />
            AVOP Optimizer
          </span>
          <span className={`w-1.5 h-1.5 rounded-full ${avopMode === "Transact" ? "bg-emerald-400 animate-ping" : "bg-orange-400 animate-pulse"}`} />
        </div>
        <div className="space-y-0.5">
          <p className="text-[9px] font-extrabold text-white leading-tight">
            {avopMode === "Transact" ? "⚡ TRANSACT PRIORITY" : "📺 HD STREAM ACTIVE"}
          </p>
          <p className="text-[7.5px] font-bold text-white/60">
            Res: {avopMode === "Transact" ? "360p Compact" : "1080p Full HD"}
          </p>
          <p className="text-[7.5px] font-bold text-emerald-400">
            Saved: {avopMode === "Transact" ? "97% (Checkout priority)" : "0% (Pre-fetching)"}
          </p>
        </div>
      </div>

      {/* Strong cinematic gradient at bottom so text is always readable */}
      <div className="absolute inset-0 pointer-events-none z-10" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 35%, transparent 60%)'}} />

      {/* Mute indicator */}
      {isMuted && isActive && videoLoaded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-black/60 backdrop-blur-sm rounded-full px-5 py-3 flex items-center space-x-2 pointer-events-none border border-white/10"
        >
          <span className="text-white text-xl">🔇</span>
          <span className="text-white text-sm font-bold">Tap to unmute</span>
        </motion.div>
      )}

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

      {isPaused && videoLoaded && (
        <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
        >
          <div className="bg-[var(--glass-bg)] rounded-full p-6 backdrop-blur-sm border border-[var(--border-color)]">
            <Play className="w-14 h-14 text-[var(--brand-orange)] fill-[var(--brand-orange)] ml-2" />
          </div>
        </motion.div>
      )}

      {showHeart && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
          <Heart fill="#FC8019" className="w-32 h-32 text-[#FC8019] opacity-90 animate-like-pump drop-shadow-2xl" />
        </div>
      )}

      {/* ── Bottom Info (Instagram-style — pushed to very bottom) ── */}
      <motion.div 
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 120, damping: 20 }}
        className="absolute bottom-20 left-4 right-20 z-20 pointer-events-auto" 
        onClick={e => e.stopPropagation()}
      >
        {/* Restaurant + POOVV verified badge */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div className={`w-4 h-4 rounded-sm border-[1.5px] flex items-center justify-center flex-shrink-0 ${food.isVeg ? "border-[#3D9970]" : "border-[#E23744]"}`}>
            <div className={`w-2 h-2 rounded-full ${food.isVeg ? "bg-[#3D9970]" : "bg-[#E23744]"}`} />
          </div>
          <button
            onClick={() => navigate(`/home?search=${encodeURIComponent(food.restaurant)}`)}
            className="flex items-center space-x-1 text-white/90 text-[12px] font-black hover:underline mr-1"
          >
            <Store className="w-3.5 h-3.5 text-[var(--brand-orange)]" />
            <span>{food.restaurant}</span>
          </button>
          
          {/* POOVV verified check badge */}
          {verification.isVerified && (
            <button
              onClick={() => setShowPoovvModal(true)}
              className="flex items-center space-x-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black px-2 py-0.5 rounded-full hover:bg-emerald-500/35 active:scale-95 transition-all shadow-sm shadow-emerald-500/10"
            >
              <ShieldCheck className="w-3 h-3 flex-shrink-0" />
              <span>KITCHEN VERIFIED</span>
            </button>
          )}

          {food.isAiGenerated && (
            <span className="flex items-center space-x-1 bg-[var(--brand-orange)]/20 text-[var(--brand-orange)] border border-[var(--brand-orange)]/30 text-[9px] font-black px-2 py-0.5 rounded-full">
              <Sparkles className="w-2.5 h-2.5 flex-shrink-0" />
              <span>CARE AI</span>
            </span>
          )}
        </div>

        {/* Food name */}
        <h2 className="text-[20px] font-black text-white mb-1.5 drop-shadow-lg leading-tight">{food.name}</h2>

        {/* Description */}
        <p className="text-[12px] text-white/70 line-clamp-1 mb-3 font-medium">
          {food.description || "Fresh and delicious. Made with love."}
        </p>

        {/* Price + Add button */}
        <div className="flex items-center space-x-3">
          <span className="text-[22px] font-black text-white drop-shadow-lg">₹{food.price}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOrder}
            className="bg-[var(--brand-orange)] text-white text-[13px] font-black px-7 py-2.5 rounded-2xl flex items-center space-x-1.5 shadow-xl shadow-orange-500/40 uppercase tracking-widest"
          >
            <Plus className="w-4 h-4" strokeWidth={3} />
            <span>ADD</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ── Right Action Bar (Instagram-style ── */}
      <motion.div 
        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 120, damping: 20 }}
        className="absolute right-3 bottom-20 flex flex-col items-center space-y-5 z-20"
      >
        <button 
             onClick={() => navigate(`/home?search=${encodeURIComponent(food.restaurant)}`)}
             className="relative mb-2 shrink-0 group active:scale-95 transition-transform"
        >
             <div className="w-11 h-11 rounded-full border-2 border-white overflow-hidden bg-[#2A2A2A] shadow-lg">
                 {food.restaurantImageUrl ? <img src={food.restaurantImageUrl} className="w-full h-full object-cover" alt="restaurant" /> : <div className="bg-white" />}
             </div>
             <motion.div 
                initial={false}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[var(--brand-orange)] rounded-full w-4 h-4 flex items-center justify-center border border-white"
             >
                 <Plus className="w-3 h-3 text-white" />
             </motion.div>
        </button>

        <button onClick={toggleLike} className="flex flex-col items-center group">
          <Heart className={`w-8 h-8 transition-all drop-shadow-lg ${isLiked ? "text-[#E23744] fill-[#E23744] scale-110" : "text-[var(--text-primary)]"}`} />
          <span className="text-[var(--text-primary)] text-[11px] font-bold mt-1 drop-shadow-md">{likesCount}</span>
        </button>

        <button onClick={() => setShowComments(v => !v)} className="flex flex-col items-center group">
          <MessageCircle className="w-8 h-8 text-[var(--text-primary)] drop-shadow-lg" />
          <span className="text-[var(--text-primary)] text-[11px] font-bold mt-1 drop-shadow-md">{comments.length}</span>
        </button>

        <button onClick={toggleSave} className="flex flex-col items-center group">
          <Bookmark className={`w-7 h-7 transition-all drop-shadow-lg ${isSaved ? "text-yellow-400 fill-yellow-400" : "text-[var(--text-primary)]"}`} />
          <span className="text-[var(--text-primary)] text-[11px] font-bold mt-1 drop-shadow-md">Save</span>
        </button>

        <button onClick={handleShare} className="flex flex-col items-center group">
          <Send className="w-7 h-7 text-[var(--text-primary)] drop-shadow-lg transform -rotate-12" />
          <span className="text-[var(--text-primary)] text-[11px] font-bold mt-1 drop-shadow-md">Share</span>
        </button>
      </motion.div>

      {/* ── Comments Panel ── */}
      <motion.div 
         initial={false}
         animate={{ y: showComments ? 0 : "100%", height: showComments ? "70%" : "0%" }}
         transition={{ type: "spring", damping: 25, stiffness: 200 }}
         className="absolute bottom-0 w-full bg-[var(--bg-surface)] rounded-t-3xl border-t border-[var(--border-color)] z-30 flex flex-col shadow-2xl overflow-hidden"
         onClick={e => e.stopPropagation()}
      >
        {showComments && (
          <ReviewSection foodId={food._id} />
        )}
      </motion.div>

      {/* ── POOVV Crypto Origin Verification Report Modal (Patent presentation) ── */}
      <AnimatePresence>
        {showPoovvModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 flex items-center justify-center p-4" onClick={(e) => { e.stopPropagation(); setShowPoovvModal(false); }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-[var(--bg-surface)] border border-emerald-500/30 rounded-[2.5rem] p-6 space-y-5 shadow-2xl relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Decorative radial highlight */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h3 className="text-sm font-black text-[var(--text-primary)] uppercase">POOVV Report</h3>
                    <p className="text-[8px] font-black text-emerald-400 uppercase tracking-wider">Proof of Kitchen Origin</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPoovvModal(false)}
                  className="p-1.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] space-y-3">
                <div className="flex justify-between text-[10px]">
                  <span className="text-[var(--text-secondary)] font-bold uppercase">Latitude / Longitude</span>
                  <span className="text-[var(--text-primary)] font-extrabold flex items-center gap-1 font-mono">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {verification.latitude.toFixed(5)}, {verification.longitude.toFixed(5)}
                  </span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-[var(--text-secondary)] font-bold uppercase">Network SSID</span>
                  <span className="text-[var(--text-primary)] font-extrabold flex items-center gap-1 font-mono">
                    <Wifi className="w-3 h-3 text-emerald-400" />
                    {verification.networkBssid}
                  </span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-[var(--text-secondary)] font-bold uppercase">Source Hardware</span>
                  <span className="text-[var(--text-primary)] font-extrabold flex items-center gap-1 font-mono">
                    <Cpu className="w-3 h-3 text-emerald-400" />
                    {verification.deviceId.slice(0, 12)}
                  </span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-[var(--text-secondary)] font-bold uppercase">Verification Time</span>
                  <span className="text-[var(--text-primary)] font-extrabold font-mono">
                    {new Date(verification.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest block ml-1">Cryptographic Proof Signature</span>
                <div className="bg-[var(--bg-primary)] p-3 rounded-2xl border border-[var(--border-color)] font-mono text-[8.5px] text-white/50 break-all select-all leading-normal">
                  {verification.signature}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
                <p className="text-[9.5px] font-bold text-emerald-400 leading-snug">
                  This media file is cryptographically locked to the restaurant kitchen hardware. Origin validated 100% authentic.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const targetFoodId = searchParams.get('foodId');

  const containerRef = useRef(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  // Instant Reset on Filter Change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo(0, 0);
      setActiveIndex(0);
    }
  }, [filter]);

  const fetchFoods = async () => {
    try {
      const res = await API.get("/foods?limit=40");
      // Shuffle reels for fresh experience
      let shuffled = res.data.sort(() => Math.random() - 0.5);
      
      if (targetFoodId) {
        const targetFoodIndex = shuffled.findIndex(f => f._id === targetFoodId);
        if (targetFoodIndex > -1) {
          const targetFood = shuffled.splice(targetFoodIndex, 1)[0];
          shuffled.unshift(targetFood);
        }
      }
      
      setFoods(shuffled);
    } catch {
      console.error("Error loading foods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading || foods.length === 0 || !containerRef.current) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const index = Array.from(containerRef.current.children).indexOf(entry.target);
                setActiveIndex(index);
            }
        });
    }, {
        root: containerRef.current,
        threshold: 0.7 
    });

    const elements = containerRef.current.children;
    for(let i=0; i<elements.length; i++) {
        observer.observe(elements[i]);
    }

    return () => observer.disconnect();
  }, [loading, foods]);

  if (loading) {
    return (
      <div className="h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center text-[var(--text-primary)] space-y-4">
        <div className="w-12 h-12 border-[3px] border-[var(--border-color)] border-t-[var(--brand-orange)] rounded-full animate-spin" />
        <p className="text-[var(--text-secondary)] text-sm font-bold tracking-widest uppercase">Loading Reels</p>
      </div>
    );
  }

  const filteredFoods = (foods || []).filter(food => {
      if (!food) return false;
      if (filter === "veg") return food.isVeg;
      if (filter === "nonveg") return !food.isVeg;
      return true;
  });

  return (
    <div className="bg-[var(--bg-primary)] w-full fixed inset-0 z-10 overflow-hidden transition-colors duration-300">
      
      {/* Top Filter Overlay */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-12 md:top-16 left-0 right-0 z-50 flex justify-center items-center pointer-events-none"
      >
          <div className="flex items-center space-x-8 pointer-events-auto">
              <button 
                onClick={() => setFilter("all")} 
                className={`text-[15px] font-black tracking-wide transition-all duration-300 drop-shadow-lg relative ${filter === "all" ? "text-white scale-110" : "text-white/60 hover:text-white"}`}
              >
                For You
                {filter === "all" && <div className="h-0.5 bg-white w-full rounded-full mt-0.5" />}
              </button>
              
              <button 
                onClick={() => setFilter("veg")} 
                className={`text-[15px] font-black tracking-wide transition-all duration-300 drop-shadow-lg relative ${filter === "veg" ? "text-white scale-110" : "text-white/60 hover:text-white"}`}
              >
                Veg
                {filter === "veg" && <div className="h-0.5 bg-white w-full rounded-full mt-0.5" />}
              </button>
              
              <button 
                onClick={() => setFilter("nonveg")} 
                className={`text-[15px] font-black tracking-wide transition-all duration-300 drop-shadow-lg relative ${filter === "nonveg" ? "text-white scale-110" : "text-white/60 hover:text-white"}`}
              >
                Non-Veg
                {filter === "nonveg" && <div className="h-0.5 bg-white w-full rounded-full mt-0.5" />}
              </button>
          </div>
      </motion.div>

      <div 
         ref={containerRef}
         className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar sm:py-4 pt-4 md:pt-16"
      >
        {filteredFoods.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center bg-transparent pointer-events-none text-[var(--text-secondary)]/50">
            <div className="text-center">
              <p className="text-5xl mb-4">🎬</p>
              <h3 className="text-xl mb-2 font-black text-[var(--text-primary)] tracking-tight">No Reels Found</h3>
              <p className="text-sm font-medium">Cannot find any reels for this filter.</p>
            </div>
          </div>
        ) : (
          filteredFoods.map((food, index) => (
            <Reel 
              key={food._id || food.id || index} 
              food={food} 
              isActive={index === activeIndex} 
              isNext={index === activeIndex + 1} 
              index={index}
              activeIndex={activeIndex}
            />
          ))
        )}
      </div>
    </div>
  );
}