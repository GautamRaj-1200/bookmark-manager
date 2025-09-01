import { deleteBookmark, updateBookmark } from "@/app/bookmarks/actions";

interface Tag {
  id: string;
  name: string;
}

interface Bookmark {
  id: string;
  url: string;
  title: string;
  description: string | null;
  tags: Tag[];
}

interface BookmarkItemProps {
  bookmark: Bookmark;
  searchQuery: string;
}

export default function BookmarkItem({
  bookmark,
  searchQuery,
}: BookmarkItemProps) {
  return (
    <li className="p-4 rounded-lg ring-1 ring-white/10 bg-white/5 space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <a
            href={bookmark.url}
            target="_blank"
            className="text-blue-400 underline break-all"
          >
            {bookmark.title}
          </a>
          <div className="text-xs text-zinc-400 break-all">{bookmark.url}</div>
        </div>
        <div className="flex items-center gap-2">
          <form action={deleteBookmark}>
            <input type="hidden" name="bookmarkId" value={bookmark.id} />
            <button
              type="submit"
              className="text-xs px-2 py-0.5 rounded ring-1 ring-red-500/40 text-red-300 hover:bg-red-500/10"
              title="Delete bookmark"
            >
              Delete
            </button>
          </form>
        </div>
      </div>
      {bookmark.description && (
        <div className="text-sm text-zinc-200">{bookmark.description}</div>
      )}
      {bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {bookmark.tags.map((t) => (
            <a
              key={t.id}
              href={`/bookmarks?tag=${encodeURIComponent(t.name)}${
                searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""
              }`}
              className="text-xs px-2 py-0.5 rounded ring-1 ring-white/10 hover:bg-white/10"
            >
              {t.name}
            </a>
          ))}
        </div>
      )}

      <details className="mt-2">
        <summary className="cursor-pointer text-sm text-zinc-300">Edit</summary>
        <form action={updateBookmark} className="mt-2 space-y-2">
          <input type="hidden" name="bookmarkId" value={bookmark.id} />
          <div className="grid grid-cols-1 gap-2">
            <input
              name="url"
              type="url"
              required
              defaultValue={bookmark.url}
              className="bg-transparent rounded px-3 py-2 ring-1 ring-white/10 focus:outline-none focus:ring-blue-500/50"
            />
            <input
              name="title"
              type="text"
              required
              defaultValue={bookmark.title}
              className="bg-transparent rounded px-3 py-2 ring-1 ring-white/10 focus:outline-none focus:ring-blue-500/50"
            />
            <input
              name="description"
              type="text"
              defaultValue={bookmark.description || ""}
              className="bg-transparent rounded px-3 py-2 ring-1 ring-white/10 focus:outline-none focus:ring-blue-500/50"
            />
            <input
              name="tags"
              type="text"
              defaultValue={bookmark.tags.map((t) => t.name).join(", ")}
              className="bg-transparent rounded px-3 py-2 ring-1 ring-white/10 focus:outline-none focus:ring-blue-500/50"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="text-xs px-3 py-1 rounded ring-1 ring-white/10 hover:bg-white/10"
            >
              Save
            </button>
          </div>
        </form>
      </details>
    </li>
  );
}
