import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { normalizeGenres } from "../constants/genres";
import { apiRequest } from "../services/api";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const genres = normalizeGenres(book?.genres);
  const [coverImageError, setCoverImageError] = useState(false);

  const [rating, setRating] = useState(0);
  const [isUpdatingRating, setIsUpdatingRating] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const loadBook = async () => {
      try {
        const data = await apiRequest(`/books/${id}`);

        setBook(data);
        setRating(data.rating || 0);
      } catch (error) {
        console.error("Failed to load book:", error);
        alert(error.message || "Failed to load book.");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    loadBook();
  }, [id, navigate]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await apiRequest(`/comments/book/${id}`);
        setComments(data);
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        setIsLoadingComments(false);
      }
    };

    loadComments();
  }, [id]);

  const handleRating = async (selectedRating) => {
    if (isUpdatingRating) return;

    try {
      setIsUpdatingRating(true);

      const data = await apiRequest(`/books/${id}/rating`, {
        method: "PATCH",
        data: { rating: selectedRating },
      });

      setRating(data.book.rating);
      setBook(data.book);
    } catch (error) {
      console.error("Rating error:", error);
      alert(error.message || "Failed to update rating.");
    } finally {
      setIsUpdatingRating(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${book.title}"?`,
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);

      await apiRequest(`/books/${id}`, { method: "DELETE" });
      alert("Book deleted successfully.");
      navigate("/");
    } catch (error) {
      console.error("Delete book error:", error);
      alert(error.message || "Failed to delete book.");
      setIsDeleting(false);
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    const trimmedComment = commentText.trim();
    if (!trimmedComment) return;

    try {
      setIsSubmittingComment(true);

      const newComment = await apiRequest(`/comments/book/${id}`, {
        method: "POST",
        data: { text: trimmedComment },
      });

      setComments((previousComments) => [newComment, ...previousComments]);
      setCommentText("");
    } catch (error) {
      console.error("Comment error:", error);
      alert(error.message || "Failed to add comment.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) return;

    try {
      await apiRequest(`/comments/${commentId}`, { method: "DELETE" });

      setComments((previousComments) =>
        previousComments.filter((comment) => comment._id !== commentId),
      );
    } catch (error) {
      console.error("Delete comment error:", error);
      alert(error.message || "Failed to delete comment.");
    }
  };

  if (isLoading) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p className="text-lg font-medium text-[#062f2a]">
          Opening your book...
        </p>
        <p className="mt-2 text-sm text-[#756f67]">
          Gathering the details from your shelf.
        </p>
      </section>
    );
  }

  if (!book) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-8 text-sm font-medium uppercase tracking-[0.14em] text-[#062f2a] transition hover:text-[#8c6a26]"
      >
        ← Back to bookshelf
      </button>

      <div className="overflow-hidden rounded-[1.75rem] border border-[#d5cab8] bg-[#fffdf8]/80 shadow-[0_20px_45px_rgba(40,31,23,0.06)]">
        <div className="grid md:grid-cols-[300px_1fr]">
          <div className="flex min-h-[420px] items-center justify-center bg-[#062f2a] p-8">
            <div className="relative h-[360px] w-[250px] overflow-hidden rounded-[0.5rem] border border-[#d6b15a]/80 bg-[#0b4a3e] shadow-[0_25px_60px_rgba(6,47,42,0.35)]">
              {book.coverImage && !coverImageError ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-full w-full object-cover"
                  onError={() => setCoverImageError(true)}
                />
              ) : (
                <div className="book-fallback flex h-full w-full">
                  <p className="text-[0.55rem] font-semibold uppercase tracking-[0.28em] text-[#d6b15a]">
                    BookShelf
                  </p>
                  <h1 className="display-serif mt-5 px-4 text-[2.55rem] leading-[0.9] text-[#fffdf8]">
                    {book.title}
                  </h1>
                  <div className="mt-4 text-sm text-[#d6b15a]">✦</div>
                  <p className="mt-2 px-4 text-[0.72rem] tracking-[0.08em] text-[#e7dcc3]">
                    {book.author}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-7 sm:p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8c6a26]">
              Book Details
            </p>

            <h1 className="display-serif mt-3 text-5xl text-[#062f2a] md:text-6xl">
              {book.title}
            </h1>

            <p className="mt-2 text-lg text-[#5a5047]">{book.author}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#f4e7c8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#72511c]">
                {book.status}
              </span>

              <div className="flex items-center gap-1 text-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <= (rating || 0)
                        ? "text-[#b8862d]"
                        : "text-[#d0c4b7]"
                    }
                  >
                    ★
                  </span>
                ))}
                <span className="ml-2 text-sm text-[#756f67]">
                  {rating ? `${rating}/5` : "Not rated"}
                </span>
              </div>
            </div>

            {genres.length > 0 && (
              <div className="mt-8">
                <h2 className="display-serif text-4xl text-[#062f2a]">
                  Genres
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full border border-[#d6b15a]/50 bg-[#f4e7c8] px-3 py-2 text-[0.62rem] font-medium uppercase tracking-[0.12em] text-[#72511c]"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <h2 className="display-serif text-4xl text-[#062f2a]">
                About this book
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#5b534f]">
                {book.description || "No description has been added yet."}
              </p>
            </div>

            <div className="mt-8 border-t border-[#efe6d7] pt-6">
              <h2 className="display-serif text-4xl text-[#062f2a]">
                Your Rating
              </h2>

              <div className="mt-4 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRating(star)}
                    disabled={isUpdatingRating}
                    aria-label={`Rate ${star} out of 5`}
                    className={`text-3xl transition duration-150 hover:scale-110 ${
                      star <= rating
                        ? "text-[#b8862d]"
                        : "text-[#d0c4b7] hover:text-[#d6b15a]"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <p className="mt-2 text-sm text-[#756f67]">
                {rating === 0
                  ? "Click a star to rate this book."
                  : `You rated this book ${rating} out of 5.`}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  navigate("/ai", {
                    state: {
                      initialPrompt: `Recommend books similar to this one: ${book.title} by ${book.author}`,
                    },
                  })
                }
                className="rounded-md border border-[#b8862d] bg-[#fffdf8] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#062f2a] transition hover:bg-[#f5ebd2]"
              >
                Ask BookShelf AI
              </button>

              <button
                type="button"
                onClick={() => navigate(`/books/${book._id}/edit`)}
                className="rounded-md bg-[#062f2a] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#f7f0e5] transition hover:bg-[#0b4a3e]"
              >
                Edit Book
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-md border border-[#d8b2b2] bg-[#fff8f8] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#8a3d3d] transition hover:bg-[#f9e5e5] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete Book"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-[1.75rem] border border-[#d5cab8] bg-[#fffdf8]/80 p-6 shadow-[0_20px_45px_rgba(40,31,23,0.06)] sm:p-8">
        <h2 className="display-serif text-4xl text-[#062f2a]">
          Reader's Notes
        </h2>

        <form onSubmit={handleCommentSubmit} className="mt-6">
          <textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            rows="4"
            maxLength="1000"
            placeholder="Write your thoughts about this book..."
            className="w-full resize-none rounded-xl border border-[#d5cab8] bg-[#fffdf8] px-4 py-3 text-sm text-[#2c241d] outline-none transition focus:border-[#b8862d] focus:ring-4 focus:ring-[#d6b15a]/20"
          />

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-[#756f67]">{commentText.length}/1000</p>

            <button
              type="submit"
              disabled={isSubmittingComment || !commentText.trim()}
              className="rounded-md bg-[#062f2a] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#f7f0e5] transition hover:bg-[#0b4a3e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmittingComment ? "Posting..." : "Add Comment"}
            </button>
          </div>
        </form>

        <div className="mt-8 border-t border-[#efe6d7] pt-6">
          {isLoadingComments ? (
            <p className="text-sm text-[#756f67]">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-[#756f67]">
              No comments yet. Be the first to share your thoughts.
            </p>
          ) : (
            <div className="space-y-5">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="rounded-[1.2rem] border border-[#e7dcc9] bg-[#fffdf8] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-[#062f2a]">
                        {comment.user?.first_name} {comment.user?.last_name}
                      </p>

                      <p className="mt-1 text-xs text-[#756f67]">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                        {" · "}
                        {new Date(comment.createdAt).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-xs font-medium uppercase tracking-[0.12em] text-[#8a3d3d] transition hover:text-[#6e2525]"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-1 text-base">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={
                          star <= (comment.rating || 5)
                            ? "text-[#b8862d]"
                            : "text-[#d0c4b7]"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <p className="mt-3 text-base leading-7 text-[#5b534f]">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default BookDetails;
