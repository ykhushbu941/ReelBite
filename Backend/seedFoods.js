require("dotenv").config();
const mongoose = require("mongoose");
const Food = require("./models/Food");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log("Connected to MongoDB for Seeding...");
  
  // 1. Create a dummy partner user to own the foods
  // Always hash and update so login works correctly
  const partnerEmail = "partner@reelbite.com";
  const partnerPass = "12345";
  const hashed = await bcrypt.hash(partnerPass, 10);

  let partner = await User.findOne({ email: partnerEmail });
  if (!partner) {
    partner = await User.create({
      name: "ReelBite Official Partner",
      email: partnerEmail,
      password: hashed,
      role: "partner",
      phone: "1234567890",
      address: "ReelBite HQ"
    });
  } else {
    // Force update password to ensure bcrypt works on login
    partner.password = hashed;
    await partner.save();
  }

  // Clear existing foods to start fresh with vertical reels
  await Food.deleteMany({});

  // 🎥 Real public domain / CDN food vertical reels (9:16 aspect ratio tested)
  // Many web MP4 sources are horizontal, these represent proper reels
  const VIDEOS = [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", // Mock as burger ad
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", // Mock
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", // Mock
    // Falling back to standard videos but configured to display vertically in app via CSS object-cover
    "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
    "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4",
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://media.w3.org/2010/05/sintel/trailer.mp4",
  ];

  /* 
   Notes on Videos:
   For production ReelBite, these would be user-uploaded vertical MP4s.
   We use `object-cover` in ReelsPage to force these horizontals to fill a 9:16 vertical phone screen.
  */

  const sampleFoods = [
    {
      name: "Tandoori Butter Chicken",
      videoUrl: VIDEOS[0],
      imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop",
      price: 280,
      restaurant: "Punjabi Dhaba",
      category: "Other",
      cuisine: "Indian",
      isVeg: false,
      description: "Creamy, rich tomato-based curry with tender smoky chicken pieces. Served best with Garlic Naan.",
      createdBy: partner._id,
      likes: [],
      comments: [],
      isAiGenerated: false,
      verificationMetadata: {
        isVerified: true,
        latitude: 12.9716,
        longitude: 77.5946,
        timestamp: new Date(),
        signature: "c2VjLXNpZ19sYXQ6MTIuOTcxNl9sbmc6NzcuNTk0Nl9kZXY6QTM4Rl9oYXNoOmFkOGY5YTIx",
        deviceId: "DEV-MAC-B5F2A8D9",
        networkBssid: "Kitchen_Staff_5G"
      },
      qualityScore: {
        score: 9.4,
        visualSimilarity: 95,
        portionMatch: 92,
        steamMatch: 96,
        countReviewed: 18
      },
      dwellMetrics: {
        totalDwellTime: 240,
        loopCount: 15,
        purchaseProbability: 88
      }
    },
    {
      name: "Crispy Masala Dosa",
      videoUrl: VIDEOS[1],
      imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop",
      price: 120,
      restaurant: "A2B Sweets & Snacks",
      category: "Other",
      cuisine: "South Indian",
      isVeg: true,
      description: "Paper-thin crispy golden dosa stuffed with spiced potato filling. Served with 3 varieties of chutney.",
      createdBy: partner._id,
      likes: [],
      comments: [],
      isAiGenerated: true,
      aiStoryboard: [
        { sceneNumber: 1, visualPrompt: "Zoom in on thin crispy golden dosa on griddle", voiceoverText: "Experience South India's finest crispy crepe", audioDuration: 4 },
        { sceneNumber: 2, visualPrompt: "Spoonful potato masala stuffed into the folded dosa", voiceoverText: "Seasoned potato stuffing inside", audioDuration: 3 },
        { sceneNumber: 3, visualPrompt: "Dosa split showing hot steam and sambar bowl", voiceoverText: "Serve it hot with chutney and sambar", audioDuration: 5 }
      ],
      verificationMetadata: {
        isVerified: true,
        latitude: 12.9629,
        longitude: 77.5975,
        timestamp: new Date(),
        signature: "c2VjLXNpZ19sYXQ6MTIuOTYyOV9sbmc6NzcuNTk3NV9kZXY6RTMwSF9oYXNoOjEyYTg5MWZk",
        deviceId: "DEV-MAC-A103F5E7",
        networkBssid: "A2B_Billing_5G"
      },
      qualityScore: {
        score: 8.9,
        visualSimilarity: 87,
        portionMatch: 90,
        steamMatch: 89,
        countReviewed: 22
      },
      dwellMetrics: {
        totalDwellTime: 410,
        loopCount: 28,
        purchaseProbability: 92
      }
    },
    {
      name: "Farmhouse Pizza",
      videoUrl: VIDEOS[2],
      imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop",
      price: 350,
      restaurant: "Domino's Pizza",
      category: "Pizza",
      cuisine: "Italian",
      isVeg: true,
      description: "Loaded with fresh tomatoes, crisp capsicum, onions, and mushrooms. A vegetarian delight.",
      createdBy: partner._id,
      likes: [],
      comments: [],
      isAiGenerated: true,
      aiStoryboard: [
        { sceneNumber: 1, visualPrompt: "Fresh cheese pulling from baked crust", voiceoverText: "Indulge in authentic Italian farmhouse cheese pulls", audioDuration: 4 },
        { sceneNumber: 2, visualPrompt: "Chipping fresh peppers and tomatoes over flour dough", voiceoverText: "Garnished with crisp peppers and ripe tomatoes", audioDuration: 4 }
      ],
      verificationMetadata: {
        isVerified: true,
        latitude: 12.9801,
        longitude: 77.5852,
        timestamp: new Date(),
        signature: "c2VjLXNpZ19sYXQ6MTIuOTgwMV9sbmc6NzcuNTg1Ml9kZXY6RjgxS19oYXNoOmRhOTM4ZWIx",
        deviceId: "DEV-MAC-C381F4B9",
        networkBssid: "Dominos_Kitchen_2G"
      },
      qualityScore: {
        score: 9.2,
        visualSimilarity: 93,
        portionMatch: 88,
        steamMatch: 95,
        countReviewed: 34
      },
      dwellMetrics: {
        totalDwellTime: 650,
        loopCount: 42,
        purchaseProbability: 95
      }
    },
    {
      name: "Spicy Schezwan Noodles",
      videoUrl: VIDEOS[3],
      imageUrl: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop",
      price: 260,
      restaurant: "Mainland China",
      category: "Other",
      cuisine: "Chinese",
      isVeg: true,
      description: "Wok-tossed noodles in fiery fiery red schezwan sauce with crunch vegetables.",
      createdBy: partner._id,
      likes: [],
      comments: [],
      isAiGenerated: false,
      verificationMetadata: {
        isVerified: true,
        latitude: 12.9785,
        longitude: 77.6011,
        timestamp: new Date(),
        signature: "c2VjLXNpZ19sYXQ6MTIuOTc4NV9sbmc6NzcuNjAxMV9kZXY6SzIySl9oYXNoOjM4MThmZWMy",
        deviceId: "DEV-MAC-E938D82A",
        networkBssid: "MainlandChina_Wok"
      },
      qualityScore: {
        score: 8.7,
        visualSimilarity: 85,
        portionMatch: 92,
        steamMatch: 83,
        countReviewed: 14
      },
      dwellMetrics: {
        totalDwellTime: 180,
        loopCount: 6,
        purchaseProbability: 72
      }
    },
    {
      name: "Whopper Burger",
      videoUrl: VIDEOS[4],
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop",
      price: 220,
      restaurant: "Burger King",
      category: "Burger",
      cuisine: "American",
      isVeg: false,
      description: "The classic Whopper. 100% flame-grilled beef topped with tomatoes, lettuce, mayo, ketchup and pickles.",
      createdBy: partner._id,
      likes: [],
      comments: [],
      isAiGenerated: false,
      verificationMetadata: {
        isVerified: true,
        latitude: 12.9742,
        longitude: 77.6105,
        timestamp: new Date(),
        signature: "c2VjLXNpZ19sYXQ6MTIuOTc0Ml9sbmc6NzcuNjEwNV9kZXY6Tzg5S19oYXNoOjU2YThkOWZh",
        deviceId: "DEV-MAC-D481C29E",
        networkBssid: "BK_Counter_5G"
      },
      qualityScore: {
        score: 9.0,
        visualSimilarity: 92,
        portionMatch: 91,
        steamMatch: 88,
        countReviewed: 29
      },
      dwellMetrics: {
        totalDwellTime: 390,
        loopCount: 22,
        purchaseProbability: 86
      }
    },
    {
      name: "Mexican Chicken Tacos",
      videoUrl: VIDEOS[5],
      imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop",
      price: 180,
      restaurant: "Taco Bell",
      category: "Other",
      cuisine: "Mexican",
      isVeg: false,
      description: "Crunchy corn taco shells stuffed with seasoned grilled chicken, fresh lettuce, and tangy cheese sauce.",
      createdBy: partner._id,
      likes: [],
      comments: [],
      isAiGenerated: false,
      verificationMetadata: {
        isVerified: true,
        latitude: 12.9812,
        longitude: 77.6045,
        timestamp: new Date(),
        signature: "c2VjLXNpZ19sYXQ6MTIuOTgxMl9sbmc6NzcuNjA0NV9kZXY6VzY2S19oYXNoOjdhOGY5MjE1",
        deviceId: "DEV-MAC-G589B31F",
        networkBssid: "TacoBell_Lobby"
      },
      qualityScore: {
        score: 8.5,
        visualSimilarity: 84,
        portionMatch: 86,
        steamMatch: 85,
        countReviewed: 19
      },
      dwellMetrics: {
        totalDwellTime: 270,
        loopCount: 11,
        purchaseProbability: 79
      }
    },
    {
      name: "Sushi Platter Special",
      videoUrl: VIDEOS[6],
      imageUrl: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&auto=format&fit=crop",
      price: 520,
      restaurant: "Oishii Sushi",
      category: "Other",
      cuisine: "Japanese",
      isVeg: false,
      description: "Assorted fresh sushi rolls, salmon nigiri, and tuna sashimi served with pickled ginger and wasabi.",
      createdBy: partner._id,
      likes: [],
      comments: [],
      isAiGenerated: false,
      verificationMetadata: {
        isVerified: true,
        latitude: 12.9912,
        longitude: 77.5872,
        timestamp: new Date(),
        signature: "c2VjLXNpZ19sYXQ6MTIuOTkxMl9sbmc6NzcuNTg3Ml9kZXY6Wjg5Sl9oYXNoOjQ4YWU5ZmNk",
        deviceId: "DEV-MAC-H891C12D",
        networkBssid: "Oishii_Kitchen"
      },
      qualityScore: {
        score: 9.5,
        visualSimilarity: 97,
        portionMatch: 95,
        steamMatch: 92,
        countReviewed: 27
      },
      dwellMetrics: {
        totalDwellTime: 790,
        loopCount: 49,
        purchaseProbability: 97
      }
    },
    {
      name: "Hot Chocolate Fudge",
      videoUrl: VIDEOS[7],
      imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop",
      price: 150,
      restaurant: "Corner House",
      category: "Dessert",
      cuisine: "American",
      isVeg: true,
      description: "Vanilla ice cream smothered in thick gooey hot chocolate fudge and roasted cashew nuts.",
      createdBy: partner._id,
      likes: [],
      comments: [],
      isAiGenerated: false,
      verificationMetadata: {
        isVerified: true,
        latitude: 12.9678,
        longitude: 77.6089,
        timestamp: new Date(),
        signature: "c2VjLXNpZ19sYXQ6MTIuOTY3OF9sbmc6NzcuNjA4OV9kZXY6Tzg5SF9oYXNoOmViYzg5MTBh",
        deviceId: "DEV-MAC-K102F4B3",
        networkBssid: "CornerHouse_Guests"
      },
      qualityScore: {
        score: 9.3,
        visualSimilarity: 94,
        portionMatch: 92,
        steamMatch: 93,
        countReviewed: 41
      },
      dwellMetrics: {
        totalDwellTime: 910,
        loopCount: 56,
        purchaseProbability: 96
      }
    }
  ];

  await Food.insertMany(sampleFoods);
  console.log(`Successfully seeded ${sampleFoods.length} beautiful food entries into DB!`);
  console.log(`Test Partner login: partner@reelbite.com / 12345`);
  process.exit(0);
})
.catch(err => {
  console.error("DB Seed Error:", err);
  process.exit(1);
});
