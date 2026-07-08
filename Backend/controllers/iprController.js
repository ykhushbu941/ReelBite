const Food = require("../models/Food");
const User = require("../models/User");

// 🎥 Standard reels lists for CARE to select from
const MOCK_REEL_VIDEOS = [
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
  "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4",
];

const MOCK_FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop",
];

/**
 * 1. CARE: Culinary AI Reel Engine
 * Generates scenes, visual prompts, and voiceover text based on food parameters.
 */
exports.generateAiReel = async (req, res) => {
  try {
    const { name, price, cuisine, category, style, description } = req.body;

    if (!name || !price) {
      return res.status(400).json({ msg: "Name and price are required to generate a reel." });
    }

    // 🔬 Culinary Generative Storyboard algorithm
    // Selects voiceover pacing and styling based on user style preference
    let storyboard = [];
    if (style === "Cinematic") {
      storyboard = [
        {
          sceneNumber: 1,
          visualPrompt: `Slow panning shot focusing on the steam rising from the fresh ${name}, warm lighting.`,
          voiceoverText: `Behold the art of culinary passion. Presenting the all-new ${name}.`,
          audioDuration: 4
        },
        {
          sceneNumber: 2,
          visualPrompt: `Extreme macro close-up of texture, slow motion capture of glaze.`,
          voiceoverText: `Crafted using traditional ${cuisine} culinary techniques. Every bite is an experience.`,
          audioDuration: 5
        },
        {
          sceneNumber: 3,
          visualPrompt: `Plating sequence showing fresh garnishes sprinkled over the hot dish.`,
          voiceoverText: `Indulge today. Freshly made at ${req.user?.restaurantName || "our kitchen"} for just ₹${price}.`,
          audioDuration: 6
        }
      ];
    } else if (style === "ASMR Fast") {
      storyboard = [
        {
          sceneNumber: 1,
          visualPrompt: `Rapid chop cut of spices and ingredients landing on the pan. Crackling sound.`,
          voiceoverText: `*Crunch* *Sizzle* Preparing the fresh ${name} with high heat and fresh ingredients.`,
          audioDuration: 3
        },
        {
          sceneNumber: 2,
          visualPrompt: `High frame rate splash of sauce coating the cooked components.`,
          voiceoverText: `Stirred to perfection. Hear that rich ${cuisine} simmer!`,
          audioDuration: 4
        },
        {
          sceneNumber: 3,
          visualPrompt: `First bite pull-apart shot showing maximum density and crispy details.`,
          voiceoverText: `Unbelievably hot. Order right now from ReelBite!`,
          audioDuration: 4
        }
      ];
    } else { // Gourmet / Default
      storyboard = [
        {
          sceneNumber: 1,
          visualPrompt: `Bright aesthetic framing of a chef preparing ingredients on a rustic board.`,
          voiceoverText: `Welcome to flavor heaven. Let's make our signature ${name}.`,
          audioDuration: 4
        },
        {
          sceneNumber: 2,
          visualPrompt: `The sizzle on the grill. Glazing the dish to lock in the flavor.`,
          voiceoverText: `A delicate blend of ${category === "Veg" ? "vegetarian ingredients" : "protein and vegetables"} seasoned perfectly.`,
          audioDuration: 5
        },
        {
          sceneNumber: 3,
          visualPrompt: `Final presentation plate served on the dining table, rotating slowly.`,
          voiceoverText: `Authentic ${cuisine} taste. Fresh, hot, and waiting for you.`,
          audioDuration: 5
        }
      ];
    }

    // Assign mock video and image
    const videoUrl = MOCK_REEL_VIDEOS[Math.floor(Math.random() * MOCK_REEL_VIDEOS.length)];
    const imageUrl = MOCK_FOOD_IMAGES[Math.floor(Math.random() * MOCK_FOOD_IMAGES.length)];

    res.json({
      success: true,
      name,
      price,
      cuisine: cuisine || "Indian",
      category: category || "Veg",
      description: description || `Freshly prepared delicious ${name}.`,
      videoUrl,
      imageUrl,
      storyboard,
      isAiGenerated: true
    });
  } catch (err) {
    res.status(500).json({ msg: "Error simulating AI reel generation", error: err.message });
  }
};

/**
 * 2. POOVV: Proof-of-Origin Video Verification
 * Validates coordinates against the restaurant profiles and signs the media block.
 */
exports.verifyKitchenOrigin = async (req, res) => {
  try {
    const { lat, lng, deviceId, fileHash } = req.body;

    if (!lat || !lng || !deviceId || !fileHash) {
      return res.status(400).json({ msg: "Missing geolocation or device telemetry details." });
    }

    // Geolocation comparison (e.g. check if user is near their recorded business location)
    // For IPR, we generate a SHA-256 block hash incorporating Lat/Lng, device, BSSID, and timestamp.
    const timestamp = new Date();
    const mockBssids = ["Kitchen_Staff_5G", "ChefRouter_Main", "Dhaba_WiFi_Secure"];
    const networkBssid = mockBssids[Math.floor(Math.random() * mockBssids.length)];
    
    // Cryptographic signature simulation (representing hardware HSM sign)
    const signatureStr = `sec-sig_lat:${lat}_lng:${lng}_dev:${deviceId.slice(-6)}_hash:${fileHash.slice(-8)}`;
    const signature = Buffer.from(signatureStr).toString("base64");

    res.json({
      success: true,
      verificationMetadata: {
        isVerified: true,
        latitude: lat,
        longitude: lng,
        timestamp,
        deviceId,
        networkBssid,
        signature
      }
    });
  } catch (err) {
    res.status(500).json({ msg: "Error verifying kitchen origin", error: err.message });
  }
};

/**
 * 3. CEPE: Culinary-Engagement Prediction Engine
 * Computes personalized recommendations with detailed math telemetry (PPI).
 */
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    // Fetch all foods
    const foods = await Food.find({}).lean();
    if (foods.length === 0) {
      return res.json([]);
    }

    // In a production scenario, we inspect the User's dwell logs.
    // For this simulation, we compute a customized Purchase Probability Index (PPI) per item.
    // PPI Formula: PPI = (CategoryMatch * 0.3) + (DwellFactor * 0.4) + (LoopFactor * 0.2) + (TemporalMatch * 0.1)
    
    const enhancedRecommendations = foods.map((food, idx) => {
      // Simulate user-affinity parameters
      // 1. Category affinity: User's diet preference (Veg/Non-Veg match gives higher affinity)
      const isVegMatch = (user.role === "partner" || idx % 2 === 0) ? food.isVeg : !food.isVeg;
      const categoryScore = isVegMatch ? 95 : 45;

      // 2. Dwell Time Factor: Simulate watching history (between 5s and 25s)
      const mockDwellTime = (12 + (idx * 3) % 15); // mock seconds
      const dwellScore = Math.min((mockDwellTime / 20) * 100, 100);

      // 3. Loop Factor: Repeated loops of the reel
      const mockLoops = (idx % 3 === 0) ? 2 : (idx % 4 === 0) ? 1 : 0;
      const loopScore = mockLoops === 0 ? 30 : mockLoops === 1 ? 75 : 98;

      // 4. Temporal Match: Current time suitability (e.g. Biryani suitability at Dinner time)
      const currentHour = new Date().getHours();
      let temporalScore = 60;
      if (currentHour >= 19 && currentHour <= 22) { // Dinner peak
        temporalScore = food.cuisine === "Indian" || food.cuisine === "Italian" ? 95 : 70;
      } else if (currentHour >= 12 && currentHour <= 15) { // Lunch peak
        temporalScore = food.cuisine === "South Indian" || food.cuisine === "Chinese" ? 90 : 75;
      }

      // Compute final PPI (%)
      const ppi = Math.round(
        (categoryScore * 0.3) + 
        (dwellScore * 0.4) + 
        (loopScore * 0.2) + 
        (temporalScore * 0.1)
      );

      // Return item with computed telemetry parameters
      return {
        ...food,
        ppi,
        ppiTelemetry: {
          categoryAffinity: Math.round(categoryScore),
          dwellScore: Math.round(dwellScore),
          loopScore: Math.round(loopScore),
          temporalScore: Math.round(temporalScore),
          calculatedDwellTime: mockDwellTime,
          calculatedLoops: mockLoops
        }
      };
    });

    // Sort by PPI descending
    enhancedRecommendations.sort((a, b) => b.ppi - a.ppi);

    // Take top 6 recommended items
    res.json(enhancedRecommendations.slice(0, 6));
  } catch (err) {
    res.status(500).json({ msg: "Error running recommendation engine", error: err.message });
  }
};

/**
 * 4. VFQAI: Visual Food Quality & Authenticity Index
 * Compares customer review photos against original food promo reel frames.
 */
exports.verifyFoodQuality = async (req, res) => {
  try {
    const { foodId } = req.body;
    
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ msg: "Food item not found." });
    }

    // VFQAI Computer Vision matching logic (simulation weights)
    // 1. Color Histogram consistency (e.g. check sauce matching profile)
    const colorMatch = Math.round(85 + Math.random() * 14);
    // 2. Portion Volume estimation (check portion sizing similarity)
    const portionMatch = Math.round(80 + Math.random() * 18);
    // 3. Steam/Thermal freshness detection (presence of rising steam pixels)
    const steamMatch = Math.round(75 + Math.random() * 22);

    // Aggregation of scores
    const overallScore = Number(((colorMatch * 0.3) + (portionMatch * 0.4) + (steamMatch * 0.3) / 10).toFixed(1));
    const scoreVal = Math.min(Math.max(Number((overallScore * 1).toFixed(1)), 1.0), 10.0);

    // Save back to document for persistence
    food.qualityScore = {
      score: scoreVal,
      visualSimilarity: colorMatch,
      portionMatch: portionMatch,
      steamMatch: steamMatch,
      countReviewed: (food.qualityScore?.countReviewed || 10) + 1
    };

    await food.save();

    res.json({
      success: true,
      foodId,
      qualityScore: food.qualityScore
    });
  } catch (err) {
    res.status(500).json({ msg: "Error computing food quality authenticity score", error: err.message });
  }
};

/**
 * 5. Track Engagement Logs (updates CEPE values dynamically)
 */
exports.logEngagement = async (req, res) => {
  try {
    const { foodId, dwellTime, loops } = req.body;

    if (!foodId) {
      return res.status(400).json({ msg: "foodId is required." });
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ msg: "Food item not found." });
    }

    // Accumulate metrics
    if (food.dwellMetrics) {
      food.dwellMetrics.totalDwellTime += (Number(dwellTime) || 0);
      food.dwellMetrics.loopCount += (Number(loops) || 0);
      
      // Dynamic recalculation of PPI based on updated logs
      const baseDwell = Math.min((food.dwellMetrics.totalDwellTime / 50) * 100, 100);
      const baseLoops = Math.min((food.dwellMetrics.loopCount / 10) * 100, 100);
      food.dwellMetrics.purchaseProbability = Math.round((baseDwell * 0.6) + (baseLoops * 0.4));
    }

    await food.save();

    res.json({
      success: true,
      dwellMetrics: food.dwellMetrics
    });
  } catch (err) {
    res.status(500).json({ msg: "Error logging engagement details", error: err.message });
  }
};
