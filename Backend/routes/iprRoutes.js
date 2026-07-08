const router = require("express").Router();
const { protect, isPartner } = require("../middleware/authMiddleware");
const {
  generateAiReel,
  verifyKitchenOrigin,
  getRecommendations,
  verifyFoodQuality,
  logEngagement
} = require("../controllers/iprController");

// 🤖 CARE: Generate AI Reels
router.post("/generate-reel", protect, isPartner, generateAiReel);

// 🛡️ POOVV: Verify kitchen origin
router.post("/verify-kitchen", protect, isPartner, verifyKitchenOrigin);

// 📈 CEPE: Fetch purchase-intent recommendation engine reels
router.get("/recommendations", protect, getRecommendations);

// 📊 VFQAI: Recalculate and scan image quality scores
router.post("/vfqai-verify", protect, verifyFoodQuality);

// ⏱️ Track engagement dwell time & loops
router.post("/log-dwell", protect, logEngagement);

module.exports = router;
