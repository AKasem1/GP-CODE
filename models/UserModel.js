const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const validator =  require('validator')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{
    type: String,
    required: true,
    },
    email: {
    type: String,
    required: true,
    unique: true
    },
    password:{
    type: String,
    required: true,
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}],
    currentlyReading:[{type:ObjectId,ref:"Book"}],
    wantsToRead:[{type:ObjectId,ref:"Book"}],
    read:[{type:ObjectId,ref:"Book"}],
    genre: [{
      type: String,
      enum:['Medical', 'Sport','Natural-History',
      'Business-Finance-Law', 'Art-Photography', 'Computing',
      'Childrens-Books', 'Biography', 'Religion', 'Science-Geography'],
      required: true
    }],
    pic:{
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/219/219983.png"  
    }
})
userSchema.statics.signup = async function (name, email, password, genre, pic){
    //validation
    if(!name || !email || !password || !genre){
      throw Error('All fields are required.')
    }
    if(!validator.isEmail(email)){
      throw Error("Email is not valid")
    }
    if(!validator.isStrongPassword(password)){
      throw Error("Password is not strong enough")
    }
      const exists = await this.findOne({email})
      if(exists){
          throw Error("Email is already exists..")
      }
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      console.log("genres: ", genre)
  
      const user = await this.create({name, email, password: hash, genre, pic})
      return user
  }
  
  userSchema.statics.login = async function (email, password){
    if(!email || !password){
      throw Error('All fields are required.')
      console.log('All fields are required.')
    }
    const user = await this.findOne({email})
    //.populate("email", "_id name")
    if(!user){
      throw Error('Invalid user credentials')
    }
    const match = await bcrypt.compare(password, user.password)
    if(!match){
      throw Error('Invalid user credentials')
    }
    return user
  }
module.exports = mongoose.model('User', userSchema)