const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  postedAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ""
  },
  author: {
    type: String,
    default: "Anonymous"
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  comments: [commentSchema],
  isPublished: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Post', postSchema);
