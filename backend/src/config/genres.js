const SUPPORTED_GENRES = [
  "Fiction",
  "Classic",
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Thriller",
  "Horror",
  "Romance",
  "Historical Fiction",
  "Adventure",
  "Literary Fiction",
  "Young Adult",
  "Children's",
  "Poetry",
  "Biography",
  "Autobiography",
  "Memoir",
  "Self Help",
  "Psychology",
  "Philosophy",
  "Productivity",
  "Business",
  "Economics",
  "Technology",
  "Programming",
  "Education",
  "Health & Wellness",
  "Travel",
  "Religion & Spirituality",
  "Other",
];

const normalizeGenres = (input = []) => {
  if (!Array.isArray(input)) {
    return [];
  }

  const uniqueGenres = new Set();

  input.forEach((genre) => {
    if (typeof genre !== "string") {
      return;
    }

    const cleaned = genre.trim();

    if (!cleaned) {
      return;
    }

    if (SUPPORTED_GENRES.includes(cleaned)) {
      uniqueGenres.add(cleaned);
    }
  });

  return [...uniqueGenres];
};

const isValidGenreValue = (value) => {
  return typeof value === "string" && SUPPORTED_GENRES.includes(value.trim());
};

const isValidGenresArray = (genres = []) => {
  if (!Array.isArray(genres)) {
    return false;
  }

  return genres.every((genre) => isValidGenreValue(genre));
};

module.exports = {
  SUPPORTED_GENRES,
  normalizeGenres,
  isValidGenreValue,
  isValidGenresArray,
};
