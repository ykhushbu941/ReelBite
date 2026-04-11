require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/reelbite")
.then(async () => {
  console.log("Connected to MongoDB");
  const users = await User.find({});
  console.log("Users in DB:");
  users.forEach(u => console.log(u.email, u.password));
  process.exit(0);
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
