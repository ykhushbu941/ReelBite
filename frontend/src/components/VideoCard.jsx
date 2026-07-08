import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function VideoCard({ food }) {
  const { token } = useContext(AuthContext);

  const like = async () => {
    await axios.post(
      `/api/foods/like/${food._id}`,
      {},
      { headers: { Authorization: token } }
    );
    window.location.reload();
  };

  return (
    <div className="h-screen relative">
      <video
        src={food.videoUrl}
        autoPlay
        loop
        muted
        className="w-full h-full object-cover"
      />

      <div className="absolute bottom-10 left-5 text-white">
        <h2 className="text-xl font-bold">{food.name}</h2>
        <p className="font-semibold">₹{food.price}</p>
        <button onClick={like} className="mt-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2">
           ❤️ {food.likes?.length || 0}
        </button>
      </div>
    </div>
  );
}