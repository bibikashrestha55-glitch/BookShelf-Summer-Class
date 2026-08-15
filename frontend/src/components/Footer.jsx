function Footer() {
  return (
    <footer className="border-t border-[#b8862d]/30 bg-[#062f2a] text-[#f5efe4]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-8 text-sm md:flex-row">
        <div>
          <p className="display-serif text-3xl font-medium text-[#f6ebd4]">
            BookShelf
          </p>
          <p className="mt-2 text-[#d7ccba]">
            Every story deserves a place on your shelf.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs font-medium uppercase tracking-[0.18em] text-[#e8d9b5]">
          <a href="/about" className="transition hover:text-[#d6b15a]">
            About
          </a>
          <a href="/" className="transition hover:text-[#d6b15a]">
            Home
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
