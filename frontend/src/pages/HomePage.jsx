import { useState, useEffect, useContext } from "react";
import API from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Search, MapPin, Grid, Flame, Soup, Pizza, Search as SearchIcon, Star, CheckCircle, ArrowUpRight, Sparkles, Activity, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NearbyRestaurants from "../components/NearbyRestaurants";
import RegisteredRestaurants from "../components/RegisteredRestaurants";
import FoodDetailModal from "../components/FoodDetailModal";
import { CartContext } from "../context/CartContext";

const CATEGORIES = ["All", "Pizza", "Burger", "Dessert", "Drinks", "Snacks", "Healthy", "Other"];
const CUISINES = ["All", "Indian", "South Indian", "Chinese", "Italian", "Mexican", "American", "Japanese", "Healthy", "Mediterranean"];

const CUISINE_ICONS = {
  "All":           "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop",
  "Indian":        "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=300&auto=format&fit=crop",
  "South Indian":  "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=300&auto=format&fit=crop",
  "Chinese":       "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=300&auto=format&fit=crop",
  "Italian":       "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=300&auto=format&fit=crop",
  "Mexican":       "https://images.unsplash.com/photo-1618040996337-56904b7850b9?q=80&w=300&auto=format&fit=crop",
  "American":      "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=300&auto=format&fit=crop",
  "Japanese":      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=300&auto=format&fit=crop",
  "Healthy":       "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=300&auto=format&fit=crop",
  "Mediterranean": "https://images.unsplash.com/photo-1544025162-d76538733b79?q=80&w=300&auto=format&fit=crop"
};

const ROLLING_TAGLINES = [
  "Lowest prices in town,",
  "Start your own restaurant,",
  "Most affordable meals,",
  "Quality you can trust,",
  "Quickest bites,"
];

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParam = new URLSearchParams(location.search).get("search") || "";

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [cuisine, setCuisine] = useState("All");
  const [vegFilter, setVegFilter] = useState("all");
  const [search, setSearch] = useState(searchParam);
  const [taglineIndex, setTaglineIndex] = useState(0);

  // IPR state additions
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Contexts
  const { addToCart } = useContext(CartContext);
  const { role } = useContext(AuthContext);
  const [toast, setToast] = useState(null);

  // Modal State
  const [selectedFood, setSelectedFood] = useState(null);

  useEffect(() => {
    fetchFoods(search);
  }, [category, cuisine, vegFilter]);

  useEffect(() => {
    if (searchParam) {
      setSearch(searchParam);
      fetchFoods(searchParam);
    }
  }, [searchParam]);

  // Rolling Tagline Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % ROLLING_TAGLINES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch CEPE smart predictions on mount
  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoadingRecs(true);
    try {
      const res = await API.get("/ipr/recommendations");
      setRecommendations(res.data);
    } catch (err) {
      console.warn("Failed to fetch smart recommendations:", err);
    } finally {
      setLoadingRecs(false);
    }
  };

  const fetchFoods = async (keyword = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.set("keyword", keyword);
      if (category !== "All") params.set("category", category);

      let displayCuisine = cuisine;
      if (cuisine === "South") displayCuisine = "South Indian";

      if (displayCuisine !== "All") params.set("cuisine", displayCuisine);
      if (vegFilter === "veg") params.set("isVeg", "true");
      if (vegFilter === "nonveg") params.set("isVeg", "false");
      params.set("limit", "40");

      const res = await API.get(`/foods?${params.toString()}`);
      setFoods(res.data);
    } catch (err) {
      console.error("Failed to fetch foods", err);
    } finally {
      setLoading(false);
    }
  };

  const resetAllFilters = () => {
    setSearch("");
    setCategory("All");
    setCuisine("All");
    setVegFilter("all");
    fetchFoods("");
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    fetchFoods(search);
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const listItem = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    }
  };

  return (
    <div className="max-w-md md:max-w-7xl mx-auto min-h-screen px-4 md:px-8 py-4 pt-16 bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">

      {/* 🚀 IPR Innovations Banner Portal */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        onClick={() => navigate("/ipr-dashboard")}
        className="mb-6 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/20 p-4 rounded-3xl flex items-center justify-between shadow-sm cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 text-purple-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-purple-400 tracking-wider">IPR Patents Active</p>
            <h4 className="text-xs md:text-sm font-black text-[var(--text-primary)]">Interactive Patent Specifications & System Architectures Dashboard</h4>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-black text-purple-400 group-hover:translate-x-1 transition-transform">
          <span className="hidden sm:inline">Explore Details</span>
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </motion.div>

      {role === "partner" && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 -mx-2 bg-gradient-to-r from-[var(--brand-orange)]/10 to-transparent border-l-4 border-[var(--brand-orange)] p-5 rounded-2xl flex items-center justify-between shadow-sm"
        >
          <div>
            <p className="text-[var(--text-primary)] font-bold text-sm uppercase tracking-tighter">Partner Dashboard Available</p>
            <p className="text-[var(--text-secondary)] text-[11px] font-bold">Manage your orders and reels from your profile.</p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="bg-[var(--brand-orange)] text-white px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            Manage Orders
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 z-[110] bg-[var(--text-primary)] text-[var(--bg-primary)] px-6 py-3 rounded-full flex items-center space-x-3 shadow-2xl border border-[var(--border-color)]"
          >
            <div className="w-5 h-5 rounded-full bg-[var(--brand-orange)] flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar Area */}
      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSearch}
        className="relative group mb-6 -mx-4 md:mx-auto z-20 px-4 md:px-0"
      >
        <input
          type="text"
          placeholder="Search for restaurants, cuisines or dishes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[var(--bg-surface)] border-2 border-[var(--border-color)] rounded-[2rem] py-4 pl-14 pr-6 text-[var(--text-primary)] font-bold text-base shadow-xl focus:outline-none focus:border-[var(--brand-orange)] placeholder-[var(--text-secondary)]/50 transition-all hover:border-[var(--brand-orange)]/50"
        />
        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--brand-orange)] w-6 h-6" strokeWidth={2.5} />
      </motion.form>

      {/* Header Banner Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden -mx-4 md:mx-auto mt-2 px-6 md:px-12 pt-8 pb-10 rounded-[3rem] shadow-sm mb-6"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-orange)] via-[var(--brand-yellow)] to-[var(--bg-primary)] opacity-90 z-0" />
        <motion.div
          animate={{
            rotate: [0, 5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent z-0"
        />

        <div className="relative z-10 md:max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left min-h-[100px] md:min-h-[120px] flex flex-col justify-center flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={taglineIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="text-2xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tighter leading-tight uppercase"
              >
                {ROLLING_TAGLINES[taglineIndex]}
                <br />
                <span className="text-[var(--brand-orange)] drop-shadow-sm">just a scroll away</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Reels Highlight Quick Link */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="shrink-0"
          >
            <button
              onClick={() => navigate('/reels')}
              className="flex items-center space-x-3 bg-white/20 backdrop-blur-md border border-white/30 px-5 py-3 rounded-2xl hover:bg-white/30 transition-all group shadow-xl"
            >
              <div className="w-10 h-10 bg-[var(--brand-orange)] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)]/60">Playable Reels</p>
                <p className="text-sm font-bold text-[var(--text-primary)]">Watch Trending Food</p>
              </div>
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Section 1: What's on your mind? (Cuisines) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.1 }}
        className="mt-8 mb-12"
      >
        <div className="flex items-center justify-between mb-8 px-1">
          <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] tracking-tight flex items-center">
            What's on your mind? <div className="ml-4 h-[2px] w-12 bg-[var(--brand-orange)]/30 rounded-full" />
          </h3>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.1 }}
          className="flex overflow-x-auto space-x-6 md:space-x-12 no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0"
        >
          {CUISINES.map(c => (
            <motion.button
              key={c}
              variants={listItem}
              onClick={() => setCuisine(c)}
              className="flex flex-col items-center shrink-0 group transition-all duration-300"
            >
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center overflow-hidden mb-3 transition-all duration-300 ease-out group-active:scale-95 ${cuisine === c
                  ? "border-4 border-[var(--brand-orange)] shadow-md shadow-orange-400/25 scale-110"
                  : "border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300"
                }`}>
                <img src={CUISINE_ICONS[c]} alt={c} className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-125 ${cuisine === c ? "" : "opacity-90 group-hover:opacity-100"}`} />
              </div>
              <span className={`text-[13px] md:text-[15px] tracking-tight transition-colors mt-1 ${cuisine === c
                  ? "text-[var(--brand-orange)] font-bold"
                  : "text-[var(--text-secondary)] font-semibold group-hover:text-[var(--text-primary)]"
                }`}>
                {c}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* ── CEPE Recommendation Tray: Predicted For You (IPR Patent) ── */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4 mb-12 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-transparent p-6 rounded-[2.5rem] border border-[var(--border-color)] relative"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[9px] font-black text-purple-400 uppercase tracking-[0.2em] block mb-1">CEPE Engagement Predictor</span>
              <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight flex items-center gap-2">
                ✨ Predicted For You <span className="h-[2px] w-8 bg-purple-500/40 rounded-full" />
              </h3>
            </div>
            <span className="text-[10px] font-bold text-[var(--text-secondary)] font-mono hidden sm:inline">Affinity Index calculation active</span>
          </div>

          <div className="flex overflow-x-auto space-x-6 pb-4 no-scrollbar -mx-2 px-2">
            {recommendations.map((food) => (
              <div 
                key={`recs-${food._id}`} 
                className="bg-[var(--bg-surface)] border border-[var(--border-color)] w-56 rounded-3xl p-3.5 flex flex-col shrink-0 relative hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => setSelectedFood(food)}
              >
                {/* Image */}
                <div className="h-28 w-full rounded-2xl overflow-hidden relative mb-2.5">
                  <img src={food.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&fit=crop"} alt={food.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* PPI Score badge */}
                  <div 
                    className="absolute top-2 right-2 bg-black/75 backdrop-blur-md border border-purple-500/30 px-2 py-0.5 rounded-xl text-[9px] font-extrabold text-purple-300 flex items-center gap-1 shadow-md hover:bg-purple-500 hover:text-white transition-all cursor-help"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTooltip(activeTooltip === food._id ? null : food._id);
                    }}
                  >
                    <Activity className="w-2.5 h-2.5 text-purple-400" />
                    <span>{food.ppi}% PPI</span>
                  </div>
                </div>

                {/* Telemetry overlay inside the card if tooltipped */}
                <AnimatePresence>
                  {activeTooltip === food._id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute inset-x-2.5 top-2.5 bottom-2.5 bg-black/95 backdrop-blur-lg border border-purple-500/30 p-3.5 rounded-2xl z-20 flex flex-col justify-between text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center pb-1 border-b border-white/10">
                        <span className="text-[8px] font-black text-purple-400 uppercase">CEPE Engine Telemetry</span>
                        <button onClick={() => setActiveTooltip(null)} className="p-0.5 bg-white/10 rounded hover:bg-white/15"><X className="w-2.5 h-2.5 text-white" /></button>
                      </div>
                      <div className="space-y-1 text-[8px] font-bold uppercase tracking-wider text-white/80">
                        <div className="flex justify-between">
                          <span>Dwell ({food.ppiTelemetry?.calculatedDwellTime || 12}s)</span>
                          <span className="text-purple-400">{food.ppiTelemetry?.dwellScore || 70}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Loop Count ({food.ppiTelemetry?.calculatedLoops || 1})</span>
                          <span className="text-purple-400">{food.ppiTelemetry?.loopScore || 75}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Affinity Match</span>
                          <span className="text-purple-400">{food.ppiTelemetry?.categoryAffinity || 95}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Temporal Suitability</span>
                          <span className="text-purple-400">{food.ppiTelemetry?.temporalScore || 90}%</span>
                        </div>
                      </div>
                      <p className="text-[7px] font-bold text-white/45 pt-1 border-t border-white/5 font-mono leading-none">
                        PPI = (0.3*Aff) + (0.4*Dwell) + (0.2*Loop) + (0.1*Time)
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Title & info */}
                <div>
                  <h4 className="font-extrabold text-xs text-[var(--text-primary)] uppercase line-clamp-1 leading-tight">{food.name}</h4>
                  <span className="text-[9px] font-bold text-[var(--text-secondary)] block mt-0.5">{food.restaurant}</span>
                </div>

                <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--border-color)]">
                  <span className="text-xs font-black">₹{food.price}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(food);
                      setToast(`${food.name} added to cart! 🛒`);
                      setTimeout(() => setToast(null), 2000);
                    }}
                    className="bg-[var(--brand-orange)] text-white px-3.5 py-1 rounded-lg text-[9px] font-black uppercase hover:scale-105 active:scale-95 transition-all shadow-md shadow-orange-500/10"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Section 2: Registered Partners ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
      >
        <RegisteredRestaurants onSelect={(name) => { setSearch(name); fetchFoods(name); }} />
      </motion.div>

      {/* ── Section 3: Top Brands (Dynamic from foods) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        className="relative z-20 md:max-w-7xl md:mx-auto"
      >
        <NearbyRestaurants foods={foods} onRestaurantClick={(name) => { setSearch(name); fetchFoods(name); }} />
      </motion.div>

      {/* ── Section 3: Main Feed & Filters ── */}
      <div className="mt-16 space-y-8">

        {/* Quick Filters Row */}
        <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar py-2 px-1">
          <button
            onClick={() => setVegFilter("all")}
            className={`flex items-center shrink-0 px-6 py-2.5 rounded-2xl text-[13px] font-bold border transition-all ${vegFilter === "all" ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)] shadow-lg" : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]"}`}
          >
            All
          </button>
          <button
            onClick={() => setVegFilter("veg")}
            className={`flex items-center shrink-0 px-6 py-2.5 rounded-2xl text-[13px] font-bold border transition-all ${vegFilter === "veg" ? "bg-[#3D9970]/10 text-[#3D9970] border-[#3D9970]/30 shadow-sm" : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-color)]"}`}
          >
            <div className="w-3.5 h-3.5 rounded-sm border-2 border-[#3D9970] flex items-center justify-center mr-2"><div className="w-1.5 h-1.5 rounded-full bg-[#3D9970]"></div></div>
            Veg
          </button>
          <button
            onClick={() => setVegFilter("nonveg")}
            className={`flex items-center shrink-0 px-6 py-2.5 rounded-2xl text-[13px] font-bold border transition-all ${vegFilter === "nonveg" ? "bg-[#E23744]/10 text-[#E23744] border-[#E23744]/30 shadow-sm" : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-color)]"}`}
          >
            <div className="w-3.5 h-3.5 rounded-sm border-2 border-[#E23744] flex items-center justify-center mr-2"><div className="w-1.5 h-1.5 rounded-full bg-[#E23744]"></div></div>
            Non-Veg
          </button>

          <div className="flex-grow" />
          <button onClick={resetAllFilters} className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-[var(--brand-orange)] hover:underline px-4">Reset All</button>
        </div>

        {/* Food Feed */}
        <div className="pb-32">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              {loading ? "Discovering..." : `${foods.length} items curated for you`}
            </h2>
            <div className="h-[2px] w-12 bg-[var(--brand-orange)] rounded-full" />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-[var(--bg-surface)] h-72 rounded-[2rem] border border-[var(--border-color)] shadow-sm" />
              ))}
            </div>
          ) : foods.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-[var(--bg-surface)] rounded-[3rem] border border-[var(--border-color)] shadow-sm"
            >
              <p className="text-6xl mb-6">🍛</p>
              <p className="text-[var(--text-primary)] font-bold text-xl">No dishes found</p>
              <p className="text-[var(--text-secondary)] text-sm mt-2 max-w-[250px] mx-auto">We couldn't find items matching your filters. Try exploring other cuisines!</p>
              <button onClick={resetAllFilters} className="mt-8 px-8 py-3 bg-[var(--brand-orange)] rounded-full text-sm font-bold text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">Reset Filters</button>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8"
            >
              {foods.map(food => (
                <motion.div
                  key={food._id}
                  variants={listItem}
                  whileHover={{ y: -5 }}
                  className="card-surface overflow-hidden flex flex-col group cursor-pointer relative"
                  onClick={() => setSelectedFood(food)}
                >
                  {/* Image Overlay */}
                  <div className="h-60 sm:h-44 md:h-48 relative overflow-hidden">
                    {food.imageUrl ? (
                      <div className="relative w-full h-full">
                        <img
                          src={food.imageUrl}
                          alt={food.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          onLoad={(e) => {
                            e.target.style.opacity = 1;
                            e.target.nextSibling.style.opacity = 0;
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                            e.target.nextSibling.style.opacity = 1;
                          }}
                          style={{ opacity: 0, transition: 'opacity 0.5s ease' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-5xl transition-opacity duration-500">🍽️</div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-5xl">🍽️</div>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center bg-white shadow-sm ${food.isVeg ? "border-[#3D9970]" : "border-[#E23744]"}`}>
                        <div className={`w-2 h-2 rounded-full ${food.isVeg ? "bg-[#3D9970]" : "bg-[#E23744]"}`} />
                      </div>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-xl border border-white/30 px-3 py-1.5 rounded-full text-[13px] font-bold text-white flex items-center shadow-2xl">
                      4.5 <Star className="w-3.5 h-3.5 ml-1 fill-[var(--brand-orange)] text-[var(--brand-orange)]" />
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--brand-orange)] transition-colors tracking-tight uppercase">{food.name}</h3>
                    </div>
                    <p className="text-gray-500 text-sm font-bold truncate mb-6">{food.restaurant}</p>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="text-[var(--text-primary)] font-bold text-xl tracking-tight">₹{food.price}</div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(food);
                          setToast(`${food.name} added to cart!`);
                          setTimeout(() => setToast(null), 2000);
                        }}
                        className="bg-[var(--bg-surface)] border-2 border-[var(--brand-orange)] text-[var(--brand-orange)] px-6 py-2 rounded-xl text-xs font-bold uppercase hover:bg-[var(--brand-orange)] hover:text-white transition-all duration-300 shadow-sm active:scale-95 flex items-center space-x-2"
                      >
                        <span>ADD</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-orange)] group-hover:bg-white" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <FoodDetailModal
        food={selectedFood}
        onClose={() => setSelectedFood(null)}
      />
    </div>
  );
}
