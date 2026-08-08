const Comment = require("../models/Comment");
const Book = require("../models/Book");

// GET comments for a book
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      book: req.params.bookId,
    })
      .populate("user", "first_name last_name")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Get comments error:", error);

    res.status(500).json({
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
};

// CREATE comment
const createComment = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty.",
      });
    }

    const book = await Book.findOne({
      _id: req.params.bookId,
      user: userId,
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found.",
      });
    }

    const comment = await Comment.create({
      text: text.trim(),
      book: book._id,
      user: userId,
    });

    const populatedComment = await comment.populate(
      "user",
      "first_name last_name",
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Create comment error:", error);

    res.status(500).json({
      message: "Failed to create comment",
      error: error.message,
    });
  }
};

// DELETE own comment
const deleteComment = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const comment = await Comment.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!comment) {
      return res.status(404).json({
        message:
          "Comment not found or you do not have permission to delete it.",
      });
    }

    res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete comment error:", error);

    res.status(500).json({
      message: "Failed to delete comment",
      error: error.message,
    });
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment,
};
