import Blog from "../models/blog.model.js";
import mongoose from "mongoose";

export async function handleCreateNewBlog(req, res){
    try {
        const { title, description, content, image, category } = req.body;

        if (!title || !description || !content){
            return res.status(400).json({message: "Some Data is Missing"})
        }

        const defaultImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop";

        const newBlog = await Blog.create({
            title: title,
            description: description,
            content: content,
            category: category || "Software Engineering",
            createdby: req.user._id,
            image: image || defaultImage
        });

        // Populate details of the newly created blog
        const populatedBlog = await Blog.findById(newBlog._id).populate("createdby", "fullName email role");

        return res.status(201).json({message: "Blog created successfully!", blog: populatedBlog});     
    }
    catch(err) {
        return res.status(500).json({error: `${err}`})
    }
}

export async function handleGetAllBlogs(req, res){
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const query = {};
        
        // Category filtering (Software Engineering, AI, etc.)
        if (req.query.category && req.query.category !== 'All') {
            query.category = { $regex: new RegExp(`^${req.query.category}$`, 'i') };
        }

        // Keywords search matching title or description
        if (req.query.search && req.query.search.trim() !== '') {
            const searchRegex = new RegExp(req.query.search.trim(), 'i');
            query.$or = [
                { title: searchRegex },
                { description: searchRegex }
            ];
        }

        const totalBlogs = await Blog.countDocuments(query);
        const allBlogs = await Blog.find(query)
            .populate("createdby", "fullName email role")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalBlogs / limit);

        return res.status(200).json({
            message: "Blogs fetched successfully",
            blogs: allBlogs,
            pagination: {
                totalBlogs,
                totalPages,
                currentPage: page,
                limit
            }
        });
    } catch(err) {
        return res.status(500).json({error: `${err}`})
    }
}

export async function handleGetMyBlogs(req, res){
    try {
        const myBlogs = await Blog.find({ createdby: req.user._id })
            .populate("createdby", "fullName email role")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "My blogs fetched successfully",
            blogs: myBlogs
        });
    } catch(err) {
        return res.status(500).json({error: `${err}`})
    }
}

export async function handleGetSingleBlog(req, res){
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Blog ID format" });
        }

        const blog = await Blog.findById(id)
            .populate("createdby", "fullName email role following followers")
            .populate("comments.user", "fullName email role");

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        return res.status(200).json({
            message: "Blog fetched successfully",
            blog
        });
    } catch(err) {
        return res.status(500).json({error: `${err}`})
    }
}

export async function handleUpdateSingleBlog(req, res){
    try {
        const { id } = req.params;
        const { title, description, content, image, category } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Blog ID format" });
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Ownership Check
        if (blog.createdby.toString() !== req.user._id.toString() && req.user.role !== "Admin") {
            return res.status(403).json({ message: "You are not authorized to update this blog" });
        }

        const updateFields = {};
        if (title) updateFields.title = title;
        if (description) updateFields.description = description;
        if (content) updateFields.content = content;
        if (image) updateFields.image = image;
        if (category) updateFields.category = category;

        const updatedBlog = await Blog.findByIdAndUpdate(
             id,
             updateFields,
             { new: true, runValidators: true }
        ).populate("createdby", "fullName email role");

        return res.status(200).json({
            message: "Blog updated successfully",
            blog: updatedBlog
        });
    } catch(err) {
        return res.status(500).json({error: `${err}`})
    }
}

export async function handleDeleteSingleBlog(req, res){
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Blog ID format" });
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Ownership Check
        if (blog.createdby.toString() !== req.user._id.toString() && req.user.role !== "Admin") {
            return res.status(403).json({ message: "You are not authorized to delete this blog" });
        }

        await Blog.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Blog deleted successfully"
        });
    } catch(err) {
        return res.status(500).json({error: `${err}`})
    }
}