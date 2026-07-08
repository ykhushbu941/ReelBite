import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { User, Phone, MapPin, ArrowLeft, Save, CheckCircle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditProfile() {
  const { user, fetchUser, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put("/auth/user/profile", formData);
      if (fetchUser) await fetchUser();
      setToast("Profile updated successfully!");
      setTimeout(() => {
        setToast(null);
        navigate("/profile");
      }, 2000);
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      setLoading(true);
      try {
        await API.delete("/auth/user/me");
        setToast("Account deleted successfully!");
        setTimeout(() => {
          logout();
          navigate("/");
        }, 1500);
      } catch (err) {
        alert(err.response?.data?.msg || "Failed to delete account");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen px-4 py-8 pt-20 bg-[var(--bg-primary)]">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 z-[110] bg-[var(--text-primary)] text-[var(--bg-primary)] px-6 py-3 rounded-full flex items-center space-x-3 shadow-2xl"
          >
            <CheckCircle className="w-5 h-5 text-[var(--brand-orange)]" />
            <span className="text-sm font-bold">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center space-x-4 mb-10">
        <button onClick={() => navigate(-1)} className="p-3 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)]">
          <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
        </button>
        <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter">Edit Profile</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[var(--bg-surface)] p-8 rounded-[2.5rem] border border-[var(--border-color)] shadow-sm space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-2">Full Name</label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[var(--brand-orange)] transition-colors" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-12 pr-5 py-4 rounded-[1.25rem] bg-[var(--bg-primary)] border border-transparent text-[var(--text-primary)] font-bold text-sm focus:outline-none focus:border-[var(--brand-orange)] transition-all"
                placeholder="Your Name"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-2">Phone Number</label>
            <div className="relative group">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[var(--brand-orange)] transition-colors" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-12 pr-5 py-4 rounded-[1.25rem] bg-[var(--bg-primary)] border border-transparent text-[var(--text-primary)] font-bold text-sm focus:outline-none focus:border-[var(--brand-orange)] transition-all"
                placeholder="Phone Number"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-2">Default Address</label>
            <div className="relative group">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[var(--brand-orange)] transition-colors" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full pl-12 pr-5 py-4 rounded-[1.25rem] bg-[var(--bg-primary)] border border-transparent text-[var(--text-primary)] font-bold text-sm focus:outline-none focus:border-[var(--brand-orange)] transition-all"
                placeholder="Delivery Address"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-[var(--brand-orange)] text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-3 shadow-xl shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={loading}
            className="w-full h-16 bg-red-500/5 text-red-500 border border-red-500/20 rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-3 active:scale-95 transition-all disabled:opacity-50 hover:bg-red-500 hover:text-white group"
          >
            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Delete Account</span>
          </button>
        </div>
      </form>
    </div>
  );
}
