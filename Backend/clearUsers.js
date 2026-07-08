require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  await User.deleteMany({});
  console.log("All users have been cleared from the database for a fresh start.");
  process.exit(0);
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
