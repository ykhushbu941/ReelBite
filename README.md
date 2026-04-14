# 🎬 ReelBite (QuickBites)

**Discover your next favorite meal through the lens of short-form food reels.**

ReelBite is a high-performance, video-first food discovery and ordering platform. Built for the modern foodie, it combines the addictive nature of social media scrolling with direct-to-restaurant commerce, featuring a premium glassmorphism UI and a robust partner management system.

🚀 **[Live Demo](https://quick-bites-y9td-q0u4i9bds-ykhushbu941s-projects.vercel.app/)**

---

## ✨ Key Features

### 🍱 Video-First Discovery
- **Localized Food Reels**: Native MP4 playback for instant, buffer-free scrolling.
- **Immersive Catalog**: High-resolution photography for all cuisine categories and menu items.
- **Social Integration**: Interactive likes and comments for food discovery.

### 💎 Premium User Experience
- **Glassmorphism UI**: Stunning, translucent interface with modern typography and vibrant gradients.
- **Micro-Animations**: Fluid transitions powered by Framer Motion for a native app feel.
- **Responsive Design**: Fully optimized for mobile-first scrolling and desktop browsing.

### 🏪 Partner Ecosystem
- **Vendor Dashboard**: Real-time order tracking and status management (Pending → Preparing → Delivered).
- **Live Diagnostics**: Built-in health checks for database and environment stability.
- **Secure Auth**: JWT-based session management with role-based access control.

---

## 🛠️ Technology Stack

**Frontend:**
- **React 18** + **Vite** (Fast Refresh & Build)
- **Framer Motion** (Production-grade animations)
- **Lucide Icons** (Clean, consistent iconography)
- **Vanilla CSS** (Custom high-end design system)

**Backend:**
- **Node.js** + **Express**
- **LowDB** (JSON-based local persistence for speed & reliability)
- **Bcrypt.js** (Secure credential hashing)
- **JWT** (Stateless authentication)

**Deployment:**
- **Frontend**: Vercel
- **Backend**: Render

---

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/ykhushbu941/QuickBites.git
cd QuickBites
```

### 2. Install Dependencies
```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 3. Environment Setup
Create a `.env` file in the `server` directory:
```env
JWT_SECRET=your_secret_key_here
PORT=5000
```

### 4. Run Locally
```bash
# In /server
npm start

# In /client
npm run dev
```

---

## 🔑 Demo Credentials

**Partner/Restaurant Admin:**
- **Email**: `partner@reelbite.com`
- **Password**: `12345`

---

## 🛡️ Stability & Security
- **Production Hardened**: Integrated crash protection for uncaught exceptions.
- **Reliable Storage**: Optimized for Render's ephemeral filesystem using the `/tmp/` persistence pattern.
- **Database Sync**: Semi-automated seeding logic for consistent production data.

---

## 🛤️ Future Roadmap
- [ ] **AI Search**: Natural language "What should I eat today?" discovery.
- [ ] **Taste Profiling**: Machine learning-based meal recommendations.
- [ ] **Group Ordering**: Seamless bill-splitting and shared carts.

Developed with ❤️ by the ReelBite Team.
