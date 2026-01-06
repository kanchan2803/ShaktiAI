import News from "../models/News.js";
import axios from "axios";

// GET all news
export const getAllNews = async (req, res) => {
    try {
        const news = await News.find().sort({ published_at: -1 }); // Newest first
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: "Error fetching news", error });
    }
};

// POST new update
export const createNews = async (req, res) => {
    try {
        const { title, summary, content, category, source, source_url, image_url, published_at } = req.body;
        
        const newUpdate = await News.create({
            title, summary, content, category, source, source_url, image_url, 
            published_at: published_at || Date.now()
        });

        res.status(201).json({ message: "News created successfully", success: true, news: newUpdate });
    } catch (error) {
        res.status(500).json({ message: "Error creating news", error });
    }
};

// Proxy function to fetch from GNews
export const fetchExternalNews = async (req, res) => {
    try {
        const { category } = req.query;
        const GNEWS_API_KEY = process.env.VITE_GNEWS_API_KEY;

        const CATEGORY_QUERIES = {
            "Laws & Amendments": '"new bill" OR "amendment" OR "parliament" OR "law" IN India',
            "Court Rulings": '"Supreme Court" OR "High Court" OR "verdict" OR "judgment" IN India',
            "Women\'s Rights": '"women rights" OR "women safety" OR "domestic violence" IN India',
            "Cyber & Digital Safety": '"cyber crime" OR "online fraud" OR "digital safety" IN India',
            "Government Policies": '"government scheme" OR "policy" OR "ministry" IN India',
            "Awareness & Education": '"legal awareness" OR "education" OR "rights" IN India',
            "All": '"women safety" OR "Supreme Court" OR "new laws" OR "cyber crime" IN India'
        };

        const query = CATEGORY_QUERIES[category] || CATEGORY_QUERIES["All"];
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=in&sortby=publishedAt&apikey=${GNEWS_API_KEY}`;

        const response = await axios.get(url);
        const data = response.data;

        if (data.articles) {
            const transformedArticles = data.articles.map((article) => ({
                id: Buffer.from(article.url).toString('base64').substring(0, 12),
                title: article.title,
                summary: article.description,
                content: article.content,
                category: category === "All" ? "Legal Updates" : category,
                source: article.source.name,
                source_url: article.url,
                image_url: article.image,
                published_at: article.publishedAt
            }));
            return res.status(200).json(transformedArticles);
        }
        
        return res.status(200).json([]);

    } catch (error) {
        console.error("Backend GNews Error:", error.message);
        res.status(500).json({ message: "Failed to fetch external news" });
    }
};