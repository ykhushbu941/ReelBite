import { useState, useEffect, useContext } from "react";
import API from "../api/api";
import { CartContext } from "../context/CartContext";
import { Bookmark, Plus, ShoppingBag, ArrowLeft, Trash2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function SavedPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedFoods();
  }, []);

  const fetchSavedFoods = async () => {
    try {
      const res = await API.get("/auth/user/me");
      setFoods(res.data.savedFoods || []);
    } catch (err) {
      console.error("Failed to fetch saved foods", err);
    } finally {
      setLoading(false);
    }
  };

  const removeSaved = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await API.post(`/auth/user/save/${id}`);
      setFoods(foods.filter(f => f._id !== id));
      setToast("Removed from collections");
      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      console.error("Failed to remove saved food");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="max-w-7xl mx-auto min-h-screen px-4 pt-20 pb-28 bg-[var(--bg-primary)] transition-colors duration-300">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 z-[110] bg-[var(--text-primary)] text-[var(--bg-primary)] px-6 py-3 rounded-full flex items-center space-x-3 shadow-2xl"
          >
            <CheckCircle className="w-4 h-4 text-[var(--brand-orange)]" />
            <span className="text-sm font-bold">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-10"
      >
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[var(--brand-orange)]/10 rounded-[1.5rem] flex items-center justify-center border border-[var(--brand-orange)]/20 shadow-lg shadow-orange-500/5">
              <Bookmark className="w-7 h-7 text-[var(--brand-orange)]" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight italic uppercase">Saved <span className="text-[var(--brand-orange)]">Reels</span></h1>
              <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mt-1 ml-1">Your curated food gallery</p>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-80 bg-[var(--bg-surface)] rounded-[2.5rem] animate-pulse border border-[var(--border-color)]" />
            ))}
          </div>
        ) : foods.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--bg-surface)] p-20 text-center rounded-[3rem] border border-[var(--border-color)] shadow-sm flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-[var(--bg-primary)] rounded-full flex items-center justify-center mb-8 shadow-inner">
              <Bookmark className="w-10 h-10 text-[var(--text-secondary)]/20" />
            </div>
            <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2 tracking-tight uppercase">Your gallery is empty</h2>
            <p className="text-[var(--text-secondary)] max-w-xs font-bold mb-10 text-sm">Save your favorite food reels to build your ultimate foodie collection!</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/reels')}
              className="bg-[var(--brand-orange)] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-orange-500/20 active:scale-95 transition-all"
            >
              Start Exploring
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {foods.map(food => (
              <motion.div 
                key={food._id} 
                variants={itemVariants}
                layout
                onClick={() => navigate(`/home?search=${encodeURIComponent(food.name)}`)}
                className="bg-[var(--bg-surface)] rounded-[2.5rem] overflow-hidden border border-[var(--border-color)] group cursor-pointer hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500"
              >
                <div className="h-64 bg-[var(--bg-primary)] relative flex items-center justify-center overflow-hidden">
                   {(food.videoUrl && !food.videoUrl.includes("dummy")) ? (
                     <video 
                        src={food.videoUrl} 
                        className="object-cover w-full h-full opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" 
                        muted 
                        loop
                        onMouseOver={(e) => e.target.play()}
                        onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                     />
                   ) : (
                     <div className="text-7xl group-hover:scale-110 transition-transform duration-500 grayscale opacity-30">🍔</div>
                   )}
                   
                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                   <motion.button 
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.9 }}
                     onClick={(e) => removeSaved(food._id, e)}
                     className="absolute top-5 right-5 bg-white/20 backdrop-blur-xl p-2.5 rounded-[1.25rem] border border-white/20 hover:bg-red-500 hover:border-red-500 transition-all z-20"
                   >
                      <Trash2 className="w-4 h-4 text-white" />
                   </motion.button>

                   <div className="absolute bottom-5 left-5 z-20">
                      <div className="bg-white/20 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/20 shadow-xl">
                        <span className="text-[12px] font-black text-white uppercase tracking-widest">₹{food.price}</span>
                      </div>
                   </div>
                </div>
                
                <div className="p-6">
                   <div className="mb-6">
                     <div className="flex items-center gap-1.5 mb-1.5">
                        <div className={`w-2.5 h-2.5 rounded-sm border flex items-center justify-center ${food.isVeg ? "border-[#3D9970]" : "border-[#E23744]"}`}>
                          <div className={`w-1 h-1 rounded-full ${food.isVeg ? "bg-[#3D9970]" : "bg-[#E23744]"}`} />
                        </div>
                        <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">{food.cuisine || 'Fast Food'}</span>
                     </div>
                     <h3 className="font-black text-[var(--text-primary)] text-xl leading-tight truncate group-hover:text-[var(--brand-orange)] transition-colors">{food.name}</h3>
                     <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mt-1.5 opacity-60 italic">{food.restaurant}</p>
                   </div>
                   
                   <motion.button 
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={(e) => { e.stopPropagation(); addToCart(food); setToast(`${food.name} added to cart!`); }}
                     className="w-full bg-[var(--bg-primary)] hover:bg-[var(--brand-orange)] py-4 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all border border-[var(--border-color)] hover:border-[var(--brand-orange)] text-[var(--text-primary)] hover:text-white font-black text-[11px] uppercase tracking-widest group/btn shadow-sm"
                   >
                     <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform" />
                     Add to Cart
                   </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
