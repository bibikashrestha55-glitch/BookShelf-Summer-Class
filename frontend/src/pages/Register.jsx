import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        data: formData,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authChange"));
      setMessage("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(error.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-lg rounded-[1.75rem] border border-[#d5cab8] bg-[#fffdf8]/80 p-6 shadow-[0_20px_45px_rgba(40,31,23,0.06)] sm:p-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8c6a26]">
            Begin Your Journey
          </p>

          <h1 className="display-serif mt-3 text-5xl text-[#062f2a]">
            Create your BookShelf
          </h1>

          <p className="mt-3 text-sm text-[#5a5047]">
            Build your personal collection and keep track of every story.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="first_name"
                className="mb-2 block text-sm font-medium text-[#453d38]"
              >
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="Your first name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#d5cab8] bg-[#fffdf8] px-4 py-3 text-sm text-[#2c241d] outline-none transition focus:border-[#b8862d] focus:ring-4 focus:ring-[#d6b15a]/20"
                required
              />
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="mb-2 block text-sm font-medium text-[#453d38]"
              >
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Your last name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#d5cab8] bg-[#fffdf8] px-4 py-3 text-sm text-[#2c241d] outline-none transition focus:border-[#b8862d] focus:ring-4 focus:ring-[#d6b15a]/20"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#453d38]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#d5cab8] bg-[#fffdf8] px-4 py-3 text-sm text-[#2c241d] outline-none transition focus:border-[#b8862d] focus:ring-4 focus:ring-[#d6b15a]/20"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#453d38]"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#d5cab8] bg-[#fffdf8] px-4 py-3 text-sm text-[#2c241d] outline-none transition focus:border-[#b8862d] focus:ring-4 focus:ring-[#d6b15a]/20"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#062f2a] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#f7f0e5] transition hover:bg-[#0b4a3e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {message && (
            <p className="text-center text-sm text-[#5a5047]">{message}</p>
          )}
        </form>
      </div>
    </section>
  );
}

export default Register;
