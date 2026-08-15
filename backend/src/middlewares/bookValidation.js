const {
  isValidGenresArray,
  normalizeGenres,
  SUPPORTED_GENRES,
} = require("../config/genres");

const validateBook = (req, res, next) => {
  const body = req.body || {};
  const { title, author, status, genres } = body;
  const validStatuses = ["Want to Read", "Reading", "Finished"];
  const isUpdateRequest = req.method === "PUT" || req.method === "PATCH";

  if (!isUpdateRequest) {
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
  } else {
    if (title !== undefined && (!title || !title.trim())) {
      return res.status(400).json({
        message: "Book title is required",
      });
    }

    if (author !== undefined && (!author || !author.trim())) {
      return res.status(400).json({
        message: "Book author is required",
      });
    }

    if (status !== undefined && (!status || !validStatuses.includes(status))) {
      return res.status(400).json({
        message: "Status must be Want to Read, Reading, or Finished",
      });
    }
  }

  if (genres !== undefined && !isValidGenresArray(genres)) {
    return res.status(400).json({
      message: `Invalid genre supplied. Supported genres: ${SUPPORTED_GENRES.join(", ")}`,
    });
  }

  if (genres) {
    req.body.genres = normalizeGenres(genres);
  }

  next();
};

module.exports = validateBook;
