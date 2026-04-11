import { Star, Clock } from "lucide-react";

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
    <div className="mt-6 mb-2">
      <div className="flex justify-between items-end mb-3">
        <h2 className="font-bold text-lg md:text-xl text-white">Top Brands Near You</h2>
      </div>

      <div className="flex overflow-x-auto space-x-5 no-scrollbar pb-4 -mx-4 px-4 snap-x snap-mandatory">
        {restaurants.map((rest, i) => (
          <div 
             key={i} 
             onClick={() => onRestaurantClick && onRestaurantClick(rest.name)}
             className="min-w-[280px] max-w-[280px] md:min-w-[320px] md:max-w-[320px] snap-center bg-brand-gray rounded-[1.25rem] overflow-hidden shadow-lg border border-white/5 flex flex-col shrink-0 cursor-pointer hover:border-brand-primary/50 transition-colors"
          >
            {/* Image Banner */}
            <div className="h-36 md:h-40 w-full relative">
               <img src={rest.image} alt={rest.name} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C] via-transparent to-transparent" />
               <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-extrabold text-white flex items-center shadow-sm border border-white/10 uppercase tracking-widest">
                  PROMOTED
               </div>
            </div>

            {/* Details */}
            <div className="p-4 bg-[#2A2A2A] flex-grow">
               <div className="flex justify-between items-start mb-1.5">
                  <h3 className="font-bold text-white truncate max-w-[180px] text-base md:text-lg">{rest.name}</h3>
                  <div className="flex items-center bg-green-700 text-white px-2 py-0.5 rounded text-xs font-bold shadow-sm">
                     {rest.rating} <Star className="w-3 h-3 ml-1 fill-white" />
                  </div>
               </div>
               
               <p className="text-sm text-gray-400 truncate mb-3"> {/* cuisines */}
                   {rest.cuisines.length > 0 ? rest.cuisines.join(", ") : "Multi-cuisine"}
               </p>

               <div className="flex items-center text-[#FC8019] text-sm font-bold bg-[#FC8019]/10 w-fit px-3 py-1.5 rounded-lg border border-[#FC8019]/20">
                   <Clock className="w-4 h-4 mr-1.5" /> {rest.time}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
