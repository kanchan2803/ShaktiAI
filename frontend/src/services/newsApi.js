import API from "./axiosConfig";

const GNEWS_API_KEY=import.meta.env.VITE_GNEWS_API_KEY;

const CATEGORY_QUERIES = {
  "Laws & Amendments": '"new bill" OR "amendment" OR "parliament" OR "law" IN India',
  "Court Rulings": '"Supreme Court" OR "High Court" OR "verdict" OR "judgment" IN India',
  "Women's Rights": '"women rights" OR "women safety" OR "domestic violence" IN India',
  "Cyber & Digital Safety": '"cyber crime" OR "online fraud" OR "digital safety" IN India',
  "Government Policies": '"government scheme" OR "policy" OR "ministry" IN India',
  "Awareness & Education": '"legal awareness" OR "education" OR "rights" IN India',
  "All": '"women safety" OR "Supreme Court" OR "new laws" OR "cyber crime" IN India'
};

export const fetchRealNews = async (category = "All") => {
    try {
        // 1. Determine the query based on the selected category
        // If the category isn't in our map, default to the "All" query
        const query = CATEGORY_QUERIES[category] || CATEGORY_QUERIES["All"];
        
        // 2. Construct the URL (Using 'search' endpoint for specific legal/safety topics)
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=in&sortby=publishedAt&apikey=${GNEWS_API_KEY}`;

        // 3. Fetch Data
        const res = await fetch(url);
        const data = await res.json();

        if (data.articles) {
            // 4. Transform GNews format to Shakti App format
            return data.articles.map((article, index) => ({
                id: btoa(article.url).substring(0, 12),
                title: article.title,
                summary: article.description,
                content: article.content,
                category: category === "All" ? "Legal Updates" : category, // Assign current category
                source: article.source.name,
                source_url: article.url,
                image_url: article.image,
                published_at: article.publishedAt
            }));
        }
        return [];
    } catch (error) {
        console.error("GNews Fetch Error:", error);
        return [];
    }
};

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