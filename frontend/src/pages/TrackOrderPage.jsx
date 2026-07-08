import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { 
  ArrowLeft, 
  ChefHat, 
  Truck, 
  ShoppingBag, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  HelpCircle,
  Map as MapIcon,
  Navigation,
  Clock,
  ExternalLink
} from "lucide-react";

export default function TrackOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();

    // Poll for updates every 10 seconds for real-time feel
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await API.put(`/orders/${orderId}/cancel`);
      setOrder(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to cancel order");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--brand-orange)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center px-4">
        <h2 className="text-xl font-bold">Order not found</h2>
        <button onClick={() => navigate("/home")} className="mt-4 bg-[var(--brand-orange)] text-white px-6 py-2 rounded-xl font-bold">Go Home</button>
      </div>
    );
  }

  const steps = [
    { name: "Order Placed", status: "Pending", icon: <ShoppingBag className="w-5 h-5" />, time: "Just now" },
    { name: "Preparing Food", status: "Preparing", icon: <ChefHat className="w-5 h-5" />, time: "Soon" },
    { name: "Out for Delivery", status: "Out for Delivery", icon: <Truck className="w-5 h-5" />, time: "In transit" },
    { name: "Delivered", status: "Delivered", icon: <CheckCircle2 className="w-5 h-5" />, time: "Enjoy!" },
  ];

  const currentStepIndex = steps.findIndex(step => step.status === order.status);
  const isCancelled = order.status === "Cancelled";

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col transition-colors">
      {/* Map Header Placeholder */}
      <div className="h-64 md:h-80 bg-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#E5E7EB] dark:bg-[#1F2937]">
            {/* Simple SVG Map Pattern */}
            <svg className="w-full h-full opacity-20" viewBox="0 0 100 100">
                <path d="M0,20 L100,20 M0,50 L100,50 M0,80 L100,80 M20,0 L20,100 M50,0 L50,100 M80,0 L80,100" stroke="currentColor" strokeWidth="0.5" fill="none" />
                <circle cx="45" cy="45" r="3" fill="var(--brand-orange)" />
                <circle cx="55" cy="55" r="1.5" fill="var(--text-primary)" />
                <path d="M45,45 L50,45 L50,55 L55,55" stroke="var(--brand-orange)" strokeWidth="1" fill="none" strokeDasharray="2,1" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                 <div className="relative">
                    <div className="w-16 h-16 bg-[var(--brand-orange)]/20 rounded-full animate-ping absolute inset-0" />
                    <div className="w-16 h-16 bg-white dark:bg-black rounded-full shadow-2xl flex items-center justify-center relative z-10">
                        <Navigation className="w-8 h-8 text-[var(--brand-orange)] animate-pulse" />
                    </div>
                 </div>
            </div>
        </div>

        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 p-3 bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all z-20"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Status Badge */}
        <div className="absolute bottom-6 left-6 right-6">
           <div className="bg-[var(--bg-surface)] p-4 rounded-2xl flex items-center justify-between shadow-xl border border-[var(--border-color)]">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-[var(--brand-orange)]/10 rounded-2xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-[var(--brand-orange)]" />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-[var(--text-primary)] tracking-tight leading-tight">
                        {isCancelled ? "Order Cancelled" : order.status === "Delivered" ? "Enjoy your meal!" : "Arriving soon"}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Order ID: #{orderId.substring(orderId.length - 8)}</p>
                 </div>
              </div>
              <div className="flex gap-2">
                 {!isCancelled && order.status === "Pending" && (
                   <button 
                     onClick={handleCancelOrder}
                     className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                   >
                     Cancel Order
                   </button>
                 )}
                 <button className="p-3 bg-[var(--bg-primary)] rounded-xl hover:bg-[var(--brand-orange)]/10 text-[var(--brand-orange)] transition-colors">
                    <HelpCircle className="w-5 h-5" />
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow max-w-2xl mx-auto w-full px-4 py-8 space-y-8 pb-40">
        
        {/* Delivery Partner */}
        {!isCancelled && order.status !== "Delivered" && (
           <div className="bg-[var(--bg-surface)] p-6 rounded-2xl flex items-center justify-between border-dashed border-2 border-[var(--border-color)]">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                       <Truck className="w-7 h-7 text-indigo-600" />
                    </div>
                 </div>
                 <div>
                    <h4 className="font-black text-[var(--text-primary)]">Delivery Partner</h4>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#3D9970]">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#3D9970] animate-pulse" />
                       {order.status.toUpperCase()}
                    </div>
                 </div>
              </div>
              <div className="flex gap-2">
                 <button className="w-11 h-11 bg-[var(--bg-primary)] rounded-2xl flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--brand-orange)]/10 hover:text-[var(--brand-orange)] transition-all">
                    <MessageCircle className="w-5 h-5" />
                 </button>
                 <button className="w-11 h-11 bg-[var(--bg-primary)] rounded-2xl flex items-center justify-center text-[var(--text-primary)] hover:bg-green-500/10 hover:text-green-500 transition-all border border-transparent hover:border-green-500/20">
                    <Phone className="w-5 h-5" />
                 </button>
              </div>
           </div>
        )}

        {/* Timeline */}
        <div className="bg-[var(--bg-surface)] p-8 rounded-3xl border border-[var(--border-color)] shadow-sm">
           <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-secondary)] mb-8">Order Journey</h3>
           <div className="space-y-10 relative">
              {/* Vertical line connector */}
              {!isCancelled && (
                 <div className="absolute left-[26px] top-2 bottom-8 w-[2px] bg-[var(--border-color)]">
                    <div 
                      className="w-full bg-[var(--brand-orange)] transition-all duration-1000" 
                      style={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                    />
                 </div>
              )}

              {isCancelled ? (
                <div className="flex gap-6 items-center">
                   <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shadow-lg shadow-red-500/10">
                      <HelpCircle className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="font-black text-red-500 text-lg uppercase tracking-tight">Order Cancelled</h4>
                      <p className="text-sm text-[var(--text-secondary)] font-medium">Refund will be initiated if applicable.</p>
                   </div>
                </div>
              ) : steps.map((step, index) => {
                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={index} className={`flex items-start gap-6 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10 ${
                      isActive 
                      ? 'bg-[var(--brand-orange)] text-white shadow-xl shadow-orange-500/20' 
                      : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'
                    } ${isCurrent ? 'ring-8 ring-orange-500/10 scale-110' : ''}`}>
                      {isActive && index < currentStepIndex ? <CheckCircle2 className="w-6 h-6" /> : step.icon}
                    </div>
                    <div className="pt-2">
                       <h4 className={`font-black text-lg tracking-tight ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                          {step.name}
                       </h4>
                       <div className="flex items-center gap-2 mt-0.5">
                          <Clock className="w-3 h-3 text-[var(--text-secondary)]" />
                          <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{step.time}</span>
                       </div>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Order Details Mini */}
        <div className="bg-[var(--bg-surface)] p-6 rounded-3xl border border-[var(--border-color)] shadow-sm">
           <div className="flex justify-between items-start mb-6">
              <div>
                 <h4 className="font-black text-[var(--text-primary)] uppercase tracking-tight">Your Order</h4>
                 <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">{order.items.length} Items</p>
              </div>
              <button 
                onClick={() => navigate('/home')}
                className="text-[10px] font-black text-[var(--brand-orange)] uppercase tracking-widest flex items-center gap-1.5 group"
              >
                VIEW MENU <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
           </div>
           
           <div className="space-y-3">
              {order.items.slice(0, 3).map((item, i) => (
                 <div key={i} className="flex justify-between items-center text-sm font-bold">
                    <span className="text-[var(--text-primary)]">{item.food?.name || "Premium Dish"} <span className="text-[var(--text-secondary)] ml-1">x{item.quantity}</span></span>
                    <span className="text-[var(--text-primary)]">₹{(item.food?.price || 0) * item.quantity}</span>
                 </div>
              ))}
              {order.items.length > 3 && (
                 <p className="text-xs font-black text-[var(--text-secondary)] pt-2">+ {order.items.length - 3} more items</p>
              )}
           </div>

           <div className="mt-6 pt-6 border-t border-[var(--border-color)] flex justify-between items-end">
              <div>
                 <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">Total Paid</p>
                 <span className="text-2xl font-black text-[var(--text-primary)] tracking-tighter italic">₹{order.totalAmount}</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black italic text-[#3D9970] bg-[#3D9970]/5 px-2 py-1 rounded mb-1 capitalize">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : `Paid via ${order.paymentMethod?.toUpperCase() || "Online"}`}
                </p>
              </div>
           </div>
        </div>

        {/* Help Action */}
        <div className="flex flex-col items-center gap-4 text-center">
           <div className="w-1 h-12 bg-gradient-to-b from-[var(--border-color)] to-transparent" />
           <p className="text-xs font-bold text-[var(--text-secondary)] max-w-xs mx-auto">
              Something went wrong with your order? Our support team is here to help 24/7.
           </p>
           <button className="flex items-center gap-2 px-8 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[var(--bg-primary)] transition-all active:scale-95 shadow-lg shadow-black/[0.02]">
              <HelpCircle className="w-4 h-4 text-[var(--brand-orange)]" />
              Get Help & Support
           </button>
        </div>

      </div>
    </div>
  );
}
