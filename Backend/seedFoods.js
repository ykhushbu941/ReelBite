require("dotenv").config();
const mongoose = require("mongoose");
const Food = require("./models/Food");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/reelbite")
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
      comments: []
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
      comments: []
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
      comments: []
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
      comments: []
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
      comments: []
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
      comments: []
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
      comments: []
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
      comments: []
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
