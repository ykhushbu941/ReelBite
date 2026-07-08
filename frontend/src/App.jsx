import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReelsPage from "./pages/ReelsPage";
import AddFood from "./pages/AddFood";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import SavedPage from "./pages/SavedPage";
import LandingPage from "./pages/LandingPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import EditProfile from "./pages/EditProfile";
import IPRDashboard from "./pages/IPRDashboard";

import PageTransition from "./components/PageTransition";
import TopBar from "./components/TopBar";
import BottomNavigation from "./components/BottomNavigation";

// 🔐 Protected Route (User must be logged in)
function ProtectedRoute({ children }) {
  const { token, loading } = useContext(AuthContext);

  if (loading) return (
    <div className="h-screen flex text-white justify-center items-center bg-[var(--bg-primary)]">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-[var(--brand-orange)] border-t-transparent rounded-full"
      />
    </div>
  );
  
  if (!token) return <Navigate to="/login" />;
  
  return <PageTransition>{children}</PageTransition>;
}

// 👨‍🍳 Partner Route (Only partners allowed)
function PartnerRoute({ children }) {
  const { token, role, loading } = useContext(AuthContext);

  if (loading) return (
    <div className="h-screen flex text-white justify-center items-center bg-[var(--bg-primary)]">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-[var(--brand-orange)] border-t-transparent rounded-full"
      />
    </div>
  );
  
  if (!token) return <Navigate to="/login" />;
  if (role !== "partner") return <Navigate to="/home" />;

  return <PageTransition>{children}</PageTransition>;
}

export default function App() {
  const location = useLocation();

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen font-sans antialiased text-[var(--text-primary)] pb-16 pt-14 selection:bg-[var(--brand-orange)]/30 relative overflow-x-hidden transition-colors duration-300">
      <TopBar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Splash / Landing */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Core App Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/reels"
            element={
              <ProtectedRoute>
                <ReelsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <SavedPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/track-order/:orderId"
            element={
              <ProtectedRoute>
                <TrackOrderPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ipr-dashboard"
            element={
              <ProtectedRoute>
                <IPRDashboard />
              </ProtectedRoute>
            }
          />

          {/* Partner Routing */}
          <Route
            path="/add"
            element={
              <PartnerRoute>
                <AddFood />
              </PartnerRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </AnimatePresence>

      <BottomNavigation />
    </div>
  );
}