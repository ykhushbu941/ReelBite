import { useEffect, useState } from "react";
import axios from "axios";

export default function Reels() {
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/api/foods")
      .then((res) => setFoods(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load data");
      });
  }, []);

  if (error) return <h1>{error}</h1>;

  return (
    <div style={{ height: "100vh", overflowY: "scroll" }}>
      {foods.length === 0 ? (
        <h1>No Food Data Found</h1>
      ) : (
        foods.map((f) => (
          <div key={f._id} style={{ height: "100vh" }}>
            <video
              src={f.videoUrl}
              autoPlay
              loop
              muted
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        ))
      )}
    </div>
  );
}