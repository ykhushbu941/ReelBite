import { useContext, useEffect, useState } from "react";
import { X, Star, Clock, MapPin, Plus, Minus, Video } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function FoodDetailModal({ food, onClose }) {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

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
    // In a real app we'd scroll to this specific reel, but for now navigate to reels page
    navigate('/reels');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 pointer-events-none">
      
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto ${isVisible ? 'opacity-100' : 'opacity-0'}`} 
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div 
        className={`w-full max-w-md bg-[#1C1C1C] rounded-t-3xl sm:rounded-3xl overflow-hidden relative shadow-2xl pointer-events-auto transition-transform duration-300 ease-out ${isVisible ? 'translate-y-0' : 'translate-y-full sm:translate-y-8 sm:opacity-0 sm:scale-95'}`}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="h-64 sm:h-72 w-full relative">
          <img 
            src={food.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"} 
            alt={food.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C] to-transparent h-1/2 bottom-0 top-auto" />
        </div>

        {/* Details Section */}
        <div className="px-6 relative -top-8 bg-[#1C1C1C] rounded-t-3xl pt-2 pb-6 flex flex-col h-[calc(100vh-16rem)] sm:h-auto sm:max-h-[60vh]">
          
          {/* Drag Handle */}
          <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 shrink-0" />
          
          <div className="overflow-y-auto no-scrollbar flex-grow pb-24">
            
            {/* Header info */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${food.isVeg ? "veg-dot" : "nonveg-dot"}`}>
                    <div className={`w-2 h-2 rounded-full ${food.isVeg ? "bg-[#3D9970]" : "bg-[#E23744]"}`} />
                  </div>
                  {food.outOfStock && <span className="bg-red-500/10 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded">SOLD OUT</span>}
                </div>
                <h2 className="text-2xl font-bold text-white leading-tight">{food.name}</h2>
                <p className="text-white/60 text-sm flex items-center mt-1">
                   <MapPin className="w-3.5 h-3.5 mr-1" /> {food.restaurant}
                </p>
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                <p className="text-xl font-bold text-white">₹{food.price}</p>
                <div className="flex items-center justify-end text-yellow-400 text-xs mt-1 font-medium bg-yellow-400/10 px-1.5 py-0.5 rounded w-max ml-auto">
                    <Star className="w-3 h-3 fill-yellow-400 mr-1" />
                    4.5 <span className="text-gray-400 ml-1">(120+)</span>
                </div>
              </div>
            </div>

            {/* Tags area */}
            <div className="flex flex-wrap gap-2 my-4">
               {food.cuisine && food.cuisine !== "Other" && (
                  <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-[11px] font-medium text-white/80">
                     {food.cuisine}
                  </span>
               )}
               <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-[11px] font-medium flex items-center text-white/80">
                  <Clock className="w-3 h-3 mr-1" /> 25-30 min
               </span>
            </div>

            <hr className="border-white/5 my-4" />

            {/* Description */}
            <div>
              <h3 className="text-[13px] font-semibold text-white/90 mb-2 uppercase tracking-wide">About this dish</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {food.description || "A delicious meal prepared with the finest ingredients. Enjoy hot and fresh."}
              </p>
            </div>
            
            {/* Watch Reel Banner */}
            <div 
               onClick={viewReel}
               className="mt-6 bg-gradient-to-r from-[#FC8019]/10 to-[#E23744]/10 border border-[#FC8019]/20 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
            >
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center shrink-0">
                     <Video className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Watch it sizzle</h4>
                    <p className="text-xs text-white/60">See the full food reel</p>
                  </div>
               </div>
               <div className="text-brand-primary text-sm font-semibold">Play ›</div>
            </div>

          </div>

          {/* Bottom Action Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#1C1C1C] border-t border-white/10 flex items-center justify-between safe-area-bottom">
            <div className="w-1/3">
              {quantity === 0 ? (
                <button 
                  onClick={handleAdd}
                  disabled={food.outOfStock}
                  className="w-full h-12 bg-brand-primary text-white font-bold rounded-xl active:scale-95 transition-all outline-none"
                >
                  ADD +
                </button>
              ) : (
                <div className="w-full h-12 bg-[#2A2A2A] border border-[#FC8019]/50 rounded-xl flex items-center justify-between px-2">
                  <button onClick={handleRemove} className="w-8 h-8 flex items-center justify-center text-brand-primary active:bg-brand-primary/10 rounded-lg">
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="font-bold text-white w-4 text-center">{quantity}</span>
                  <button onClick={handleAdd} className="w-8 h-8 flex items-center justify-center text-brand-primary active:bg-brand-primary/10 rounded-lg">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="w-[60%] pl-4">
              <button 
                 className="w-full h-12 bg-white text-black font-bold rounded-xl active:scale-95 transition-all shadow-lg flex items-center justify-center"
                 onClick={() => { handleClose(); navigate('/cart'); }}
              >
                  {quantity > 0 ? `View Cart (₹${food.price * quantity})` : "View Cart"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
