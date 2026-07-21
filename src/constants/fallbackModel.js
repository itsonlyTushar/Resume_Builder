import { prompt } from "./ReviewPrompt";

export const fallBackModel = async (rawText, customPrompt = prompt) => {
  const res = await fetch("/api/review-resume", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      rawText,
      customPrompt,
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || data.details || "AI service request failed");
  }

  return {
    response: {
      text: () => data.text,
    },
  };
};