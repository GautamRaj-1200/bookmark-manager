interface Tag {
  id: string;
  name: string;
}

interface SearchAndFilterProps {
  tags: Tag[];
  activeTag: string;
  searchQuery: string;
}

export default function SearchAndFilter({
  tags,
  activeTag,
  searchQuery,
}: SearchAndFilterProps) {
  return (
    <div className="space-y-4">
      <form method="GET" className="flex gap-2">
        {activeTag && <input type="hidden" name="tag" value={activeTag} />}
        <input
          name="search"
          type="text"
          placeholder="Search bookmarks..."
          defaultValue={searchQuery}
          className="flex-1 bg-transparent rounded px-3 py-2 ring-1 ring-white/10 focus:outline-none focus:ring-blue-500/50"
        />
        <button
          type="submit"
          className="px-3 py-2 rounded ring-1 ring-white/10 hover:bg-white/10 text-sm"
        >
          Search
        </button>
        {searchQuery && (
          <a
            href={
              activeTag
                ? `/bookmarks?tag=${encodeURIComponent(activeTag)}`
                : "/bookmarks"
            }
            className="px-3 py-2 rounded ring-1 ring-white/10 hover:bg-white/10 text-sm"
          >
            Clear
          </a>
        )}
      </form>

      <div className="flex flex-wrap gap-2 items-center">
        <a
          href={
            searchQuery
              ? `/bookmarks?search=${encodeURIComponent(searchQuery)}`
              : "/bookmarks"
          }
          className={`cursor-pointer inline-flex items-center text-xs px-3 py-1.5 rounded-full transition-all duration-200 ${
            !activeTag
              ? "bg-blue-500/20 ring-1 ring-blue-500/50 text-blue-200"
              : "bg-zinc-800/50 ring-1 ring-zinc-600 text-zinc-400 hover:bg-zinc-700/50"
          }`}
        >
          All
        </a>
        {tags.map((t) => (
          <a
            key={t.id}
            href={`/bookmarks?tag=${encodeURIComponent(t.name)}${
              searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""
            }`}
            className={`cursor-pointer inline-flex items-center text-xs px-3 py-1.5 rounded-full transition-all duration-200 ${
              activeTag === t.name
                ? "bg-blue-500/20 ring-1 ring-blue-500/50 text-blue-200"
                : "bg-blue-500/10 ring-1 ring-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:ring-blue-500/50"
            }`}
          >
            <span className="mr-1">#</span>
            {t.name}
          </a>
        ))}
      </div>

      {(activeTag || searchQuery) && (
        <div className="text-sm text-zinc-400">
          {activeTag && `Filtering by tag: ${activeTag}`}
          {activeTag && searchQuery && " • "}
          {searchQuery && `Searching for: "${searchQuery}"`}
        </div>
      )}
    </div>
  );
}
