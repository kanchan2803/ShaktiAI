import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './src/config/db.js'
import authRoutes from './src/routes/authRouter.js'
import chatBotRoutes from './src/routes/chatbotRouter.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000   

connectDB();

// Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies in requests

//routes
app.use("/auth", authRoutes);
app.use("/chatbot",chatBotRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});