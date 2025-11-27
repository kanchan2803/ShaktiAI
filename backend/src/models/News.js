import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String }, // HTML or rich text
    category: { type: String, default: "General" },
    source: { type: String },
    source_url: { type: String },
    image_url: { type: String },
    published_at: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Optional: track who added it
}, { timestamps: true });

export default mongoose.model("News", newsSchema);