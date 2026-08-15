const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const verifyToken = require("./middlewares/VerifyToken");
const commentRoutes = require("./routes/commentRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// Middleware
app.use(express.json());

// Auth Routes
app.use("/api/auth", authRoutes);

// API Routes
app.use("/api/books", verifyToken, bookRoutes);

// Comment Routes
app.use("/api/comments", verifyToken, commentRoutes);

// AI Routes
app.use("/api/ai", verifyToken, aiRoutes);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "BookShelf API is running",
  });
});

module.exports = app;
