const Book = require("../models/BookModel")

const allbooks = async (req, res) => {
    try{
    console.log("query is : ", req.body.query)
     let bookPattern = new RegExp("^"+req.body.query)
      const books = await Book.find({title:{$regex:bookPattern}})
      console.log(books)
      res.status(200).json(books);
  
    } catch(error){
      console.log("Can not retrieve books");
      res.status(400).json({ error: error.message });
    }
  }
  module.exports = {allbooks}