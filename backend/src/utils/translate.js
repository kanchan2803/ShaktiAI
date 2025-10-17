// backend/utils/translate.js
import dotenv from "dotenv";
import axios from "axios"; // or axios
import { InferenceClient } from "@huggingface/inference";

dotenv.config();

const HF_API_KEY = process.env.HF_API_KEY;
if (!HF_API_KEY) {
  throw new Error("Set HF_API_KEY in your .env");
}

// Initialize the client once and reuse it.
const client = new InferenceClient({ apiKey: HF_API_KEY });

export const SUPPORTED_LANGS = {
  hi: "hi", bn: "bn", ta: "ta", te: "te", mr: "mr",
  gu: "gu", kn: "kn", ml: "ml", or: "or", pa: "pa",
  ur: "ur", en: "en"
};

async function callModel(model, inputs, options = {}) {
  const maxRetries = options.retries ?? 3;
  const timeoutMs = options.timeoutMs ?? 25_000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);

      // The InferenceClient exposes model-specific call helpers:
      const res = await client.post(`/models/${model}`, {
        inputs,
        parameters: options.parameters ?? {},
      });

      clearTimeout(id);
      return res;
    } catch (err) {
      if (attempt === maxRetries) throw err;
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
}

/**
 * Translate from Indic -> English
 * model: ai4bharat/indictrans2-indic-en
 * src_lang: e.g. "hi", tgt_lang: "en"
**/
export async function translateIndicToEnglish(text, srcLang = "hi") {
  const model = "ai4bharat/indictrans2-indic-en";
  try {
    const payload = {
      inputs: text,
      parameters: { src_lang: srcLang, tgt_lang: "en" },
    };
    const res = await callModel(model, text, { parameters: payload.parameters });
    // response formats vary: check keys
    if (res && res.translation_text) return res.translation_text;
    if (Array.isArray(res) && res[0]?.translation_text) return res[0].translation_text;
    if (res?.generated_text) return res.generated_text;
    // fallback: try string
    return (typeof res === "string") ? res : text;
  } catch (err) {
    console.error("translateIndicToEnglish error:", err?.message || err);
    return text; 
  }
}

/**
 * Translate English -> Indic
 * model: ai4bharat/indictrans2-en-indic
 */
export async function translateEnglishToIndic(text, tgtLang = "hi") {
  const model = "ai4bharat/indictrans2-en-indic";
  try {
    const payload = {
      inputs: text,
      parameters: { src_lang: "en", tgt_lang: tgtLang },
    };
    const res = await callModel(model, text, { parameters: payload.parameters });
    if (res && res.translation_text) return res.translation_text;
    if (Array.isArray(res) && res[0]?.translation_text) return res[0].translation_text;
    if (res?.generated_text) return res.generated_text;
    return (typeof res === "string") ? res : text;
  } catch (err) {
    console.error("translateEnglishToIndic error:", err?.message || err);
    return text;
  }
}

