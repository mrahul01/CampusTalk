const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

// Set up multer storage for user profile image
const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const uploadUserImage = multer({ storage: userStorage }).single("image");

// ======================== Register ========================
const register = async (req, res) => {
  try {
    const { name, userId, password, email, bio, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User ID or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      userId,
      email,
      password: hashedPassword,
      bio,
      role: role || "user",
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ======================== Login ========================
const login = async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;

    const user = await User.findOne({ userId: username });
    if (!user) return res.status(400).json({ message: "User not found" });
    

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    if (!user.isAllowed) return res.status(400).json({ message: "User Blocked" });
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ======================== Admin Login ========================
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await User.findOne({ userId: username, isAdmin: true });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: admin._id, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Admin login successful", token });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ======================== Get User Count ========================
const getUserCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ userCount });
  } catch (err) {
    console.error("User count error:", err);
    res.status(500).json({ message: "Failed to load admin data" });
  }
};

// ======================== Get All Users ========================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select("-password");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// ======================== Get User Profile ========================
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.id }).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// ======================== Update User Profile ========================
const updateUserProfile = (req, res) => {
  uploadUserImage(req, res, async function (err) {
    if (err) {
      console.error("Image Upload Error:", err);
      return res.status(500).json({ message: "Image upload failed", error: err.message });
    }

    try {
      const userId = req.params.id;
      const { name, bio, email, year, interest } = req.body;

      const updateFields = {
        name,
        bio,
        email,
        year,
        interest,
      };

      if (req.file) {
        updateFields.image = req.file.filename; // ✅ Save filename if image uploaded
      }

      const updatedUser = await User.findOneAndUpdate(
        { userId: userId }, // ✅ use userId not _id
        updateFields,
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
      console.error("Error updating user profile:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.id }); // switched from findById
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isAllowed = !user.isAllowed; // toggles true/false
    await user.save();

    res.status(200).json({ message: "User status updated", isAllowed: user.isAllowed });
  } catch (err) {
    console.error("Toggle user status error:", err); // helpful for debugging
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
  adminLogin,
  getUserCount,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  toggleUserStatus
};
