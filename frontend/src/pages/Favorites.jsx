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
    <section className="mx-auto max-w-6xl px-6 py-16">
      {/* Heading */}

      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-800">
          Your Collection
        </p>

        <h1 className="mt-2 text-4xl font-bold text-emerald-950 md:text-5xl">
          My Favorites
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-stone-600">
          The stories you've chosen to keep close.
        </p>
      </div>

      {/* Content */}

      <div className="mt-14">
        {isLoading ? (
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-lg font-medium text-emerald-950">
              Opening your favorites...
            </p>

            <p className="mt-2 text-sm text-stone-500">
              Gathering your favorite stories.
            </p>
          </div>
        ) : favoriteBooks.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {favoriteBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <div className="text-4xl text-amber-700">♡</div>

            <h2 className="mt-4 text-xl font-semibold text-emerald-950">
              No favorites yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
              When you find a book you love, click the heart to add it to your
              favorites.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Favorites;
