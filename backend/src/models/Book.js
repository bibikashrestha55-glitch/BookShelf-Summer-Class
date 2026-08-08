const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      required: true,
      enum: ["Want to Read", "Reading", "Finished"],
      default: "Want to Read",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    // The user who owns this book
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Favorite status
    isFavorite: {
      type: Boolean,
      default: false,
    },

    // Rating - we'll use this later
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Book", bookSchema);
