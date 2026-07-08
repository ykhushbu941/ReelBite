import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Activity, Sparkles, Cpu, Star, ChevronLeft, ArrowRight, Zap, RefreshCw, FileText, CheckCircle2, Lock, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function IPRDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("care");
  const [simulationActive, setSimulationActive] = useState(false);
  const [bandwidthSaved, setBandwidthSaved] = useState(4.8);
  const [verificationRate, setVerificationRate] = useState(99.6);

  const stats = [
    { label: "Patents Queued", value: "5", color: "text-purple-400" },
    { label: "POOVV Verification Rate", value: `${verificationRate}%`, color: "text-emerald-400" },
    { label: "AVOP Bandwidth Saved", value: `${bandwidthSaved.toFixed(1)} GB`, color: "text-orange-400" },
    { label: "VFQAI Mismatch Delta", value: "±4.2%", color: "text-blue-400" }
  ];

  const triggerSimulation = () => {
    setSimulationActive(true);
    // Simulate real-time optimization processing
    setTimeout(() => {
      setSimulationActive(false);
      setBandwidthSaved(prev => prev + 0.2);
      setVerificationRate(99.8);
    }, 2000);
  };

  const tabs = [
    { id: "care", name: "🤖 CARE Engine", subtitle: "Reel Synthesis" },
    { id: "poovv", name: "🛡️ POOVV System", subtitle: "Kitchen Trust" },
    { id: "avop", name: "⚡ AVOP Pipeline", subtitle: "Bandwidth Saver" },
    { id: "cepe", name: "📈 CEPE Predictor", subtitle: "Engagement AI" },
    { id: "vfqai", name: "📊 VFQAI Index", subtitle: "Quality Verification" }
  ];

  return (
    <div className="max-w-6xl mx-auto min-h-screen px-4 py-8 pt-20 pb-28 bg-[var(--bg-primary)] transition-colors duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-3 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--border-color)]/25 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase italic">
              IPR Innovation <span className="text-purple-500">Hub</span>
            </h1>
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mt-1">
              Patent portfolios & system telemetry details
            </p>
          </div>
        </div>

        <button
          onClick={triggerSimulation}
          disabled={simulationActive}
          className="px-6 py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95 transition-all disabled:opacity-55"
        >
          {simulationActive ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Optimizing Telemetry...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Run Telemetry Update</span>
            </>
          )}
        </button>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-[var(--bg-surface)] p-5 rounded-[2rem] border border-[var(--border-color)] shadow-sm space-y-2 flex flex-col justify-between">
            <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">{s.label}</span>
            <h3 className={`text-2xl font-black font-mono tracking-tight ${s.color}`}>{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest block mb-3 ml-2">Innovation Categories</span>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-purple-500/10 border-purple-500/40 text-purple-400 shadow-sm"
                    : "bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-purple-500/20"
                }`}
              >
                <h4 className="text-xs font-black uppercase tracking-wide">{tab.name}</h4>
                <p className="text-[9px] font-bold opacity-60 mt-0.5 uppercase tracking-wider">{tab.subtitle}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Detail Viewer */}
        <div className="lg:col-span-3 bg-[var(--bg-surface)] p-8 rounded-[3.5rem] border border-[var(--border-color)] shadow-sm min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === "care" && (
              <motion.div
                key="care"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase text-[var(--text-primary)] leading-none">Culinary AI Reel Engine (CARE)</h3>
                    <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest">Patent Ref: RB-CARE-2026</span>
                  </div>
                </div>

                <div className="p-5 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] text-xs text-[var(--text-secondary)] leading-relaxed space-y-4">
                  <p className="font-semibold text-[var(--text-primary)]">
                    CARE implements a multi-modal script generation pipeline that translates low-bandwidth user parameters (cuisine, category, plate theme) into timed macro scenes.
                  </p>
                  <p>
                    By dynamically allocating pacing style tags ("ASMR Fast", "Cinematic", "Gourmet") and matching overlays (such as steam focus, sound sizzle intervals, and visual prompts), the engine synthesizes professional commercial reels instantly without requiring video production hardware.
                  </p>
                </div>

                {/* Flowchart diagram */}
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider ml-1">Synthesis Pipeline Architecture</span>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {[
                      { step: "1. Inputs", desc: "Dish details, price, style selection" },
                      { step: "2. Storyboard", desc: "Sequence parsing, camera shots" },
                      { step: "3. Voiceover", desc: "Text-to-speech timing matching" },
                      { step: "4. Rendering", desc: "Playable compiled kinetic reel card" }
                    ].map((step, idx) => (
                      <div key={idx} className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-color)] text-center relative">
                        <span className="text-[9px] font-extrabold text-purple-400 uppercase block">{step.step}</span>
                        <p className="text-[10px] text-[var(--text-secondary)] mt-1 font-semibold leading-relaxed">{step.desc}</p>
                        {idx < 3 && <div className="hidden md:block absolute top-1/2 -right-2.5 -translate-y-1/2 w-4 h-0.5 bg-purple-500/30 z-10" />}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "poovv" && (
              <motion.div
                key="poovv"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase text-[var(--text-primary)] leading-none">Proof-of-Origin Video Verification (POOVV)</h3>
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Patent Ref: RB-POOVV-2026</span>
                  </div>
                </div>

                <div className="p-5 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] text-xs text-[var(--text-secondary)] leading-relaxed space-y-4">
                  <p className="font-semibold text-[var(--text-primary)]">
                    POOVV secures consumers against restaurant menu spoofing and deepfakes by cryptographically tying video submissions to physical kitchen coordinates.
                  </p>
                  <p>
                    When a video is registered, a localized hardware signature is requested, merging device tokens, GPS positioning coordinates (WGS 84 ellipsoid), Wi-Fi router BSSIDs, and timestamp intervals. This packet is hashed with SHA-256 and locked inside the menu database, offering an interactive audit log.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider ml-1">Trust Parameters Validation</span>
                  <div className="bg-[var(--bg-primary)] p-5 rounded-2xl border border-[var(--border-color)] space-y-3 font-mono text-[10px]">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-emerald-400">GEOLOCATION ATTESTATION</span>
                      <span className="text-[var(--text-primary)]">PASSED (Matched Partner coordinates)</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-emerald-400">ROUTER BSSID HANDSHAKE</span>
                      <span className="text-[var(--text-primary)]">PASSED (Verified Dhaba_HQ Router)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-400">ANTI-TAMPER HASH SEAL</span>
                      <span className="text-[var(--text-primary)]">PASSED (SHA-256 Checksum Verified)</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "avop" && (
              <motion.div
                key="avop"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase text-[var(--text-primary)] leading-none">Adaptive Video-Ordering Pipeline (AVOP)</h3>
                    <span className="text-[8px] font-black text-orange-400 uppercase tracking-widest">Patent Ref: RB-AVOP-2026</span>
                  </div>
                </div>

                <div className="p-5 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] text-xs text-[var(--text-secondary)] leading-relaxed space-y-4">
                  <p className="font-semibold text-[var(--text-primary)]">
                    AVOP solves network bandwidth spikes and prevents dropped transaction packets during video commerce sessions.
                  </p>
                  <p>
                    Rather than separating video streaming and ordering queues, AVOP tracks user transaction intent (cart modification, comment triggers, or overlay actions). In priority checkout state, the pipeline dynamically downscales video stream resolution (from 1080p to 360p) and halts buffer chunk pre-fetching, saving up to 97% client bandwidth to guarantee immediate order placement under slow networks.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[var(--bg-primary)] p-5 rounded-2xl border border-[var(--border-color)] space-y-2 text-center">
                    <span className="text-[8px] font-black text-orange-400 uppercase">📺 Standard Streaming</span>
                    <h4 className="text-lg font-black text-[var(--text-primary)] font-mono">4.5 Mbps</h4>
                    <p className="text-[10px] text-[var(--text-secondary)]">Video Pre-fetching full capacity</p>
                  </div>
                  <div className="bg-[var(--bg-primary)] p-5 rounded-2xl border border-emerald-500/20 space-y-2 text-center">
                    <span className="text-[8px] font-black text-emerald-400 uppercase">⚡ Transaction Priority</span>
                    <h4 className="text-lg font-black text-emerald-400 font-mono">120 Kbps</h4>
                    <p className="text-[10px] text-[var(--text-secondary)]">97% Bandwidth saved to secure order</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "cepe" && (
              <motion.div
                key="cepe"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-500">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase text-[var(--text-primary)] leading-none">Culinary-Engagement Prediction Engine (CEPE)</h3>
                    <span className="text-[8px] font-black text-purple-500 uppercase tracking-widest">Patent Ref: RB-CEPE-2026</span>
                  </div>
                </div>

                <div className="p-5 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] text-xs text-[var(--text-secondary)] leading-relaxed space-y-4">
                  <p className="font-semibold text-[var(--text-primary)]">
                    CEPE tracks player micro-behaviors instead of passive metrics to predict food category purchase conversion rates.
                  </p>
                  <p>
                    By logging loop counts, active dwell duration per reel sequence, audio status, and temporal suitability (lunch vs. dinner timings), the engine outputs a dynamic Purchase Probability Index (PPI).
                  </p>
                </div>

                {/* Algorithm formulation */}
                <div className="space-y-3">
                  <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider ml-1">Mathematical Formula & Coefficients</span>
                  <div className="bg-[var(--bg-primary)] p-5 rounded-2xl border border-[var(--border-color)] space-y-4">
                    <div className="text-center font-mono text-sm md:text-base text-[var(--text-primary)] py-2 border-b border-white/5">
                      PPI = <span className="text-purple-400">0.3</span> &middot; Affinity + <span className="text-purple-400">0.4</span> &middot; Dwell + <span className="text-purple-400">0.2</span> &middot; Loop + <span className="text-purple-400">0.1</span> &middot; Time
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold w-24 text-[var(--text-secondary)]">Dwell Weight (40%)</span>
                        <div className="flex-grow bg-white/5 h-2 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full w-[40%]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold w-24 text-[var(--text-secondary)]">Affinity Weight (30%)</span>
                        <div className="flex-grow bg-white/5 h-2 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full w-[30%]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold w-24 text-[var(--text-secondary)]">Loop Weight (20%)</span>
                        <div className="flex-grow bg-white/5 h-2 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full w-[20%]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold w-24 text-[var(--text-secondary)]">Temporal Weight (10%)</span>
                        <div className="flex-grow bg-white/5 h-2 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full w-[10%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "vfqai" && (
              <motion.div
                key="vfqai"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase text-[var(--text-primary)] leading-none">Visual Food Quality & Authenticity Index (VFQAI)</h3>
                    <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Patent Ref: RB-VFQAI-2026</span>
                  </div>
                </div>

                <div className="p-5 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] text-xs text-[var(--text-secondary)] leading-relaxed space-y-4">
                  <p className="font-semibold text-[var(--text-primary)]">
                    VFQAI ensures meal visual integrity by dynamically mapping restaurant reels against real user-uploaded review pictures.
                  </p>
                  <p>
                    By evaluating color histogram mismatch profiles, estimating portion size boundaries, and thermal pixel freshness markers (steam matching), the index provides a visual similarity percentage, securing transparency.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider ml-1">Visual Similarity Mapping Matrix</span>
                  <div className="bg-[var(--bg-primary)] p-5 rounded-2xl border border-[var(--border-color)] space-y-2 text-[10px]">
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span>Color Histogram Harmony (Sauces, glazes)</span>
                      <span className="text-blue-400 font-bold">0.3 Weight</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span>Portion Contour Mapping (Volume consistency)</span>
                      <span className="text-blue-400 font-bold">0.4 Weight</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rising Steam Pixel Verification (Freshness)</span>
                      <span className="text-blue-400 font-bold">0.3 Weight</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
