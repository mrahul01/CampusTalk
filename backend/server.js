const express = require("express");
const cors = require("cors");
const connectDB = require("./database/db");
const routes = require("./routes/route"); // updated from controller to routes folder
require('dotenv').config();
const path = require("path");

const app = express();

// Use CORS middleware
const allowedOrigins = ["http://localhost:5173", "http://localhost:3002", "http://localhost:5174"];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE,PATCH",
  credentials: true,
}));

app.use(express.json());

// ✅ Serve static files from 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

// Routes
app.use("/", routes);
app.use("/posts",routes)

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
