import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";
import { Trash2, ShoppingBag, MapPin, Plus, Minus, Tag, Clock, ArrowRight, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { cart, addToCart, removeFromCart, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
        const orderData = {
           items: cart.map(item => ({ food: item.food._id, quantity: item.quantity, price: item.price })),
           totalAmount: calculateTotal(),
           deliveryAddress: user?.address || "Address",
           paymentMethod
        };
        await API.post("/orders", orderData);
        clearCart();
        navigate("/profile");
    } catch (err) {
        alert("Failed to place order.");
    } finally {
        setLoading(false);
    }
  };

  const calculateTotal = () => {
      const subtotal = getCartTotal();
      return Math.max(0, subtotal - discount);
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const listItemNode = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md md:max-w-5xl mx-auto min-h-screen px-4 py-8 flex flex-col items-center justify-center -mt-14 bg-[var(--bg-primary)] transition-colors duration-300">
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-48 h-48 mb-6 opacity-80"
        >
           <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/2xempty_cart_yfxml0" alt="Empty Cart" className="w-full h-full object-contain filter grayscale invert opacity-50" />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl font-bold mb-2 text-[var(--text-primary)]">Your cart is empty</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-[var(--text-secondary)] text-center mb-8 text-sm">You can go to home page to view more restaurants</motion.p>
        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => navigate("/home")}
          className="px-8 py-3 bg-[var(--brand-orange)] text-white font-bold uppercase tracking-wide text-sm shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
        >
          See Restaurants near you
        </motion.button>
      </div>
    );
  }

  const restaurantName = cart[0]?.food?.restaurant || "Restaurant";

  return (
    <div className="max-w-md md:max-w-7xl mx-auto min-h-screen bg-[var(--bg-primary)] pb-[200px] md:pb-[120px] transition-colors duration-300">
      
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-[var(--glass-bg)] px-4 py-4 pt-16 flex items-center shadow-sm border-b border-[var(--border-color)] transition-colors"
      >
          <button onClick={() => navigate(-1)} className="mr-4 p-2 -ml-2 rounded-full hover:bg-[var(--text-primary)]/5 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[var(--text-primary)]" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 className="font-black text-xl text-[var(--text-primary)] leading-tight tracking-tight">{restaurantName}</h1>
            <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest">Checkout</p>
          </div>
      </motion.div>

      <div className="p-4 space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-8 md:items-start text-left max-w-7xl mx-auto mt-6">
          
        {/* Left Column: Cart Items */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2 space-y-6"
        >
          <div className="bg-[var(--bg-surface)] rounded-3xl p-6 shadow-xl shadow-black/[0.02] border border-[var(--border-color)] transition-colors">
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex items-center gap-3 pb-6 mb-6 border-b border-[var(--border-color)] border-dashed"
            >
               <div className="w-10 h-10 rounded-full bg-[var(--brand-orange)]/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[var(--brand-orange)]" />
               </div>
               <div>
                  <span className="text-sm font-black text-[var(--text-primary)]">Delivery in 25-30 mins</span>
                  <p className="text-[11px] text-[var(--text-secondary)] font-bold uppercase tracking-wider">Fastest in your area</p>
               </div>
            </motion.div>

            <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
              {cart.map((item) => (
                <motion.div 
                    key={item.food._id} 
                    variants={listItemNode}
                    className="flex items-start gap-5"
                >
                  <div className="flex-grow">
                     <div className={`w-4 h-4 rounded border-2 flex items-center justify-center mb-2 bg-[var(--bg-primary)] ${item.food.isVeg ? "border-[#3D9970]" : "border-[#E23744]"}`}>
                          <div className={`w-2 h-2 rounded-full ${item.food.isVeg ? "bg-[#3D9970]" : "bg-[#E23744]"}`} />
                     </div>
                     <h3 className="font-black text-lg text-[var(--text-primary)] leading-tight tracking-tight">{item.food.name}</h3>
                     <div className="text-[var(--text-primary)] font-black text-lg mt-1 tracking-tight">₹{item.price}</div>
                  </div>

                  <div className="relative shrink-0">
                      <div className="w-28 h-28 rounded-2xl overflow-hidden bg-[var(--bg-primary)] shadow-inner border border-[var(--border-color)]">
                          {item.food.imageUrl ? (
                             <img src={item.food.imageUrl} alt={item.food.name} className="w-full h-full object-cover" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
                          )}
                      </div>
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[var(--bg-surface)] border-2 border-[var(--text-primary)] shadow-xl rounded-xl flex items-center justify-between w-24 h-10 px-2">
                          <button onClick={() => removeFromCart(item.food._id)} className="w-8 h-full flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5 transition-colors">
                              <Minus className="w-4 h-4" strokeWidth={3} />
                          </button>
                          <span className="text-sm font-black text-[var(--text-primary)] w-6 text-center">{item.quantity}</span>
                          <button onClick={() => addToCart(item.food)} className="w-8 h-full flex items-center justify-center text-[var(--brand-orange)] hover:bg-[var(--brand-orange)]/10 transition-colors">
                              <Plus className="w-4 h-4" strokeWidth={3} />
                          </button>
                      </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Right Column: Bill & Offers */}
        <div className="md:col-span-1 space-y-6">
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="bg-[var(--bg-surface)] rounded-3xl p-6 shadow-xl shadow-black/[0.02] border border-[var(--border-color)] flex flex-col justify-center"
          >
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowCouponInput(!showCouponInput)}>
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[var(--brand-orange)]/10 flex items-center justify-center">
                         <Tag className="w-5 h-5 text-[var(--brand-orange)]" />
                      </div>
                      <span className="text-base font-black text-[var(--text-primary)] tracking-tight">Apply Coupon</span>
                  </div>
                  <span className="text-[var(--brand-orange)] text-sm font-black uppercase tracking-widest">{showCouponInput ? "CLOSE" : "SELECT"}</span>
              </div>
              <AnimatePresence>
                {showCouponInput && (
                   <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-6 flex items-center gap-3 overflow-hidden"
                   >
                       <input 
                          type="text" 
                          placeholder="e.g. SWIGGY50"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-grow bg-[var(--bg-primary)] text-[var(--text-primary)] border-2 border-[var(--border-color)] rounded-2xl px-4 py-3 text-sm font-black focus:outline-none focus:border-[var(--brand-orange)]/50 transition-all placeholder-[var(--text-secondary)]"
                       />
                       <button 
                          onClick={applyCoupon}
                          className="bg-[var(--brand-orange)] text-white px-6 py-3 rounded-2xl text-xs font-black tracking-widest disabled:opacity-50 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                          disabled={!couponCode.trim()}
                       >
                          APPLY
                       </button>
                   </motion.div>
                )}
              </AnimatePresence>
          </motion.div>

          {/* Payment Method Section (Myntra Style) */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.25 }}
             className="bg-[var(--bg-surface)] rounded-3xl p-6 shadow-xl shadow-black/[0.02] border border-[var(--border-color)] flex flex-col justify-center"
          >
            <h3 className="font-black text-lg text-[var(--text-primary)] mb-4 tracking-tight flex items-center">
               Payment Method <div className="ml-3 h-[2px] w-8 bg-[var(--brand-orange)] rounded-full" />
            </h3>
            <div className="space-y-3">
               <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[var(--brand-orange)] bg-[var(--brand-orange)]/5' : 'border-[var(--border-color)]'}`}>
                 <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mr-3 accent-[var(--brand-orange)] w-4 h-4" />
                 <span className="text-sm font-bold text-[var(--text-primary)]">Cash on Delivery</span>
               </label>
               <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-[var(--brand-orange)] bg-[var(--brand-orange)]/5' : 'border-[var(--border-color)]'}`}>
                 <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="mr-3 accent-[var(--brand-orange)] w-4 h-4" />
                 <span className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                    UPI 
                    <span className="text-[10px] bg-[var(--bg-primary)] px-2 py-0.5 rounded text-[var(--text-secondary)] border border-[var(--border-color)]">Google Pay, PhonePe</span>
                 </span>
               </label>
               <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[var(--brand-orange)] bg-[var(--brand-orange)]/5' : 'border-[var(--border-color)]'}`}>
                 <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="mr-3 accent-[var(--brand-orange)] w-4 h-4" />
                 <span className="text-sm font-bold text-[var(--text-primary)]">Credit / Debit Card</span>
               </label>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[var(--bg-surface)] rounded-3xl p-6 shadow-xl shadow-black/[0.02] border border-[var(--border-color)] group transition-colors"
          >
            <h3 className="font-black text-lg text-[var(--text-primary)] mb-6 tracking-tight flex items-center">
               Bill Details <div className="ml-3 h-[2px] w-8 bg-[var(--brand-orange)] rounded-full" />
            </h3>
            <div className="space-y-4 text-sm font-bold text-[var(--text-secondary)]">
              <div className="flex justify-between items-center">
                <span>Item Total</span>
                <span className="text-[var(--text-primary)]">₹{getCartTotal()}</span>
              </div>
              <hr className="border-[var(--border-color)] my-4" />
              {discount > 0 && (
                 <div className="flex justify-between items-center text-[#3D9970] font-black italic">
                    <span>Coupon Discount</span>
                    <span>-₹{discount}</span>
                 </div>
              )}
              <div className="pt-2">
                 <div className="flex justify-between items-end">
                    <div>
                       <p className="text-[10px] uppercase font-black text-[var(--text-secondary)] tracking-widest mb-1">Grand Total</p>
                       <span className="text-2xl font-black text-[var(--text-primary)] tracking-tighter">₹{calculateTotal()}</span>
                    </div>
                    {discount > 0 && <div className="text-[10px] font-black text-[#3D9970] bg-[#3D9970]/10 px-2 py-1 rounded-lg uppercase tracking-wider">Saved ₹{discount}</div>}
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Checkout Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
        className="fixed bottom-[4rem] left-0 right-0 z-[60] bg-[var(--bg-surface)] border-t border-[var(--border-color)] p-4 shadow-[0_-20px_40px_rgba(0,0,0,0.05)] transition-colors"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-grow max-w-[50%] p-3 bg-[var(--bg-primary)] rounded-[2rem] flex items-center gap-4 transition-all hover:bg-[var(--bg-surface)] hover:shadow-lg border border-transparent hover:border-[var(--border-color)] cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-surface)] shadow-sm flex items-center justify-center shrink-0 border border-[var(--border-color)]">
                   <MapPin className="w-5 h-5 text-[var(--brand-orange)]" />
                </div>
                <div className="overflow-hidden">
                   <div className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-0.5">Delivering to</div>
                   <div className="text-sm font-black text-[var(--text-primary)] truncate leading-tight">Home ⋅ {user?.address || "Address"}</div>
                </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="flex-grow max-w-[50%] h-16 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-[2rem] font-black flex items-center justify-between px-8 shadow-2xl active:scale-95 transition-all group overflow-hidden relative"
            >
               <div className="relative z-10">
                   <div className="text-[10px] uppercase tracking-widest font-black opacity-50 mb-0.5 text-left text-[var(--bg-primary)]">
                       {paymentMethod === 'cod' ? 'Confirm Order' : `Pay ₹${calculateTotal()}`}
                   </div>
                   <div className="text-lg font-black tracking-tight uppercase">
                       {paymentMethod === 'cod' ? 'CASH ON DELIVERY' : (paymentMethod === 'upi' ? 'PAY VIA UPI' : 'PAY VIA CARD')}
                   </div>
               </div>
               <div className="relative z-10 w-10 h-10 rounded-full bg-[var(--bg-primary)]/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                   <ArrowRight className="w-6 h-6 text-[var(--bg-primary)]" />
               </div>
            </button>
        </div>
      </motion.div>
    </div>
  );
}
