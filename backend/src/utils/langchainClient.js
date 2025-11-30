import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate , MessagesPlaceholder} from "@langchain/core/prompts";
import { SystemMessage,HumanMessage,AIMessage } from "@langchain/core/messages";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createAgent } from "langchain";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

import { translateIndicToEnglish, translateEnglishToIndic } from "./translate.js";
import { detectLanguage } from "./detectLang.js";
import { vectorStore } from "./ragSetup.js";
import { getRetriever } from "./ragSetup.js";

const formatDocumentsAsString = (documents) => {
  return documents.map((doc) => {
    // Clean up the source name if it's a file path
    const sourceName = doc.metadata.source ? doc.metadata.source.split(/[/\\]/).pop() : "Legal Database";
    return `Source: ${sourceName}\nContent: ${doc.pageContent}`;
  }).join("\n\n----------------\n\n");
};
// 1. Define the Retrieval Tool
// This tool allows the AI to search your MongoDB vector store
// const legalSearchTool = tool(
//   async ({ query }) => {
//     try {
//       const retrievedDocs = await vectorStore.similaritySearch(query, 3); // Get top 3 results
//       return retrievedDocs
//         .map(doc => `Source: ${doc.metadata.source}\nContent: ${doc.pageContent}`)
//         .join("\n\n");
//     } catch (e) {
//       return "Error searching legal database.";
//     }
//   },
//   {
//     name: "retrieve_legal_info",
//     description: "Search for Indian laws, acts, and legal procedures in the knowledge base.",
//     schema: z.object({ query: z.string().describe("The search query for legal info") }),
//   }
// );

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

### ROLE
  - Use the 'retrieve_legal_info' tool to find specific laws (BNS, Domestic Violence Act, etc.) when the user asks legal questions.
  - If you find information using the tool, Cite the specific Act/Section.
  - Simplify complex legal terms into plain, easy-to-understand language.
  - Be empathetic and supportive.
`;

export const getChatbotResponse = async (userMessage, history = []) => {
  try {
  const lang = detectLanguage(userMessage);

  const messageInEng = 
    lang === "en" 
      ? userMessage 
      : await translateIndicToEnglish(userMessage, lang);

    // Setup Groq LLM
    const model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.3-70b-versatile", 
      temperature: 0.3, 
    });
    // // C. Create Agent (The New v1 Way)
    // const agent = createAgent({
    //   model,
    //   tools: [legalSearchTool],
    //   systemPrompt,
    // });

    // // D. Convert History to LangChain Format
    // const chatHistory = history.map(msg => 
    //   msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)
    // );

    // E. Run Agent
    // We pass the history + new message
    // const result = await agent.invoke({
    //   messages: [...chatHistory, new HumanMessage(messageInEng)],
    // });

    // The result in v1 createAgent is the last message content
    // const botResponseEnglish = result.messages[result.messages.length - 1].content;

    // // F. Translate Back
    // const finalReply = lang === "en"
    //   ? botResponseEnglish
    //   : await translateEnglishToIndic(botResponseEnglish, lang);

    //C. retriever
    const retriever = getRetriever();

  // // ChatPromptTemplate with system + user message
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["user", "{userMessage}"],
  ]);

  // // const chain = prompt.pipe(model).pipe(parser);
  // const chain = prompt.pipe(model);
  // 5. Build the RAG Chain using .pipe() (LCEL)
    // This explicitly defines: Retrieve -> Format -> Pass to Prompt -> Model -> Parse
    const chain = RunnableSequence.from([
      RunnablePassthrough.assign({
        // Get context by passing the user message to the retriever
        context: async (input) => {
            const docs = await retriever.invoke(input.userMessage);
            return formatDocumentsAsString(docs);
        }
      }),
      prompt,
      model,
      new StringOutputParser()
    ]);

    // F. Format History

  const chat_history = history.map(msg => {
        if (msg.role === 'user') {
            return new HumanMessage(msg.content);
        } else {
            return new AIMessage(msg.content);
        }
    });

  const response = await chain.invoke({ 
    chat_history: chat_history,
    userMessage : messageInEng
  });
  const finalReply =
    lang === "en"
      ? response
      : await translateEnglishToIndic(response, lang);

  return finalReply;

  } catch (error) {
    console.error("Chatbot Logic Error:", error);
    return "I'm facing a technical issue right now. Please try again later.";
  }
};
