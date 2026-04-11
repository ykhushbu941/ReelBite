import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Trash2, ShoppingBag, MapPin, Plus, Minus, Tag, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cart, addToCart, removeFromCart, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          food: item.food._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: calculateTotal() + 5, // including platform fee
        deliveryAddress: user?.address || "Default Address"
      };

      await axios.post("/api/orders", orderData);
      clearCart();
      alert("Order placed successfully!");
      navigate("/profile");
    } catch (err) {
      alert("Failed to place order");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
      const subtotal = getCartTotal();
      const deliveryFee = 40;
      const gst = Math.round(subtotal * 0.05); // 5% GST mock
      return Math.max(0, subtotal + deliveryFee + gst - discount);
  };

  const applyCoupon = () => {
      if (couponCode.toUpperCase() === "SWIGGY50") {
          setDiscount(50);
          alert("Coupon Applied! ₹50 Off");
          setShowCouponInput(false);
      } else {
          setDiscount(0);
          alert("No coupons available for this code.");
      }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md md:max-w-5xl mx-auto min-h-screen px-4 py-8 flex flex-col items-center justify-center -mt-14 bg-[#1C1C1C]">
        <div className="w-48 h-48 mb-6 opacity-80">
           <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/2xempty_cart_yfxml0" alt="Empty Cart" className="w-full h-full object-contain filter grayscale invert opacity-50" />
        </div>
        <h2 className="text-xl font-bold mb-2 text-white/90">Your cart is empty</h2>
        <p className="text-white/50 text-center mb-8 text-sm">You can go to home page to view more restaurants</p>
        <button 
          onClick={() => navigate("/home")}
          className="px-8 py-3 bg-[#FC8019] text-white font-bold uppercase tracking-wide text-sm shadow-lg shadow-[#FC8019]/20"
        >
          See Restaurants near you
        </button>
      </div>
    );
  }

  // Get restaurant name for the top of the cart (assuming all items from same restaurant for mock)
  const restaurantName = cart[0]?.food?.restaurant || "Restaurant";
  const restaurantImage = cart[0]?.food?.imageUrl;

  return (
    <div className="max-w-md md:max-w-5xl mx-auto min-h-screen bg-[#121212] pb-[140px] md:pb-[100px]">
      
      {/* Header */}
      <div className="bg-[#1C1C1C] px-4 py-4 pt-16 flex items-center shadow-sm">
          <button onClick={() => navigate(-1)} className="mr-4 p-2 -ml-2 rounded-full hover:bg-white/5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 className="font-bold text-lg text-white leading-tight">{restaurantName}</h1>
            <p className="text-xs text-white/60">Order for yourself</p>
          </div>
      </div>

      <div className="p-4 space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-6 md:items-start text-left">
          
        {/* Left Column: Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {/* Cart Items Card */}
        <div className="bg-[#1C1C1C] rounded-2xl p-4 shadow-sm border border-white/5">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-white/10 border-dashed">
             <Clock className="w-4 h-4 text-[#FC8019]" />
             <span className="text-sm font-bold text-white">Delivery in 25-30 mins</span>
          </div>

          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.food._id} className="flex items-start gap-4">
                
                {/* Food info */}
                <div className="flex-grow">
                   <div className={`w-3 h-3 rounded-sm border flex items-center justify-center mb-1.5 ${item.food.isVeg ? "border-[#3D9970]" : "border-[#E23744]"}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.food.isVeg ? "bg-[#3D9970]" : "bg-[#E23744]"}`} />
                   </div>
                   <h3 className="font-semibold text-sm text-white">{item.food.name}</h3>
                   <div className="text-white font-medium text-sm mt-1">₹{item.price}</div>
                   
                   {/* Customizer Mock */}
                   <div className="text-[10px] text-white/50 mt-1 cursor-pointer">Customize ›</div>
                </div>

                {/* Sub-controls */}
                <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#2A2A2A] shadow-sm">
                        {item.food.imageUrl ? (
                           <img src={item.food.imageUrl} alt={item.food.name} className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
                        )}
                    </div>
                    {/* Quantity Stepper */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#1C1C1C] border border-[#FC8019]/50 shadow-md rounded-lg flex items-center justify-between w-20 h-8 px-1">
                        <button 
                            onClick={() => removeFromCart(item.food._id)}
                            className="w-6 h-full flex items-center justify-center text-[#FC8019] text-xl font-medium active:bg-[#FC8019]/10 rounded"
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                        <button 
                            onClick={() => addToCart(item.food)}
                            className="w-6 h-full flex items-center justify-center text-[#FC8019] text-xl font-medium active:bg-[#FC8019]/10 rounded"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-4 pb-1 border-t border-white/5 cursor-pointer flex gap-3 text-white/80 hover:text-white">
              <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <span className="text-sm font-medium">Add cooking instructions</span>
          </div>
        </div>
        </div>

        {/* Right Column: Bill & Offers */}
        <div className="md:col-span-1 space-y-4">
          {/* Offers Card */}
        <div className="bg-[#1C1C1C] rounded-2xl p-4 shadow-sm border border-white/5 flex flex-col justify-center">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowCouponInput(!showCouponInput)}>
                <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-bold text-white">Apply Coupon</span>
                </div>
                <span className="text-[#FC8019] text-sm font-bold uppercase">{showCouponInput ? "Close" : "Select"}</span>
            </div>
            
            {showCouponInput && (
               <div className="mt-4 flex items-center gap-2">
                   <input 
                      type="text" 
                      placeholder="Enter SWIGGY50"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-grow bg-[#2A2A2A] text-white border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FC8019]/50"
                   />
                   <button 
                      onClick={applyCoupon}
                      className="bg-[#FC8019] text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
                      disabled={!couponCode.trim()}
                   >
                      APPLY
                   </button>
               </div>
            )}
        </div>

        {/* Bill Details */}
        <div className="bg-[#1C1C1C] rounded-2xl p-4 shadow-sm border border-white/5">
          <h3 className="font-bold mb-4 text-white">Bill Details</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-white/70">
              <span>Item Total</span>
              <span>₹{getCartTotal()}</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Delivery Fee | 3.5 kms</span>
              <span>₹40</span>
            </div>
            <hr className="border-white/5 my-2" />
            
            {discount > 0 && (
               <div className="flex justify-between text-green-400 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
               </div>
            )}
            
            <div className="flex justify-between text-white/70">
              <span>Platform fee</span>
              <span>₹5</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>GST and Restaurant Charges</span>
              <span>₹{Math.round(getCartTotal() * 0.05)}</span>
            </div>
            <hr className="border-white/10 my-3 border-dashed" />
            <div className="flex justify-between font-bold text-sm text-white">
              <span className="uppercase">To Pay</span>
              <span>₹{calculateTotal() + 5}</span> {/* +5 for platform fee */}
            </div>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="bg-[#1C1C1C] rounded-2xl p-4 shadow-sm border border-white/5">
            <h3 className="font-bold text-sm text-white mb-2">Review your order and address details to avoid cancellations</h3>
            <p className="text-xs text-white/50 leading-relaxed">
               <span className="text-red-400 font-semibold">Note:</span> If you choose to cancel, you can do it within 60 seconds after placing order. A 100% cancellation fee will be applicable afterwards.
            </p>
        </div>
        </div>
      </div>

      {/* Floating Checkout Bar overlaying the bottom nav safe area */}
      <div className="fixed bottom-[4rem] left-0 right-0 z-[60] bg-[#1C1C1C] border-t border-white/10 p-3 shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
        <div className="max-w-md md:max-w-5xl mx-auto flex items-center gap-3">
            {/* Delivery address left */}
            <div className="w-1/2 p-2 bg-[#2A2A2A] rounded-xl flex items-start gap-2">
                <MapPin className="w-5 h-5 text-[#FC8019] shrink-0 mt-0.5" />
                <div className="overflow-hidden">
                   <div className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-0.5">Delivering To</div>
                   <div className="text-sm font-bold text-white truncate">Home</div>
                   <div className="text-xs text-white/60 truncate">{user?.address || "Please select address"}</div>
                </div>
            </div>

            {/* Pay Button */}
            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-1/2 h-full bg-[#1DE9B6] text-[#0A4A38] rounded-xl font-bold flex flex-col justify-center px-4 active:scale-95 transition-all outline-none"
            >
               <div className="text-xs uppercase tracking-wide font-extrabold opacity-80 mb-0.5">Pay Using</div>
               <div className="flex items-center justify-between">
                   <span className="text-sm sm:text-base font-bold">Cash on Delivery</span>
                   <span className="text-base sm:text-lg font-extrabold ml-1">›</span>
               </div>
            </button>
        </div>
      </div>
      
      {/* Spacer to fix any underlap behind nav since nav is z-50 and cart is z-60 */}
      <div className="h-4"></div>
    </div>
  );
}
