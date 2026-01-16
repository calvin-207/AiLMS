import { GoogleGenAI } from "@google/genai";
import { Book } from "../types";

// Safety check for API key
const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is not set. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const askLibrarianAI = async (
  query: string,
  context: { books: Book[] }
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "I'm sorry, my brain (API Key) is missing. Please contact the administrator.";

  const bookContext = context.books.map(b => 
    `- "${b.title}" by ${b.author} (Cat: ${b.category}, Loc: ${b.location})`
  ).join("\n");

  const systemInstruction = `
    You are a helpful, knowledgeable Library Assistant for "LibraTech".
    
    Your goal is to help users find books, understand library rules, or discover new knowledge.
    
    Here is the current catalog of books available in the library:
    ${bookContext}
    
    If a user asks for a recommendation, use the catalog provided. 
    If the user asks about a book not in the catalog, you can mention general knowledge about it but specify we don't have it currently.
    Keep answers concise, professional, and friendly.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the library network right now. Please try again later.";
  }
};
