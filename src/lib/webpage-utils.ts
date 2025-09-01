export interface WebpageMetadata {
  title: string;
  description: string;
  content: string;
  url: string;
}

export async function fetchWebpageContent(
  url: string
): Promise<WebpageMetadata> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      next: { revalidate: 0 }, // Don't cache
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Simple regex-based extraction (more reliable than JSDOM in serverless)
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch?.[1]?.trim() || "Untitled";

    const descriptionMatch =
      html.match(
        /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
      ) ||
      html.match(
        /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i
      );
    const description = descriptionMatch?.[1]?.trim() || "";

    // Extract text content by removing HTML tags
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "") // Remove scripts
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "") // Remove styles
      .replace(/<[^>]+>/g, " ") // Remove HTML tags
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim()
      .substring(0, 2000); // Limit for AI processing

    return {
      title,
      description,
      content: textContent,
      url,
    };
  } catch (error) {
    console.error("Error fetching webpage:", error);
    throw new Error(
      `Failed to fetch webpage: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
