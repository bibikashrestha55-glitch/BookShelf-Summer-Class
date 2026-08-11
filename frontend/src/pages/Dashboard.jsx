function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <section className="mx-auto min-h-[calc(100vh-5rem)] max-w-6xl px-6 py-16">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-amber-800">
          Your Reading Space
        </p>

        <h1 className="mt-2 text-4xl font-bold text-emerald-950">
          Welcome back, {user?.first_name || "Reader"}.
        </h1>

        <p className="mt-4 max-w-2xl text-stone-600">
          Keep track of your books, discover new stories, and continue your
          reading journey.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-stone-500">Account</p>

          <h2 className="mt-2 text-xl font-semibold text-emerald-950">
            {user?.first_name} {user?.last_name}
          </h2>

          <p className="mt-2 text-sm text-stone-500">{user?.email}</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-stone-500">Reading Library</p>

          <h2 className="mt-2 text-xl font-semibold text-emerald-950">
            Your Books
          </h2>

          <p className="mt-2 text-sm text-stone-500">
            View and manage your personal collection.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-stone-500">Account Type</p>

          <h2 className="mt-2 text-xl font-semibold capitalize text-emerald-950">
            {user?.role || "user"}
          </h2>

          <p className="mt-2 text-sm text-stone-500">Your BookShelf account.</p>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
