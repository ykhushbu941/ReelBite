import { Link, useLocation } from "react-router-dom";
import { Home, PlaySquare, ShoppingBag, User, Bookmark, UploadCloud, LayoutDashboard } from "lucide-react";
import { useContext } from "react";
import { motion } from "framer-motion";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

export default function BottomNavigation() {
  const location = useLocation();
  const { getCartCount } = useContext(CartContext);
  const { role } = useContext(AuthContext);
  
  if (["/", "/login", "/register"].includes(location.pathname)) return null;

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} className="flex flex-col items-center justify-center w-full h-full relative group">
        
        {/* Active Indicator (Sliding) */}
        {isActive && (
            <motion.div 
               layoutId="nav-indicator"
               className="absolute top-0 w-12 h-1 bg-[var(--brand-orange)] rounded-b-full z-10" 
            />
        )}
        
        {/* Background Highlight */}
        {isActive && (
            <motion.div 
               layoutId="nav-bg"
               className="absolute inset-x-2 inset-y-2 bg-[var(--brand-orange)]/10 rounded-2xl -z-0" 
            />
        )}

        <div className="relative z-10 mt-1">
          <motion.div
            animate={{ scale: isActive ? 1.1 : 1, y: isActive ? -2 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Icon 
              className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${isActive ? "text-[var(--brand-orange)]" : "text-gray-400 group-hover:text-gray-300"}`} 
              strokeWidth={isActive ? 2.5 : 2} 
            />
          </motion.div>
          
          {label === 'Cart' && getCartCount() > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[var(--brand-orange)] text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
              {getCartCount()}
            </span>
          )}
        </div>
        <span className={`text-[10px] sm:text-[11px] font-black tracking-tight transition-colors z-10 ${isActive ? "text-[var(--brand-orange)]" : "text-gray-500 group-hover:text-gray-400"}`}>
            {label}
        </span>
      </Link>
    );
  };

  return (
    <div className="fixed bottom-0 w-full bg-[var(--bg-surface)]/80 backdrop-blur-xl h-16 safe-area-bottom z-50 rounded-t-[2rem] border-t border-[var(--border-color)] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      <div className="flex justify-around items-center h-full max-w-md mx-auto px-2">
        <NavItem to="/reels" icon={PlaySquare} label="Reels" />
        <NavItem to="/home" icon={Home} label="Home" />
        
        {role === "partner" ? (
          <>
             <NavItem to="/add" icon={UploadCloud} label="Upload" />
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
