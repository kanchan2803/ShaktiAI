import { franc } from "franc-min";

// ISO 639-1 mapping for common Indian languages
const langMap = {
  hin: "hi",
  ben: "bn",
  tam: "ta",
  tel: "te",
  mar: "mr",
  guj: "gu",
  mal: "ml",
  pan: "pa",
  kan: "kn",
  ori: "or",
  urd: "ur",
  eng: "en",
};

export const detectLanguage = (text) => {
  try {
    const iso639_3 = franc(text); // e.g. "hin"
    const langCode = langMap[iso639_3] || "en"; // default English
    console.log("Detected language:", langCode);
    return langCode;
  } catch (err) {
    console.error("Language detection failed:", err);
    return "en";
  }
};
