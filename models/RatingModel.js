const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const validator =  require('validator')

const Schema = mongoose.Schema

const ratingSchema = new Schema({
    rating:{
        type: Number,
        required: true,
        min: 0,
        max:5
    },
    book:{type:ObjectId,ref:"Book"},
    likes:[{type:ObjectId,ref:"User"}],
    comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"User"}
    }],
    postedBy:{
        type: ObjectId,
        ref: "User"
    },
    createdAt: {
    type: Date,
    }
})
ratingSchema.virtual('createdAtFormatted').get(function () {
    const now = new Date();
    const diffInMinutes = Math.floor((now - this.createdAt) / (1000 * 60));
    return `${diffInMinutes} minutes ago`;
  });

module.exports = mongoose.model('Rating', ratingSchema)