const express = require('express');
const { register, login, adminLogin ,getUserCount,getAllUsers,getUserProfile,updateUserProfile,toggleUserStatus} = require('../controller/user_controller');
const {createPost, getAllPosts,getPostById,addComment,getPostCount,getUserPosts,deletePost,updatePost,getPosts} = require('../controller/post_controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/adminLogin', adminLogin);
router.post('/create',createPost);
router.get("/postss", getAllPosts);
router.get("/posts/:id", getPostById);
router.post("/posts/:id/comment", addComment);

router.get('/userCount', getUserCount);
router.get('/postCount', getPostCount);
router.get('/users', getAllUsers);
router.get('/userPosts',getUserPosts);
router.put('/posts/:id', updatePost);
router.get('/users/:id', getUserProfile);
router.delete("/posts/:id", deletePost);
// Update user profile with optional image
router.put('/users/:id', updateUserProfile);
router.get('/posts', getPosts);
router.patch('/users/:id/toggle', toggleUserStatus);
module.exports = router;
