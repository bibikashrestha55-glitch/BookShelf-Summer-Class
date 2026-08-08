import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

function BookCard({ book }) {
  const navigate = useNavigate();

  const [isFavorite, setIsFavorite] = useState(book.isFavorite || false);

  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);

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
    "Want to Read": "bg-[#f3e4bd] text-[#72511c]",
    Reading: "bg-[#f3e4bd] text-[#72511c]",
    Finished: "bg-[#dfe8d0] text-[#455532]",
  };

  return (
    <article
      onClick={handleBookClick}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* =================================
          BOOK COVER AREA
      ================================= */}

      <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#073b32] p-6">
        {/* Soft background glow */}

        <div className="pointer-events-none absolute h-40 w-40 rounded-full bg-[#b8862d]/10 blur-3xl" />

        {/* Favorite */}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleFavorite();
          }}
          disabled={isUpdatingFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#e5ddd0] bg-[#fffdf8] text-xl text-[#073b32] shadow-md transition duration-200 hover:scale-105 hover:text-[#b8862d] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isFavorite ? "♥" : "♡"}
        </button>

        {/* Book */}

        <div className="relative flex h-52 w-36 flex-col items-center justify-center overflow-hidden rounded-sm border border-[#b8862d]/70 bg-[#0b4a3e] px-4 text-center shadow-2xl transition duration-300 group-hover:scale-[1.03]">
          {/* Inner border */}

          <div className="pointer-events-none absolute inset-2 border border-[#b8862d]/40" />

          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d6b15a]">
            BookShelf
          </p>

          <h2 className="mt-4 font-['Playfair_Display'] text-xl font-semibold leading-tight text-[#fffdf8]">
            {book.title}
          </h2>

          <div className="my-3 text-xs text-[#d6b15a]">✦</div>

          <p className="text-xs text-[#e5d8bd]">{book.author}</p>
        </div>
      </div>
      {/* Rating */}

      <div className="mt-3 flex items-center gap-1">
        <div className="flex text-sm">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={
                star <= (book.rating || 0) ? "text-[#b8862d]" : "text-stone-300"
              }
            >
              ★
            </span>
          ))}
        </div>

        <span className="text-xs text-stone-500">
          {book.rating ? `${book.rating}/5` : "Not rated"}
        </span>
      </div>

      {/* =================================
          BOOK DETAILS
      ================================= */}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-['Playfair_Display'] text-xl font-semibold text-[#073b32]">
              {book.title}
            </h3>

            <p className="mt-1 text-sm text-[#756f67]">{book.author}</p>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
              statusStyles[book.status] || "bg-[#f3e4bd] text-[#72511c]"
            }`}
          >
            {book.status}
          </span>
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#756f67]">
          {book.description}
        </p>

        {isFavorite && (
          <p className="mt-4 text-xs font-medium text-[#b8862d]">
            ♥ Added to your favorites
          </p>
        )}
      </div>
    </article>
  );
}

export default BookCard;
