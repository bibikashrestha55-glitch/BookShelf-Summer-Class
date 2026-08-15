const Book = require("../models/Book");
const Comment = require("../models/Comment");

const buildReadingProfile = async (userId) => {
  const books = await Book.find({ user: userId }).sort({ updatedAt: -1 });
  const comments = await Comment.find({ user: userId })
    .populate("book", "title author genres")
    .sort({ createdAt: -1 })
    .limit(10);

  const totalBooks = books.length;
  const finishedBooks = books.filter((book) => book.status === "Finished");
  const currentlyReading = books.filter((book) => book.status === "Reading");
  const wantToRead = books.filter((book) => book.status === "Want to Read");
  const favoriteBooks = books.filter((book) => book.isFavorite);
  const highlyRatedBooks = books
    .filter((book) => Number(book.rating) >= 4)
    .map((book) => ({
      title: book.title,
      author: book.author,
      rating: Number(book.rating) || 0,
      genres: Array.isArray(book.genres) ? book.genres : [],
      status: book.status,
    }));

  const allGenres = books.flatMap((book) =>
    Array.isArray(book.genres) ? book.genres : [],
  );
  const preferredGenres = [...new Set(allGenres)].filter(Boolean);

  const allAuthors = books.map((book) => book.author).filter(Boolean);
  const favoriteAuthors = [...new Set(allAuthors)];

  const recentFinishedBooks = finishedBooks.slice(0, 5).map((book) => ({
    title: book.title,
    author: book.author,
    genres: Array.isArray(book.genres) ? book.genres : [],
    rating: Number(book.rating) || 0,
  }));

  const commentText = comments
    .map((comment) => comment.text)
    .filter(Boolean)
    .slice(0, 10);

  return {
    totalBooks,
    finishedBooks: finishedBooks.length,
    currentlyReading: currentlyReading.length,
    wantToRead: wantToRead.length,
    favoriteBooks: favoriteBooks.map((book) => ({
      title: book.title,
      author: book.author,
      genres: Array.isArray(book.genres) ? book.genres : [],
      rating: Number(book.rating) || 0,
    })),
    highlyRatedBooks,
    preferredGenres,
    favoriteAuthors,
    recentFinishedBooks,
    ratings: books
      .filter((book) => Number(book.rating) > 0)
      .map((book) => ({
        title: book.title,
        author: book.author,
        rating: Number(book.rating),
        genres: Array.isArray(book.genres) ? book.genres : [],
      })),
    commentText,
    ownedBookTitles: books.map((book) => book.title),
  };
};

const buildRecommendationContext = async (userId) => {
  const profile = await buildReadingProfile(userId);

  return {
    preferredGenres: profile.preferredGenres.slice(0, 12),
    favoriteAuthors: profile.favoriteAuthors.slice(0, 10),
    highlyRatedBooks: profile.highlyRatedBooks.slice(0, 6),
    recentFinishedBooks: profile.recentFinishedBooks.slice(0, 5),
    favoriteBooks: profile.favoriteBooks.slice(0, 6),
    totalBooks: profile.totalBooks,
    finishedBooks: profile.finishedBooks,
    currentlyReading: profile.currentlyReading,
    wantToRead: profile.wantToRead,
    ratings: profile.ratings.slice(0, 12),
    commentText: profile.commentText.slice(0, 8),
    ownedBookTitles: profile.ownedBookTitles.slice(0, 50),
  };
};

module.exports = {
  buildReadingProfile,
  buildRecommendationContext,
};
