import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { Bookmark, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function SavedPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedFoods();
  }, []);

  const fetchSavedFoods = async () => {
    try {
      const res = await axios.get("/api/auth/user/me");
      // The backend populates savedFoods array
      setFoods(res.data.savedFoods || []);
    } catch (err) {
      console.error("Failed to fetch saved foods", err);
    } finally {
      setLoading(false);
    }
  };

  const removeSaved = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.put(`/api/auth/user/save/${id}`);
      setFoods(foods.filter(f => f._id !== id));
    } catch (err) {
      console.error("Failed to remove saved food");
    }
  };

  return (
    <div className="max-w-md md:max-w-7xl mx-auto min-h-screen px-4 py-8 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Bookmark className="w-6 h-6 text-brand-primary" fill="currentColor" />
        <h1 className="text-2xl font-bold text-white">Saved Reels</h1>
      </div>

      <div className="pb-16">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 animate-pulse">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-brand-gray/30 h-48 rounded-2xl"></div>
            ))}
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center text-gray-500 mt-20 flex flex-col items-center">
            <Bookmark className="w-16 h-16 text-gray-700 mb-4" />
            <p className="text-lg">No saved reels yet.</p>
            <p className="text-sm mt-2">Go to Reels and tap the save icon to bookmark your favorite foods!</p>
            <Link to="/reels" className="mt-6 bg-brand-primary/20 text-brand-primary px-6 py-2 rounded-full font-semibold border border-brand-primary/30">Explore Reels</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {foods.map(food => (
              <div 
                key={food._id} 
                onClick={() => navigate(`/home?search=${encodeURIComponent(food.name)}`)}
                className="glass-panel overflow-hidden rounded-2xl flex flex-col group cursor-pointer hover:border-brand-primary/50 transition-colors"
              >
                <div className="h-32 bg-brand-gray relative flex items-center justify-center overflow-hidden">
                   {(food.videoUrl && !food.videoUrl.includes("dummy")) ? (
                     <video src={food.videoUrl} className="object-cover w-full h-full opacity-70 group-hover:opacity-100 transition-opacity" muted />
                   ) : (
                     <div className="text-4xl">🍔</div>
                   )}
                   
                   {/* Remove save button overlay */}
                   <button 
                     onClick={(e) => removeSaved(food._id, e)}
                     className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full hover:bg-black/80 transition-colors"
                   >
                      <Bookmark className="w-4 h-4 text-brand-primary" fill="currentColor" />
                   </button>
                </div>
                
                <div className="p-3 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-semibold text-sm truncate">{food.name}</h3>
                    <p className="text-gray-400 text-xs truncate">{food.restaurant}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-brand-secondary">₹{food.price}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(food); }}
                      className="bg-brand-primary p-1.5 rounded-lg hover:bg-brand-primary/80 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
