function About() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl flex-col justify-center px-6 py-16">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-800">
          About BookShelf
        </p>

        <h1 className="mt-3 text-4xl font-bold text-emerald-950 md:text-5xl">
          A quieter place for your reading life.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-stone-600">
          BookShelf is a personal reading list tracker designed to help you
          organize your books, keep track of your progress, and remember the
          stories that matter to you.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-emerald-950">Curate</h2>

          <p className="mt-3 text-sm leading-6 text-stone-600">
            Build your own collection and keep your reading list organized.
          </p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-emerald-950">Track</h2>

          <p className="mt-3 text-sm leading-6 text-stone-600">
            Follow your reading progress and know what deserves your attention
            next.
          </p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-emerald-950">Remember</h2>

          <p className="mt-3 text-sm leading-6 text-stone-600">
            Rate and review the books that become part of your story.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
