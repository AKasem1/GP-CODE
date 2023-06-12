const express = require("express")
const { loginUser, signupUser, currentlyReading, read, wantstoread, allusers} = require('../controllers/userController')
const requireAuth = require("../middlewares/requireAuth");
const User = require("../models/UserModel");
const Review = require("../models/ReviewModel");

const router = express.Router();

router.post('/login', loginUser);

router.post('/signup', signupUser);

router.get('/users', allusers)

router.get('/currentlyreading', requireAuth, currentlyReading);

router.get('/read', requireAuth, read);

router.get('/wantstoread', requireAuth, wantstoread);

router.get('/myuser/:id', (req, res) => {
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        return res.status(404).json({error:err})
    })
})

router.get('/user/:id', (req, res) => {
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
         Review.find({postedBy:req.params.id})
         .populate("postedBy")
         .populate("book")
         .exec((err,reviews)=>{
             if(err){
                console.log("errorrrrrrrrrrr")
                 return res.status(422).json({error:err})
             }
             res.json({user,reviews})
         })
    }).catch(err=>{
        return res.status(404).json({error:err})
    })
})

router.put('/follow', requireAuth, (req, res) => {
    //followId is the id of the user that will be followed
    User.findByIdAndUpdate(req.body.followId, {
        //req.user._id is the id of the user that will perform the follow action
        $push:{followers: req.user._id}
    },{
        new:true
    }).populate("followers", "_id name")
    .exec((err, result) => {
        if(err){
            console.log("can not follow..")
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id, {
            //req.user._id is the id of the user that will perform the follow action
            $push:{following: req.body.followId}
        },{new:true}) .populate("following", "_id name")
        .then(result => {
            console.log("fooooollowed!")
            res.json(result)
        }).catch(err=>{
            console.log("can not follow..!")
            return res.status(422).json({error:err})
        })
    })
})

router.put('/unfollow', requireAuth, (req, res) => {
    //followId is the id of the user that will be followed
    User.findByIdAndUpdate(req.body.unfollowId, {
        //req.user._id is the id of the user that will perform the follow action
        $pull:{followers: req.user._id}
    },{
        new:true
    },(err, result) => {
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id, {
            //req.user._id is the id of the user that will perform the follow action
            $pull:{following: req.body.unfollowId}
        },{new:true}).populate("_id","following followers")
        .then(result => {
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})

router.get('/public', (req, res, next) => {
    res.status(200).json({ message: "here is your public resource" });
});

// will match any other path


module.exports = router