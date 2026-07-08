const router = require("express").Router();
const { protect, isPartner } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

const {
  getFoods,
  likeFood,
  addFood,
  deleteFood,
  addComment,
  incrementViews,
  getMyFoods
} = require("../controllers/foodController");

router.get("/", getFoods);
router.get("/my", protect, isPartner, getMyFoods);
router.post("/like/:id", protect, likeFood);
router.post("/comment/:id", protect, addComment);
router.put("/view/:id", incrementViews);

// Accept two files: video and image
router.post("/", protect, isPartner, upload.fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 1 }]), addFood);

router.delete("/:id", protect, isPartner, deleteFood);

module.exports = router;