const Book = require("../models/Book");
const { normalizeGenres, SUPPORTED_GENRES } = require("../config/genres");

// ========================================
// GET ALL BOOKS FOR LOGGED-IN USER
// ========================================

const getBooks = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { genre } = req.query;

    if (genre && !SUPPORTED_GENRES.includes(genre)) {
      return res.status(400).json({
        message: "Invalid genre filter.",
      });
    }

    const filter = {
      user: userId,
    };

    if (genre) {
      filter.genres = { $in: [genre] };
    }

    const books = await Book.find(filter).sort({ createdAt: -1 });

    res.status(200).json(
      books.map((book) => ({
        ...book.toObject(),
        genres: book.genres || [],
      })),
    );
  } catch (error) {
    console.error("Get books error:", error);

    res.status(500).json({
      message: "Failed to fetch books",
    });
  }
};

// ========================================
// GET ONE BOOK
// ========================================

const getBookById = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const book = await Book.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const normalizedBook = book.toObject ? book.toObject() : book;
    normalizedBook.genres = normalizedBook.genres || [];

    res.status(200).json(normalizedBook);
  } catch (error) {
    console.error("Get book error:", error);

    res.status(500).json({
      message: "Failed to fetch book",
    });
  }
};

// ========================================
// CREATE BOOK
// ========================================

const createBook = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const body = req.body || {};
    const { title, author, status, description, genres } = body;

    const normalizedGenres = normalizeGenres(genres || []);

    const newBook = await Book.create({
      title,
      author,
      status,
      description,
      genres: normalizedGenres,
      user: userId,
    });

    res.status(201).json(newBook);
  } catch (error) {
    console.error("Create book error:", error);

    res.status(500).json({
      message: "Failed to create book",
    });
  }
};

// ========================================
// UPDATE BOOK
// ========================================

const updateBook = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const body = req.body || {};
    const { user, genres, ...updateData } = body;

    if (genres !== undefined) {
      if (!Array.isArray(genres)) {
        return res.status(400).json({
          message: "Genres must be an array of supported values.",
        });
      }

      updateData.genres = normalizeGenres(genres);
    }

    const book = await Book.findOneAndUpdate(
      {
        _id: req.params.id,
        user: userId,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Update book error:", error);

    res.status(500).json({
      message: "Failed to update book",
    });
  }
};

// ========================================
// DELETE BOOK
// ========================================

const deleteBook = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json({
      message: "Book deleted successfully",
      book,
    });
  } catch (error) {
    console.error("Delete book error:", error);

    res.status(500).json({
      message: "Failed to delete book",
    });
  }
};

// ========================================
// TOGGLE FAVORITE
// ========================================

const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const book = await Book.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    book.isFavorite = !book.isFavorite;

    await book.save();

    res.status(200).json({
      message: book.isFavorite
        ? "Book added to favorites"
        : "Book removed from favorites",

      book,
    });
  } catch (error) {
    console.error("Toggle favorite error:", error);

    res.status(500).json({
      message: "Failed to update favorite",
    });
  }
};

// ========================================
// GET FAVORITE BOOKS
// ========================================

const getFavoriteBooks = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const books = await Book.find({
      user: userId,
      isFavorite: true,
    }).sort({ updatedAt: -1 });

    res.status(200).json(books);
  } catch (error) {
    console.error("Get favorite books error:", error);

    res.status(500).json({
      message: "Failed to fetch favorite books",
    });
  }
};

// ========================================
// UPDATE BOOK RATING
// ========================================

const updateBookRating = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const { rating } = req.body;

    // Validate rating
    if (
      rating === undefined ||
      rating < 1 ||
      rating > 5 ||
      !Number.isInteger(Number(rating))
    ) {
      return res.status(400).json({
        message: "Rating must be a whole number between 1 and 5.",
      });
    }

    const book = await Book.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    book.rating = Number(rating);

    await book.save();

    res.status(200).json({
      message: "Rating updated successfully",
      book,
    });
  } catch (error) {
    console.error("Update rating error:", error);

    res.status(500).json({
      message: "Failed to update rating",
    });
  }
};

// ========================================
// EXPORT
// ========================================

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  toggleFavorite,
  getFavoriteBooks,
  updateBookRating,
};
