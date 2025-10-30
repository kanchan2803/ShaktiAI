import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'model'],
        required: true
    },
    content: {
        type: String,
        required: true
    }
},{timestamps: true});

const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: { 
        type: String,
        default: 'New Chat'
    },
    messages: [messageSchema],
}, { timestamps: true });

export default mongoose.model("Chat", chatSchema);