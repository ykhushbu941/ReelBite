import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin } from "lucide-react";

export default function Register() {
  const [user, setUser] = useState({ name: "", email: "", password: "", phone: "", address: "", role: "user" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useContext(AuthContext); // Will need to import useContext and AuthContext

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("/api/auth/user/register", user);
      
      // Auto-login after successful registration
      const res = await axios.post("/api/auth/user/login", { email: user.email, password: user.password });
      login(res.data.token, res.data.role, res.data.user);

      if (res.data.role === "partner") {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || err.message || "Failed to register. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 py-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-brand-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-6">
           <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h1>
           <p className="text-gray-400 text-sm mt-1">Join QuickBites today!</p>
        </div>

        <div className="bg-brand-gray rounded-3xl p-6 border border-white/8 shadow-2xl">
          {error && (
            <div className="mb-4 text-xs text-red-400 bg-red-500/10 p-3 rounded-xl text-center border border-red-500/20 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" name="name" placeholder="Full Name" required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary text-sm transition-all"
                onChange={handleChange} 
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="email" name="email" placeholder="Email" required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary text-sm transition-all"
                onChange={handleChange} 
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type={showPassword ? "text" : "password"} name="password" placeholder="Password" required
                className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary text-sm transition-all"
                onChange={handleChange} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="tel" name="phone" placeholder="Phone Number" 
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary text-sm transition-all"
                onChange={handleChange} 
              />
            </div>

            {/* Address */}
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" name="address" placeholder="Delivery Address" 
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary text-sm transition-all"
                onChange={handleChange} 
              />
            </div>
            
            {/* Role Select */}
            <div className="pt-2">
              <select name="role" onChange={handleChange} className="w-full py-3.5 px-4 rounded-xl bg-black/40 border border-white/10 text-gray-300 focus:outline-none focus:border-brand-primary appearance-none text-sm transition-all cursor-pointer">
                <option value="user" className="bg-brand-gray text-white">Foodie (User)</option>
                <option value="partner" className="bg-brand-gray text-white">Restaurant Partner</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-lg mt-4 text-white text-sm disabled:opacity-60 active:scale-[0.98] ${
                user.role === 'partner' ? 'bg-brand-secondary hover:bg-red-500 shadow-brand-secondary/25' : 'bg-brand-primary hover:bg-orange-400 shadow-brand-primary/25'
              }`}
            >
               {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-sm mt-6 text-center text-gray-400">
            Already have an account? <Link to="/login" className="text-brand-primary hover:underline font-semibold">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}