const express = require('express')
const feedRouter = express.Router()
const User =require("../models/user.model")
const { userAuth } = require('../middlewares/auth');
feedRouter.get("/feed",userAuth,async(req,res)=>{
    try {
        const users = await User.find({}).select(['-password','-_id']);
        // console.log(users);
        if(!users){
            return res.status(400).send("Something Went Wrong1")
        }
         return res.status(200).send(users)
    } catch (error) {
        res.status(400).send("Something Went Wrong2");
    }
}
)


module.exports = feedRouter;