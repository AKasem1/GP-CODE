const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const requireAuth = require("../middlewares/requireAuth")
const Review = require("../models/ReviewModel")
const Book = require("../models/BookModel")
const User = require("../models/UserModel")
const { route } = require("./userRoute")


router.get('/allreviews', requireAuth,(req,res)=>{
    res.cookie("id", res.userId)
    Review.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .populate("book")
    .sort('-createdAt')
    .then(reviews=>{
        res.json({reviews})
    })
    .catch(err=>{
        console.log(err)
    })
})
router.get('/following', requireAuth,(req,res)=>{
    res.cookie("id", req.user._id)
    console.log("req user following:", req.user.following);
    Review.find({postedBy:{$in:req.user.following}})
    .populate({
        path: 'postedBy',
        select: '_id name followers',
        populate: {
          path: 'followers',
          model: 'User',
        }
      })
    .populate("comments.postedBy", "_id name")
    .sort('-createdAt')
    .then(reviews=>{
        console.log("here are your following reviews: ", reviews)
        res.json({reviews})
    })
    .catch(err=>{
        console.log("can not retrieve your following reviews due to: ", err)
    })
})

router.post('/createreview', requireAuth, async (req, res) => {
    const { bookName, rating, body } = req.body;
    console.log("here starting creating review")
  
    if (!rating || !body || !bookName) {
        console.log("Please Add All Fields..")
      return res.status(422).json({ error: "Please Add All Fields.." });
    }
  
    try {
      const book = await Book.findOne({ title: bookName });
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }
  
        const intRating = parseInt(rating, 10);
        book.ratings_sum += intRating;
        book.ratings_count += 1;
  
      book.average_rating = book.ratings_sum / book.ratings_count;
      console.log("this is the average rating of this book: ", book.average_rating)
  
      await book.save();

      const user = await User.findByIdAndUpdate(req.user._id, {
        $push:{read: book}
    },{new:true}).populate("read")

      await user.save();
  
      req.user.password = undefined;
      const review = new Review({
        bookName,
        rating,
        body,
        postedBy: req.user,
        book
      });
  
      review.save().then(result => {
        res.json({ review: result });
        console.log("saved..");
      }).catch(err => {
        console.log(err);
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.get('/myreviews',requireAuth, (req, res)=>{
    Review.find({postedBy: req.user._id})
    .populate("postedBy")
    .populate("book")
    .then(myposts=>{res.json({myposts})}).catch(err=>{console.log(err)})
})
router.get('/reviews/:id', (req, res)=>{
    Review.find({postedBy: req.params.id})
    .populate("postedBy")
    .populate("book")
    .then(posts=>{res.json({posts})}).catch(err=>{console.log(err)})
})
router.put('/like', requireAuth, (req, res) => {
    Review.findByIdAndUpdate(req.body.reviewId, {
        $push:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            console.log("Liked..")
            res.json(result)
        }
    })
})
router.put('/unlike', requireAuth, (req, res) => {
    Review.findByIdAndUpdate(req.body.reviewId, {
        $pull:{likes:req.user._id}
    },{
        new: true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err, results)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(results)
        }
    })
})
router.put('/comment',requireAuth,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Review.findByIdAndUpdate(req.body.reviewId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            console.log("commented")
            res.json(result)
        }
    })
})

router.delete('/deletereview/:reviewId',requireAuth,(req,res)=>{
    Review.findOne({_id:req.params.reviewId})
    .populate("postedBy","_id")
    .exec((err,review)=>{
        if(err || !review){
            return res.status(422).json({error:err})
        }
        if(review.postedBy._id.toString() === req.user._id.toString()){
            review.remove()
            .then(result=>{
                  console.log("deleted..")
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})

module.exports = router
