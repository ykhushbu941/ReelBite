const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema({
  restaurantName: String,
  email: String,
  password: String,
});

module.exports = mongoose.model("Partner", partnerSchema);