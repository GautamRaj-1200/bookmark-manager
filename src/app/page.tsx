export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight">
            Save links. Find them fast.
          </h1>
          <p className="text-zinc-400">
            Organize bookmarks with tags and filter in a click.
          </p>
          <div className="flex justify-center gap-3">
            <a
              href="/bookmarks"
              className="inline-block rounded px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white"
            >
              Open Bookmarks
            </a>
            <a
              href="/profile"
              className="inline-block rounded px-4 py-2 border border-white/20 text-zinc-100 hover:bg-white/5"
            >
              View Profile
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
