const express = require('express');
const { userAuth } = require('../middlewares/auth');
const connectionRequest = require('../models/connectionRequest.model');
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
        }).populate("fromUserId",["firstName","lastName","photoUrl","age","gender","about","skills"]);
        const data =connection.map((row)=>row.fromUserId)
        res.json({
            data:data
        })
    }catch(err){
        res.status(400).send({
            message:err.message
        })
    }
})





module.exports =userRouter;