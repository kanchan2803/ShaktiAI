import News from "../models/News.js";

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