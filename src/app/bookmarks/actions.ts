"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { fetchWebpageContent } from "@/lib/webpage-utils";
import { generateSummary } from "@/lib/ai-summary";

export async function addBookmark(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const userId = session.user.id;
  const url = String(formData.get("url") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const tagsInput = String(formData.get("tags") || "");

  if (!url) return; // Only URL is required

  const tagNames = Array.from(
    new Set(
      tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    )
  );

  // Fetch webpage content and generate AI summary
  let webpageTitle = title;
  let aiSummary = "";

  try {
    const metadata = await fetchWebpageContent(url);
    // Use fetched title if user didn't provide one, otherwise use user's title
    webpageTitle = title || metadata.title || "Untitled";

    // Generate AI summary from the content
    aiSummary = await generateSummary(metadata.content, metadata.title);
  } catch (error) {
    console.error("Error fetching webpage or generating summary:", error);
    // Continue with bookmark creation even if fetching/summarization fails
    webpageTitle = title || "Untitled";
  }

  const savedBookmark = await prisma.bookmark.create({
    data: {
      userId,
      url,
      title: webpageTitle,
      description: description || null,
      summary: aiSummary || null,
      ...(tagNames.length > 0
        ? {
            tags: {
              connectOrCreate: tagNames.map((name) => ({
                where: { userId_name: { userId, name } },
                create: { userId, name },
              })),
            },
          }
        : {}),
    },
  });

  revalidatePath("/bookmarks");
}

export async function deleteBookmark(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const userId = session.user.id;
  const bookmarkId = String(formData.get("bookmarkId") || "");
  if (!bookmarkId) return;

  // Delete the bookmark
  await prisma.bookmark.deleteMany({ where: { id: bookmarkId, userId } });

  // Clean up orphaned tags (tags that no longer have any bookmarks)
  await prisma.tag.deleteMany({
    where: {
      userId,
      bookmarks: {
        none: {}, // Tags that have no bookmarks
      },
    },
  });

  revalidatePath("/bookmarks");
}

export async function updateBookmark(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const userId = session.user.id;
  const bookmarkId = String(formData.get("bookmarkId") || "");
  const url = String(formData.get("url") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const tagsInput = String(formData.get("tags") || "");

  if (!bookmarkId || !url) return; // Only bookmarkId and URL are required

  const tagNames = Array.from(
    new Set(
      tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    )
  );

  // Ensure tags exist
  const ensured = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { userId_name: { userId, name } },
        update: {},
        create: { userId, name },
      })
    )
  );

  // Fetch webpage content and generate AI summary if URL changed
  let aiSummary = "";
  try {
    const existingBookmark = await prisma.bookmark.findFirst({
      where: { id: bookmarkId, userId },
    });

    // Regenerate summary if URL changed or if no summary exists
    if (!existingBookmark?.summary || existingBookmark.url !== url) {
      const metadata = await fetchWebpageContent(url);
      aiSummary = await generateSummary(
        metadata.content,
        metadata.title || title
      );
    } else {
      aiSummary = existingBookmark.summary;
    }
  } catch (error) {
    console.error("Error generating summary:", error);
    // Keep existing summary if fetch fails
    const existingBookmark = await prisma.bookmark.findFirst({
      where: { id: bookmarkId, userId },
    });
    aiSummary = existingBookmark?.summary || "";
  }

  await prisma.bookmark.updateMany({
    where: { id: bookmarkId, userId },
    data: {
      url,
      title: title || "Untitled",
      description: description || null,
      summary: aiSummary || null,
    },
  });

  // Replace tag relations
  await prisma.bookmark.update({
    where: { id: bookmarkId },
    data: {
      tags: {
        set: ensured.map((t) => ({ id: t.id })),
      },
    },
  });

  // Clean up orphaned tags (tags that no longer have any bookmarks)
  await prisma.tag.deleteMany({
    where: {
      userId,
      bookmarks: {
        none: {}, // Tags that have no bookmarks
      },
    },
  });

  revalidatePath("/bookmarks");
}

export async function generateBookmarkSummary(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const userId = session.user.id;
  const bookmarkId = String(formData.get("bookmarkId") || "");
  if (!bookmarkId) return;

  const bookmark = await prisma.bookmark.findFirst({
    where: { id: bookmarkId, userId },
  });

  if (!bookmark) return;

  try {
    const metadata = await fetchWebpageContent(bookmark.url);
    const aiSummary = await generateSummary(
      metadata.content,
      metadata.title || bookmark.title
    );

    await prisma.bookmark.updateMany({
      where: { id: bookmarkId, userId },
      data: { summary: aiSummary },
    });
  } catch (error) {
    console.error("Error generating summary:", error);
  }

  revalidatePath("/bookmarks");
}
