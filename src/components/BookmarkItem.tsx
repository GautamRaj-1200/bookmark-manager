"use client";

import {
  deleteBookmark,
  updateBookmark,
  generateBookmarkSummary,
} from "@/app/bookmarks/actions";
import { useState } from "react";
import { useFormStatus } from "react-dom";

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="cursor-pointer text-xs px-2 py-1 rounded ring-1 ring-red-500/40 text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
      title="Delete bookmark"
    >
      {pending && (
        <div className="w-3 h-3 border border-red-300/30 border-t-red-300 rounded-full animate-spin"></div>
      )}
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}

function GenerateSummaryButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="cursor-pointer text-xs px-2 py-1 rounded bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
    >
      {pending && (
        <div className="w-3 h-3 border border-blue-300/30 border-t-blue-300 rounded-full animate-spin"></div>
      )}
      {pending ? "Generating..." : "Generate Summary"}
    </button>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="cursor-pointer text-xs px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
    >
      {pending && (
        <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
      )}
      {pending ? "Saving..." : "Save"}
    </button>
  );
}

interface Tag {
  id: string;
  name: string;
}

interface Bookmark {
  id: string;
  url: string;
  title: string;
  description: string | null;
  summary: string | null;
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
  const [isEditing, setIsEditing] = useState(false);

  return (
    <li className="p-4 rounded-lg ring-1 ring-white/10 bg-white/5 space-y-3">
      {/* Title and Actions */}
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-white mb-1">
            <a
              href={bookmark.url}
              target="_blank"
              className="hover:text-blue-400 transition-colors"
            >
              {bookmark.title}
            </a>
          </h3>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="cursor-pointer text-xs px-3 py-1 rounded ring-1 ring-white/10 hover:bg-white/10 transition-colors"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          <form action={deleteBookmark}>
            <input type="hidden" name="bookmarkId" value={bookmark.id} />
            <DeleteButton />
          </form>
        </div>
      </div>

      {/* AI Summary */}
      {bookmark.summary ? (
        <div className="text-sm text-zinc-200 bg-zinc-800/50 p-3 rounded">
          <span className="text-xs text-zinc-400 mr-2 font-medium">
            🤖 AI Summary:
          </span>
          {bookmark.summary}
        </div>
      ) : (
        <div className="text-sm text-zinc-400 bg-zinc-800/20 p-3 rounded border-dashed border border-zinc-600 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-500 mr-2">🤖</span>
            <em>No AI summary available</em>
          </div>
          <form action={generateBookmarkSummary} className="inline">
            <input type="hidden" name="bookmarkId" value={bookmark.id} />
            <GenerateSummaryButton />
          </form>
        </div>
      )}

      {/* Manual Description */}
      {bookmark.description && (
        <div className="text-sm text-zinc-300 bg-zinc-800/30 p-3 rounded">
          <span className="text-xs text-zinc-400 mr-2 font-medium">
            📝 Description:
          </span>
          {bookmark.description}
        </div>
      )}

      {/* URL */}
      <div className="text-xs text-zinc-400 break-all">
        <span className="text-zinc-500 mr-2">🔗</span>
        {bookmark.url}
      </div>

      {/* Tags */}
      {bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {bookmark.tags.map((t) => (
            <a
              key={t.id}
              href={`/bookmarks?tag=${encodeURIComponent(t.name)}${
                searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""
              }`}
              className="cursor-pointer inline-flex items-center text-xs px-3 py-1.5 rounded-full bg-blue-500/10 ring-1 ring-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:ring-blue-500/50 transition-all duration-200"
            >
              <span className="mr-1">#</span>
              {t.name}
            </a>
          ))}
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <form
          action={updateBookmark}
          className="mt-4 space-y-3 p-4 bg-zinc-800/30 rounded"
        >
          <input type="hidden" name="bookmarkId" value={bookmark.id} />
          <div className="grid grid-cols-1 gap-3">
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
            <textarea
              name="description"
              placeholder="Manual description (optional)"
              defaultValue={bookmark.description || ""}
              rows={3}
              className="bg-transparent rounded px-3 py-2 ring-1 ring-white/10 focus:outline-none focus:ring-blue-500/50 resize-none"
            />
            <input
              name="tags"
              type="text"
              defaultValue={bookmark.tags.map((t) => t.name).join(", ")}
              className="bg-transparent rounded px-3 py-2 ring-1 ring-white/10 focus:outline-none focus:ring-blue-500/50"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs px-3 py-1 rounded ring-1 ring-white/10 hover:bg-white/10"
            >
              Cancel
            </button>
            <SaveButton />
          </div>
        </form>
      )}
    </li>
  );
}
