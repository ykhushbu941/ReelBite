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
        <h2>{food.name}</h2>
        <p>₹{food.price}</p>
        <button onClick={like}>❤️ {food.likes}</button>
      </div>
    </div>
  );
}