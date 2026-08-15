import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GENRE_OPTIONS, normalizeGenres } from "../constants/genres";
import { apiRequest } from "../services/api";

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    status: "Want to Read",
    description: "",
    genres: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadBook = async () => {
      try {
        const book = await apiRequest(`/books/${id}`);

        setFormData({
          title: book.title || "",
          author: book.author || "",
          status: book.status || "Want to Read",
          description: book.description || "",
          genres: normalizeGenres(book.genres),
        });
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

  const statusOptions = ["Want to Read", "Reading", "Finished"];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleStatusChange = (value) => {
    setFormData((previousData) => ({
      ...previousData,
      status: value,
    }));
  };

  const toggleGenre = (genre) => {
    setFormData((previousData) => {
      const currentGenres = Array.isArray(previousData.genres)
        ? previousData.genres
        : [];
      const exists = currentGenres.includes(genre);

      return {
        ...previousData,
        genres: exists
          ? currentGenres.filter((item) => item !== genre)
          : [...currentGenres, genre],
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSaving(true);

      await apiRequest(`/books/${id}`, {
        method: "PUT",
        data: formData,
      });

      alert("Book updated successfully.");
      navigate(`/books/${id}`);
    } catch (error) {
      console.error("Update book error:", error);
      alert(error.message || "Failed to update book.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p className="text-lg font-medium text-[#062f2a]">
          Opening your book...
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#8c6a26]">
          Your Collection
        </p>

        <h1 className="display-serif mt-3 text-5xl text-[#062f2a] md:text-6xl">
          Edit Book
        </h1>

        <p className="mt-4 text-lg text-[#5a5047]">
          Refine the details of your volume.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-[1.75rem] border border-[#d5cab8] bg-[#fffdf8]/80 p-6 shadow-[0_20px_45px_rgba(40,31,23,0.06)] sm:p-8"
      >
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-[#453d38]"
          >
            Book Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-[#d5cab8] bg-[#fffdf8] px-4 py-3 text-sm text-[#2c241d] outline-none transition focus:border-[#b8862d] focus:ring-4 focus:ring-[#d6b15a]/20"
          />
        </div>

        <div>
          <label
            htmlFor="author"
            className="mb-2 block text-sm font-medium text-[#453d38]"
          >
            Author
          </label>
          <input
            id="author"
            name="author"
            type="text"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-[#d5cab8] bg-[#fffdf8] px-4 py-3 text-sm text-[#2c241d] outline-none transition focus:border-[#b8862d] focus:ring-4 focus:ring-[#d6b15a]/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#453d38]">
            Reading Status
          </label>

          <div className="grid gap-2 sm:grid-cols-3">
            {statusOptions.map((option) => {
              const isActive = formData.status === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleStatusChange(option)}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium uppercase tracking-[0.12em] transition-all duration-200 ${
                    isActive
                      ? "border-[#b8862d] bg-[#062f2a] text-[#f7f0e5] shadow-[0_12px_25px_rgba(6,47,42,0.18)]"
                      : "border-[#d5cab8] bg-[#fffdf8] text-[#453d38] hover:border-[#b8862d] hover:text-[#062f2a]"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#453d38]">
            Genre
          </label>

          <div className="flex flex-wrap gap-2">
            {GENRE_OPTIONS.map((genre) => {
              const isActive = formData.genres.includes(genre);

              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`rounded-full border px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-all duration-200 ${
                    isActive
                      ? "border-[#b8862d] bg-[#062f2a] text-[#f7f0e5] shadow-[0_12px_25px_rgba(6,47,42,0.18)]"
                      : "border-[#d5cab8] bg-[#fffdf8] text-[#453d38] hover:border-[#b8862d] hover:text-[#062f2a]"
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-[#453d38]"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="w-full resize-none rounded-xl border border-[#d5cab8] bg-[#fffdf8] px-4 py-3 text-sm text-[#2c241d] outline-none transition focus:border-[#b8862d] focus:ring-4 focus:ring-[#d6b15a]/20"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 rounded-md bg-[#062f2a] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#f7f0e5] transition hover:bg-[#0b4a3e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/books/${id}`)}
            className="rounded-md border border-[#d5cab8] bg-[#fffdf8] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#2c241d] transition hover:border-[#b8862d]"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default EditBook;
