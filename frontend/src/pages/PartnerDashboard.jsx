import { useEffect, useState } from "react";
import axios from "axios";
import { Package, Clock, CheckCircle, Truck, ExternalLink } from "lucide-react";

export default function PartnerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/orders/partner");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch partner orders", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: res.data.status } : o));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const StatusButton = ({ order, status, icon: Icon, label, colorClass }) => {
    const isActive = order.status === status;
    return (
      <button 
        onClick={() => updateStatus(order._id, status)}
        disabled={isActive || order.status === "Cancelled"}
        className={`flex-1 flex flex-col items-center justify-center p-2 rounded-xl text-xs font-semibold transition-all ${
          isActive 
            ? `${colorClass} shadow-lg scale-105` 
            : "bg-white/5 text-gray-500 hover:bg-white/10"
        } ${order.status === "Cancelled" ? "opacity-30 cursor-not-allowed" : ""}`}
      >
        <Icon className="w-5 h-5 mb-1" />
        {label}
      </button>
    );
  };

  return (
    <div className="max-w-md md:max-w-6xl mx-auto min-h-screen px-4 py-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Partner Dashboard</h1>
        <p className="text-brand-primary text-sm font-medium">Manage incoming orders</p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
           {[1,2,3].map(i => <div key={i} className="h-40 bg-brand-gray/50 rounded-2xl"></div>)}
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-panel p-8 text-center rounded-2xl mt-12 bg-black/40">
           <Package className="w-16 h-16 text-brand-primary/50 mx-auto mb-4" />
           <h2 className="text-xl font-bold text-white mb-2">No active orders</h2>
           <p className="text-gray-400 text-sm">When users order your dishes, they will appear here for you to manage.</p>
        </div>
      ) : (
        <div className="space-y-5 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {orders.map((order) => (
            <div key={order._id} className={`glass-panel p-5 rounded-2xl border-l-4 h-full flex flex-col justify-between ${
              order.status === 'Cancelled' ? 'border-l-red-500 bg-red-900/10 opacity-75' : 'border-l-brand-primary'
            }`}>
              {/* Header */}
              <div className="flex justify-between items-start mb-4 pb-3 border-b border-white/10">
                <div>
                  <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider mb-1">
                    Order #{order._id.substring(order._id.length - 6)}
                  </div>
                  <h3 className="font-bold text-white text-lg">{order.user?.name || "Customer"}</h3>
                  <p className="text-xs text-gray-400 flex items-center space-x-1 mt-0.5">
                    <span className="truncate max-w-[200px]">{order.deliveryAddress || order.user?.address || "No address provided"}</span>
                  </p>
                </div>
                <div className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                    order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : 
                    order.status === 'Cancelled' ? 'bg-red-500/20 text-red-500' :
                    order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-brand-primary/20 text-brand-primary'
                  }`}>
                    {order.status}
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-5 bg-black/30 p-3 rounded-xl border border-white/5">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-3">
                       <span className="text-brand-primary font-bold bg-brand-primary/10 px-2 py-0.5 rounded">{item.quantity}x</span> 
                       <span className="text-white font-medium">{item.food?.name || "Unknown Item"}</span>
                    </div>
                    <span className="text-gray-400 font-mono">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Status Pipeline Buttons */}
              {order.status !== 'Cancelled' ? (
                <div className="flex space-x-2">
                  <StatusButton order={order} status="Pending" icon={Clock} label="Pending" colorClass="bg-yellow-500 text-white" />
                  <StatusButton order={order} status="Preparing" icon={Package} label="Cooking" colorClass="bg-blue-500 text-white" />
                  <StatusButton order={order} status="Out for Delivery" icon={Truck} label="Out" colorClass="bg-purple-500 text-white" />
                  <StatusButton order={order} status="Delivered" icon={CheckCircle} label="Done" colorClass="bg-green-500 text-white" />
                </div>
              ) : (
                <div className="text-center text-red-400 text-sm font-semibold bg-red-500/10 py-2 rounded-xl">
                   Customer cancelled this order.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}