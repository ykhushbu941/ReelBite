import { useState, useContext } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin, ChefHat, UtensilsCrossed, ChevronDown } from "lucide-react";
import TopBar from "../components/TopBar";

export default function Register() {
  const [user, setUser] = useState({ name: "", email: "", password: "", phone: "", address: "", role: "user" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("Registering with payload:", user);
    try {
      await API.post("/auth/user/register", user);
      
      console.log("Registration successful, logging in...");
      const res = await API.post("/auth/user/login", { email: user.email, password: user.password });
      console.log("Login res:", res.data);
      
      login(res.data.token, res.data.role, res.data.user);

      if (res.data.role === "partner") {
        navigate("/profile");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error("Registration/Login Error:", err);
      setError(err.response?.data?.msg || err.message || "Failed to register. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'restaurantName') {
      // Auto-use restaurant name as the account name for the backend
      setUser({ ...user, restaurantName: value, name: value });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  return (
    <>
      <TopBar />
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 py-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-[var(--brand-orange)]/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[var(--brand-yellow)]/10 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="w-full max-sm relative z-10">
          <div className="text-center mb-8">
             <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">Create Account</h1>
             <p className="text-[var(--text-secondary)] text-[13px] font-bold mt-2 uppercase tracking-widest opacity-80">Join QuickBites today!</p>
          </div>

          <div className="bg-[var(--bg-surface)] rounded-[3rem] p-8 border border-[var(--border-color)] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
            {error && (
              <div className="mb-6 text-[11px] font-black uppercase tracking-widest text-[#E23744] bg-[#E23744]/10 p-4 rounded-2xl text-center border border-[#E23744]/20 animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Name - only for Foodies */}
              {user.role !== 'partner' && (
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[var(--brand-orange)] transition-colors" />
                  <input 
                    type="text" name="name" placeholder="Full Name" required
                    className="w-full pl-12 pr-5 py-4 rounded-[1.25rem] bg-[var(--bg-primary)] border border-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--brand-orange)] text-[13px] font-bold transition-all shadow-sm"
                    onChange={handleChange} 
                  />
                </div>
              )}

              {/* Restaurant Name - only for Partners */}
              {user.role === 'partner' && (
                <div className="relative group">
                  <ChefHat className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[var(--brand-orange)] transition-colors" />
                  <input 
                    type="text" name="restaurantName" placeholder="Restaurant Name" required
                    className="w-full pl-12 pr-5 py-4 rounded-[1.25rem] bg-[var(--bg-primary)] border border-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--brand-orange)] text-[13px] font-bold transition-all shadow-sm"
                    onChange={handleChange} 
                  />
                </div>
              )}

              {/* Email */}
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[var(--brand-orange)] transition-colors" />
                <input 
                  type="email" name="email" placeholder="Email Address" required
                  className="w-full pl-12 pr-5 py-4 rounded-[1.25rem] bg-[var(--bg-primary)] border border-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--brand-orange)] text-[13px] font-bold transition-all shadow-sm"
                  onChange={handleChange} 
                />
              </div>

              {/* Password */}
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[var(--brand-orange)] transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} name="password" placeholder="Create Password" required
                  className="w-full pl-12 pr-14 py-4 rounded-[1.25rem] bg-[var(--bg-primary)] border border-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--brand-orange)] text-[13px] font-bold transition-all shadow-sm"
                  onChange={handleChange} 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Phone */}
              <div className="relative group">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[var(--brand-orange)] transition-colors" />
                <input 
                  type="tel" name="phone" placeholder="Phone Number" 
                  className="w-full pl-12 pr-5 py-4 rounded-[1.25rem] bg-[var(--bg-primary)] border border-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--brand-orange)] text-[13px] font-bold transition-all shadow-sm"
                  onChange={handleChange} 
                />
              </div>

              {/* Address */}
              <div className="relative group">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[var(--brand-orange)] transition-colors" />
                <input 
                  type="text" name="address" placeholder={user.role === 'partner' ? 'Restaurant Address' : 'Delivery Address'}
                  className="w-full pl-12 pr-5 py-4 rounded-[1.25rem] bg-[var(--bg-primary)] border border-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--brand-orange)] text-[13px] font-bold transition-all shadow-sm"
                  onChange={handleChange} 
                />
              </div>

              {/* Role Selector Dropdown */}
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                  {user.role === 'partner' 
                    ? <ChefHat className="w-4 h-4 text-[var(--brand-orange)]" />
                    : <UtensilsCrossed className="w-4 h-4 text-[var(--brand-orange)]" />}
                </div>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none" />
                <select
                  name="role"
                  value={user.role}
                  onChange={(e) => { setUser({ ...user, role: e.target.value }); setError(""); }}
                  className="w-full pl-12 pr-10 py-4 rounded-[1.25rem] bg-[var(--bg-primary)] border-2 border-[var(--brand-orange)]/30 text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-orange)] text-[13px] font-black transition-all cursor-pointer appearance-none"
                >
                  <option value="user">🍽️ &nbsp; I'm a Foodie (Order Food)</option>
                  <option value="partner">👨‍🍳 &nbsp; I'm a Restaurant Partner (Sell Food)</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 font-black rounded-2xl transition-all shadow-xl mt-6 text-white text-[13px] uppercase tracking-widest disabled:opacity-60 active:scale-[0.98] bg-[var(--brand-orange)] hover:bg-orange-600 shadow-orange-500/25"
              >
                 {loading ? "Joining..." : (user.role === 'partner' ? "Create Restaurant" : "Join QuickBites")}
              </button>
            </form>

            <p className="text-[13px] mt-8 text-center text-[var(--text-secondary)] font-bold">
              Already have an account? <Link to="/login" className="text-[var(--brand-orange)] hover:underline font-black">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}