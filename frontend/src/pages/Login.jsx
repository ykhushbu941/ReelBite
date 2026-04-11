import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ChefHat, UtensilsCrossed } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/user/login", { email, password });

      // Automatically switch UI loginType to match their actual role for seamless experience
      setLoginType(res.data.role);

      login(res.data.token, res.data.role, res.data.user);

      if (res.data.role === "partner") {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || err.message || "Failed to login. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const isPartner = loginType === "partner";

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-brand-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary mb-4 shadow-lg shadow-brand-primary/30">
            <span className="text-3xl">🍔</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">QuickBites</h1>
          <p className="text-gray-400 text-sm mt-1">Discover food, one reel at a time</p>
        </div>

        {/* Card */}
        <div className="bg-brand-gray rounded-3xl p-6 border border-white/8 shadow-2xl">

          {/* Portal Toggle */}
          <div className="flex bg-black/50 rounded-2xl p-1 mb-6 border border-white/5">
            <button
              onClick={() => { setLoginType("user"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                loginType === "user"
                  ? "bg-brand-primary text-white shadow-md shadow-brand-primary/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              Foodie
            </button>
            <button
              onClick={() => { setLoginType("partner"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                loginType === "partner"
                  ? "bg-brand-secondary text-white shadow-md shadow-brand-secondary/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <ChefHat className="w-4 h-4" />
              Restaurant
            </button>
          </div>

          {error && (
            <div className="mb-4 text-xs text-red-400 bg-red-500/10 p-3 rounded-xl text-center border border-red-500/20 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                type="email"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white
                           placeholder-gray-500 focus:outline-none focus:border-brand-primary focus:ring-1
                           focus:ring-brand-primary/50 transition-all text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white
                           placeholder-gray-500 focus:outline-none focus:border-brand-primary focus:ring-1
                           focus:ring-brand-primary/50 transition-all text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg mt-2 text-white text-sm
                          disabled:opacity-60 active:scale-[0.98] ${
                isPartner
                  ? "bg-brand-secondary hover:bg-red-500 shadow-brand-secondary/25"
                  : "bg-brand-primary hover:bg-orange-400 shadow-brand-primary/25"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </span>
              ) : (
                isPartner ? "Log In as Restaurant" : "Log In as Foodie"
              )}
            </button>
          </form>

          <p className="text-sm mt-6 text-center text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-brand-primary hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}