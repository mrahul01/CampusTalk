const multer = require("multer");
const path = require("path");
const Blog = require("../model/post");
//const Post = require("../models/Post");

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage }).single("image");

// Blog post creation controller
const createPost = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error("Multer Error:", err);
      return res.status(500).json({ message: "Image upload failed", details: err.message });
    }

    try {
      const { title, body,author, tags } = req.body;
      console.log("Received Blog Post Data:", req.body);

      if (!title || !body || !tags || !author) {
        return res.status(400).json({ message: "Title, body, and tags are required" });
      }

      const tagArray = tags.split(",").map(tag => tag.trim());
      const imagePath = req.file ? req.file.path : null;

      const newPost = new Blog({
        title,
        body,
        author,
        tags: tagArray,
        image: imagePath,
      });

      await newPost.save();
      res.status(201).json({ message: "Blog post created successfully", post: newPost });
    } catch (err) {
      console.error("Blog Post Creation Error:", err);
      res.status(500).json({ message: "Internal server error", details: err.message });
    }
  });
};

// Fetch all blog posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Blog.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching blog posts:", err);
    res.status(500).json({ message: "Failed to retrieve blog posts" });
  }
};

// Get single post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch post", error: err.message });
  }
};

// Add comment to a post
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { author, body } = req.body;

    if (!author || !body) {
      return res.status(400).json({ message: "Author and body are required" });
    }

    const post = await Blog.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({ author, body });
    await post.save();

    res.status(201).json({ message: "Comment added", post });
  } catch (err) {
    console.error("Error adding comment:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getPostCount = async (req, res) => {
  try {
    const postCount = await Blog.countDocuments();  // ✅ Use Blog here
    res.json({ postCount });
  } catch (err) {
    console.error("Admin summary error:", err);
    res.status(500).json({ message: "Failed to load admin data" });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { author } = req.query; // ?author=username
    let posts;

    if (author) {
      posts = await Blog.find({ author }).sort({ createdAt: -1 });
    } else {
      posts = await Blog.find().sort({ createdAt: -1 });
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a blog post
const deletePost = async (req, res) => {
  try {
    const deletedPost = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a blog post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedFields = {
      title: req.body.title,
      body: req.body.body,
      tags: req.body.tags.split(',').map(tag => tag.trim()),
      isPublished: req.body.isPublished,
    };

    const updatedPost = await Blog.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post updated", post: updatedPost });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /posts with optional search
const getPosts = async (req, res) => {
  try {
    const searchQuery = req.query.search;
    let posts;
    if (searchQuery) {
      const regex = new RegExp(searchQuery, 'i'); // case-insensitive search
      posts = await Blog.find({
        $or: [
          { title: regex },
          { body: regex },
          { author: regex },
          { tags: { $in: [regex] } }
        ]
      });
    } else {
      posts = await Blog.find(); // return all posts if no search
    }

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getPostCount,
  getUserPosts,
  createPost,
  getAllPosts,
  getPostById,
  getPosts,
  addComment,
  deletePost,
  updatePost
};

