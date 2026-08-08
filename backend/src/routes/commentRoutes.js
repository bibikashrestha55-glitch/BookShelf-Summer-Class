const express = require("express");

const {
  getComments,
  createComment,
  deleteComment,
} = require("../controllers/commentController");

const router = express.Router();

// Get comments for a book
router.get("/book/:bookId", getComments);

// Add comment to a book
router.post("/book/:bookId", createComment);

// Delete own comment
router.delete("/:id", deleteComment);

module.exports = router;
