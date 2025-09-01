import { addBookmark } from "@/app/bookmarks/actions";

export default function AddBookmarkForm() {
  return (
    <form
      action={addBookmark}
      className="space-y-3 p-4 rounded-lg ring-1 ring-white/10 bg-white/5"
    >
      <div className="grid grid-cols-1 gap-3">
        <input
          name="url"
          type="url"
          required
          placeholder="https://example.com"
          className="bg-transparent rounded px-3 py-2 ring-1 ring-white/10 focus:outline-none focus:ring-blue-500/50"
        />
        <input
          name="title"
          type="text"
          required
          placeholder="Title"
          className="bg-transparent rounded px-3 py-2 ring-1 ring-white/10 focus:outline-none focus:ring-blue-500/50"
        />
        <input
          name="description"
          type="text"
          placeholder="Description (optional)"
          className="bg-transparent rounded px-3 py-2 ring-1 ring-white/10 focus:outline-none focus:ring-blue-500/50"
        />
        <input
          name="tags"
          type="text"
          placeholder="Tags (comma separated)"
          className="bg-transparent rounded px-3 py-2 ring-1 ring-white/10 focus:outline-none focus:ring-blue-500/50"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="cursor-pointer rounded px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white"
        >
          Add Bookmark
        </button>
      </div>
    </form>
  );
} 