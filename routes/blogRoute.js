const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const requireAuth = require("../middlewares/requireAuth")
const User = require("../models/UserModel")
const Blog = require("../models/BlogModel")

router.get('/blogs', requireAuth,(req,res)=>{
    res.cookie("id", res.userId)
    Blog.find()
    .populate("postedBy")
    .populate("comments.postedBy")
    .populate("likes")
    .sort('-createdAt')
    .then(blogs=>{
        res.json({blogs})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/createblog', requireAuth, async (req, res) => {
    const { body } = req.body;
    console.log("here starting creating blog")
  
    if (!body) {
        console.log("Please Write Something..")
      return res.status(422).json({ error: "Please Write Something.." });
    }
    try {
      req.user.password = undefined;
      const blog = new Blog({
        body,
        postedBy: req.user,
      });
  
      blog.save().then(result => {
        res.json({ blog: result });
        console.log(" blog saved..");
      }).catch(err => {
        console.log(err);
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });