import BookmarkItem from "./BookmarkItem";

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

interface BookmarkListProps {
  bookmarks: Bookmark[];
  searchQuery: string;
  activeTag: string;
}

export default function BookmarkList({
  bookmarks,
  searchQuery,
  activeTag,
}: BookmarkListProps) {
  return (
    <ul className="space-y-3">
      {bookmarks.map((bookmark) => (
        <BookmarkItem
          key={bookmark.id}
          bookmark={bookmark}
          searchQuery={searchQuery}
        />
      ))}
      {bookmarks.length === 0 && (
        <li className="text-sm text-zinc-400">
          {searchQuery || activeTag
            ? "No bookmarks match your filters."
            : "No bookmarks found."}
        </li>
      )}
    </ul>
  );
}
