import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Video, Utensils, IndianRupee, FileText, Upload } from "lucide-react";

export default function AddFood() {
  const [food, setFood] = useState({
    name: "",
    videoUrl: "",
    price: "",
    restaurant: "",
    description: "",
    category: "Burger"
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/foods", food);
      alert("Reel and Food added successfully! 🎉");
      navigate("/reels");
    } catch (err) {
      alert(err.response?.data?.msg || "Error adding food");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-md md:max-w-2xl mx-auto min-h-screen px-4 py-8">
      <div className="mb-8">
         <h1 className="text-2xl font-bold text-white mb-2">Partner Dashboard</h1>
         <p className="text-brand-primary text-sm font-medium">Upload a new Food Reel</p>
      </div>

      <div className="glass-panel p-6 rounded-3xl">
        <form onSubmit={submit} className="space-y-4">
          
          <div>
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1 block">Video URL (mp4)</label>
            <div className="relative">
              <Video className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <input 
                name="videoUrl" 
                placeholder="https://.../video.mp4" 
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand-primary outline-none" 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1 block">Food Details</label>
            <div className="relative mb-3">
              <Utensils className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <input 
                name="name" 
                placeholder="Food Item Name" 
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand-primary outline-none" 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="flex gap-3">
              <div className="relative flex-grow">
                <IndianRupee className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                <input 
                  name="price" 
                  type="number"
                  placeholder="Price" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand-primary outline-none" 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <select name="category" onChange={handleChange} className="w-1/2 p-3 rounded-xl bg-black/40 border border-white/10 text-gray-300 focus:outline-none focus:border-brand-primary appearance-none">
                <option value="Burger">Burger</option>
                <option value="Pizza">Pizza</option>
                <option value="Healthy">Healthy</option>
                <option value="Dessert">Dessert</option>
                <option value="Drinks">Drinks</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1 block">Restaurant Name</label>
            <input 
              name="restaurant" 
              placeholder="e.g. Burger King" 
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-brand-primary outline-none" 
              onChange={handleChange} 
              required 
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1 block">Short Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <textarea 
                name="description" 
                placeholder="Delicious cheese burst..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand-primary outline-none resize-none h-24" 
                onChange={handleChange} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-primary text-white p-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/20 disabled:opacity-50 mt-6"
          >
            <Upload className="w-5 h-5" />
            <span>{loading ? "Uploading..." : "Publish Reel"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}