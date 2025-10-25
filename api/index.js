require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');

// NOTE: You must ensure 'user' and 'post' models are correctly defined in './model/user' and './model/post'
const User = require('./model/user');
const Post = require('./model/post');

const app = express();
// Using '/tmp' is necessary for serverless environments like Vercel
const uploadMiddleware = multer({ dest: '/tmp' }); 
const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;
const CORS_ORIGIN = process.env.FRONTEND_URL;

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ CORS setup
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

app.use(express.json());
app.use(cookieParser());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.get('/', (req, res) => res.send('Backend is running!'));

// ---------------- REGISTER ----------------
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const UserDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt)
    });
    res.json(UserDoc);
  } catch (e) {
    // Return a 400 for client-side errors like duplicate username
    res.status(400).json(e);
  }
});

// ---------------- LOGIN ----------------
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) return res.status(400).json("wrong credentials");

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) throw err;
        res.cookie("token", token, {
          secure: true,
          httpOnly: true,
          sameSite: 'none',
          maxAge: 1000 * 60 * 60 * 24 * 7
        }).json({
          id: userDoc._id,
          username
        });
      });
    } else {
      res.status(400).json("wrong credentials");
    }
  } catch (e) {
    console.error("❌ Login failed:", e);
    res.status(500).json({ message: "Server error during login." });
  }
});

// ---------------- PROFILE ----------------
app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, secret, {}, (err, userData) => {
    if (err) return res.status(401).json({ message: 'Invalid or expired token' });
    res.json(userData);
  });
});

// ---------------- LOGOUT ----------------
app.post('/logout', (req, res) => {
  res.cookie('token', '', {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 0 // Expire the cookie immediately
  }).json('ok');
});

// ---------------- CREATE POST ----------------
app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  try {
    let coverUrl = null;

    if (req.file) {
      // 1. Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_posts",
        use_filename: true,
        unique_filename: true
      });
      coverUrl = result.secure_url;
      console.log("✅ Uploaded to Cloudinary:", coverUrl);
      
      // 2. Clean up temporary file
      fs.unlinkSync(req.file.path);
    }

    const { token } = req.cookies;
    if (!token) return res.status(401).json("No token");

    // 3. Verify token and create post
    jwt.verify(token, secret, {}, async (err, userData) => {
      if (err) return res.status(401).json("Invalid token");

      const { title, summary, content } = req.body;
      const PostDoc = await Post.create({
        title,
        summary,
        content,
        cover: coverUrl, // This is the public URL your frontend needs
        author: userData.id
      });

      console.log("📝 New post created:", PostDoc);
      res.json(PostDoc);
    });
  } catch (err) {
    console.error("❌ CREATE POST failed:", err);
    // Crucial: Respond with JSON on error
    res.status(500).json({ message: "Post creation failed due to a server error." }); 
  }
});

// ---------------- UPDATE POST ----------------
app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  try {
    let coverUrl = null;

    if (req.file) {
      // 1. Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_posts",
        use_filename: true,
        unique_filename: true
      });
      coverUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const { token } = req.cookies;
    if (!token) return res.status(401).json("No token");

    // 2. Verify token and update post
    jwt.verify(token, secret, {}, async (err, userData) => {
      if (err) return res.status(401).json("Invalid token");

      const { id, title, summary, content } = req.body;
      if (!id) return res.status(400).json("Post ID is missing");

      const PostDoc = await Post.findById(id);
      if (!PostDoc) return res.status(404).json("Post not found");

      // Check if the user is the author
      const isAuthor = PostDoc.author.equals(userData.id);
      if (!isAuthor) return res.status(403).json("You are not the author");

      await PostDoc.set({
        title,
        summary,
        content,
        // Use the new URL if available, otherwise keep the old one
        cover: coverUrl ? coverUrl : PostDoc.cover 
      });

      await PostDoc.save();
      res.json(PostDoc);
    });
  } catch (err) {
    console.error("❌ UPDATE POST failed:", err);
    res.status(500).json({ message: "Post update failed due to a server error." });
  }
});

// ---------------- GET POSTS (FIXED) ----------------
app.get('/post', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (err) {
    // 💥 THIS IS THE CRUCIAL FIX: Handle Mongoose/DB error and return JSON.
    console.error("❌ Error fetching posts:", err);
    res.status(500).json({ message: "Failed to fetch posts from the database." });
  }
});

// ---------------- GET SINGLE POST (FIXED) ----------------
app.get('/post/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    if (!postDoc) return res.status(404).json({ message: "Post not found" });
    res.json(postDoc);
  } catch (err) {
    console.error("❌ Error fetching single post:", err);
    res.status(500).json({ message: "Failed to fetch post." });
  }
});

app.listen(process.env.PORT || 4000, () => {
  console.log("🚀 Server running on port", process.env.PORT || 4000);
});