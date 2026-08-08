function Footer() {
  return (
    <footer className="border-t border-amber-900/20 bg-stone-950 text-stone-300">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm md:flex-row">
        <p>© 2026 BookShelf. Every story deserves a place on your shelf.</p>

        <div className="flex gap-6">
          <a href="/about" className="transition hover:text-amber-200">
            About
          </a>

          <a href="/" className="transition hover:text-amber-200">
            Home
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
