const Food = require("../models/Food");

// ✅ GET FOODS (Pagination + Latest First + Filters)
exports.getFoods = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    // Add filtering
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { restaurant: { $regex: req.query.keyword, $options: "i" } }
          ]
        }
      : {};

    const category = req.query.category && req.query.category !== "All"
      ? { category: req.query.category }
      : {};

    const cuisine = req.query.cuisine && req.query.cuisine !== "All"
      ? { cuisine: req.query.cuisine }
      : {};

    const vegFilter = req.query.isVeg === "true"
      ? { isVeg: true }
      : req.query.isVeg === "false"
      ? { isVeg: false }
      : {};

    const foods = await Food.find({ ...keyword, ...category, ...cuisine, ...vegFilter })
      .populate("comments.user", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(foods);

  } catch (err) {
    res.status(500).json({ msg: "Error fetching foods" });
  }
};

// ✅ LIKE / UNLIKE (Toggle)
exports.likeFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ msg: "Food not found" });
    }

    const userId = req.user.id;

    // If already liked → remove (unlike)
    if (food.likes.includes(userId)) {
      food.likes = food.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // Else → add like
      food.likes.push(userId);
    }

    await food.save();
    res.json(food);

  } catch (err) {
    res.status(500).json({ msg: "Error liking food" });
  }
};

// ✅ ADD FOOD (Partner Only)
exports.addFood = async (req, res) => {
  try {
    console.log("Upload Body:", req.body);
    console.log("Upload Files:", req.files);
    const { name, price, restaurant, description, category, isVeg, cuisine, isAiGenerated, aiStoryboard, verificationMetadata } = req.body;

    // Get files from multer
    let videoUrl = req.body.videoUrl; // fallback to link if provided
    let imageUrl = req.body.imageUrl; // fallback to link if provided

    if (req.files) {
      if (req.files.video && req.files.video[0]) {
        videoUrl = `/uploads/${req.files.video[0].filename}`;
      }
      if (req.files.image && req.files.image[0]) {
        imageUrl = `/uploads/${req.files.image[0].filename}`;
      }
    }

    if (!name || !videoUrl || !price || !restaurant) {
      return res.status(400).json({ msg: "All required fields must be filled" });
    }

    // Parse JSON strings if passed via multipart form
    let parsedStoryboard = [];
    if (aiStoryboard) {
      try {
        parsedStoryboard = typeof aiStoryboard === "string" ? JSON.parse(aiStoryboard) : aiStoryboard;
      } catch (e) {
        console.error("Storyboard parse error:", e);
      }
    }

    let parsedVerification = undefined;
    if (verificationMetadata) {
      try {
        parsedVerification = typeof verificationMetadata === "string" ? JSON.parse(verificationMetadata) : verificationMetadata;
      } catch (e) {
        console.error("Verification parse error:", e);
      }
    }

    const food = new Food({
      name,
      videoUrl,
      imageUrl: imageUrl || "",
      price,
      restaurant,
      description,
      category: category || "Other",
      isVeg: isVeg === 'true' || isVeg === true,
      cuisine: cuisine || "Other",
      createdBy: req.user.id,
      isAiGenerated: isAiGenerated === 'true' || isAiGenerated === true,
      aiStoryboard: parsedStoryboard,
      verificationMetadata: parsedVerification
    });

    await food.save();

    res.status(201).json(food);

  } catch (err) {
    res.status(500).json({ msg: "Error adding food", error: err.message });
  }
};

// ✅ DELETE FOOD (Only Owner)
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ msg: "Food not found" });
    }

    // Only creator can delete
    if (food.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await food.deleteOne();

    res.json({ msg: "Food deleted successfully" });

  } catch (err) {
    res.status(500).json({ msg: "Error deleting food" });
  }
};

// ✅ ADD COMMENT TO FOOD
exports.addComment = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ msg: "Food not found" });
    }

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ msg: "Comment text is required" });
    }

    const comment = {
      user: req.user.id,
      text
    };

    food.comments.push(comment);
    await food.save();

    res.status(201).json(food.comments);
  } catch (err) {
    res.status(500).json({ msg: "Error adding comment", error: err.message });
  }
};

// ✅ INCREMENT VIEWS
exports.incrementViews = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ msg: "Food not found" });
    }
    
    food.views += 1;
    await food.save();
    
    res.json({ views: food.views });
  } catch (err) {
    res.status(500).json({ msg: "Error incrementing views" });
  }
};

// ✅ GET MY FOODS (Partner — fetch by createdBy)
exports.getMyFoods = async (req, res) => {
  try {
    const foods = await Food.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching your foods", error: err.message });
  }
};