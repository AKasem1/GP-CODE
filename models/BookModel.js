const mongoose = require('mongoose')
const validator =  require('validator')

const Schema = mongoose.Schema

const bookSchema = new Schema({
    image: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  format: {
    type: String,
    required: true
  },
  average_rating: {
    type: Number,
    default: 0
  },
  isbn: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  ratings_sum: {
    type: Number,
    default: 0
  },
  ratings_count: {
    type: Number,
    default: 0
  },
})

module.exports = mongoose.model('Book', bookSchema)