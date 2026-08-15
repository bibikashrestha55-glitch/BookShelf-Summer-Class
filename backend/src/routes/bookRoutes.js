const express = require("express");

const validateBook = require("../middlewares/bookValidation");

const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  toggleFavorite,
  getFavoriteBooks,
  updateBookRating,
} = require("../controllers/bookController");

const router = express.Router();

router.get("/", getBooks);

router.patch("/:id/favorite", toggleFavorite);

router.patch("/:id/rating", updateBookRating);

router.get("/favorites/list", getFavoriteBooks);

router.get("/:id", getBookById);

router.post("/", validateBook, createBook);

router.put("/:id", validateBook, updateBook);

router.delete("/:id", deleteBook);

module.exports = router;
