import React from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  addBookmark,
  deleteBookmark,
  updateBookmark,
  deleteTag,
} from "./actions";

export default async function BookmarksPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(
      `/unauthenticated?callbackUrl=${encodeURIComponent("/bookmarks")}`
    );
  }

  const { tag } = await searchParams;
  const userId = session.user.id;
  const activeTag = (tag || "").trim();

  const [tags, bookmarks] = await Promise.all([
    prisma.tag.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    }),
    prisma.bookmark.findMany({
      where: {
        userId,
        ...(activeTag
          ? {
              tags: {
                some: {
                  name: activeTag,
                  userId,
                },
              },
            }
          : {}),
      },
      include: { tags: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Your Bookmarks
        </h1>
        <p className="text-sm text-zinc-400">Add links and filter by tags.</p>
      </div>

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

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 items-center">
          <a
            href="/bookmarks"
            className={`px-2 py-1 rounded border ${
              !activeTag ? "bg-white/10 border-white/10" : "border-white/10"
            }`}
          >
            All
          </a>
          {tags.map((t) => (
            <div key={t.id} className="flex items-center gap-1">
              <a
                href={`/bookmarks?tag=${encodeURIComponent(t.name)}`}
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
        {activeTag && (
          <div className="text-sm text-zinc-400">
            Filtering by tag: {activeTag}
          </div>
        )}
      </div>

      <ul className="space-y-3">
        {bookmarks.map((b) => (
          <li
            key={b.id}
            className="p-4 rounded-lg ring-1 ring-white/10 bg-white/5 space-y-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <a
                  href={b.url}
                  target="_blank"
                  className="text-blue-400 underline break-all"
                >
                  {b.title}
                </a>
                <div className="text-xs text-zinc-400 break-all">{b.url}</div>
              </div>
              <div className="flex items-center gap-2">
                <form action={deleteBookmark}>
                  <input type="hidden" name="bookmarkId" value={b.id} />
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
            {b.description && (
              <div className="text-sm text-zinc-200">{b.description}</div>
            )}
            {b.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {b.tags.map((t) => (
                  <a
                    key={t.id}
                    href={`/bookmarks?tag=${encodeURIComponent(t.name)}`}
                    className="text-xs px-2 py-0.5 rounded ring-1 ring-white/10 hover:bg-white/10"
                  >
                    {t.name}
                  </a>
                ))}
              </div>
            )}

            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-zinc-300">
                Edit
              </summary>
              <form action={updateBookmark} className="mt-2 space-y-2">
                <input type="hidden" name="bookmarkId" value={b.id} />
                <div className="grid grid-cols-1 gap-2">
                  <input
                    name="url"
                    type="url"
                    required
                    defaultValue={b.url}
                    className="bg-transparent rounded px-3 py-2 ring-1 ring-white/10 focus:outline-none focus:ring-blue-500/50"
                  />
                  <input
                    name="title"
                    type="text"
                    required
                    defaultValue={b.title}
                    className="bg-transparent rounded px-3 py-2 ring-1 ring-white/10 focus:outline-none focus:ring-blue-500/50"
                  />
                  <input
                    name="description"
                    type="text"
                    defaultValue={b.description || ""}
                    className="bg-transparent rounded px-3 py-2 ring-1 ring-white/10 focus:outline-none focus:ring-blue-500/50"
                  />
                  <input
                    name="tags"
                    type="text"
                    defaultValue={b.tags.map((t) => t.name).join(", ")}
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
        ))}
        {bookmarks.length === 0 && (
          <li className="text-sm text-zinc-400">No bookmarks found.</li>
        )}
      </ul>
    </div>
  );
}
