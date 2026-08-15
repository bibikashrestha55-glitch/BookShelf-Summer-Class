export const GENRE_OPTIONS = [
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

export const normalizeGenres = (value) => {
  if (!Array.isArray(value)) return [];

  return value.filter((genre) => typeof genre === "string" && genre.trim());
};
