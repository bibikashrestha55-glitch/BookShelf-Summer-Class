import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { normalizeGenres } from "../constants/genres";
import { apiRequest } from "../services/api";

function BookCard({ book }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(book.isFavorite || false);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleFavorite = async () => {
    if (isUpdatingFavorite) return;

    try {
      setIsUpdatingFavorite(true);

      const data = await apiRequest(`/books/${book._id}/favorite`, {
        method: "PATCH",
      });

      setIsFavorite(data.book.isFavorite);
    } catch (error) {
      console.error("Favorite error:", error);
      alert(error.message || "Failed to update favorite.");
    } finally {
      setIsUpdatingFavorite(false);
    }
  };

  const handleBookClick = () => {
    navigate(`/books/${book._id}`);
  };

  const statusStyles = {
    "Want to Read": "bg-[#f4e7c8] text-[#72511c]",
    Reading: "bg-[#efe0b9] text-[#72511c]",
    Finished: "bg-[#dde8d8] text-[#3d5636]",
  };

  const genres = normalizeGenres(book?.genres);

  const renderCover = () => {
    if (book.coverImage && !imageError) {
      return (
        <img
          src={book.coverImage}
          alt={book.title}
          className="book-cover-image"
          onError={() => setImageError(true)}
        />
      );
    }

    return (
      <div className="book-fallback flex h-full w-full">
        <p className="text-[0.5rem] font-semibold uppercase tracking-[0.28em] text-[#d6b15a]">
          BookShelf
        </p>

        <h2 className="display-serif mt-4 px-4 text-[2rem] leading-[0.88] text-[#fffdf8]">
          {book.title}
        </h2>

        <div className="mt-4 text-sm text-[#d6b15a]">✦</div>

        <p className="mt-2 px-4 text-[0.65rem] tracking-[0.08em] text-[#e7dcc3]">
          {book.author}
        </p>
      </div>
    );
  };

  return (
    <article
      onClick={handleBookClick}
      className="group cursor-pointer overflow-hidden rounded-3xl border border-[#d9d1c7] bg-[#fffdf8]/80 shadow-[0_20px_45px_rgba(40,31,23,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_55px_rgba(38,28,19,0.12)]"
    >
      <div className="relative h-72 overflow-hidden bg-[#073b32] p-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,177,90,0.18),transparent_35%)]" />

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleFavorite();
          }}
          disabled={isUpdatingFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[#e7ddcf] bg-[#fffdf8] text-xl text-[#073b32] shadow-lg transition duration-200 hover:scale-105 hover:text-[#b8862d] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isFavorite ? "♥" : "♡"}
        </button>

        <div className="relative mx-auto h-full w-48 transition-transform duration-300 group-hover:scale-[1.03]">
          {renderCover()}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="display-serif text-[2rem] leading-[0.9] text-[#062f2a]">
              {book.title}
            </h3>
            <p className="mt-2 text-sm text-[#756f67]">{book.author}</p>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-widest ${
              statusStyles[book.status] || "bg-[#f4e7c8] text-[#72511c]"
            }`}
          >
            {book.status}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#efe6d7] pt-4">
          <div className="flex items-center gap-1 text-base">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={
                  star <= (book.rating || 0)
                    ? "text-[#b8862d]"
                    : "text-[#d0c4b7]"
                }
              >
                ★
              </span>
            ))}
            <span className="ml-1 text-xs text-[#756f67]">
              {book.rating ? `${book.rating}/5` : "Not rated"}
            </span>
          </div>

          {isFavorite && (
            <span className="text-xs font-medium uppercase tracking-widest text-[#b8862d]">
              Favorite
            </span>
          )}
        </div>

        {genres.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="rounded-full border border-[#d6b15a]/50 bg-[#f4e7c8] px-2 py-1 text-[0.6rem] font-medium uppercase tracking-[0.12em] text-[#72511c]"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#5b534f]">
          {book.description}
        </p>
      </div>
    </article>
  );
}

export default BookCard;
