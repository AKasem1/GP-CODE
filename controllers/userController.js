const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  //Sign function take three arguments (object of payload, secret, some options)
  return jwt.sign({_id: _id}, process.env.SECRET, {expiresIn: '3d'})
}
// login a user
const loginUser = async (req, res) => {
  const {email, password} = req.body
  try{
    const user = await User.login(email,password)
    const token = createToken(user._id)
    const {name} = await User.findById(user._id)
    res.status(200).json({name, email, token})
    console.log("Logged in successfully")
  }
  catch(error){
    res.status(400).json({error: error.message})
  }
}

// signup a user
const signupUser = async (req, res) => {
    const {name, email, password, genre, pic} = req.body
    try{
    const user = await User.signup(name, email, password, genre, pic)

    //create token
    const token = createToken(user._id)
    res.status(200).json({name, email, token})
    }
    catch(error){
        res.status(400).json({error: error.message})
    }
}

const currentlyReading = async (req, res) => {
  try {
    const user_id = req.user._id;
    console.log("id: ", user_id);
    const user = await User.findById(user_id).populate('currentlyReading');
    const currentlyReading = user.currentlyReading;
    console.log("currentlyReading: ", currentlyReading);
    res.status(200).json(currentlyReading);
  } catch (error) {
    console.log("Can not retrieve currently reading list");
    res.status(400).json({ error: error.message });
  }
}
const read = async (req, res) => {
  try {
    const user_id = req.user._id;
    console.log("id: ", user_id);
    const user = await User.findById(user_id).populate('read');
    const readList = user.read;
    console.log("readList: ", readList);
    res.status(200).json(readList);
  } catch (error) {
    console.log("Can not retrieve read list");
    res.status(400).json({ error: error.message });
  }
}
const wantstoread = async (req, res) => {
  try {
    const user_id = req.user._id;
    console.log("id: ", user_id);
    const user = await User.findById(user_id).populate('wantsToRead');
    const wantList = user.wantsToRead;
    console.log("wants to read list: ", wantList);
    res.status(200).json(wantList);
  } catch (error) {
    console.log("Can not retrieve wants to read list");
    res.status(400).json({ error: error.message });
  }
}
const allusers = async (req, res) => {
  try{
    const users = await User.find({});
    res.status(200).json(users);

  } catch(error){
    console.log("Can not retrieve users");
    res.status(400).json({ error: error.message });
  }
}
module.exports = { signupUser, loginUser, currentlyReading, read, wantstoread, allusers}