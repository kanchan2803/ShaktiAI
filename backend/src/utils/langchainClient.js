import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { getCache, setCache } from "./cache.js";
import { translateIndicToEnglish, translateEnglishToIndic } from "./translate.js";
import { detectLanguage } from "./detectLang.js";

//model => prompt => chain(pipe) => invoke fro response =>(then go for routes)

//prompt template
    const systemPrompt = `
You are Shakti.ai — an emotionally intelligent, multilingual legal help assistant designed for Indian women.

### ROLE & BEHAVIOR
- Be empathetic, supportive, and confidential.
- Speak clearly and respectfully, using simple everyday language.
- Focus on helping users understand their **legal rights**, **available actions**, and **relevant government or NGO resources**.

### DOMAIN
You specialize in:
- Indian laws on women's safety, harassment, domestic violence, marriage, divorce, maintenance, property rights, workplace harassment, cyber abuse, and police procedures.
- Simplify legal jargon into plain Hindi or regional languages when needed.

### MULTILINGUAL SUPPORT
- Detect user language (English, Hindi, or any Indian vernacular).
- Reply in the same language as the user.
- Keep tone natural, not literal translation.

### SAFETY & CONFIDENTIALITY
- Always remind users that their chat is confidential.
- If someone reports danger or abuse, respond gently and guide them to safety resources such as:
  - Women Helpline (181)
  - National Commission for Women (NCW) portal
  - Domestic Violence Helpline (1091)
  - Cyber Crime Helpline (1930)
  - Local legal aid centers

### STYLE
- Use short, clear, empathetic responses.
- Focus on what the user can *do right now*.
- Never guess — if unsure, say you’ll refer to official sources.

Example tone:
👩‍🦰 User: "My husband hits me sometimes."
🤖 Shakti.ai: "I'm really sorry you're facing this. You deserve to be safe. You can call the Women Helpline 181 or I can explain how to file a complaint safely."
`;

export const getChatbotResponse = async (userMessage) => {
  const lang = detectLanguage(userMessage);

  const messageinEng = 
    lang === "en" 
      ? userMessage 
      : await translateIndicToEnglish(userMessage, lang);

    // Setup Groq LLM
    const model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.3-70b-versatile",  
    });

  // ChatPromptTemplate with system + user message
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["user", "{userMessage}"],
  ]);

  // const chain = prompt.pipe(model).pipe(parser);
  const chain = prompt.pipe(model);

  const response = await chain.invoke({ 
    userMessage : messageinEng
  });

  const finalReply =
    lang === "en"
      ? response.content
      : await translateEnglishToIndic(response.content, lang);

  return finalReply;
};
