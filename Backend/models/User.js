const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" }, // user / partner
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  savedFoods: [{ type: mongoose.Schema.Types.ObjectId, ref: "Food" }],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);