import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true });

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        default: "Software Engineering",
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    comments: [commentSchema]

}, {timestamps: true});

const Blog = mongoose.model("blogs", blogSchema);

export default Blog;