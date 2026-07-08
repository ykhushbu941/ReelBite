import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, CheckCircle, ChevronRight, BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function RegisteredRestaurants({ onSelect }) {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await API.get("/auth/partners");
      setPartners(res.data);
    } catch (err) {
      console.error("Error fetching partners:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
      <div className="flex space-x-6 overflow-x-auto no-scrollbar py-8 px-1">
        {[1,2,3,4].map(i => (
          <div key={i} className="w-72 h-32 bg-[var(--bg-surface)] rounded-[2.5rem] animate-pulse shrink-0 border border-[var(--border-color)]" />
        ))}
      </div>
  );

  if (partners.length === 0) return null;

  return (
    <div className="mt-12 mb-16">
      <div className="flex items-center justify-between mb-8 px-1">
        <h3 className="text-xl md:text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center italic uppercase">
          Elite <span className="text-[var(--brand-orange)] ml-2">Partners</span>
          <div className="ml-4 h-[2px] w-12 bg-[var(--brand-orange)]/30 rounded-full" />
        </h3>
        <button className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-orange)] flex items-center gap-1 group">
           Explore All <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex overflow-x-auto space-x-6 no-scrollbar pb-8 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory">
        {partners.map((partner) => (
          <motion.div
            key={partner.id || partner._id}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect ? onSelect(partner.restaurantName || partner.name) : navigate(`/home?search=${encodeURIComponent(partner.restaurantName || partner.name)}`)}
            className="flex-shrink-0 w-80 bg-[var(--bg-surface)] p-6 rounded-[2.5rem] border border-[var(--border-color)] shadow-sm hover:shadow-2xl hover:shadow-orange-500/5 transition-all text-left flex items-center space-x-5 group cursor-pointer snap-center"
          >
            {/* Logo Wrapper */}
            <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-[var(--bg-primary)] shadow-lg bg-white group-hover:border-[var(--brand-orange)] transition-all duration-500 rotate-3 group-hover:rotate-0">
                  <img 
                    src={partner.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.restaurantName || partner.name)}&background=FC8019&color=fff&bold=true`} 
                    alt={partner.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[var(--brand-orange)] rounded-full p-1 shadow-lg border-2 border-[var(--bg-surface)]">
                  <BadgeCheck className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
            </div>

            {/* Info */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center space-x-1.5 mb-1">
                <h4 className="font-black text-lg text-[var(--text-primary)] tracking-tight group-hover:text-[var(--brand-orange)] transition-colors line-clamp-1 italic uppercase">
                  {partner.restaurantName || partner.name}
                </h4>
              </div>
              
              <div className="flex items-center text-[var(--text-secondary)] mb-3">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-[var(--bg-primary)] px-2.5 py-1 rounded-lg border border-[var(--border-color)]">
                   Authentic
                </span>
              </div>

              <div className="flex items-center space-x-4 text-[11px] font-black text-[var(--text-secondary)]">
                <div className="flex items-center space-x-1.5">
                  <Star className="w-3.5 h-3.5 text-[var(--brand-orange)] fill-[var(--brand-orange)]" />
                  <span className="text-[var(--text-primary)]">4.9</span>
                </div>
                <div className="flex items-center space-x-1.5 opacity-60">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[80px]">{partner.address?.split(',')[0] || "1.2 km"}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
