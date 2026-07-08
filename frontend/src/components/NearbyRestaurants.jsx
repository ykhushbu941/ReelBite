import { Star, Clock, MapPin, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function NearbyRestaurants({ foods, onRestaurantClick }) {
  // Extract unique restaurants from foods
  if (!foods || foods.length === 0) return null;

  // Group foods by restaurant to get images/cuisines
  const restaurantMap = new Map();
  
  foods.forEach(food => {
      if (!restaurantMap.has(food.restaurant)) {
          // generate random metrics for mock purposes based on string hash to remain consistent
          const hash = food.restaurant.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
          const time = 20 + (Math.abs(hash) % 25); // 20-45 mins
          const rating = 3.8 + ((Math.abs(hash) % 12) / 10); // 3.8 - 4.9
          
          restaurantMap.set(food.restaurant, {
              name: food.restaurant,
              image: food.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
              rating: rating.toFixed(1),
              time: `${time}-${time + 10} mins`,
              cuisines: [food.cuisine].filter(c => c && c !== "Other")
          });
      } else {
          // Add cuisine if unique
          const entry = restaurantMap.get(food.restaurant);
          if (food.cuisine && food.cuisine !== 'Other' && !entry.cuisines.includes(food.cuisine)) {
              if (entry.cuisines.length < 2) entry.cuisines.push(food.cuisine);
          }
      }
  });

  const restaurants = Array.from(restaurantMap.values());

  if (restaurants.length === 0) return null;

  return (
    <div className="mt-12 mb-16 px-1">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl md:text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center">
          Top Brands <div className="ml-4 h-[2px] w-12 bg-[var(--brand-orange)]/30 rounded-full" />
        </h3>
        <button className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-orange)] flex items-center gap-1 group">
           See All <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex overflow-x-auto space-x-6 no-scrollbar pb-6 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory">
        {restaurants.map((rest, i) => (
          <motion.div 
             key={i} 
             whileHover={{ y: -5 }}
             whileTap={{ scale: 0.98 }}
             onClick={() => onRestaurantClick && onRestaurantClick(rest.name)}
             className="min-w-[280px] max-w-[280px] md:min-w-[320px] md:max-w-[320px] snap-center bg-[var(--bg-surface)] rounded-[2.5rem] overflow-hidden shadow-sm border border-[var(--border-color)] flex flex-col shrink-0 cursor-pointer hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300"
          >
            {/* Image Banner */}
            <div className="h-40 md:h-44 w-full relative group">
               <img src={rest.image} alt={rest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-transparent to-transparent opacity-60" />
               <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-xl px-3 py-1 rounded-xl text-[10px] font-black text-white flex items-center shadow-lg border border-white/20 uppercase tracking-[0.2em]">
                  HOT DEAL 🔥
               </div>
            </div>

            {/* Details */}
            <div className="p-6 flex flex-col flex-grow">
               <div className="flex justify-between items-start mb-1.5">
                  <h4 className="font-black text-[var(--text-primary)] truncate max-w-[180px] text-lg tracking-tight group-hover:text-[var(--brand-orange)] transition-colors">{rest.name}</h4>
                  <div className="flex items-center bg-[#3D9970] text-white px-2.5 py-1 rounded-lg text-[11px] font-black shadow-lg shadow-[#3D9970]/20">
                     {rest.rating} <Star className="w-3 h-3 ml-1 fill-white" />
                  </div>
               </div>
               
               <p className="text-[13px] font-bold text-[var(--text-secondary)] truncate mb-6">
                   {rest.cuisines.length > 0 ? rest.cuisines.join(", ") : "Premium Selections"}
               </p>

               <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center text-[var(--brand-orange)] text-[12px] font-black uppercase tracking-widest bg-[var(--brand-orange)]/5 px-3 py-1.5 rounded-xl border border-[var(--brand-orange)]/10">
                      <Clock className="w-3.5 h-3.5 mr-2" /> {rest.time}
                  </div>
                  <div className="flex items-center text-[var(--text-secondary)] text-[11px] font-black">
                     <MapPin className="w-3 h-3 mr-1" /> 2.4 km
                  </div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
