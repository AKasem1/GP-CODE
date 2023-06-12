const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const requireAuth = require("../middlewares/requireAuth")
const User = require("../models/UserModel")
const Book = require("../models/BookModel")
const {allbooks} = require("../controllers/bookController")
const { route } = require("./userRoute")

router.post('/allbooks', allbooks)
router.get('/book/:id', (req, res) => {
    Book.findOne({_id:req.params.id})
    .then(book=>{
        console.log("this book is retrieved..")
        res.json({book})
    })
    .catch(err=>{
        console.log("Can not retrieve this book due to: ", err)
    })
})

router.put('/currentlyReading', requireAuth, (req, res) => {
    const userId = req.user._id;
    const bookId = req.body.bookId;
  
    User.findByIdAndUpdate(userId, {
      $push: { currentlyReading: bookId },
      $pull: { wantsToRead: bookId }
    }, { new: true })
      .populate("currentlyReading")
      .then(result => {
        console.log("you are currently reading this book!");
        res.json(result);
      }).catch(err => {
        console.log("cannot add that book to currently reading list!");
        return res.status(422).json({ error: err });
      });
  });
  

  router.put('/wantstoread', requireAuth, (req, res) => {
    const userId = req.user._id;
    const bookId = req.body.bookId;
  
    User.findByIdAndUpdate(userId, {
      $push: { wantsToRead: bookId },
      $pull: { currentlyReading: bookId }
    }, { new: true })
      .populate("wantsToRead")
      .then(result => {
        console.log("you want to read this book!");
        res.json(result);
      }).catch(err => {
        console.log("cannot add that book to wants to read list!");
        return res.status(422).json({ error: err });
      });
  });
  

router.post('/addBook',(req, res)=>{
    const {image, title, author, format, isbn, category} = req.body
    
    if(!title || !author || !isbn){
        return res.status(422).json({error:"Please Add All Fields.."})
    }
    const book = new Book({
        image,
        title,
        author,
        format,
        isbn,
        category
    })

    book.save().then(result=>{
        res.json({book:result})
        console.log("saved..")
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router