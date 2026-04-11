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
      enum: ["Indian", "South Indian", "Chinese", "Italian", "Mexican", "American", "Japanese", "Other"]
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
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Food", foodSchema);