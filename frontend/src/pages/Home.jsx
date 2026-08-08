import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import { apiRequest } from "../services/api";

const filterOptions = ["All", "Want to Read", "Reading", "Finished"];

function Home() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // -----------------------------
  // Load books from backend
  // -----------------------------

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

  // -----------------------------
  // Search + Filter
  // -----------------------------

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || book.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // -----------------------------
  // Select Filter
  // -----------------------------

  const handleFilterSelect = (option) => {
    setStatusFilter(option);
    setIsFilterOpen(false);
  };

  // -----------------------------
  // Page
  // -----------------------------

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      {/* =========================
          Hero Section
      ========================== */}

      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-amber-800">
          Your Personal Reading Library
        </p>

        <h1 className="text-5xl font-bold leading-tight text-emerald-950 md:text-6xl">
          Every story deserves a place on your shelf.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-stone-600">
          Keep track of the books you want to read, the stories you're
          discovering, and the pages that stay with you.
        </p>
      </div>

      {/* =========================
          Featured Collection
      ========================== */}

      <div className="mt-16">
        {/* Section Heading */}

        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-800">
            Featured Collection
          </p>

          <h2 className="mt-2 text-3xl font-bold text-emerald-950">
            From your bookshelf
          </h2>
        </div>

        {/* =========================
            Search + Filter
        ========================== */}

        <div className="mb-10 flex flex-col gap-4 md:flex-row">
          {/* Search */}

          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by title or author..."
              className="w-full rounded-full border border-stone-300 bg-[#fffdf8] px-5 py-3 text-sm text-stone-800 shadow-sm outline-none transition duration-200 placeholder:text-stone-400 hover:border-stone-400 hover:shadow-md focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          {/* =========================
              Custom Status Dropdown
          ========================== */}

          <div className="relative w-full md:w-52">
            {/* Dropdown Button */}

            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex w-full items-center justify-between rounded-full border bg-[#fffdf8] px-5 py-3 text-sm font-medium text-emerald-950 shadow-sm outline-none transition-all duration-200 ${
                isFilterOpen
                  ? "border-amber-700 shadow-md ring-2 ring-amber-100"
                  : "border-stone-300 hover:border-amber-600 hover:shadow-md"
              }`}
            >
              <span>{statusFilter === "All" ? "All Books" : statusFilter}</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`h-4 w-4 text-amber-800 transition-transform duration-200 ${
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

            {/* Dropdown Menu */}

            {isFilterOpen && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-stone-200 bg-[#fffdf8] p-2 shadow-xl">
                {filterOptions.map((option) => {
                  const isSelected = statusFilter === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleFilterSelect(option)}
                      className={`w-full rounded-xl px-4 py-2.5 text-left text-sm transition-all duration-150 ${
                        isSelected
                          ? "bg-emerald-950 font-medium text-amber-100"
                          : "text-stone-700 hover:bg-amber-50 hover:text-emerald-950"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option === "All" ? "All Books" : option}</span>

                        {isSelected && (
                          <span className="text-amber-400">✓</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* =========================
            Loading / Books / Empty
        ========================== */}

        {isLoading ? (
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-lg font-medium text-emerald-950">
              Opening your bookshelf...
            </p>

            <p className="mt-2 text-sm text-stone-500">
              Gathering your collection.
            </p>
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <h3 className="text-xl font-semibold text-emerald-950">
              No books found
            </h3>

            <p className="mt-2 text-sm text-stone-500">
              Try a different search term or reading status.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Home;
