const User = require("../model/user");
const Post = require("../model/post");

const getAdminSummary = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();

    res.json({ userCount, postCount });
  } catch (err) {
    console.error("Admin summary error:", err);
    res.status(500).json({ message: "Failed to load admin data" });
  }
};

const getAllAdminPosts = async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });
      res.json(posts);
    } catch (err) {
      console.error("Admin post fetch error:", err);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  };
  module.exports = {
    getAdminSummary,
    getAllAdminPosts
  };