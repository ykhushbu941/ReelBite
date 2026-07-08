import { useNavigate } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { token, loading } = useContext(AuthContext);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[var(--bg-primary)] flex flex-col justify-between p-6 relative z-10 pt-20 overflow-hidden text-[var(--text-primary)] transition-colors duration-300">
      {/* Background Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1],
          x: [0, 20, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--brand-orange)] blur-[120px] rounded-full z-0" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.12, 0.1],
          x: [0, -20, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--brand-yellow)] blur-[120px] rounded-full z-0" 
      />

      {/* Hero Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col md:flex-row justify-center items-center text-center md:text-left max-w-sm md:max-w-6xl mx-auto md:w-full md:gap-16 lg:gap-32 relative z-10"
      >
        
        {/* Main Graphic/Icon */}
        <motion.div 
          variants={itemVariants}
          className="relative group mb-12 md:mb-0 md:order-2"
        >
            <motion.div 
              animate={{ rotate: [-2, 0, -2], y: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-64 h-[400px] md:w-80 md:h-[500px] bg-black rounded-[3rem] md:rounded-[4rem] shadow-2xl shadow-orange-500/20 overflow-hidden relative border-4 border-white/10"
            >
                {/* 🎥 Hero Visual — Split view for Photo vs Reel */}
                <div className="absolute inset-0 flex w-full h-full">
                  {/* Left: Photo (Static / Less accurate) */}
                  <div className="w-1/2 h-full relative overflow-hidden bg-gray-100 border-r border-white/10 opacity-90 group-hover:opacity-60 transition-opacity duration-500">
                    <div className="absolute top-4 left-3 bg-black/60 backdrop-blur-md text-white/80 text-[8px] sm:text-[10px] px-2 py-1 rounded-full z-10 font-bold tracking-widest uppercase border border-white/10">Photo (Static)</div>
                    <img
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop"
                      alt="Static Dish"
                      className="w-full h-full object-cover filter grayscale-[30%] contrast-75"
                    />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                       <span className="bg-red-500/80 text-white text-[8px] px-2 py-0.5 rounded-full font-bold uppercase backdrop-blur-sm">Less Accurate</span>
                    </div>
                  </div>
                  
                  {/* Right: Reel (Dynamic / Realistic) */}
                  <div className="w-1/2 h-full relative overflow-hidden bg-black group-hover:w-[60%] transition-all duration-500 ease-out origin-left shadow-[-20px_0_30px_rgba(0,0,0,0.5)] z-10">
                    <div className="absolute top-4 right-3 bg-[var(--brand-orange)] text-white text-[8px] sm:text-[10px] px-2 py-1 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)] z-10 font-black tracking-widest uppercase flex items-center gap-1 border border-white/20"><Play className="w-2.5 h-2.5" fill="currentColor"/> Reel (Realistic)</div>
                    <img
                      src="https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=600&auto=format&fit=crop"
                      alt="Premium Dish"
                      className="w-full h-full object-cover brightness-110 contrast-110 group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Reel UI Overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-4 left-3 right-3 text-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 overflow-hidden border border-white/50">
                             <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&q=80" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[9px] sm:text-[11px] font-bold">@tastemaker</span>
                        </div>
                        <span className="bg-[#3D9970] text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">100% Real</span>
                      </div>
                      <p className="text-[9px] sm:text-[10px] font-medium opacity-90 line-clamp-2 leading-tight">Look at that cheese pull! 🧀🔥 Way better than the menu photo.</p>
                    </div>
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-white/20 backdrop-blur-md rounded-full p-3 sm:p-4 border border-white/30 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
                            <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white ml-0.5" />
                        </div>
                    </div>
                  </div>
                </div>
            </motion.div>
            
            {/* Absolute badges floating */}
            <motion.div 
               animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
               className="absolute top-10 -right-8 bg-[var(--bg-surface)] px-4 py-2 rounded-2xl shadow-xl font-black text-[var(--text-primary)] text-sm border border-[var(--border-color)] z-20"
            >
               Trending 🔥
            </motion.div>
            
            <motion.div 
               animate={{ y: [0, 8, 0], x: [0, -5, 0] }}
               transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute bottom-10 -left-8 bg-[var(--bg-primary)] px-4 py-2 rounded-2xl shadow-xl font-black text-[var(--brand-orange)] text-sm border border-[var(--border-color)] z-20"
            >
               Watch & Order
            </motion.div>
        </motion.div>
        
        <div className="md:order-1 flex flex-col items-center md:items-start md:max-w-lg">
            <motion.h1 
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter mb-6 uppercase"
            >
              Taste the <span className="text-[var(--brand-orange)]">Future</span> of Food.
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-[var(--text-secondary)] font-bold mb-12 md:text-xl leading-relaxed"
            >
              The most affordable way to enjoy premium food or start your own restaurant. Watch, order, and grow with the lowest commissions.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row w-full gap-5 mt-2"
            >
              <button 
                onClick={() => navigate('/login')}
                className="group bg-[var(--text-primary)] text-[var(--bg-primary)] w-full py-5 px-10 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-black/20 hover:scale-[1.03] active:scale-95 transition-all"
              >
                Get Started
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
              </button>
              
              <button 
                onClick={() => navigate('/register')}
                className="bg-[var(--bg-surface)] text-[var(--text-primary)] border-2 border-[var(--border-color)] w-full py-5 px-10 rounded-[2rem] font-black text-lg hover:border-[var(--brand-orange)]/50 transition-all shadow-xl shadow-black/[0.02] hover:scale-[1.03] active:scale-95"
              >
                Join Now
              </button>
            </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
