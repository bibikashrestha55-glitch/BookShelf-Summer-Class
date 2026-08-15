require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");
const Book = require("./src/models/Book");

const MONGO_URI = process.env.MONGO_URI;
const TEST_EMAILS = ["alice@example.com", "bob@example.com"];

if (!MONGO_URI) {
  console.error(
    "MONGO_URI is missing. Add it to backend/.env before running seed.js",
  );
  process.exit(1);
}

if (process.env.NODE_ENV === "production") {
  console.error(
    "Seeding is disabled in production to avoid overwriting real data.",
  );
  process.exit(1);
}

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding");

    const existingUsers = await User.find({ email: { $in: TEST_EMAILS } });
    const existingUserIds = existingUsers.map((user) => user._id);

    if (existingUserIds.length) {
      await Book.deleteMany({ user: { $in: existingUserIds } });
      await User.deleteMany({ _id: { $in: existingUserIds } });
    }

    const users = await User.create([
      {
        first_name: "Alice",
        last_name: "Reader",
        email: "alice@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "user",
      },
      {
        first_name: "Bob",
        last_name: "Books",
        email: "bob@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "user",
      },
    ]);

    const userOne = users[0];
    const userTwo = users[1];

    await Book.create([
      {
        title: "Atomic Habits",
        author: "James Clear",
        status: "Finished",
        description:
          "A practical guide to building good habits and breaking bad ones.",
        coverImage: "",
        genres: ["Self Help", "Psychology", "Productivity"],
        user: userOne._id,
        isFavorite: true,
        rating: 5,
      },
      {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        status: "Reading",
        description: "A classic fantasy adventure with rich world-building.",
        coverImage: "",
        genres: ["Fantasy", "Adventure"],
        user: userOne._id,
        isFavorite: false,
        rating: 4,
      },
      {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        status: "Want to Read",
        description:
          "A witty and insightful story of romance and social class.",
        coverImage: "",
        genres: ["Classic", "Romance", "Historical Fiction"],
        user: userTwo._id,
        isFavorite: true,
        rating: 5,
      },
    ]);

    console.log("Seed data created successfully");
    console.log("Run with: node seed.js");
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

seedData();
