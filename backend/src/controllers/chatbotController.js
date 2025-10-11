import { getChatbotResponse } from "../utils/langchainClient.js";

export const chatWithBot = async (req,res) => {
    try {
        const { message } = req.body;
        console.log("user messgae:",message);

        if(!message){
            return res.status(400).json({ error: "Message is required" });
        }

        const reply = await getChatbotResponse(message);
        res.json({ reply });
        console.log("Reply:", reply);
    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ error: "Internal server error" });

    }
}