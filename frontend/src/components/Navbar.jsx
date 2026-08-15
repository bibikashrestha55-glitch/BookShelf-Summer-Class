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
    <header className="border-b border-[#b8862d]/40 bg-[#062f2a] shadow-[0_8px_30px_rgba(2,15,13,0.22)]">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="display-serif text-3xl font-semibold tracking-[0.04em] text-[#f5e8c8] transition hover:text-[#d6b15a]"
        >
          BookShelf
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <Link
            to="/"
            className="text-sm font-medium tracking-[0.12em] text-[#e9e0d1] uppercase transition hover:text-[#d6b15a]"
          >
            Home
          </Link>

          <Link
            to="/books/add"
            className="text-sm font-medium tracking-[0.12em] text-[#e9e0d1] uppercase transition hover:text-[#d6b15a]"
          >
            Add Book
          </Link>

          <Link
            to="/favorites"
            className="text-sm font-medium tracking-[0.12em] text-[#e9e0d1] uppercase transition hover:text-[#d6b15a]"
          >
            Favorites
          </Link>

          <Link
            to="/about"
            className="text-sm font-medium tracking-[0.12em] text-[#e9e0d1] uppercase transition hover:text-[#d6b15a]"
          >
            About
          </Link>

          {isLoggedIn && (
            <>
              <Link
                to="/ai"
                className="text-sm font-medium tracking-[0.12em] text-[#e9e0d1] uppercase transition hover:text-[#d6b15a]"
              >
                BookShelf AI
              </Link>

              <Link
                to="/dashboard"
                className="text-sm font-medium tracking-[0.12em] text-[#e9e0d1] uppercase transition hover:text-[#d6b15a]"
              >
                Dashboard
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {isLoggedIn ? (
            <>
              {user && (
                <span className="hidden text-sm font-medium text-[#f5e8c8] sm:inline-block">
                  Welcome, {user.first_name}
                </span>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-[#d6b15a]/60 bg-[#0b4a3e] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[#f8f1e5] transition hover:border-[#d6b15a] hover:bg-[#d6b15a] hover:text-[#062f2a]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md border border-[#d6b15a]/60 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[#f8f1e5] transition hover:bg-[#d6b15a] hover:text-[#062f2a]"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="rounded-md bg-[#d6b15a] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[#062f2a] transition hover:bg-[#e4c877]"
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
