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
    const { name, videoUrl, price, restaurant, description, category } = req.body;

    if (!name || !videoUrl || !price || !restaurant) {
      return res.status(400).json({ msg: "All required fields must be filled" });
    }

    const food = new Food({
      name,
      videoUrl,
      price,
      restaurant,
      description,
      category,
      createdBy: req.user.id
    });

    await food.save();

    res.status(201).json(food);

  } catch (err) {
    res.status(500).json({ msg: "Error adding food" });
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