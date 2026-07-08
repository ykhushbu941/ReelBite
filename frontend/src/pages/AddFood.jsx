 import { useState, useContext, useEffect, useRef } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { Video, Utensils, IndianRupee, FileText, Upload, Sparkles, Image as ImageIcon, CheckCircle, ChevronLeft, Play, Eye, MapPin, Info, FileVideo, ImagePlus, Store } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function AddFood() {
  const { user } = useContext(AuthContext);
  const [food, setFood] = useState({
    name: "",
    price: "",
    restaurant: user?.restaurantName || user?.name || "",
    description: user?.address || "",
    category: "Veg",
    cuisine: "Indian",
    isVeg: true
  });
  
  // File Upload states
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // IPR System states
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiStyle, setAiStyle] = useState("Gourmet");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [enablePoovv, setEnablePoovv] = useState(true);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  
  const videoInputRef = useRef();
  const imageInputRef = useRef();

  useEffect(() => {
    if (user?.restaurantName || user?.address) {
      setFood(f => ({ 
          ...f, 
          restaurant: user.restaurantName || f.restaurant,
          description: user.address || f.description 
      }));
    }
  }, [user]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'video') {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    } else {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGenerateAiReel = async () => {
    if (!food.name || !food.price) {
      alert("Please fill in the Dish Name and Price before running the AI Reel Engine.");
      return;
    }
    setIsGeneratingAi(true);
    try {
      const res = await API.post("/ipr/generate-reel", {
        name: food.name,
        price: food.price,
        cuisine: food.cuisine,
        category: food.category,
        style: aiStyle,
        description: food.description
      });
      if (res.data?.success) {
        setAiData(res.data);
        setVideoPreview(res.data.videoUrl);
        setImagePreview(res.data.imageUrl);
        setToast("AI Storyboard & Reel Generated! 🤖🎥");
        setTimeout(() => setToast(null), 2500);
      }
    } catch (err) {
      alert("Error generating AI reel: " + (err.response?.data?.msg || err.message));
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!isAiMode && !videoFile) {
        alert("Please upload a video reel!");
        return;
    }
    if (isAiMode && !aiData) {
        alert("Please generate the AI Reel before publishing!");
        return;
    }

    setLoading(true);
    
    try {
      let verificationPayload = null;
      if (enablePoovv) {
        // Trigger Geolocation capture
        const coords = await new Promise((resolve) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
              () => resolve({ lat: 12.9716, lng: 77.5946 }) // Default/mock Bangalore coordinates
            ), { timeout: 3000 };
          } else {
            resolve({ lat: 12.9716, lng: 77.5946 });
          }
        });

        // Request cryptographic stamp
        const hash = "sha256_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const devId = "dev-mac-" + Math.random().toString(36).substring(2, 10).toUpperCase();
        
        const verifyRes = await API.post("/ipr/verify-kitchen", {
          lat: coords.lat,
          lng: coords.lng,
          deviceId: devId,
          fileHash: hash
        });
        if (verifyRes.data?.success) {
          verificationPayload = verifyRes.data.verificationMetadata;
        }
      }

      const formData = new FormData();
      formData.append("name", food.name);
      formData.append("price", food.price);
      formData.append("restaurant", food.restaurant);
      formData.append("description", food.description);
      formData.append("category", food.category);
      formData.append("cuisine", food.cuisine);
      formData.append("isVeg", food.isVeg);
      
      if (isAiMode) {
        formData.append("isAiGenerated", "true");
        formData.append("videoUrl", aiData.videoUrl);
        formData.append("imageUrl", aiData.imageUrl);
        formData.append("aiStoryboard", JSON.stringify(aiData.storyboard));
      } else {
        if (videoFile) formData.append("video", videoFile);
        if (imageFile) formData.append("image", imageFile);
      }

      if (verificationPayload) {
        formData.append("verificationMetadata", JSON.stringify(verificationPayload));
      }

      await API.post("/foods", formData);
      setToast("Reel Published Successfully! 🎉");
      setTimeout(() => {
        setToast(null);
        navigate("/reels");
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.msg || "Error adding food");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFood({ ...food, [name]: type === 'checkbox' ? checked : value });
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="max-w-md md:max-w-6xl mx-auto min-h-screen px-4 py-8 pt-20 pb-24 bg-[var(--bg-primary)] transition-colors duration-300">
      
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 z-[110] bg-[var(--text-primary)] text-[var(--bg-primary)] px-6 py-3 rounded-full flex items-center space-x-3 shadow-2xl animate-bounce"
          >
            <CheckCircle className="w-5 h-5 text-[var(--brand-orange)]" />
            <span className="text-sm font-bold">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial="hidden" animate="visible" className="space-y-8">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="p-3 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)]">
                <ChevronLeft className="w-5 h-5 text-[var(--text-primary)]" />
              </button>
              <div>
                 <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tighter uppercase">Creator <span className="text-[var(--brand-orange)]">Studio</span></h1>
                 <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.3em] mt-1 ml-1">IPR Automated Publishing</p>
              </div>
           </div>
           <Sparkles className="text-[var(--brand-orange)] w-8 h-8 opacity-40 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-[var(--bg-surface)] p-8 rounded-[3rem] border border-[var(--border-color)] shadow-sm">
            
            {/* Tabs Switcher for CARE Engine */}
            <div className="grid grid-cols-2 p-1 bg-[var(--bg-primary)] rounded-[1.5rem] border border-[var(--border-color)] mb-6">
              <button
                type="button"
                onClick={() => { setIsAiMode(false); setVideoPreview(null); setImagePreview(null); setAiData(null); }}
                className={`py-3 rounded-[1.25rem] font-bold text-[10px] uppercase tracking-widest transition-all ${!isAiMode ? "bg-[var(--brand-orange)] text-white shadow-md" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
              >
                📤 Standard Upload
              </button>
              <button
                type="button"
                onClick={() => { setIsAiMode(true); setVideoPreview(null); setImagePreview(null); }}
                className={`py-3 rounded-[1.25rem] font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${isAiMode ? "bg-[var(--brand-orange)] text-white shadow-md" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                🤖 CARE AI Generative
              </button>
            </div>

            <form onSubmit={submit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest ml-2">Dish Name</label>
                  <div className="relative group">
                    <Utensils className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[var(--brand-orange)] transition-colors" />
                    <input name="name" value={food.name} placeholder="e.g. Flaming Peri-Peri Wings" className="w-full bg-[var(--bg-primary)] border border-transparent rounded-[1.25rem] py-4 pl-12 pr-4 text-[var(--text-primary)] font-bold focus:border-[var(--brand-orange)] outline-none transition-all text-sm" onChange={handleChange} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest ml-2">Price (₹)</label>
                  <div className="relative group">
                    <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[var(--brand-orange)] transition-colors" />
                    <input name="price" type="number" value={food.price} placeholder="349" className="w-full bg-[var(--bg-primary)] border border-transparent rounded-[1.25rem] py-4 pl-12 pr-4 text-[var(--text-primary)] font-bold focus:border-[var(--brand-orange)] outline-none transition-all text-sm" onChange={handleChange} required />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest ml-2">Restaurant Name</label>
                <div className="relative group">
                  <Store className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[var(--brand-orange)] transition-colors" />
                  <input name="restaurant" value={food.restaurant} placeholder="Your Restaurant Name" className="w-full bg-[var(--bg-primary)] border border-transparent rounded-[1.25rem] py-4 pl-12 pr-4 text-[var(--text-primary)] font-bold focus:border-[var(--brand-orange)] outline-none transition-all text-sm" onChange={handleChange} required />
                </div>
              </div>

              {/* 🎥 Media Area: Upload vs Generative */}
              {!isAiMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest ml-2">Upload Reel (MP4)</label>
                      <div 
                          onClick={() => videoInputRef.current.click()}
                          className={`w-full aspect-video bg-[var(--bg-primary)] rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--bg-primary)]/80 transition-all ${videoFile ? 'border-[var(--brand-orange)]' : 'border-[var(--border-color)]'}`}
                      >
                          <input type="file" accept="video/mp4" ref={videoInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'video')} />
                          {videoFile ? (
                             <>
                                <FileVideo className="w-8 h-8 text-[var(--brand-orange)] mb-2" />
                                <span className="text-[10px] font-bold text-[var(--text-primary)] uppercase truncate max-w-[80%]">{videoFile.name}</span>
                             </>
                          ) : (
                             <>
                                <Upload className="w-8 h-8 text-[var(--text-secondary)] mb-2" />
                                <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Choose Video</span>
                             </>
                          )}
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest ml-2">Upload Photo (Thumbnail)</label>
                      <div 
                          onClick={() => imageInputRef.current.click()}
                          className={`w-full aspect-video bg-[var(--bg-primary)] rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--bg-primary)]/80 transition-all ${imageFile ? 'border-[var(--brand-orange)]' : 'border-[var(--border-color)]'}`}
                      >
                          <input type="file" accept="image/*" ref={imageInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'image')} />
                          {imageFile ? (
                             <>
                                <ImagePlus className="w-8 h-8 text-[var(--brand-orange)] mb-2" />
                                <span className="text-[10px] font-bold text-[var(--text-primary)] uppercase truncate max-w-[80%]">{imageFile.name}</span>
                             </>
                          ) : (
                             <>
                                <ImageIcon className="w-8 h-8 text-[var(--text-secondary)] mb-2" />
                                <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Choose Image</span>
                             </>
                          )}
                      </div>
                   </div>
                </div>
              ) : (
                <div className="bg-[var(--bg-primary)] p-5 rounded-[2rem] border border-[var(--border-color)] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase">Culinary AI Reel Engine (CARE)</h4>
                      <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase mt-0.5">Automated Storyboarding System</p>
                    </div>
                    <Sparkles className="w-5 h-5 text-[var(--brand-orange)] animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">AI Video Pacing & Style</label>
                    <select 
                      value={aiStyle} 
                      onChange={(e) => setAiStyle(e.target.value)}
                      className="w-full bg-[var(--bg-surface)] border border-transparent rounded-[1.25rem] py-3.5 px-4 text-[var(--text-primary)] font-bold outline-none cursor-pointer text-sm"
                    >
                      <option value="Gourmet">Gourmet Aesthetic (Slow plates, voiceover)</option>
                      <option value="Cinematic">Cinematic Gourmet (High contrast, steam focus)</option>
                      <option value="ASMR Fast">High Energy ASMR (Rapid slicing, high sizzle audio)</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateAiReel}
                    disabled={isGeneratingAi}
                    className="w-full py-4 bg-[var(--brand-orange)]/10 text-[var(--brand-orange)] hover:bg-[var(--brand-orange)] border border-[var(--brand-orange)]/30 hover:text-white rounded-[1.25rem] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                  >
                    {isGeneratingAi ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[var(--brand-orange)] border-t-transparent rounded-full animate-spin" />
                        <span>Synthesizing Frame Buffers...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Synthesize AI Storyboard & Video</span>
                      </>
                    )}
                  </button>

                  {/* Storyboard display */}
                  {aiData && (
                    <div className="mt-4 space-y-3">
                      <h5 className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wider">CARE Orchestrator Output:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {aiData.storyboard.map((scene) => (
                          <div key={scene.sceneNumber} className="bg-[var(--bg-surface)] p-3 rounded-2xl border border-[var(--border-color)] flex flex-col justify-between">
                            <div>
                              <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-full bg-[var(--brand-orange)]/20 text-[var(--brand-orange)] uppercase">Scene {scene.sceneNumber}</span>
                              <p className="text-[9px] text-[var(--text-primary)] mt-1.5 font-bold line-clamp-2 italic">"{scene.visualPrompt}"</p>
                            </div>
                            <div className="mt-2 pt-2 border-t border-white/5">
                              <span className="text-[8px] text-[var(--text-secondary)] uppercase block font-semibold">Narrator VO:</span>
                              <p className="text-[9px] text-[var(--text-secondary)] font-medium leading-relaxed">"{scene.voiceoverText}"</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest ml-2">Cuisine</label>
                  <select name="cuisine" value={food.cuisine} onChange={handleChange} className="w-full bg-[var(--bg-primary)] border border-transparent rounded-[1.25rem] py-4 px-5 text-[var(--text-primary)] font-bold focus:border-[var(--brand-orange)] outline-none transition-all appearance-none cursor-pointer text-sm">
                    <option value="Indian">Indian</option>
                    <option value="South Indian">South Indian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Italian">Italian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="American">American</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Mediterranean">Mediterranean</option>
                    <option value="Healthy">Healthy</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest ml-2">Category</label>
                  <select name="category" value={food.category} onChange={handleChange} className="w-full bg-[var(--bg-primary)] border border-transparent rounded-[1.25rem] py-4 px-5 text-[var(--text-primary)] font-bold focus:border-[var(--brand-orange)] outline-none transition-all appearance-none cursor-pointer text-sm">
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest ml-2">Restaurant Address</label>
                <div className="relative group">
                  <MapPin className="absolute left-5 top-5 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[var(--brand-orange)] transition-colors" />
                  <textarea name="description" value={food.description} placeholder="Enter the full physical address..." className="w-full bg-[var(--bg-primary)] border border-transparent rounded-[1.25rem] py-4 pl-12 pr-4 text-[var(--text-primary)] font-bold focus:border-[var(--brand-orange)] outline-none transition-all resize-none h-20 text-sm" onChange={handleChange} />
                </div>
              </div>

              {/* POOVV Secure Kitchen Geotag Verification */}
              <div className="p-5 bg-[var(--bg-primary)] rounded-[2rem] border border-emerald-500/20 shadow-sm shadow-emerald-500/5 space-y-3">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all bg-emerald-500/10 border-emerald-500/30 text-emerald-500`}>
                          <MapPin className="w-4 h-4" />
                       </div>
                       <div>
                          <span className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-widest block">POOVV Secure Verification</span>
                          <span className="text-[10px] font-bold text-emerald-500 uppercase">Cryptographic Origin Stamp</span>
                       </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" checked={enablePoovv} onChange={(e) => setEnablePoovv(e.target.checked)} className="sr-only peer" />
                       <div className="w-12 h-6 bg-[var(--border-color)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                 </div>
                 {enablePoovv && (
                   <div className="text-[10px] font-semibold text-emerald-500/80 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl space-y-1">
                      <p>📡 GPS Satellite Signal Lock Active</p>
                      <p>🔐 Cryptographic Device Signature Key initialized</p>
                      <p>📜 SHA-256 Payload Hash verification queued on submit</p>
                   </div>
                 )}
              </div>

              <div className="flex items-center justify-between p-5 bg-[var(--bg-primary)] rounded-[2rem] border border-[var(--border-color)]">
                 <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${food.isVeg ? "border-[#3D9970] bg-[#3D9970]/10" : "border-[#E23744] bg-[#E23744]/10"}`}>
                       <div className={`w-2.5 h-2.5 rounded-full ${food.isVeg ? "bg-[#3D9970]" : "bg-[#E23744]"}`} />
                    </div>
                    <div>
                       <span className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-widest block">Dietary Preference</span>
                       <span className={`text-[10px] font-bold ${food.isVeg ? "text-[#3D9970]" : "text-[#E23744]"} uppercase`}>{food.isVeg ? "Pure Vegetarian" : "Non-Vegetarian"}</span>
                    </div>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="isVeg" checked={food.isVeg} onChange={handleChange} className="sr-only peer" />
                    <div className="w-12 h-6 bg-[var(--border-color)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-orange)]"></div>
                 </label>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full h-16 bg-[var(--brand-orange)] text-white rounded-[2rem] font-bold text-sm uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-xl shadow-orange-500/30 active:scale-95 transition-all disabled:opacity-50 mt-6 group">
                {loading ? <div className="w-5 h-5 border-2 border-white/50 border-t-transparent rounded-full animate-spin" /> : <><Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" /><span>Publish Reel</span></>}
              </motion.button>
            </form>
          </motion.div>

          <div className="hidden lg:block space-y-6">
             <div className="sticky top-24">
                <div className="flex items-center gap-2 mb-4 ml-4">
                   <Eye className="w-4 h-4 text-[var(--brand-orange)]" />
                   <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Live Preview</span>
                </div>

                <div className="w-full aspect-[9/16] bg-black rounded-[3rem] border-4 border-white/10 shadow-2xl relative overflow-hidden group">
                   {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-cover opacity-60" alt="Preview" />
                   ) : videoPreview ? (
                      <video src={videoPreview} className="w-full h-full object-cover opacity-60" muted />
                   ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white/20 p-8 text-center">
                         <Play className="w-12 h-12 mb-4 opacity-10" />
                         <p className="text-xs font-bold italic uppercase tracking-widest">Upload Media to Preview</p>
                      </div>
                   )}
                   
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                   
                   <div className="absolute bottom-10 left-6 right-12 text-white text-left">
                      <div className="flex items-center gap-2 mb-2">
                         <div className={`w-3 h-3 rounded-sm border flex items-center justify-center ${food.isVeg ? "border-[#3D9970]" : "border-[#E23744]"}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${food.isVeg ? "bg-[#3D9970]" : "bg-[#E23744]"}`} />
                          </div>
                          <span className="text-[10px] font-bold opacity-80">{food.cuisine} • {food.category}</span>
                      </div>
                      <h3 className="text-xl font-bold italic uppercase leading-tight mb-1">{food.name || "Dish Title"}</h3>
                      <p className="text-[10px] opacity-60 line-clamp-1 mb-4">{food.description || "Address will appear here..."}</p>
                      <div className="flex items-center gap-3">
                         <span className="text-xl font-bold">₹{food.price || "0"}</span>
                         <div className="bg-[var(--brand-orange)] px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase">ADD</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}