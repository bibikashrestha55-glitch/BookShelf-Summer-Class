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
        body: JSON.stringify(formData),
      });

      // Save JWT token
      localStorage.setItem("token", data.token);

      // Save user information
      localStorage.setItem("user", JSON.stringify(data.user));

      // Tell Navbar that login happened
      window.dispatchEvent(new Event("authChange"));

      // Go to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      setMessage(error.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-amber-700">
            Welcome Back
          </p>

          <h1 className="mt-2 text-3xl font-bold text-emerald-950">
            Sign in to BookShelf
          </h1>

          <p className="mt-3 text-sm text-stone-500">
            Continue your reading journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-stone-700"
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
              className="w-full rounded-md border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-stone-700"
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
              className="w-full rounded-md border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-emerald-950 px-5 py-3 font-medium text-amber-100 transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {message && (
            <p className="text-center text-sm text-stone-600">{message}</p>
          )}
        </form>
      </div>
    </section>
  );
}

export default Login;
