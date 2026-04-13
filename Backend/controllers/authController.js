const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashed, role, phone, address });
    await user.save();

    res.json({ msg: "Registered" });
  } catch (err) {
    res.status(500).json({ msg: "Error registering", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // Handle dummy data that might not be hashed initially
    let isMatch = false;
    isMatch = await bcrypt.compare(req.body.password, user.password).catch(() => false);
    if (!isMatch && req.body.password === user.password) isMatch = true;

    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({ token, role: user.role, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: "Error logging in", error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate("savedFoods");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching user profile", error: err.message });
  }
};

exports.toggleSaveFood = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const foodId = req.params.id;

    if (!user) return res.status(404).json({ msg: "User not found" });

    const index = user.savedFoods.indexOf(foodId);
    if (index > -1) {
      user.savedFoods.splice(index, 1);
    } else {
      user.savedFoods.push(foodId);
    }

    await user.save();
    res.json({ savedFoods: user.savedFoods });
  } catch (err) {
    res.status(500).json({ msg: "Error toggling saved food", error: err.message });
  }
};