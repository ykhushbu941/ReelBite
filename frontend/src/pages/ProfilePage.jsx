import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { LogOut, Package, MapPin, Phone, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    try {
      const res = await axios.put(`/api/orders/${orderId}/cancel`);
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: res.data.status } : o));
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to cancel order");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-md md:max-w-4xl mx-auto min-h-screen px-4 py-6">
      
      {/* Profile Header */}
      <div className="glass-panel p-6 rounded-3xl flex items-center space-x-5 mb-8">
        <div className="w-20 h-20 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <p className="text-gray-400 text-sm">{user?.email}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium uppercase tracking-wider text-brand-secondary">
            {user?.role}
          </span>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
          <Phone className="w-6 h-6 text-brand-primary" />
          <div>
            <div className="text-xs text-gray-400 mb-1">Phone Number</div>
            <div className="text-sm font-medium">{user?.phone || "Not set"}</div>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
          <MapPin className="w-6 h-6 text-brand-secondary" />
          <div>
            <div className="text-xs text-gray-400 mb-1">Delivery Address</div>
            <div className="text-sm font-medium line-clamp-1">{user?.address || "Not set"}</div>
          </div>
        </div>
      </div>

      {/* Order History */}
      <h3 className="text-xl font-bold mb-4 flex items-center"><Package className="mr-2" /> Order History</h3>
      
      {loading ? (
        <div className="space-y-4 animate-pulse">
           {[1,2].map(i => <div key={i} className="h-28 bg-brand-gray/50 rounded-2xl"></div>)}
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-panel p-8 text-center rounded-2xl">
           <Coffee className="w-12 h-12 text-gray-500 mx-auto mb-3" />
           <p className="text-gray-400">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-2 md:gap-6 pb-20">
          {orders.map((order) => (
            <div key={order._id} className="glass-panel p-5 rounded-2xl border-l-4 border-l-brand-primary h-full flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <div className="text-xs text-gray-400">Order #{order._id.substring(order._id.length - 6)}</div>
                <div className="flex items-center space-x-3">
                  {order.status === "Pending" && (
                     <button onClick={() => cancelOrder(order._id)} className="text-xs text-red-500 hover:underline">Cancel</button>
                  )}
                  <div className={`text-xs font-bold px-2 py-1 rounded ${
                    order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : 
                    order.status === 'Cancelled' ? 'bg-red-500/20 text-red-500' :
                    order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {order.status}
                  </div>
                </div>
              </div>
              <div className="space-y-1 mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="text-gray-400">{item.quantity}x</span> {item.food?.name || "Unknown Food"}
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/10">
                <span className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</span>
                <span className="font-bold">₹{order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Settings / Actions */}
      <button 
        onClick={handleLogout}
        className="mt-8 w-full glass-panel flex items-center justify-center space-x-2 p-4 rounded-xl text-red-400 hover:bg-black transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout Safely</span>
      </button>

    </div>
  );
}
