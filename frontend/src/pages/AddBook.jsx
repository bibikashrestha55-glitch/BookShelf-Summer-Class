import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GENRE_OPTIONS } from "../constants/genres";
import { apiRequest } from "../services/api";

function AddBook() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    status: "Want to Read",
    description: "",
    genres: [],
  });

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
      await apiRequest("/books", {
        method: "POST",
        data: formData,
      });

      alert("Book added successfully!");
      navigate("/");
    } catch (error) {
      console.error("Add book error:", error);
      alert(error.message || "Failed to add book.");
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#8c6a26]">
          Your Collection
        </p>

        <h1 className="display-serif mt-3 text-5xl text-[#062f2a] md:text-6xl">
          Add a story to your shelf.
        </h1>

        <p className="mt-4 text-lg text-[#5a5047]">
          Welcome the next great read into your library.
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
            placeholder="Enter the book title"
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
            placeholder="Enter the author's name"
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
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="block text-sm font-medium text-[#453d38]">
              Genres
            </label>
            <span className="text-[0.65rem] uppercase tracking-[0.12em] text-[#756f67]">
              {formData.genres.length} selected
            </span>
          </div>

          <div className="rounded-2xl border border-[#d5cab8] bg-[#f7f1e7]/80 p-2.5 sm:p-3">
            <div className="flex flex-wrap gap-2">
              {GENRE_OPTIONS.map((genre) => {
                const isActive = formData.genres.includes(genre);

                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`rounded-full border px-2.5 py-1.5 text-[0.58rem] font-medium uppercase tracking-[0.12em] transition-all duration-200 sm:px-3 sm:py-2 ${
                      isActive
                        ? "border-[#b8862d] bg-[#062f2a] text-[#f7f0e5] shadow-[0_8px_18px_rgba(6,47,42,0.14)]"
                        : "border-[#d5cab8] bg-[#fffdf8] text-[#453d38] hover:border-[#b8862d] hover:text-[#062f2a]"
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
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
            placeholder="Add a short description..."
            className="w-full resize-none rounded-xl border border-[#d5cab8] bg-[#fffdf8] px-4 py-3 text-sm text-[#2c241d] outline-none transition focus:border-[#b8862d] focus:ring-4 focus:ring-[#d6b15a]/20"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-[#062f2a] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#f7f0e5] transition hover:bg-[#0b4a3e]"
        >
          Add Book
        </button>
      </form>
    </section>
  );
}

export default AddBook;
