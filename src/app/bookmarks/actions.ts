"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addBookmark(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const userId = session.user.id;
  const url = String(formData.get("url") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const tagsInput = String(formData.get("tags") || "");

  if (!url || !title) return;

  const tagNames = Array.from(
    new Set(
      tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    )
  );

  await prisma.bookmark.create({
    data: {
      userId,
      url,
      title,
      description: description || null,
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

  await prisma.bookmark.deleteMany({ where: { id: bookmarkId, userId } });
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

  if (!bookmarkId || !url || !title) return;

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

  await prisma.bookmark.updateMany({
    where: { id: bookmarkId, userId },
    data: {
      url,
      title,
      description: description || null,
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

  revalidatePath("/bookmarks");
}

export async function deleteTag(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const userId = session.user.id;
  const tagId = String(formData.get("tagId") || "");
  if (!tagId) return;

  await prisma.tag.deleteMany({ where: { id: tagId, userId } });
  revalidatePath("/bookmarks");
}
