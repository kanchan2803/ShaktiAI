import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Initialize MongoDB Client (Reusing your env vars)
const client = new MongoClient(process.env.MONGO_DB_URI || "");
const collection = client
  .db(process.env.MONGODB_ATLAS_DB_NAME || "shakti_db")
  .collection(process.env.MONGODB_ATLAS_COLLECTION_NAME || "legal_docs");

// 2. Setup Embeddings
const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HF_RAG_KEY,
  model: "sentence-transformers/all-MiniLM-L6-v2", 
});

// 3. Export Vector Store Instance
export const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
  collection: collection,
  indexName: "vector_index", // Ensure you created this in Atlas UI!
  textKey: "text",
  embeddingKey: "embedding",
});

// 4. Function to Seed Database (Run on startup)
export const initializeKnowledgeBase = async () => {
  try {
    await client.connect();
    console.log("✅ RAG: Connected to MongoDB Atlas");

    const count = await collection.countDocuments();
    if (count > 0) {
      console.log(`ℹ️  RAG: Knowledge base ready (${count} chunks).`);
      return;
    }

    console.log("🔄 RAG: Database empty. Ingesting PDFs...");
    const dataDir = path.join(__dirname, "..", "data");
    
    if (!fs.existsSync(dataDir)) return console.warn("⚠️ No 'data' folder found.");
    
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith(".pdf"));
    if (files.length === 0) return console.warn("⚠️ No PDFs found.");

    const allDocs = [];
    for (const file of files) {
      console.log(`📄 Loading: ${file}`);
      const loader = new PDFLoader(path.join(dataDir, file));
      const docs = await loader.load();
      allDocs.push(...docs);
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await splitter.splitDocuments(allDocs);

    console.log(`🚀 Uploading ${splitDocs.length} chunks to Atlas...`);
    await vectorStore.addDocuments(splitDocs);
    console.log("✅ RAG: Ingestion Complete!");

  } catch (error) {
    console.error("❌ RAG Init Error:", error);
  }
};

// 5. Export the Retriever for the Chatbot
export const getRetriever = () => {
  return vectorStore.asRetriever({
    k: 4, // Number of documents to retrieve
    searchType: "similarity",
  });
};