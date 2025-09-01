import React from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import SearchAndFilter from "@/components/SearchAndFilter";
import BookmarkList from "@/components/BookmarkList";

export default async function BookmarksPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; search?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(
      `/unauthenticated?callbackUrl=${encodeURIComponent("/bookmarks")}`
    );
  }

  const { tag, search } = await searchParams;
  const userId = session.user.id;
  const activeTag = (tag || "").trim();
  const searchQuery = (search || "").trim();

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
        ...(searchQuery
          ? {
              OR: [
                { title: { contains: searchQuery, mode: "insensitive" } },
                { description: { contains: searchQuery, mode: "insensitive" } },
                { url: { contains: searchQuery, mode: "insensitive" } },
              ],
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

      <AddBookmarkForm />

      <SearchAndFilter
        tags={tags}
        activeTag={activeTag}
        searchQuery={searchQuery}
      />

      <BookmarkList
        bookmarks={bookmarks}
        searchQuery={searchQuery}
        activeTag={activeTag}
      />
    </div>
  );
}
