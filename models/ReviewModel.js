const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const validator =  require('validator')

const Schema = mongoose.Schema

const reviewSchema = new Schema({
    bookName:{
    type: String,
    required: true,
    },
    rating:{
    type: Number,
    required: true,
    max: 5,
    min: 0
    },
    body:{
    type: String,
    required: true,
    },
    likes:[{type:ObjectId,ref:"User"}],
    comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"User"}
    }],
    postedBy:{
        type: ObjectId,
        ref: "User"
    },
    book: { 
        type: ObjectId,
        ref: "Book"
    }
}, {timestamps: true})

module.exports = mongoose.model('Review', reviewSchema)