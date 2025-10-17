import API from "./axiosConfig";

export const sendMessageToBot = async (message) => {
    try {
        const res = await API.post('/chatbot', {message});
        console.log("user:",message);
        console.log("bot: ", res.data.reply);
        return res.data.reply;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        return "Oops! Something went wrong. Please try again.";
    }
}