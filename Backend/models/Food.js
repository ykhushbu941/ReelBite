const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    videoUrl: {
      type: String,
      required: true
    },

    // 🖼️ thumbnail image for home grid
    imageUrl: {
      type: String,
      default: ""
    },

    price: {
      type: Number,
      required: true
    },

    restaurant: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: ""
    },

    category: {
      type: String,
      default: "Other"
    },

    // 🌿 Veg / Non-Veg
    isVeg: {
      type: Boolean,
      default: false
    },

    // 🌍 Cuisine type
    cuisine: {
      type: String,
      default: "Other",
      enum: ["Indian", "South Indian", "Chinese", "Italian", "Mexican", "American", "Japanese", "Healthy", "Mediterranean", "Other"]
    },

    // 👤 who added this (partner)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // ❤️ likes (unique users)
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    // 💬 comments
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],

    // 👁️ Views count
    views: {
      type: Number,
      default: 0
    },

    // 🤖 CARE: Culinary AI Reel Engine details
    isAiGenerated: {
      type: Boolean,
      default: false
    },
    aiStoryboard: [
      {
        sceneNumber: Number,
        visualPrompt: String,
        voiceoverText: String,
        audioDuration: Number
      }
    ],

    // 🛡️ POOVV: Proof-of-Origin Video Verification
    verificationMetadata: {
      isVerified: { type: Boolean, default: false },
      latitude: Number,
      longitude: Number,
      timestamp: { type: Date },
      signature: String,
      deviceId: String,
      networkBssid: String
    },

    // 📊 VFQAI: Visual Food Quality & Authenticity Index
    qualityScore: {
      score: { type: Number, default: 8.5 },
      visualSimilarity: { type: Number, default: 85 },
      portionMatch: { type: Number, default: 88 },
      steamMatch: { type: Number, default: 90 },
      countReviewed: { type: Number, default: 12 }
    },

    // 📈 CEPE: Engagement metrics per-food for prediction engine
    dwellMetrics: {
      totalDwellTime: { type: Number, default: 0 }, // in seconds
      loopCount: { type: Number, default: 0 },
      purchaseProbability: { type: Number, default: 50 } // PPI percentage
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Food", foodSchema);