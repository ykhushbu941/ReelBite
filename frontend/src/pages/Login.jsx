import { useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ChefHat, UtensilsCrossed } from "lucide-react";
import TopBar from "../components/TopBar";

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
      // 🔑 Simplified login: directly call the login endpoint
      const loginRes = await API.post("/auth/user/login", { email, password });
      
      console.log("✅ Login successful:", loginRes.data);
      login(loginRes.data.token, loginRes.data.role, loginRes.data.user);
      
      if (loginRes.data.role === "partner") {
        navigate("/profile");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error("❌ Login Error:", err);
      const msg = err.response?.data?.msg || err.message || "Login failed. Please check your connection.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const isPartner = loginType === "partner";

  return (
    <>
      <TopBar />
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 relative overflow-hidden pt-16">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-[var(--brand-orange)]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[var(--brand-yellow)]/10 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="w-full max-w-sm relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-br from-[var(--brand-orange)] to-[var(--brand-yellow)] mb-6 shadow-2xl shadow-orange-500/20">
               <UtensilsCrossed className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter">QuickBites</h1>
            <p className="text-[var(--text-secondary)] text-[13px] font-bold mt-2 uppercase tracking-widest opacity-80">Discover food, one reel at a time</p>
          </div>

          {/* Card */}
          <div className="bg-[var(--bg-surface)] rounded-[3rem] p-8 border border-[var(--border-color)] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">

            {/* Portal Toggle */}
            <div className="flex bg-[var(--bg-primary)] rounded-[1.5rem] p-1.5 mb-8 border border-[var(--border-color)]">
              <button
                onClick={() => { setLoginType("user"); setError(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-black rounded-xl transition-all duration-300 ${
                  loginType === "user"
                    ? "bg-[var(--brand-orange)] text-white shadow-lg shadow-orange-500/20"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <UtensilsCrossed className="w-4 h-4" />
                Foodie
              </button>
              <button
                onClick={() => { setLoginType("partner"); setError(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-black rounded-xl transition-all duration-300 ${
                  loginType === "partner"
                    ? "bg-[var(--brand-orange)] text-white shadow-lg shadow-orange-500/20"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <ChefHat className="w-4 h-4" />
                Partner
              </button>
            </div>

            {error && (
              <div className="mb-6 text-[11px] font-black uppercase tracking-widest text-[#E23744] bg-[#E23744]/10 p-4 rounded-2xl text-center border border-[#E23744]/20 animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[var(--brand-orange)] transition-colors pointer-events-none" />
                <input
                  type="email"
                  className="w-full pl-12 pr-5 py-4 rounded-[1.25rem] bg-[var(--bg-primary)] border border-transparent text-[var(--text-primary)]
                             placeholder-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--brand-orange)] focus:ring-4
                             focus:ring-[var(--brand-orange)]/5 transition-all text-[13px] font-bold"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[var(--brand-orange)] transition-colors pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-14 py-4 rounded-[1.25rem] bg-[var(--bg-primary)] border border-transparent text-[var(--text-primary)]
                             placeholder-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--brand-orange)] focus:ring-4
                             focus:ring-[var(--brand-orange)]/5 transition-all text-[13px] font-bold"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 font-black rounded-2xl transition-all shadow-xl mt-4 text-white text-[13px] uppercase tracking-widest
                            disabled:opacity-60 active:scale-[0.98] bg-[var(--brand-orange)] hover:bg-orange-600 shadow-orange-500/25"
              >
                {loading ? "Signing in..." : (isPartner ? "Restaurant Login" : "Foodie Login")}
              </button>
            </form>

            <p className="text-[13px] mt-8 text-center text-[var(--text-secondary)] font-bold">
              New here?{" "}
              <Link to="/register" className="text-[var(--brand-orange)] hover:underline font-black">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}