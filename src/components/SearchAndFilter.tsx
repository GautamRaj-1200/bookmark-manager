import { deleteTag } from "@/app/bookmarks/actions";

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
          className={`px-2 py-1 rounded border ${
            !activeTag ? "bg-white/10 border-white/10" : "border-white/10"
          }`}
        >
          All
        </a>
        {tags.map((t) => (
          <div key={t.id} className="flex items-center gap-1">
            <a
              href={`/bookmarks?tag=${encodeURIComponent(t.name)}${
                searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""
              }`}
              className={`px-2 py-1 rounded border ${
                activeTag === t.name
                  ? "bg-white/10 border-white/10"
                  : "border-white/10"
              }`}
            >
              {t.name}
            </a>
            <form action={deleteTag}>
              <input type="hidden" name="tagId" value={t.id} />
              <button
                type="submit"
                title="Delete tag"
                className="text-xs px-1 rounded ring-1 ring-white/10 hover:bg-white/10"
              >
                ×
              </button>
            </form>
          </div>
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
