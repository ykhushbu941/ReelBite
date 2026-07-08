const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { register, login, getMe, toggleSaveFood, updateProfile, getPartners, deleteAccount } = require("../controllers/authController");

const router = express.Router();

router.post("/user/register", register);
router.post("/user/login", login);
router.get("/user/me", protect, getMe);
router.post("/user/save/:id", protect, toggleSaveFood);
router.put("/user/profile", protect, updateProfile);
router.delete("/user/me", protect, deleteAccount);
router.get("/partners", getPartners);

module.exports = router;