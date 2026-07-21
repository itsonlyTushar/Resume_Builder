import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Only POST is supported." });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "Gemini API key is not configured on the server. Please add GEMINI_API_KEY to your Vercel Environment Variables."
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { rawText, customPrompt } = body;

    if (!rawText) {
      return res.status(400).json({ error: "Missing required parameter: rawText." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Primary fast models followed by fallbacks
    const modelNames = [
      "gemini-1.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-pro",
      "gemini-flash-latest"
    ];

    const promptText = customPrompt ? `${customPrompt} ${rawText}` : rawText;

    let lastError = null;
    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(promptText);
        const responseText = result.response.text();
        return res.status(200).json({ success: true, text: responseText, model: modelName });
      } catch (err) {
        lastError = err;
        console.warn(`Model ${modelName} failed on server:`, err.message);
        // Continue to next model on error
        continue;
      }
    }

    return res.status(500).json({
      error: "All Gemini models failed or rate-limited.",
      details: lastError?.message || "Unknown error"
    });
  } catch (error) {
    console.error("Serverless AI Handler Error:", error);
    return res.status(500).json({ error: error.message || "Internal server error." });
  }
}
