import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

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
    if (isUpdatingRating) {
      return;
    }

    try {
      setIsUpdatingRating(true);

      const data = await apiRequest(`/books/${id}/rating`, {
        method: "PATCH",
        body: JSON.stringify({
          rating: selectedRating,
        }),
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

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      await apiRequest(`/books/${id}`, {
        method: "DELETE",
      });

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

    if (!trimmedComment) {
      return;
    }

    try {
      setIsSubmittingComment(true);

      const newComment = await apiRequest(`/comments/book/${id}`, {
        method: "POST",
        body: JSON.stringify({
          text: trimmedComment,
        }),
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

    if (!confirmed) {
      return;
    }

    try {
      await apiRequest(`/comments/${commentId}`, {
        method: "DELETE",
      });

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
        <p className="text-lg font-medium text-emerald-950">
          Opening your book...
        </p>

        <p className="mt-2 text-sm text-stone-500">
          Gathering the details from your shelf.
        </p>
      </section>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      {/* Back */}

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-8 text-sm font-medium text-emerald-950 transition hover:text-amber-700"
      >
        ← Back to bookshelf
      </button>

      {/* Main Card */}

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="grid md:grid-cols-[280px_1fr]">
          {/* Book Cover */}

          <div className="flex min-h-[400px] items-center justify-center bg-[#073b32] p-8">
            <div className="relative flex h-80 w-52 flex-col items-center justify-center overflow-hidden rounded-sm border border-[#b8862d]/70 bg-[#0b4a3e] px-6 text-center shadow-2xl">
              <div className="pointer-events-none absolute inset-3 border border-[#b8862d]/40" />

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d6b15a]">
                BookShelf
              </p>

              <h1 className="mt-6 font-['Playfair_Display'] text-2xl font-semibold leading-tight text-[#fffdf8]">
                {book.title}
              </h1>

              <div className="my-5 text-sm text-[#d6b15a]">✦</div>

              <p className="text-sm text-[#e5d8bd]">{book.author}</p>
            </div>
          </div>

          {/* Details */}

          <div className="p-8 md:p-10">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-amber-800">
              Book Details
            </p>

            <h1 className="mt-3 font-['Playfair_Display'] text-4xl font-bold text-emerald-950">
              {book.title}
            </h1>

            <p className="mt-2 text-lg text-stone-500">{book.author}</p>

            {/* Status */}

            <div className="mt-6">
              <span className="rounded-full bg-[#f3e4bd] px-4 py-2 text-sm font-medium text-[#72511c]">
                {book.status}
              </span>
            </div>

            {/* Description */}

            <div className="mt-8">
              <h2 className="font-['Playfair_Display'] text-xl font-semibold text-emerald-950">
                About this book
              </h2>

              <p className="mt-3 leading-7 text-stone-600">
                {book.description || "No description has been added yet."}
              </p>
            </div>

            {/* Rating */}

            <div className="mt-8 border-t border-stone-200 pt-6">
              <h2 className="font-['Playfair_Display'] text-xl font-semibold text-emerald-950">
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
                        : "text-stone-300 hover:text-[#d6b15a]"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <p className="mt-2 text-sm text-stone-500">
                {rating === 0
                  ? "Click a star to rate this book."
                  : `You rated this book ${rating} out of 5.`}
              </p>
            </div>

            {/* Actions */}

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate(`/books/${book._id}/edit`)}
                className="rounded-md bg-emerald-950 px-5 py-3 font-medium text-amber-100 transition hover:bg-emerald-900"
              >
                Edit Book
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-md border border-red-200 px-5 py-3 font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete Book"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-emerald-950">
          Comments
        </h2>

        {/* Add Comment */}

        <form onSubmit={handleCommentSubmit} className="mt-6">
          <textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            rows="4"
            maxLength="1000"
            placeholder="Write your thoughts about this book..."
            className="w-full resize-none rounded-md border border-stone-300 px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
          />

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-stone-400">{commentText.length}/1000</p>

            <button
              type="submit"
              disabled={isSubmittingComment || !commentText.trim()}
              className="rounded-md bg-emerald-950 px-5 py-3 text-sm font-medium text-amber-100 transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmittingComment ? "Posting..." : "Add Comment"}
            </button>
          </div>
        </form>

        {/* Existing Comments */}

        <div className="mt-8 border-t border-stone-200 pt-6">
          {isLoadingComments ? (
            <p className="text-sm text-stone-500">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-stone-500">
              No comments yet. Be the first to share your thoughts.
            </p>
          ) : (
            <div className="space-y-5">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="rounded-xl border border-stone-200 bg-[#fffdf8] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-emerald-950">
                        {comment.user?.first_name} {comment.user?.last_name}
                      </p>

                      <p className="mt-1 text-xs text-stone-400">
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
                      className="text-xs font-medium text-red-600 transition hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-stone-600">
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
