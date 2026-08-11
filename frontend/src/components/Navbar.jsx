import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      setIsLoggedIn(!!token);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    checkAuth();

    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setUser(null);

    window.dispatchEvent(new Event("authChange"));

    navigate("/login");
  };

  return (
    <header className="bg-emerald-950">
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          className="font-['Playfair_Display'] text-2xl font-semibold text-amber-200"
        >
          BookShelf
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-sm text-stone-200 transition hover:text-amber-200"
          >
            Home
          </Link>

          <Link
            to="/books/add"
            className="text-sm text-stone-200 transition hover:text-amber-200"
          >
            Add Book
          </Link>

          <Link
            to="/favorites"
            className="text-sm text-stone-200 transition hover:text-amber-200"
          >
            Favorites
          </Link>

          <Link
            to="/about"
            className="text-sm text-stone-200 transition hover:text-amber-200"
          >
            About
          </Link>

          {isLoggedIn && (
            <Link
              to="/dashboard"
              className="text-sm text-stone-200 transition hover:text-amber-200"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Authentication */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {user && (
                <span className="text-sm text-amber-100">
                  {user.first_name}
                </span>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-amber-200/60 px-4 py-2 text-sm text-amber-100 transition hover:bg-amber-200 hover:text-emerald-950"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md border border-amber-200/60 px-4 py-2 text-sm text-amber-100 transition hover:bg-amber-200 hover:text-emerald-950"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="rounded-md border border-amber-200/60 px-4 py-2 text-sm text-amber-100 transition hover:bg-amber-200 hover:text-emerald-950"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
