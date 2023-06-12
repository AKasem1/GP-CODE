const mongoose = require('mongoose')
const validator =  require('validator')

const Schema = mongoose.Schema

const blogSchema = new Schema({
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
    
}, {timestamps: true})

module.exports = mongoose.model('Blog', userSchema)