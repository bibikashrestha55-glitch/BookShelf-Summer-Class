import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import { GENRE_OPTIONS, normalizeGenres } from "../constants/genres";
import { apiRequest } from "../services/api";

const filterOptions = ["All", "Want to Read", "Reading", "Finished"];

function Home() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [genreFilter, setGenreFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isGenreFilterOpen, setIsGenreFilterOpen] = useState(false);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await apiRequest("/books");

        setBooks(data);
      } catch (error) {
        console.error("Failed to load books:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const bookGenres = normalizeGenres(book?.genres);
    const query = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !query ||
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" || book.status === statusFilter;

    const matchesGenre =
      genreFilter === "All" ||
      (bookGenres.length > 0 && bookGenres.includes(genreFilter));

    return matchesSearch && matchesStatus && matchesGenre;
  });

  const handleFilterSelect = (option) => {
    setStatusFilter(option);
    setIsFilterOpen(false);
  };

  const handleGenreSelect = (option) => {
    setGenreFilter(option);
    setIsGenreFilterOpen(false);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(184,134,45,0.18),_transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-[#8c6a26]">
              Your Personal Library
            </p>

            <h1 className="display-serif text-5xl leading-[0.96] text-[#062f2a] sm:text-6xl lg:text-7xl">
              Every story deserves a place on your shelf.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#5a5047]">
              Keep track of the books you want to read, the stories you are
              discovering, and the pages that stay with you long after the final
              chapter.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#featured-collection"
                className="rounded-md bg-[#062f2a] px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#f7f0e5] transition hover:bg-[#0b4a3e]"
              >
                Explore My Books
              </a>

              <a
                href="/books/add"
                className="rounded-md border border-[#b8862d] bg-[#fffdf8]/80 px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#062f2a] transition hover:border-[#d6b15a] hover:bg-[#f4e8c9]"
              >
                Add a Book
              </a>
            </div>
          </div>

          <div className="relative flex min-h-[430px] items-center justify-center">
            <div className="absolute inset-x-12 bottom-6 h-16 rounded-full bg-[#062f2a]/15 blur-2xl" />
            <div className="absolute left-8 top-8 h-32 w-32 rounded-full border border-[#d6b15a]/40" />
            <div className="absolute right-12 top-12 h-24 w-24 rounded-full border border-[#b8862d]/30" />

            <div className="relative h-[360px] w-[340px]">
              <div className="absolute bottom-0 left-10 h-[290px] w-[180px] -rotate-[13deg] rounded-[6px] border border-[#d6b15a]/60 bg-[#0b4a3e] p-3 shadow-[0_25px_40px_rgba(6,47,42,0.28)]">
                <div className="book-fallback">
                  <p className="text-[0.52rem] font-semibold uppercase tracking-[0.26em] text-[#d6b15a]">
                    BookShelf
                  </p>
                  <h2 className="display-serif mt-4 px-4 text-3xl leading-[0.9] text-[#fffdf8]">
                    Persuasion
                  </h2>
                  <div className="mt-4 text-sm text-[#d6b15a]">✦</div>
                  <p className="mt-2 px-4 text-[0.7rem] tracking-[0.08em] text-[#e7dcc3]">
                    Jane Austen
                  </p>
                </div>
              </div>

              <div className="absolute bottom-6 right-1 h-[300px] w-[190px] rotate-[8deg] rounded-[6px] border border-[#d6b15a]/60 bg-[#062f2a] p-3 shadow-[0_30px_48px_rgba(9,38,34,0.28)]">
                <div className="book-fallback">
                  <p className="text-[0.52rem] font-semibold uppercase tracking-[0.26em] text-[#d6b15a]">
                    BookShelf
                  </p>
                  <h2 className="display-serif mt-4 px-4 text-3xl leading-[0.9] text-[#fffdf8]">
                    Wuthering Heights
                  </h2>
                  <div className="mt-4 text-sm text-[#d6b15a]">✦</div>
                  <p className="mt-2 px-4 text-[0.7rem] tracking-[0.08em] text-[#e7dcc3]">
                    Emily Brontë
                  </p>
                </div>
              </div>

              <div className="absolute bottom-14 left-24 z-20 h-[320px] w-[200px] rotate-[2deg] rounded-[7px] border border-[#d6b15a]/80 bg-[#073b32] p-3 shadow-[0_30px_50px_rgba(6,47,42,0.35)]">
                <div className="book-fallback">
                  <p className="text-[0.56rem] font-semibold uppercase tracking-[0.3em] text-[#d6b15a]">
                    BookShelf
                  </p>
                  <h2 className="display-serif mt-5 px-4 text-[2.2rem] leading-[0.9] text-[#fffdf8]">
                    Pride & Prejudice
                  </h2>
                  <div className="mt-5 text-sm text-[#d6b15a]">✦</div>
                  <p className="mt-2 px-4 text-[0.72rem] tracking-[0.08em] text-[#e7dcc3]">
                    Jane Austen
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-18 pt-10">
          <div className="mb-6 rounded-[1.5rem] border border-[#d5cab8] bg-[#fffdf8]/80 p-5 shadow-[0_15px_30px_rgba(94,80,62,0.04)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8c6a26]">
                  ✨ BookShelf AI
                </p>
                <p className="mt-2 text-base text-[#5a5047]">
                  Not sure what to read next?
                </p>
              </div>

              <a
                href="/ai"
                className="inline-flex items-center justify-center rounded-md bg-[#062f2a] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#f7f0e5] transition hover:bg-[#0b4a3e]"
              >
                Ask BookShelf AI
              </a>
            </div>
          </div>
        </div>

        <div id="featured-collection" className="pt-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8c6a26]">
                Featured Collection
              </p>
              <h2 className="display-serif mt-2 text-4xl text-[#062f2a] sm:text-5xl">
                From your bookshelf
              </h2>
            </div>
          </div>

          <div className="mb-10 flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by title or author..."
                className="w-full rounded-full border border-[#d4c9b9] bg-[#fffdf8]/90 px-5 py-3.5 text-sm text-[#2c241d] shadow-[0_12px_20px_rgba(98,83,62,0.05)] outline-none transition duration-200 placeholder:text-[#8f8277] hover:border-[#b8862d] focus:border-[#b8862d] focus:ring-4 focus:ring-[#d6b15a]/20"
              />
            </div>

            <div className="relative w-full md:w-60">
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex w-full items-center justify-between rounded-full border bg-[#fffdf8]/90 px-5 py-3.5 text-sm font-medium text-[#062f2a] shadow-[0_12px_20px_rgba(98,83,62,0.05)] outline-none transition-all duration-200 ${
                  isFilterOpen
                    ? "border-[#b8862d] ring-4 ring-[#d6b15a]/20"
                    : "border-[#d4c9b9] hover:border-[#b8862d]"
                }`}
              >
                <span>
                  {statusFilter === "All" ? "All Books" : statusFilter}
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`h-4 w-4 text-[#8c6a26] transition-transform duration-200 ${
                    isFilterOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01.02 1.06l-4.25-4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isFilterOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-[#d4c9b9] bg-[#fffdf8] p-2 shadow-[0_24px_60px_rgba(13,20,18,0.12)]">
                  {filterOptions.map((option) => {
                    const isSelected = statusFilter === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleFilterSelect(option)}
                        className={`w-full rounded-xl px-4 py-2.5 text-left text-sm transition-all duration-150 ${
                          isSelected
                            ? "bg-[#062f2a] font-medium text-[#f5e8c8]"
                            : "text-[#3d352e] hover:bg-[#f7f0e5] hover:text-[#062f2a]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option === "All" ? "All Books" : option}</span>
                          {isSelected && (
                            <span className="text-[#d6b15a]">✓</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="relative w-full md:w-60">
              <button
                type="button"
                onClick={() => setIsGenreFilterOpen(!isGenreFilterOpen)}
                className={`flex w-full items-center justify-between rounded-full border bg-[#fffdf8]/90 px-5 py-3.5 text-sm font-medium text-[#062f2a] shadow-[0_12px_20px_rgba(98,83,62,0.05)] outline-none transition-all duration-200 ${
                  isGenreFilterOpen
                    ? "border-[#b8862d] ring-4 ring-[#d6b15a]/20"
                    : "border-[#d4c9b9] hover:border-[#b8862d]"
                }`}
              >
                <span>
                  {genreFilter === "All" ? "All Genres" : genreFilter}
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`h-4 w-4 text-[#8c6a26] transition-transform duration-200 ${
                    isGenreFilterOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01.02 1.06l-4.25-4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isGenreFilterOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-[#d4c9b9] bg-[#fffdf8] p-2 shadow-[0_24px_60px_rgba(13,20,18,0.12)]">
                  {["All", ...GENRE_OPTIONS].map((option) => {
                    const isSelected = genreFilter === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleGenreSelect(option)}
                        className={`w-full rounded-xl px-4 py-2.5 text-left text-sm transition-all duration-150 ${
                          isSelected
                            ? "bg-[#062f2a] font-medium text-[#f5e8c8]"
                            : "text-[#3d352e] hover:bg-[#f7f0e5] hover:text-[#062f2a]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>
                            {option === "All" ? "All Genres" : option}
                          </span>
                          {isSelected && (
                            <span className="text-[#d6b15a]">✓</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-[1.5rem] border border-[#d4c9b9] bg-[#fffdf8]/80 px-6 py-16 text-center shadow-[0_15px_30px_rgba(94,80,62,0.04)]">
              <p className="text-lg font-medium text-[#062f2a]">
                Opening your bookshelf...
              </p>
              <p className="mt-2 text-sm text-[#756f67]">
                Gathering your collection.
              </p>
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-[#b8ac98] bg-[#fffdf8]/80 px-6 py-16 text-center">
              <h3 className="display-serif text-3xl text-[#062f2a]">
                No books found
              </h3>
              <p className="mt-2 text-sm text-[#756f67]">
                Try a different search term or reading status.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Home;
