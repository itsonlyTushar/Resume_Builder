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

    // Primary model followed by fallbacks. Pinned versions get retired (404) over time,
    // so the "-latest" alias is kept in the chain as a safety net.
    const modelNames = [
      "gemini-3.5-flash",
      "gemini-3.5-flash-lite",
      "gemini-flash-lite-latest",
      "gemini-3.1-flash-lite",
      "gemini-2.5-flash"
    ];

    const promptText = customPrompt ? `${customPrompt} ${rawText}` : rawText;

    // Stay under the 30s maxDuration in vercel.json so a slow model can't turn into a 504
    const deadline = Date.now() + 27000;
    const perModelTimeout = 18000;

    let lastError = null;
    for (const modelName of modelNames) {
      const remaining = deadline - Date.now();
      if (remaining < 4000) break;
      try {
        const model = genAI.getGenerativeModel(
          { model: modelName },
          { timeout: Math.min(perModelTimeout, remaining) }
        );
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
