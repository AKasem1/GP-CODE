const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const requireAuth = require("../middlewares/requireAuth")
const User = require("../models/UserModel")
const Book = require("../models/BookModel")
const Review = require("../models/ReviewModel")


// Recommender function
async function recommender(userId) {
  try {
    // Find the user's genre preferences
    const user = await User.findById(userId);

    if (!user) {
      console.log('User not found.');
      return;
    }

    const userGenres = user.genre;
    console.log("user genre: ", user.genre)

    // Find the user's ratings
    const userRatings = await Review.find({ postedBy: userId });

    if (userRatings.length === 0) {
      console.log('User has not rated any books yet.');
      return;
    }

    // Extract book names from user's ratings
    const userBookNames = userRatings.map(rating => rating.bookName);

    // Find other users who rated the same books
    const similarUsers = await Review.find({
      bookName: { $in: userBookNames },
      postedBy: { $ne: userId }
    })
      .distinct('postedBy');
    
    console.log("Similar users: ", similarUsers)

    // Find recommended books based on similar users' ratings and user's genre preferences
    const recommendedBooks = await Review.aggregate([
      // Match reviews by similar users, exclude books already rated by the user, and match genre preferences
      {
        $match: {
          postedBy: { $in: similarUsers },
          bookName: { $nin: userBookNames }
        }
      },
      // Group by bookName and calculate average rating
      {
        $group: {
          _id: '$bookName',
          averageRating: { $avg: '$rating' }
        }
      },
      // Sort by average rating in descending order
      {
        $sort: { averageRating: -1 }
      },
      // Lookup the Book collection to get the genre of each book
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: 'title',
          as: 'book'
        }
      },
      // Unwind the book array
      { $unwind: '$book' },
      // Match books with genres that match the user's preferences
      {
        $match: {
          'book.category': { $in: userGenres }
        }
      },
      { $limit: 5 }
    ]);
    
    const uniqueRecommendedBooks = [];
    const seenIds = [];

    for (let i = 0; i < recommendedBooks.length; i++) {
      const books = recommendedBooks[i];
      const id = books._id;

      if (!seenIds.includes(id)) {
        uniqueRecommendedBooks.push(books.book);
        seenIds.push(id);
      }
    }
    console.log("uniqueRecommendedBooks: ", uniqueRecommendedBooks)
    return uniqueRecommendedBooks
  } catch (error) {
    console.error('Error occurred:', error);
  }
}



router.get('/recommend/:userId', async (req, res) => {
    const userId = req.params.userId;
    const recommendations = await recommender(userId);
    //console.log("Here are your final recommendations: ", recommendations)
    res.json(recommendations);
  });

module.exports = router