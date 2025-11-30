import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './src/config/db.js'
import authRoutes from './src/routes/authRouter.js'
import chatBotRoutes from './src/routes/chatbotRouter.js'
import newsRouter from './src/routes/newsRouter.js';
import { initializeKnowledgeBase } from './src/utils/ragSetup.js';

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000   

connectDB();

// 2. Initialize RAG (Vector Data) - Runs in background
initializeKnowledgeBase().then(() => {
  console.log("⚙️  RAG System Initialized");
}).catch(err => console.log("RAG Init Warning:", err.message));

initializeKnowledgeBase().then(() => {
    console.log("⚙️  RAG System Initialized");
});

const corsOptions = {
  origin: process.env.LOCAL_FRONTEND_URL,
  credentials: true
}
// Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies in requests

//routes
app.use("/auth", authRoutes);
app.use("/chatbot",chatBotRoutes);
app.use('/news', newsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});