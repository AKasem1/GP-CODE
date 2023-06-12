const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')

const requireAuth = async (req,res,next) =>{
    //verify authentication
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error: "Authorization token is required"})
    }
    const token = authorization.split(' ')[1]
    try{
        const {_id} = jwt.verify(token, process.env.SECRET)
        const user = await User.findOne({ _id }).populate('following'); // Populate the 'following' field
        if (!user) {
        throw Error('Invalid user');
        }
        res.userId = _id;
        req.user = user; // Assign the user object to req.user
        next()
    }
    catch{
        res.status(401).json({error: 'Request is not authorized'})
    }
}
module.exports = requireAuth