import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await apiRequest("/books");
        setBooks(data);
      } catch (error) {
        console.error("Failed to load dashboard books:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, []);

  const totalBooks = books.length;
  const wantToRead = books.filter(
    (book) => book.status === "Want to Read",
  ).length;
  const currentlyReading = books.filter(
    (book) => book.status === "Reading",
  ).length;
  const finished = books.filter((book) => book.status === "Finished").length;
  const favorites = books.filter((book) => book.isFavorite).length;
  const recentBooks = [...books].slice(-3).reverse();

  const favoriteGenres = Array.isArray(books)
    ? books
        .filter((book) => book.isFavorite)
        .flatMap((book) => (Array.isArray(book.genres) ? book.genres : []))
        .reduce((counts, genre) => {
          counts[genre] = (counts[genre] || 0) + 1;
          return counts;
        }, {})
    : {};

  const topGenres = Object.entries(favoriteGenres)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([genre]) => genre);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#8c6a26]">
          Your Reading Space
        </p>

        <h1 className="display-serif mt-3 text-5xl text-[#062f2a] md:text-6xl">
          Welcome back, {user?.first_name || "Reader"}.
        </h1>

        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#5a5047]">
          Keep track of your books, discover new stories, and continue your
          reading journey with intention.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <div className="luxury-panel rounded-[1.25rem] p-6">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8c6a26]">
            Total Books
          </p>
          <h2 className="display-serif mt-4 text-5xl text-[#062f2a]">
            {isLoading ? "—" : totalBooks}
          </h2>
          <p className="mt-2 text-sm text-[#756f67]">Books in your library</p>
        </div>
        <div className="luxury-panel rounded-[1.25rem] p-6">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8c6a26]">
            Want to Read
          </p>
          <h2 className="display-serif mt-4 text-5xl text-[#062f2a]">
            {isLoading ? "—" : wantToRead}
          </h2>
          <p className="mt-2 text-sm text-[#756f67]">On your next shelf</p>
        </div>
        <div className="luxury-panel rounded-[1.25rem] p-6">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8c6a26]">
            Reading
          </p>
          <h2 className="display-serif mt-4 text-5xl text-[#062f2a]">
            {isLoading ? "—" : currentlyReading}
          </h2>
          <p className="mt-2 text-sm text-[#756f67]">Currently in progress</p>
        </div>
        <div className="luxury-panel rounded-[1.25rem] p-6">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8c6a26]">
            Finished
          </p>
          <h2 className="display-serif mt-4 text-5xl text-[#062f2a]">
            {isLoading ? "—" : finished}
          </h2>
          <p className="mt-2 text-sm text-[#756f67]">Completed works</p>
        </div>
        <div className="luxury-panel rounded-[1.25rem] p-6">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8c6a26]">
            Favorites
          </p>
          <h2 className="display-serif mt-4 text-5xl text-[#062f2a]">
            {isLoading ? "—" : favorites}
          </h2>
          <p className="mt-2 text-sm text-[#756f67]">Beloved stories</p>
        </div>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="luxury-panel rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8c6a26]">
                Recently Added
              </p>
              <h2 className="display-serif mt-2 text-4xl text-[#062f2a]">
                New to the shelf
              </h2>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {recentBooks.length > 0 ? (
              recentBooks.map((book) => (
                <a
                  key={book._id}
                  href={`/books/${book._id}`}
                  className="flex items-center gap-4 rounded-[1.2rem] border border-[#e7dcc9] bg-[#fffdf8]/80 p-3 transition hover:border-[#d6b15a] hover:shadow-[0_15px_30px_rgba(94,80,62,0.06)]"
                >
                  <div className="h-20 w-14 overflow-hidden rounded-[0.4rem] border border-[#d6b15a]/60 bg-[#073b32] shadow-md">
                    <div className="book-fallback h-full w-full">
                      <p className="text-[0.35rem] font-semibold uppercase tracking-[0.2em] text-[#d6b15a]">
                        BookShelf
                      </p>
                      <h3 className="display-serif mt-2 px-2 text-lg leading-[0.9] text-[#fffdf8]">
                        {book.title.slice(0, 14)}
                      </h3>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="display-serif text-3xl leading-tight text-[#062f2a]">
                      {book.title}
                    </p>
                    <p className="mt-1 text-sm text-[#756f67]">{book.author}</p>
                  </div>

                  <span className="rounded-full bg-[#f4e7c8] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-widest text-[#72511c]">
                    {book.status}
                  </span>
                </a>
              ))
            ) : (
              <p className="text-sm text-[#756f67]">
                Your shelves are waiting for their first story.
              </p>
            )}
          </div>
        </div>

        <div className="luxury-panel rounded-3xl p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8c6a26]">
            Account
          </p>

          <h2 className="display-serif mt-2 text-4xl text-[#062f2a]">
            {user?.first_name || "Reader"} {user?.last_name || ""}
          </h2>

          <p className="mt-4 text-base text-[#5b534f]">{user?.email}</p>

          <div className="mt-8 space-y-4 border-t border-[#e7dcc9] pt-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8c6a26]">
                Reading Library
              </p>
              <p className="mt-2 text-sm leading-6 text-[#5b534f]">
                View and manage your personal collection with ease.
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8c6a26]">
                Account Type
              </p>
              <p className="mt-2 text-sm capitalize text-[#062f2a]">
                {user?.role || "user"}
              </p>
            </div>

            {topGenres.length > 0 && (
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8c6a26]">
                  Favorite Genres
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {topGenres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full border border-[#d6b15a]/50 bg-[#f4e7c8] px-2 py-1 text-[0.62rem] font-medium uppercase tracking-[0.12em] text-[#72511c]"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <a
              href="/books/add"
              className="mt-6 inline-block rounded-md bg-[#062f2a] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#f7f0e5] transition hover:bg-[#0b4a3e]"
            >
              Add a Story
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
