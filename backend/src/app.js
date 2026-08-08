const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const verifyToken = require("./middlewares/VerifyToken");
const commentRoutes = require("./routes/commentRoutes");

const app = express();

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// Middleware
app.use(express.json());

// Auth Routes
app.use("/api/auth", authRoutes);

// API Routes
app.use("/api/books", verifyToken, bookRoutes);

//Comment Routes
app.use("/api/comments", verifyToken, commentRoutes);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "BookShelf API is running",
  });
});

module.exports = app;
