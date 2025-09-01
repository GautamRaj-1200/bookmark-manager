import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function generateSummary(
  content: string,
  title: string
): Promise<string> {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.warn("Google API key not found, skipping AI summary");
      return "";
    }

    const prompt = `Summarize this webpage content in 1-2 sentences. Focus on the main topic and key information.
Title: ${title}
Content: ${content.substring(0, 1500)}

Provide a concise, informative summary:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const summary = response.text || "";
    console.log("Generated AI summary:", summary);
    return summary;
  } catch (error) {
    console.error("Error generating AI summary:", error);
    return ""; // Return empty string on error, don't fail the bookmark creation
  }
}
