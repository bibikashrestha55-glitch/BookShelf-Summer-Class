function About() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#8c6a26]">
          About BookShelf
        </p>

        <h1 className="display-serif mt-3 text-5xl text-[#062f2a] md:text-7xl">
          A quieter place for your reading life.
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#5a5047]">
          BookShelf is a private reading room for your personal library — a
          place to gather titles that matter, track what you are reading, and
          preserve the stories that stay with you long after the final page.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        <div className="luxury-panel rounded-3xl p-7">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8c6a26]">
            The Idea
          </p>
          <h2 className="display-serif mt-3 text-4xl text-[#062f2a]">Curate</h2>
          <p className="mt-4 text-base leading-7 text-[#5b534f]">
            Build a collection that feels considered, personal, and beautifully
            organized — a shelf you actually want to return to.
          </p>
        </div>

        <div className="luxury-panel rounded-3xl p-7">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8c6a26]">
            The Practice
          </p>
          <h2 className="display-serif mt-3 text-4xl text-[#062f2a]">Track</h2>
          <p className="mt-4 text-base leading-7 text-[#5b534f]">
            Follow what you want to read, what you are reading, and what you
            have finished — all without losing the romance of the book itself.
          </p>
        </div>

        <div className="luxury-panel rounded-3xl p-7">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8c6a26]">
            The Memory
          </p>
          <h2 className="display-serif mt-3 text-4xl text-[#062f2a]">
            Remember
          </h2>
          <p className="mt-4 text-base leading-7 text-[#5b534f]">
            Rate the books that move you, leave notes that matter, and keep a
            living archive of your reading life.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
