require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");
const iprRoutes = require("./routes/iprRoutes");
const path = require("path");

// Models
const Food = require("./models/Food");

// Middleware
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// 🔧 Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔍 Health Check Route (Production practice)
app.get("/", (req, res) => {
  res.send("🚀 QuickBites API Running...");
});

// 🔐 API Routes
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ipr", iprRoutes);


// ❌ Error Handling Middleware (must be last)
app.use(errorHandler);

// Serve frontend in production
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "deploy") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
  });
}

// 🌐 Database Connection
mongoose.connect(process.env.MONGO_URI)
.then((conn) => console.log(`✅ MongoDB Connected to ${conn.connection.host}`))
.catch((err) => console.error("❌ DB Connection Error:", err.message));

// Only run listen() if we are NOT on Vercel
if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "deploy") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Export for Vercel Serverless Function
module.exports = app;