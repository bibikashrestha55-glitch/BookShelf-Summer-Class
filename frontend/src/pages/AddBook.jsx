import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

function AddBook() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    status: "Want to Read",
    description: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await apiRequest("/books", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      alert("Book added successfully!");

      navigate("/");
    } catch (error) {
      console.error("Add book error:", error);

      alert(error.message || "Failed to add book.");
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-800">
          Your Collection
        </p>

        <h1 className="mt-2 text-4xl font-bold text-emerald-950">
          Add a new book
        </h1>

        <p className="mt-3 text-stone-600">
          Add a story to your personal bookshelf.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm"
      >
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-stone-700"
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
            className="w-full rounded-md border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* Author */}
        <div>
          <label
            htmlFor="author"
            className="mb-2 block text-sm font-medium text-stone-700"
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
            className="w-full rounded-md border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            Reading Status
          </label>

          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
          >
            <option value="Want to Read">Want to Read</option>
            <option value="Reading">Reading</option>
            <option value="Finished">Finished</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-stone-700"
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
            className="w-full resize-none rounded-md border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-md bg-emerald-950 px-5 py-3 font-medium text-amber-100 transition hover:bg-emerald-900"
        >
          Add Book
        </button>
      </form>
    </section>
  );
}

export default AddBook;
