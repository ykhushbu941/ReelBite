import { Link, useLocation } from "react-router-dom";
import { Home, PlaySquare, ShoppingBag, User, Bookmark, UploadCloud, LayoutDashboard } from "lucide-react";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

export default function BottomNavigation() {
  const location = useLocation();
  const { getCartCount } = useContext(CartContext);
  const { role } = useContext(AuthContext);
  
  // Don't show bottom nav on landing, login, or register pages
  if (["/", "/login", "/register"].includes(location.pathname)) return null;

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative ${isActive ? "text-brand-primary" : "text-gray-400 hover:text-white transition-colors"}`}>
        
        {/* Active Indicator Line */}
        {isActive && (
            <div className="absolute top-0 w-8 h-0.5 bg-brand-primary rounded-b-full"></div>
        )}

        <div className="relative mt-1">
          <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${isActive ? 'fill-brand-primary/10' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
          {label === 'Cart' && getCartCount() > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-brand-secondary text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-fade-in shadow-md">
              {getCartCount()}
            </span>
          )}
        </div>
        <span className="text-[11px] sm:text-xs font-semibold">{label}</span>
      </Link>
    );
  };

  return (
    <div className="fixed bottom-0 w-full glass-panel h-16 safe-area-bottom z-50 rounded-t-2xl border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        <NavItem to="/home" icon={Home} label="Home" />
        <NavItem to="/reels" icon={PlaySquare} label="Reels" />
        
        {role === "partner" ? (
          <>
             <NavItem to="/add" icon={UploadCloud} label="Upload" />
             <NavItem to="/dashboard" icon={LayoutDashboard} label="Manage" />
          </>
        ) : (
          <>
             <NavItem to="/saved" icon={Bookmark} label="Saved" />
             <NavItem to="/cart" icon={ShoppingBag} label="Cart" />
          </>
        )}
        
        <NavItem to="/profile" icon={User} label="Profile" />
      </div>
    </div>
  );
}
