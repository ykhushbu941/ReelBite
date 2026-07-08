import { useContext, useEffect, useState } from "react";
import { X, Star, Clock, MapPin, Plus, Minus, Video, Navigation, ShieldCheck, Activity } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function FoodDetailModal({ food, onClose }) {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // VFQAI state declarations
  const [showVfqaiOverlay, setShowVfqaiOverlay] = useState(false);
  const [vfqaiScore, setVfqaiScore] = useState({ score: 9.1, visualSimilarity: 91, portionMatch: 89, steamMatch: 93 });
  const [isScanning, setIsScanning] = useState(false);

  // Sync VFQAI score from food model when loaded
  useEffect(() => {
    if (food?.qualityScore) {
      setVfqaiScore(food.qualityScore);
    } else {
      // Generate randomized realistic score if not set
      setVfqaiScore({ score: 8.8, visualSimilarity: 88, portionMatch: 89, steamMatch: 90 });
    }
  }, [food]);

  // Find item in cart to get accurate quantity
  useEffect(() => {
    const item = cart.find(c => c.food._id === food?._id);
    setQuantity(item ? item.quantity : 0);
  }, [cart, food]);

  // Handle slide-up animation
  useEffect(() => {
    if (food) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [food]);

  if (!food) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // wait for animation
  };

  const handleAdd = () => {
    addToCart(food);
  };

  const handleRemove = () => {
    if (quantity > 0) {
      removeFromCart(food._id);
    }
  };

  const viewReel = () => {
    handleClose();
    navigate(`/reels?foodId=${food._id}`);
  };

  const openMaps = () => {
    if (food.description) {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(food.description + " " + food.restaurant)}`;
        window.open(url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 pointer-events-none">
      
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto ${isVisible ? 'opacity-100' : 'opacity-0'}`} 
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div 
        className={`w-full max-w-md bg-[var(--bg-surface)] rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden relative shadow-2xl pointer-events-auto transition-transform duration-300 ease-out border-t border-[var(--border-color)] sm:border ${isVisible ? 'translate-y-0' : 'translate-y-full sm:translate-y-8 sm:opacity-0 sm:scale-95'}`}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 z-10 p-2.5 bg-black/40 backdrop-blur-xl rounded-full text-white hover:bg-black/60 transition shadow-lg border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="h-72 sm:h-80 w-full relative">
          <img 
            src={food.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"} 
            alt={food.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-transparent to-transparent opacity-80" />
        </div>

        {/* Details Section */}
        <div className="px-8 relative -top-12 bg-[var(--bg-surface)] rounded-t-[3rem] pt-4 pb-8 flex flex-col h-[calc(100vh-14rem)] sm:h-auto sm:max-h-[75vh]">
          
          {/* Drag Handle */}
          <div className="w-12 h-1.5 bg-[var(--text-secondary)]/20 rounded-full mx-auto mb-8 shrink-0" />
          
          <div className="overflow-y-auto no-scrollbar flex-grow pb-32">
            
            {/* Header info */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${food.isVeg ? "border-[#3D9970] bg-[#3D9970]/10" : "border-[#E23744] bg-[#E23744]/10"}`}>
                    <div className={`w-2 h-2 rounded-full ${food.isVeg ? "bg-[#3D9970]" : "bg-[#E23744]"}`} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Authentic {food.cuisine}</span>
                </div>
                <h2 className="text-3xl font-black text-[var(--text-primary)] leading-tight tracking-tighter uppercase italic">{food.name}</h2>
                <p className="text-[var(--brand-orange)] font-black text-sm flex items-center mt-2 uppercase tracking-widest italic">
                    {food.restaurant}
                </p>
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                <p className="text-2xl font-black text-[var(--text-primary)] tracking-tight">₹{food.price}</p>
                <div className="flex items-center justify-end text-[#3D9970] text-[11px] mt-2 font-black bg-[#3D9970]/10 px-2 py-1 rounded-lg w-max ml-auto border border-[#3D9970]/20">
                    <Star className="w-3.5 h-3.5 fill-[#3D9970] mr-1" />
                    4.8
                </div>
              </div>
            </div>

            <div className="flex gap-4 my-8">
               <div className="flex-1 bg-[var(--bg-primary)] p-4 rounded-[2rem] border border-[var(--border-color)]">
                  <span className="text-[10px] font-black uppercase text-[var(--text-secondary)] block mb-1">Cuisine</span>
                  <span className="text-sm font-black text-[var(--text-primary)]">{food.cuisine || "Gourmet"}</span>
               </div>
               <div className="flex-1 bg-[var(--bg-primary)] p-4 rounded-[2rem] border border-[var(--border-color)]">
                  <span className="text-[10px] font-black uppercase text-[var(--text-secondary)] block mb-1">Prep Time</span>
                  <span className="text-sm font-black text-[var(--text-primary)]">25-30 MIN</span>
               </div>
            </div>

            {/* VFQAI: Food Quality Authenticity Card */}
            <div 
              onClick={() => setShowVfqaiOverlay(true)}
              className="mb-6 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent border border-blue-500/20 rounded-[2.5rem] p-6 hover:border-blue-500/40 transition-all cursor-pointer space-y-3 shadow-md shadow-blue-500/5"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block leading-none">VFQAI Index</span>
                    <span className="text-xs font-black text-[var(--text-primary)] uppercase">Visual Quality Score</span>
                  </div>
                </div>
                <div className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-2xl text-xs font-black">
                  {vfqaiScore.score.toFixed(1)}/10
                </div>
              </div>
              
              <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] font-bold pt-1 border-t border-white/5">
                <span>Visual Match: {vfqaiScore.visualSimilarity}%</span>
                <span>Portion: {vfqaiScore.portionMatch}%</span>
                <span>Steam Match: {vfqaiScore.steamMatch}%</span>
              </div>
              <p className="text-[9px] text-blue-400 font-semibold text-center mt-1">
                🔍 Click to view side-by-side computer vision scan
              </p>
            </div>

            {/* Restaurant Address & Location tracking */}
            <div className="mt-6 bg-[var(--bg-primary)] p-6 rounded-[2.5rem] border border-[var(--border-color)] group hover:border-[var(--brand-orange)]/30 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                  <h3 className="text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[var(--brand-orange)]" /> Restaurant Address
                  </h3>
                  <button 
                    onClick={openMaps}
                    className="bg-[var(--brand-orange)] p-2.5 rounded-2xl text-white shadow-lg shadow-orange-500/20 active:scale-90 transition-all group-hover:bg-orange-600"
                  >
                    <Navigation className="w-4 h-4" />
                  </button>
              </div>
              <p className="text-sm font-bold text-[var(--text-primary)] leading-relaxed mb-4">
                {food.description || "Visit our restaurant to experience the true essence of this dish. Authenticity in every bite."}
              </p>
              <button 
                onClick={openMaps}
                className="w-full py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest hover:text-[var(--brand-orange)] hover:border-[var(--brand-orange)]/30 transition-all"
              >
                Track Location on Maps
              </button>
            </div>
            
            {/* Watch Reel Action */}
            <button 
               onClick={viewReel}
               className="w-full mt-6 bg-gradient-to-r from-[var(--brand-orange)]/10 to-transparent border border-[var(--brand-orange)]/20 rounded-[2.5rem] p-6 flex items-center justify-between hover:bg-[var(--brand-orange)]/10 transition-all group"
            >
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--brand-orange)] flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                     <Video className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-[13px] font-black text-[var(--text-primary)] uppercase tracking-tight">Watch it sizzle</h4>
                    <p className="text-[11px] font-bold text-[var(--text-secondary)]">Experience the cinematic food reel</p>
                  </div>
               </div>
               <div className="text-[var(--brand-orange)] font-black text-xs uppercase tracking-widest">Play</div>
            </button>

          </div>

          {/* Bottom Action Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-[var(--bg-surface)]/80 backdrop-blur-xl border-t border-[var(--border-color)] flex items-center gap-4 safe-area-bottom">
            <div className="flex-1">
              {quantity === 0 ? (
                <button 
                  onClick={handleAdd}
                  disabled={food.outOfStock}
                  className="w-full h-16 bg-[var(--brand-orange)] text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 active:scale-95 transition-all outline-none uppercase tracking-widest text-sm"
                >
                  Add to Cart
                </button>
              ) : (
                <div className="w-full h-16 bg-[var(--bg-primary)] border border-[var(--brand-orange)]/50 rounded-2xl flex items-center justify-between px-4">
                  <button onClick={handleRemove} className="w-10 h-10 flex items-center justify-center bg-[var(--bg-surface)] text-[var(--brand-orange)] active:scale-90 rounded-xl border border-[var(--border-color)]">
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="font-black text-[var(--text-primary)] text-xl w-8 text-center">{quantity}</span>
                  <button onClick={handleAdd} className="w-10 h-10 flex items-center justify-center bg-[var(--bg-surface)] text-[var(--brand-orange)] active:scale-90 rounded-xl border border-[var(--border-color)]">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            
            <button 
                className="flex-1 h-16 bg-[var(--text-primary)] text-[var(--bg-primary)] font-black rounded-2xl active:scale-95 transition-all shadow-xl flex items-center justify-center uppercase tracking-widest text-sm"
                onClick={() => { handleClose(); navigate('/cart'); }}
            >
                {quantity > 0 ? `Checkout (₹${food.price * quantity})` : "View Cart"}
            </button>
          </div>

        </div>
      </div>

      {/* ── VFQAI Side-by-Side Comparison Overlay (Patent Presentation) ── */}
      <AnimatePresence>
        {showVfqaiOverlay && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 pointer-events-auto animate-fade-in" onClick={() => setShowVfqaiOverlay(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm bg-[var(--bg-surface)] border border-blue-500/30 rounded-[2.5rem] p-6 space-y-6 shadow-2xl relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Decorative radial highlight */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <div>
                    <h3 className="text-xs font-black uppercase text-[var(--text-primary)]">VFQAI Scan Report</h3>
                    <p className="text-[7.5px] font-black text-blue-400 uppercase tracking-widest leading-none">Multi-Spectral Authenticity Index</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowVfqaiOverlay(false)}
                  className="p-1.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] hover:text-white transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Side by side comparison images */}
              <div className="grid grid-cols-2 gap-4 relative">
                
                {/* Scan laser line animation */}
                {isScanning && (
                  <motion.div 
                    initial={{ top: "0%" }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 1.8, repeat: 1, ease: "easeInOut" }}
                    className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_12px_#3b82f6] z-30 pointer-events-none"
                  />
                )}

                <div className="space-y-1 text-center">
                  <span className="text-[8px] font-black text-white/50 uppercase block">Promo Reel Frame</span>
                  <div className="h-24 rounded-2xl overflow-hidden border border-white/10 relative">
                    <img src={food.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300"} className="w-full h-full object-cover" />
                    {/* Simulated Bounding Box */}
                    <div className="absolute top-2 left-2 right-2 bottom-2 border border-emerald-500/60 rounded flex items-center justify-center bg-emerald-500/5">
                      <span className="bg-emerald-500 text-white text-[6px] font-black px-1 rounded-sm uppercase tracking-wide scale-90">PORTION_VOL</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-center">
                  <span className="text-[8px] font-black text-white/50 uppercase block">User Review Image</span>
                  <div className="h-24 rounded-2xl overflow-hidden border border-white/10 relative">
                    <img src={food.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300"} className="w-full h-full object-cover brightness-95" />
                    {/* Simulated Bounding Box */}
                    <div className="absolute top-4 left-4 right-4 bottom-2 border border-cyan-400/60 rounded flex items-end justify-center bg-cyan-400/5">
                      <span className="bg-cyan-400 text-black text-[6px] font-black px-1 rounded-sm uppercase tracking-wide scale-90 mb-0.5">STEAM_PIXELS</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={async () => {
                    setIsScanning(true);
                    await new Promise(r => setTimeout(r, 2000));
                    try {
                      const res = await API.post("/ipr/vfqai-verify", { foodId: food._id });
                      if (res.data?.success) {
                        setVfqaiScore(res.data.qualityScore);
                      }
                    } catch (e) {
                      console.warn("Failed VFQAI scan request", e);
                    } finally {
                      setIsScanning(false);
                    }
                  }}
                  disabled={isScanning}
                  className="w-full py-3 bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 rounded-2xl font-bold text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
                >
                  {isScanning ? (
                    <>
                      <div className="w-3.5 h-3.5 border border-blue-400 border-t-transparent rounded-full animate-spin" />
                      <span>Running VFQAI Scan Engine...</span>
                    </>
                  ) : (
                    <span>Run Visual Similarity Scan</span>
                  )}
                </button>

                <div className="p-3.5 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] space-y-2">
                  <div className="flex justify-between items-center text-[9px] font-bold">
                    <span className="text-[var(--text-secondary)] uppercase">Color Profile Similarity</span>
                    <span className="text-[var(--text-primary)] font-extrabold font-mono">{vfqaiScore.visualSimilarity}% Match</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-bold">
                    <span className="text-[var(--text-secondary)] uppercase">Portion Consistency</span>
                    <span className="text-[var(--text-primary)] font-extrabold font-mono">{vfqaiScore.portionMatch}% Consistent</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-bold">
                    <span className="text-[var(--text-secondary)] uppercase">Steam Freshness Index</span>
                    <span className="text-[var(--text-primary)] font-extrabold font-mono">{vfqaiScore.steamMatch}% Matching</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-extrabold pt-2 border-t border-white/5">
                    <span className="text-[var(--text-primary)] uppercase">Aggregate VFQAI score</span>
                    <span className="text-blue-400 font-black text-xs font-mono">{vfqaiScore.score.toFixed(1)}/10</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-2xl text-[8px] font-semibold text-blue-400 leading-normal font-mono">
                Formula: VFQAI = (0.3*Color) + (0.4*Portion) + (0.3*Steam)
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
