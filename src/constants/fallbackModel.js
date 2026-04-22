// this function will traverse thourgh available models and give resposnse if available 

import { GoogleGenerativeAI } from "@google/generative-ai";
import { prompt } from "./ReviewPrompt";

// Google Generative AI Setup
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEMINI_API_KEY)

const GEMINI3_FLASH_MODEL = genAI.getGenerativeModel({model: 'gemini-3-flash-preview'});
const GEMINI3_PRO_MODEL = genAI.getGenerativeModel({model: 'gemini-3-pro-preview'});
const GEMINI_FLASH_LATEST = genAI.getGenerativeModel({model: 'gemini-flash-latest'});

const modelArr = [GEMINI3_FLASH_MODEL, GEMINI3_PRO_MODEL, GEMINI_FLASH_LATEST]

export const fallBackModel = async (rawText, customPrompt = prompt) => {
  for (const elem of modelArr) {
    try {
      const result = await elem.generateContent(`${customPrompt} ${rawText}`);
      // If successful, return immediately
      return result;
    } catch (error) {
      // Handle rate limit or other errors (e.g., 429)
      if (error.status === 429 || error.message?.includes("429") || error.message?.includes("Too Many Requests")) {
        console.warn("Rate limited, trying next model");
        continue;
      }
      // Log other errors but continue to next model for better fallback
      console.error("Error with model, trying next:", error.message);
      continue;
    }
  }
  throw new Error("All models failed or rate limited");
};