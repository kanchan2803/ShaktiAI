import API from "./axiosConfig";

export const fetchAllNews = async () => {
    try {
        const res = await API.get('/news');
        return res.data;
    } catch (error) {
        console.error("Fetch News Error:", error);
        return [];
    }
};

export const addNewsUpdate = async (newsData) => {
    try {
        const res = await API.post('/news', newsData);
        return res.data;
    } catch (error) {
        console.error("Add News Error:", error);
        throw error;
    }
};