import { Home, PlusSquare, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 w-full bg-black/70 backdrop-blur-md text-white flex justify-around py-3 z-50">
      <Home onClick={() => navigate("/reels")} className="cursor-pointer" />
      <PlusSquare onClick={() => navigate("/add")} className="cursor-pointer" />
      <User onClick={() => navigate("/profile")} className="cursor-pointer" />
    </div>
  );
}