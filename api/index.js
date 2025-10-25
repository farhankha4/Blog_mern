require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
const cors = require('cors');
const User = require('./model/user')
const Post = require('./model/post')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const multer  = require('multer')
const uploadMiddleware = multer({ dest: '/tmp' })
const fs = require('fs')
const CORS_ORIGIN = process.env.FRONTEND_URL;
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const corsOptions = {
    origin: CORS_ORIGIN, // ONLY allow the frontend URL set in Vercel
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};
app.use(cors(corsOptions));
const secret = process.env.JWT_SECRET;
app.use(express.json())
app.use(cookieParser());
const salt = bcrypt.genSaltSync(10)
// app.use('/uploads',express.static(__dirname + '/uploads'));

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));


app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.post('/register',async (req,res)=>{
    const {username,password}= req.body;
    try{
        const UserDoc = await User.create({
            username,
            password:bcrypt.hashSync(password,salt)});
            res.json(UserDoc);
        }
        catch(e){
            res.status(400).json(e)
        }
})
app.get('/profile', (req,res) => {
  const {token} = req.cookies;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  jwt.verify(token, secret, {}, (err,userData) => {
    if (err) {
      console.error('JWT Verification Error:', err);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    res.json(userData);
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });

  // Prevent 500 crash if user not found
  if (!userDoc) {
    return res.status(400).json("wrong credentials");
  }

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
        id:userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("wrong credentials");
  }
});

app.post('/logout', (req, res) => {
    res.cookie('token','').json('ok');
});
//
app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  try {
    let coverUrl = null;

    if (req.file) {
      // req.file.path is the temp file
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_posts", // optional: organize in a folder
        use_filename: true,
        unique_filename: true,
      });
      coverUrl = result.secure_url;
      // remove temp file
      fs.unlinkSync(req.file.path);
    }

    const { token } = req.cookies;
    if (!token) return res.status(401).json("No token");

    jwt.verify(token, secret, {}, async (err, userData) => {
      if (err) return res.status(401).json("Invalid token");
      const { title, summary, content } = req.body;
      const PostDoc = await Post.create({
        title,
        summary,
        content,
        cover: coverUrl, // store full Cloudinary URL
        author: userData.id,
      });
      res.json(PostDoc);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Upload failed");
  }
});

// ---------------- PUT update post ----------------
app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  try {
    let coverUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_posts",
        use_filename: true,
        unique_filename: true,
      });
      coverUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const { token } = req.cookies;
    if (!token) return res.status(401).json("No token");

    jwt.verify(token, secret, {}, async (err, userData) => {
      if (err) return res.status(401).json("Invalid token");

      const { id, title, summary, content } = req.body;
      if (!id) return res.status(400).json("Post ID is missing");

      const PostDoc = await Post.findById(id);
      if (!PostDoc) return res.status(404).json("Post not found");

      const isAuthor = PostDoc.author.equals(userData.id);
      if (!isAuthor) return res.status(403).json("You are not the author");

      PostDoc.set({
        title,
        summary,
        content,
        cover: coverUrl ? coverUrl : PostDoc.cover,
      });

      await PostDoc.save();
      res.json(PostDoc);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Update failed");
  }
});
//

app.get('/post', async(req,res)=>{
  res.json(
    await Post.find()
      .populate('author',['username'])
      .sort({createdAt: -1})
      .limit(20)
  );
})
app.get('/post/:id' , async(req,res) =>{
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author',['username']);
  res.json(postDoc)
})
    
app.listen(process.env.PORT || 4000);