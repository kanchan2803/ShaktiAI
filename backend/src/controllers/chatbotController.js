import Chat from "../models/Chat.js";
import { getChatbotResponse } from "../utils/langchainClient.js";

export const chatWithBot = async (req,res) => {
    try {
        const { message, chatId } = req.body;
        const userId = req.user._id;
        console.log("user messgae:",message);

        if(!message){
            return res.status(400).json({ error: "Message is required" });
        }

        let chat;
        if(chatId){
            chat = await Chat.findById(chatId);
            if (chat && chat.user.toString() !== userId) {
                 return res.status(403).json({ error: "Forbidden: Access to chat denied" });
            }
        }

        if(!chat){
            chat = new Chat({ user: userId, messages: [] });
        }
        
        const history = chat.messages.map( msg => ({
            role : msg.role,
            content: msg.content
        }));

        chat.messages.push({ role: 'user', content: message });

        const reply = await getChatbotResponse(message,history);

        chat.messages.push({ role: 'model', content: reply });
        await chat.save();

        res.json({ reply, chatId: chat._id });
        console.log("Reply:", reply);    
    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getUserChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({ user: userId })
                                .sort({ createdAt: -1 });
        res.json(chats);
    } catch (error) {
        console.error("Error fetching user chats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getChatById = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user._id;

        const chat = await Chat.findOne({ _id: chatId, user: userId });

        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        res.json(chat);
    } catch (error) {
        console.error("Error fetching chat by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};