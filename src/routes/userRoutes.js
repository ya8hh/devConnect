const express = require('express');
const { userAuth } = require('../middlewares/auth');
const connectionRequest = require('../models/connectionRequest.model');
const User = require('../models/user.model');
const userRouter  = express.Router();

userRouter.get("/user/requests/received",userAuth,async (req,res)=>{
    try {
        const loggedInUser =req.user;
        const request =await connectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName","photoUrl","age","gender","about","skills"]);
        res.json({
            message:"Data Fetched Successfully",
            data:request,
        })

    } catch (error) {
        res.status(400).json({
            message:"ERROR "
        })
    }
})
userRouter.get("/user/connections",userAuth,async (req,res)=>{
    try{
        const loggedInUser =req.user;
        const connection =await connectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"}
            ]
        }).populate("fromUserId",["firstName","lastName","photoUrl","age","gender","about","skills"]).populate("toUserId",["firstName","lastName","photoUrl","age","gender","about","skills"]);
        const data =connection.map((row)=>{
            if(loggedInUser._id.toString()===row.fromUserId._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        })
        
    }catch(err){
        res.status(400).send({
            message:err.message
        })
    }
})
//feed API-actual feed api
userRouter.get("/feed",userAuth,async(req,res)=>{
    try {
        const loggedInUser =req.user;
        const page = parseInt(req.query.page)||1
        let limit = parseInt(req.query.limit)||10
        limit = limit>50?50:limit
        const skip =(page-1)*limit
        const request =await connectionRequest.find({
            $or:[{toUserId:loggedInUser._id},
                {fromUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId")
        const hideUserFromFeed =new Set()
        request.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserId.toString())
            hideUserFromFeed.add(req.toUserId.toString())
        })
        const users = await User.find({
            $and:[
                {_id:{$nin:Array.from(hideUserFromFeed)}},
                {_id:{$ne:loggedInUser._id}}
            ]
        }).select(["firstName","lastName","photoUrl","age","gender","about","skills"])
        .skip(skip)
        .limit(limit);
        res.send(users)
    } catch (error) {
        res.status(400).json({message: error.message})
    }

})




module.exports =userRouter;