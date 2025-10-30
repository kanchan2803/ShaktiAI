import API from "./axiosConfig";

export const sendMessageToBot = async (message, chatId) => {
    try {
        const res = await API.post('/chatbot', {message, chatId});
        console.log("user:",message);
        console.log("bot: ", res.data.reply);
        return res.data;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        return { 
            reply: "Oops! Something went wrong. Please try again.",
            chatId: chatId // Return the old chatId
        };
    }
}

export const fetchUserChats = async () => {
    try {
        const res = await API.get('/chatbot');
        return res.data;
    } catch (error) {
        console.error("API Error fetching chats:", error.response?.data || error.message);
        return [];
    }
}

export const fetchChatMessages = async (chatId) => {
    try {
        const res = await API.get(`/chatbot/${chatId}`);
        return res.data;
    } catch (error) {
        console.error("API Error fetching chat messages:", error.response?.data || error.message);
        return null;
    }
}