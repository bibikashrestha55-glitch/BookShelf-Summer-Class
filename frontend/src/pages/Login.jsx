import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
      const data = await apiRequest("/auth/login", {
        method: "POST",
        data: formData,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authChange"));
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md rounded-[1.75rem] border border-[#d5cab8] bg-[#fffdf8]/80 p-6 shadow-[0_20px_45px_rgba(40,31,23,0.06)] sm:p-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8c6a26]">
            Welcome Back
          </p>

          <h1 className="display-serif mt-3 text-5xl text-[#062f2a]">
            Sign in to BookShelf
          </h1>

          <p className="mt-3 text-sm text-[#5a5047]">
            Continue your reading journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
              placeholder="••••••••"
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
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {message && (
            <p className="text-center text-sm text-[#5a5047]">{message}</p>
          )}
        </form>
      </div>
    </section>
  );
}

export default Login;
