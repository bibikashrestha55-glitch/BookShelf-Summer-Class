import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    status: "Want to Read",
    description: "",
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
      setIsSaving(true);

      await apiRequest(`/books/${id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
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
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-lg font-medium text-emerald-950">
          Opening your book...
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-800">
          Your Collection
        </p>

        <h1 className="mt-2 text-4xl font-bold text-emerald-950">Edit Book</h1>

        <p className="mt-3 text-stone-600">Update the details of your book.</p>
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
            className="w-full resize-none rounded-md border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* Buttons */}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 rounded-md bg-emerald-950 px-5 py-3 font-medium text-amber-100 transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/books/${id}`)}
            className="rounded-md border border-stone-300 px-5 py-3 font-medium text-stone-700 transition hover:bg-stone-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default EditBook;
