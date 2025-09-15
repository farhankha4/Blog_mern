const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
const cors = require('cors');
const User = require('./model/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');

const secret = "asdfghjkqwertyuizxcvbnm";
app.use(express.json())
app.use(cors({credentials:true,origin:'http://localhost:5173'}));
app.use(cookieParser());
const salt = bcrypt.genSaltSync(10)
mongoose.connect('mongodb+srv://blog:FHLAfajflajflafjfaf@cluster0.hc8k4ue.mongodb.net/')


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
      res.cookie("token", token).json("ok");
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

    
    
app.listen(4000);