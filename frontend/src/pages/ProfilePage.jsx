import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";
import { LogOut, Package, MapPin, Phone, Coffee, Settings, ChevronRight, Truck, Clock, CheckCircle2, Navigation, Video, Trash2, Play } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { user, role, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [myReels, setMyReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [role]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const endpoint = role === "partner" ? "/orders/partner" : "/orders/my";
      const res = await API.get(endpoint);
      setOrders(res.data);

      if (role === 'partner') {
        const reelsRes = await API.get("/foods/my");
        setMyReels(reelsRes.data);
      }
    } catch (err) {
      console.error("Failed to fetch orders or reels", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const res = await API.put(`/orders/${orderId}/cancel`);
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: res.data.status } : o));
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to cancel order");
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await API.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: res.data.status } : o));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const deleteReel = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this reel?")) return;
    try {
      await API.delete(`/foods/${id}`);
      setMyReels(myReels.filter(r => r._id !== id));
    } catch (err) {
      alert("Failed to delete reel.");
    }
  };

  const formatViews = (views) => {
    return views > 1000 ? (views/1000).toFixed(1) + 'k' : views;
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-md md:max-w-5xl mx-auto min-h-screen px-4 py-8 pb-40 pt-20 bg-[var(--bg-primary)] transition-colors duration-300">
      
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[var(--bg-surface)] p-8 rounded-[3rem] flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-12 shadow-xl shadow-black/[0.03] border border-[var(--border-color)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-orange)]/5 rounded-full -mr-16 -mt-16 blur-2xl" />
        
        <motion.div 
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-28 h-28 bg-gradient-to-br from-[var(--brand-orange)] to-[var(--brand-yellow)] rounded-3xl flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-orange-500/30 rotate-3 shrink-0"
        >
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </motion.div>

        <div className="flex-grow text-center sm:text-left w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
            <div>
              <h2 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter leading-[0.9] uppercase mb-2">{user?.name}</h2>
              <p className="text-[var(--text-secondary)] font-black text-xs uppercase tracking-widest opacity-60">{user?.email}</p>
            </div>
            <Link to="/edit-profile" className="p-4 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] hover:bg-[var(--brand-orange)]/10 hover:border-[var(--brand-orange)]/20 transition-all group shrink-0">
               <Settings className="w-6 h-6 text-[var(--text-secondary)] group-hover:text-[var(--brand-orange)] transition-colors" />
            </Link>
          </div>
          
          <div className="flex justify-center sm:justify-start gap-3 mt-6">
            <span className="px-4 py-1.5 bg-[var(--brand-orange)]/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[var(--brand-orange)] border border-[var(--brand-orange)]/20">
                {role === 'partner' ? 'Verified Partner' : 'Premium Foodie'}
            </span>
            {role === 'partner' && (
               <span className="px-4 py-1.5 bg-[#3D9970]/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[#3D9970] border border-[#3D9970]/20 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Live Hub
               </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <div className="bg-[var(--bg-surface)] p-8 rounded-[2.5rem] flex items-center gap-6 shadow-sm border border-[var(--border-color)] group hover:shadow-2xl transition-all duration-500">
          <div className="w-14 h-14 rounded-2xl bg-[var(--brand-orange)]/5 flex items-center justify-center group-hover:bg-[var(--brand-orange)]/10 transition-colors shrink-0">
            <Phone className="w-7 h-7 text-[var(--brand-orange)]" />
          </div>
          <div>
            <div className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-[0.2em] mb-1">Phone Contact</div>
            <div className="text-base font-black text-[var(--text-primary)] tracking-tight">{user?.phone || "+91 98765 43210"}</div>
          </div>
        </div>
        <div className="bg-[var(--bg-surface)] p-8 rounded-[2.5rem] flex items-center gap-6 shadow-sm border border-[var(--border-color)] group hover:shadow-2xl transition-all duration-500">
           <div className="w-14 h-14 rounded-2xl bg-[var(--brand-orange)]/5 flex items-center justify-center group-hover:bg-[var(--brand-orange)]/10 transition-colors shrink-0">
            <MapPin className="w-7 h-7 text-[var(--brand-orange)]" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-[0.2em] mb-1">Office Address</div>
            <div className="text-base font-black text-[var(--text-primary)] truncate tracking-tight">{user?.address || "Street 12, Food Hub"}</div>
          </div>
        </div>
      </div>

      {/* TABS for Partners */}
      {role === 'partner' && (
         <div className="flex bg-[var(--bg-surface)] p-2 rounded-[2rem] border border-[var(--border-color)] mb-8 shadow-sm">
            <button 
               onClick={() => setActiveTab("orders")}
               className={`flex-1 py-4 text-center rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === "orders" ? "bg-[var(--brand-orange)] text-white shadow-lg shadow-orange-500/20" : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]"}`}
            >
               Manage Orders
            </button>
            <button 
               onClick={() => setActiveTab("reels")}
               className={`flex-1 py-4 text-center rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === "reels" ? "bg-[var(--brand-orange)] text-white shadow-lg shadow-orange-500/20" : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]"}`}
            >
               Manage My Reels
            </button>
         </div>
      )}

      {/* Conditional Rendering based on Tab */}
      {(role !== 'partner' || activeTab === "orders") && (
        <>
          {/* Order Management Section */}
          <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center uppercase italic">
                 <Package className="mr-4 text-[var(--brand-orange)] w-8 h-8" /> 
                 {role === 'partner' ? 'Business Intelligence' : 'Recent Feasts'}
                 <div className="ml-4 h-[2px] w-12 bg-[var(--brand-orange)]/30 rounded-full" />
              </h3>
          </div>
          
          {loading ? (
            <div className="space-y-6">
               {[1,2,3].map(i => <div key={i} className="h-40 bg-[var(--bg-surface)] rounded-[3rem] animate-pulse border border-[var(--border-color)]"></div>)}
            </div>
          ) : orders.length === 0 ? (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--bg-surface)] p-20 text-center rounded-[3rem] border border-[var(--border-color)] shadow-sm"
            >
               <div className="w-24 h-24 bg-[var(--bg-primary)] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Coffee className="w-10 h-10 text-[var(--text-secondary)]/10" />
               </div>
               <p className="text-[var(--text-primary)] font-black text-2xl tracking-tighter uppercase mb-2">Silence in the kitchen</p>
               <p className="text-[var(--text-secondary)] font-bold text-sm mb-10 max-w-xs mx-auto">
                 {role === 'partner' ? 'Your active orders will appear here once customers start ordering from your reels!' : 'You haven\'t placed any orders yet. Time to change that!'}
               </p>
               <button 
                onClick={() => navigate(role === 'partner' ? '/add' : '/home')} 
                className="bg-[var(--brand-orange)] text-white px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-orange-500/30"
               >
                 {role === 'partner' ? 'Create a Reel' : 'Explore Cravings'}
               </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
              <AnimatePresence mode="popLayout">
                {orders.map((order) => (
                  <motion.div 
                    layout
                    key={order._id} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`bg-[var(--bg-surface)] p-8 rounded-[3rem] border shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col h-full ${
                      order.status === 'Cancelled' ? 'border-red-500/20 opacity-60 grayscale' : 'border-[var(--border-color)]'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div>
                          <div className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1.5">ORD#{order._id.substring(order._id.length - 6).toUpperCase()}</div>
                          <h4 className="text-2xl font-black text-[var(--text-primary)] tracking-tighter italic uppercase">{role === 'partner' ? (order.user?.name || "Premium Foodie") : (order.items[0]?.food?.restaurant || "QuickBites Store")}</h4>
                      </div>
                      <div className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-xl border ${
                        order.status === 'Delivered' ? 'bg-[#3D9970]/10 text-[#3D9970] border-[#3D9970]/10' : 
                        order.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/10' :
                        order.status === 'Pending' ? 'bg-[var(--brand-orange)]/10 text-[var(--brand-orange)] border-[var(--brand-orange)]/10' : 'bg-blue-500/10 text-blue-500 border-blue-500/10'
                      }`}>
                        {order.status}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-4 mb-10 flex-grow bg-[var(--bg-primary)]/50 p-6 rounded-[2.5rem] border border-[var(--border-color)]">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="w-8 h-8 rounded-xl bg-[var(--brand-orange)]/10 flex items-center justify-center">
                                <span className="text-[var(--brand-orange)] font-black text-xs">{item.quantity}</span>
                             </div>
                             <span className="text-sm font-black text-[var(--text-primary)] leading-tight tracking-tight uppercase">{item.food?.name || "Dish"}</span>
                          </div>
                          <span className="text-[11px] font-black text-[var(--text-secondary)] tracking-widest">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div className="pt-4 mt-4 border-t border-[var(--border-color)] border-dashed flex justify-between items-center">
                          <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Grand Total</span>
                          <span className="text-xl font-black text-[var(--brand-orange)] tracking-tighter">₹{order.totalAmount}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto relative z-10">
                      {role === 'partner' ? (
                        order.status !== 'Cancelled' && order.status !== 'Delivered' ? (
                           <div className="flex gap-3">
                              <button onClick={() => updateStatus(order._id, "Preparing")} className="flex-1 py-4 rounded-2xl bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Prep</button>
                              <button onClick={() => updateStatus(order._id, "Out for Delivery")} className="flex-1 py-4 rounded-2xl bg-[var(--brand-orange)] text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-95 transition-all">Ship</button>
                              <button onClick={() => updateStatus(order._id, "Delivered")} className="flex-1 py-4 rounded-2xl bg-[#3D9970] text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#3D9970]/20 active:scale-95 transition-all">End</button>
                           </div>
                        ) : (
                           <div className="text-center p-4 bg-[var(--bg-primary)] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] border border-[var(--border-color)]">
                              {order.status === 'Cancelled' ? 'Order Terminated' : 'Order Fulfilled'}
                           </div>
                        )
                      ) : (
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-3">
                              <span className="text-[var(--text-secondary)] font-black text-[10px] uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                              <div className="w-1.5 h-1.5 rounded-full bg-[var(--border-color)]" />
                              <button onClick={() => navigate(`/track-order/${order._id}`)} className="text-[var(--brand-orange)] font-black text-[10px] uppercase tracking-widest flex items-center gap-1 hover:translate-x-1 transition-transform">
                                 Track <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                           </div>
                           {order.status === 'Pending' && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); if(window.confirm("Cancel this order?")) cancelOrder(order._id); }}
                                className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/5 px-4 py-2 rounded-xl transition-all"
                              >
                                Cancel
                              </button>
                           )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {role === 'partner' && activeTab === "reels" && (
         <div className="mb-8">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center uppercase italic">
                   <Video className="mr-4 text-[var(--brand-orange)] w-8 h-8" /> 
                   My Uploaded Reels
                   <div className="ml-4 h-[2px] w-12 bg-[var(--brand-orange)]/30 rounded-full" />
                </h3>
            </div>
            {myReels.length === 0 ? (
                <div className="text-center p-20 bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-color)]">
                   <div className="w-24 h-24 bg-[var(--bg-primary)] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <Video className="w-10 h-10 text-[var(--text-secondary)]/10" />
                   </div>
                   <p className="text-[var(--text-primary)] font-black text-2xl tracking-tighter uppercase mb-2">No reels uploaded yet</p>
                   <p className="text-[var(--text-secondary)] font-bold text-sm mb-10 max-w-xs mx-auto">Upload your first food reel to start receiving orders!</p>
                   <button 
                    onClick={() => navigate('/add')} 
                    className="bg-[var(--brand-orange)] text-white px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-orange-500/30"
                   >
                     Create a Reel
                   </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                   {myReels.map(reel => (
                      <div key={reel._id} onClick={() => navigate(`/reels?foodId=${reel._id}`)} className="cursor-pointer relative aspect-[9/16] bg-black rounded-xl overflow-hidden group border border-[var(--border-color)] shadow-sm">
                         <img src={reel.imageUrl} className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />
                         
                         <button 
                           onClick={(e) => deleteReel(e, reel._id)}
                           className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:scale-110 active:scale-95 z-10"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>

                         <div className="absolute bottom-2 left-2 flex items-center space-x-1 pointer-events-none z-10 drop-shadow-md">
                            <Play className="w-3.5 h-3.5 text-white fill-white" />
                            <span className="text-white font-bold text-xs">{formatViews(reel.views || 0)}</span>
                         </div>
                      </div>
                   ))}
                </div>
            )}
         </div>
      )}
      
      {/* Logout Action */}
      <motion.button 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        onClick={handleLogout}
        className="mt-8 w-full bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center space-x-4 p-6 rounded-[3rem] text-red-500 hover:bg-red-500/5 transition-all shadow-xl shadow-black/[0.02] active:scale-95 group mb-20"
      >
        <LogOut className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        <span className="font-black text-xs uppercase tracking-[0.3em]">Sign Out Securely</span>
      </motion.button>

    </div>
  );
}
