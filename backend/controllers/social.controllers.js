import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

/**
 * Toggle Likes on a Blog
 */
export async function handleToggleLikeBlog(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Blog ID format" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const isLiked = blog.likes.includes(userId);
    if (isLiked) {
      // Unlike
      blog.likes = blog.likes.filter(uid => uid.toString() !== userId.toString());
    } else {
      // Like
      blog.likes.push(userId);
    }

    await blog.save();
    return res.status(200).json({
      message: isLiked ? "Blog unliked successfully" : "Blog liked successfully",
      likesCount: blog.likes.length,
      isLiked: !isLiked
    });
  } catch (err) {
    return res.status(500).json({ error: `${err}` });
  }
}

/**
 * Add Comment to a Blog
 */
export async function handleAddCommentBlog(req, res) {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Blog ID format" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const newComment = {
      user: userId,
      text: text.trim()
    };

    blog.comments.push(newComment);
    await blog.save();

    // Populate comments to send clean data back to the client
    const populatedBlog = await Blog.findById(id)
      .populate("comments.user", "fullName email role");

    return res.status(201).json({
      message: "Comment added successfully!",
      comments: populatedBlog.comments
    });
  } catch (err) {
    return res.status(500).json({ error: `${err}` });
  }
}

/**
 * Delete Comment from a Blog
 */
export async function handleDeleteCommentBlog(req, res) {
  try {
    const { id, commentId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid ID formats" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = blog.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Authorization: User must be comment creator, blog creator, or Admin
    const isCommentCreator = comment.user.toString() === userId.toString();
    const isBlogCreator = blog.createdby.toString() === userId.toString();
    const isAdmin = req.user.role === "Admin";

    if (!isCommentCreator && !isBlogCreator && !isAdmin) {
      return res.status(403).json({ message: "You are not authorized to delete this comment" });
    }

    // Pull/Remove comment
    blog.comments = blog.comments.filter(c => c._id.toString() !== commentId.toString());
    await blog.save();

    const populatedBlog = await Blog.findById(id)
      .populate("comments.user", "fullName email role");

    return res.status(200).json({
      message: "Comment deleted successfully",
      comments: populatedBlog.comments
    });
  } catch (err) {
    return res.status(500).json({ error: `${err}` });
  }
}

/**
 * Toggle Follow User
 */
export async function handleToggleFollowUser(req, res) {
  try {
    const { userId } = req.params; // blogger ID to follow
    const currentUserId = req.user._id; // reader ID

    if (userId.toString() === currentUserId.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    const targetUser = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(userId);

    if (isFollowing) {
      // Unfollow: pull from following of currentUser, pull from followers of targetUser
      currentUser.following = currentUser.following.filter(uid => uid.toString() !== userId.toString());
      targetUser.followers = targetUser.followers.filter(uid => uid.toString() !== currentUserId.toString());
    } else {
      // Follow: push into following of currentUser, push into followers of targetUser
      currentUser.following.push(userId);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    return res.status(200).json({
      message: isFollowing ? "Blogger unfollowed successfully" : "Blogger followed successfully",
      isFollowing: !isFollowing,
      followersCount: targetUser.followers.length
    });
  } catch (err) {
    return res.status(500).json({ error: `${err}` });
  }
}
