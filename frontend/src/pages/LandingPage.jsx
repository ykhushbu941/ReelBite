import { useNavigate } from "react-router-dom";
import { ArrowRight, Utensils } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-br from-[#1C1C1C] to-[#0A0A0A] flex flex-col justify-between p-6 relative z-10 pt-20">
      
      {/* Hero Content - the old header was removed to avoid double branding */}

      {/* Hero Content */}
      <div className="flex-1 flex flex-col md:flex-row justify-center items-center text-center md:text-left max-w-sm md:max-w-5xl mx-auto md:w-full md:gap-16 lg:gap-32">
        
        {/* Main Graphic/Icon (Moved to top on mobile, right on desktop) */}
        <div className="w-32 h-32 md:w-64 md:h-64 bg-gradient-to-tr from-[#FC8019] to-[#E23744] rounded-[2rem] md:rounded-[4rem] flex items-center justify-center shadow-lg shadow-[#FC8019]/20 mb-8 md:mb-0 md:order-2" style={{ transform: 'rotate(-10deg)' }}>
            <span className="text-6xl md:text-9xl">🍕</span>
        </div>
        
        <div className="md:order-1 flex flex-col items-center md:items-start md:max-w-md">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight tracking-tight mb-4">
              Experience food like never before.
            </h1>
            <p className="text-gray-400 font-medium mb-10 md:text-lg">
              Watch mouth-watering reels, explore nearby top brands, and order in seconds.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row w-full gap-4 mt-2">
              <button 
                onClick={() => navigate('/login')}
                className="group bg-[#FC8019] text-white w-full py-4 px-8 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                Log In
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => navigate('/register')}
                className="bg-white/10 text-white w-full py-4 px-8 rounded-2xl font-extrabold text-lg hover:bg-white/20 transition-all shadow-lg hover:scale-[1.02] active:scale-95"
              >
                Create Account
              </button>
            </div>
        </div>

      </div>
    </div>
  );
}
