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

const secret = process.env.JWT_SECRET;
app.use(express.json())
app.use(cors({credentials:true,origin:process.env.FRONTEND_URL}));
app.use(cookieParser());
const salt = bcrypt.genSaltSync(10)
// app.use('/uploads',express.static(__dirname + '/uploads'));

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));



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
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id:userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("wrong credentials");
  }
});
app.get('/profile', (req, res) => {
    const { token } = req.cookies;   
    if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
    jwt.verify(token, secret, {},(err, userData) => {
    if (err) throw err;
    res.json(userData);
    });
});
app.post('/logout', (req, res) => {
    res.cookie('token','').json('ok');
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const ext = originalname.split(".").pop();
  const newPath = `/tmp/${path.split("/").pop()}.${ext}`;
  fs.renameSync(path, newPath);
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, userData) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const PostDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: userData.id,
    });
    res.json(PostDoc);
  });
});

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const ext = originalname.split(".").pop();
    newPath = `/tmp/${path.split("/").pop()}.${ext}`;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, userData) => {
    if (err) return res.status(401).json("Invalid token");

    const { id, title, summary, content } = req.body;

    if (!id) {
      return res.status(400).json("Post ID is missing");
    }
    const PostDoc = await Post.findById(id);

    if (!PostDoc) {
      return res.status(404).json("Post not found");
    }

    const isAuthor = PostDoc.author.equals(userData.id);

    if (!isAuthor) {
      return res.status(403).json("You are not the author");
    }
    PostDoc.set({
      title,
      summary,
      content,
      cover: newPath ? newPath : PostDoc.cover,
    });

    await PostDoc.save();

    res.json(PostDoc);
  });
});

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