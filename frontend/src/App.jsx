import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReelsPage from "./pages/ReelsPage";
import AddFood from "./pages/AddFood";
import PartnerDashboard from "./pages/PartnerDashboard";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import SavedPage from "./pages/SavedPage";

// Components
import TopBar from "./components/TopBar";
import BottomNavigation from "./components/BottomNavigation";

import LandingPage from "./pages/LandingPage";

// 🔐 Protected Route (User must be logged in)
function ProtectedRoute({ children }) {
  const { token, loading } = useContext(AuthContext);

  if (loading) return <div className="h-screen flex text-white justify-center items-center bg-brand-dark">Loading...</div>;
  if (!token) return <Navigate to="/login" />;
  
  return children;
}

// 👨‍🍳 Partner Route (Only partners allowed)
function PartnerRoute({ children }) {
  const { token, role, loading } = useContext(AuthContext);

  if (loading) return <div className="h-screen flex text-white justify-center items-center bg-brand-dark">Loading...</div>;
  if (!token) return <Navigate to="/login" />;
  if (role !== "partner") return <Navigate to="/home" />;

  return children;
}

export default function App() {
  return (
    <div className="bg-brand-dark min-h-screen font-sans antialiased text-white pb-16 pt-14 selection:bg-brand-primary/30 relative">
      <TopBar />

      <Routes>
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

        {/* Partner Routing */}
        <Route
          path="/add"
          element={
            <PartnerRoute>
              <AddFood />
            </PartnerRoute>
          }
        />
        
        <Route
          path="/dashboard"
          element={
            <PartnerRoute>
              <PartnerDashboard />
            </PartnerRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>

      <BottomNavigation />
    </div>
  );
}