# Bookmark Manager

Save links with tags, list them, and filter fast. Built with Next.js App Router, Auth.js (NextAuth), Prisma, and PostgreSQL. **Now with AI-powered automatic webpage summarization!**

<img width="1607" height="820" alt="image" src="https://github.com/user-attachments/assets/282cc308-e721-4f68-aa05-cd8cb4533e21" />

## Features

- Add bookmarks (URL, title, optional description)
- **🤖 AI-powered automatic webpage summarization** (using OpenAI)
- **📄 Auto-fetch webpage titles** from HTML metadata
- Tagging with many-to-many relation and per-user tag space
- List bookmarks for the signed-in user
- Filter by tag (query string `?tag=...`)
- Search bookmarks by title, description, URL, or AI summary
- Edit bookmark (URL/title/description/tags)
- Delete bookmark
- Delete tag (removes tag and relations for the current user)
- Google Sign-In via Auth.js

## Tech Stack

- Next.js 15 (App Router)
- Auth.js (NextAuth v5) with Prisma Adapter
- Prisma ORM (PostgreSQL)
- Tailwind CSS v4
- TypeScript
- **OpenAI API** for AI summarization

## Project Structure

```
src/
  app/
    api/auth/[...nextauth]/route.ts   # Auth.js route
    bookmarks/
      actions.ts                      # Server actions for add/edit/delete
      page.tsx                        # Bookmarks UI (list/filter/add/edit)
    profile/page.tsx                  # Profile UI
    unauthenticated/page.tsx          # Sign-in prompt + callback
    layout.tsx                        # App chrome, gradient bg, navbar
    page.tsx                          # Home (hero + CTAs)
  components/
    AddBookmarkForm.tsx               # Add bookmark form
    BookmarkItem.tsx                  # Individual bookmark display
    BookmarkList.tsx                  # Bookmark list container
    SearchAndFilter.tsx               # Search and tag filtering
    Navbar.tsx                        # Top nav with brand and links
  lib/
    prisma.ts                         # Prisma client singleton
    webpage-utils.ts                  # Webpage content fetching
    ai-summary.ts                     # OpenAI summarization
prisma/
  schema.prisma                       # Models (User, Account, Session, Bookmark, Tag)
  migrations/                         # Generated migrations
```

## Getting Started

### 1) Prerequisites

- Node.js 18+
- PostgreSQL 14+
- OpenAI API key (for AI summaries)

### 2) Install

```bash
npm install
```

### 3) Environment variables

Create `.env.local` at the project root:

```bash
# Postgres connection
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/bookmarks?schema=public"

# Auth.js Google provider
AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"

# Auth.js secret (any strong random string)
AUTH_SECRET="your-strong-random-secret"

# OpenAI API (for AI summaries)
OPENAI_API_KEY="your-openai-api-key"
```

### 4) Database migration

```bash
npx prisma migrate dev
```

This creates the tables for `User`, `Account`, `Session`, `Bookmark`, `Tag`, and the join table.

### 5) Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

- Sign in with Google from the navbar.
- Go to `/bookmarks` to add and manage bookmarks.
- **When you add a bookmark, it automatically:**
  - Fetches the webpage title from HTML
  - Extracts webpage content
  - Generates an AI summary using OpenAI
  - Stores everything in the database

### 6) Build

```bash
npm run build && npm start
```

## How it Works (no custom API routes needed)

- Mutations (add/edit/delete) use Next.js Server Actions defined in `src/app/bookmarks/actions.ts` with `"use server"` at the top of the module.
- Forms in `src/app/bookmarks/page.tsx` post directly to those actions via `action={serverAction}`.
- After each mutation, the UI is refreshed via `revalidatePath("/bookmarks")`.
- Data listing happens server-side in the page component using Prisma.
- **AI Summarization**: When adding a bookmark, the system fetches webpage content and uses OpenAI to generate a concise summary.

## Database Models (Prisma)

- `Bookmark`: `id`, `userId`, `url`, `title`, `description?`, `summary?` (AI-generated), `createdAt`, `tags[]`
- `Tag`: `id`, `userId`, `name` (unique per user), `createdAt`, `bookmarks[]`
- `User`, `Account`, `Session` from Auth.js adapter

## Routes

- `/` — Home (hero + CTAs)
- `/bookmarks` — Add/list/filter/edit/delete bookmarks and delete tags
- `/profile` — Profile card (name, email, avatar)
- `/unauthenticated` — Sign-in prompt with callback redirect

## Security

- All mutations re-check the session on the server using `auth()`.
- Bookmark/Tag operations are scoped by `userId`.

## License

MIT
