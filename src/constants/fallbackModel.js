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

  const contentType = res.headers.get("content-type");
  let data;

  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    const errorText = await res.text();
    throw new Error(
      `Server response error (${res.status}): ${errorText.slice(0, 150) || "Gateway Timeout or Network Error"}`
    );
  }

  if (!res.ok || !data.success) {
    throw new Error(data.error || data.details || "AI service request failed");
  }

  return {
    response: {
      text: () => data.text,
    },
  };
};