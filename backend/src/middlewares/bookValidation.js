const validateBook = (req, res, next) => {
  const { title, author, status } = req.body;

  const validStatuses = ["Want to Read", "Reading", "Finished"];

  if (!title || !title.trim()) {
    return res.status(400).json({
      message: "Book title is required",
    });
  }

  if (!author || !author.trim()) {
    return res.status(400).json({
      message: "Book author is required",
    });
  }

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      message: "Status must be Want to Read, Reading, or Finished",
    });
  }

  next();
};

module.exports = validateBook;
