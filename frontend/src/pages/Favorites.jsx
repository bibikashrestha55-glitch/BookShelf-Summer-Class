import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import { apiRequest } from "../services/api";

function Favorites() {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const data = await apiRequest("/books/favorites/list");
        setFavoriteBooks(data);
      } catch (error) {
        console.error("Failed to load favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#8c6a26]">
          Your Private Collection
        </p>

        <h1 className="display-serif mt-3 text-5xl text-[#062f2a] md:text-6xl">
          Your Favorites
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#5a5047]">
          Stories worth returning to.
        </p>
      </div>

      <div className="mt-14">
        {isLoading ? (
          <div className="rounded-[1.5rem] border border-[#d4c9b9] bg-[#fffdf8]/80 px-6 py-16 text-center shadow-[0_15px_30px_rgba(94,80,62,0.04)]">
            <p className="text-lg font-medium text-[#062f2a]">
              Opening your favorites...
            </p>
            <p className="mt-2 text-sm text-[#756f67]">
              Gathering your favorite stories.
            </p>
          </div>
        ) : favoriteBooks.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {favoriteBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-[#b8ac98] bg-[#fffdf8]/80 px-6 py-16 text-center shadow-[0_15px_30px_rgba(94,80,62,0.03)]">
            <div className="text-5xl text-[#b8862d]">♡</div>

            <h2 className="display-serif mt-4 text-4xl text-[#062f2a]">
              Your private collection is waiting.
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-[#5b534f]">
              Save the books that stay with you and they will gather here like a
              treasured shelf of unforgettable stories.
            </p>

            <a
              href="/"
              className="mt-8 inline-block rounded-md bg-[#062f2a] px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#f7f0e5] transition hover:bg-[#0b4a3e]"
            >
              Discover Books
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

export default Favorites;
