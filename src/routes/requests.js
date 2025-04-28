const express = require('express');
const { userAuth } = require('../middlewares/auth');
const requestsRouter = express.Router();
const connectionRequest = require('../models/connectionRequest.model');
const User = require('../models/user.model');
//sending the connection request
requestsRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res)=>{
    try {
    const fromUserId =req.user._id
    const toUserId = req.params.toUserId
    const status = req.params.status
    const allowedStatus =["ignored","interested"];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({message:"Invalid Status Type " + status})
    }
    const toUser =await User.findById(toUserId);
    if(!toUser){
        return res.status(400).json({message:'User Dont Exist'})
    }
    const connectionExist =await connectionRequest.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId}
        ]
    })
    if(connectionExist){
        return res.status(400).json({message:"Connection Request Already Exists"})
    }
    const connectionInstance = new connectionRequest({
        fromUserId,
        toUserId,
        status
    })
    const data = await connectionInstance.save()
    res.json({
        message:"Connection Request Sent Successfully",
        data,
    })
    } catch (error) {
        res.status(400).send("ERROR "+ error.message);
    }  
})
//reviewing the connection reqest
requestsRouter.post("/request/review/:status/:requestId",userAuth, async (req,res)=>{
    try {
        const loggedInUser =req.user;
        const {status,requestId} =req.params;
        const allowedStatus =["accepted","rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({ message:"Status not Valid" })
        }
        const Request = await connectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        })
        if(!Request){
            return res
            .status(404)
            .json({message:"Connection request not found"})
        }
        Request.status =status;
        const data = await Request.save();
        res.json({message:" Connection request "+status,data})
    } catch (error) {
        res.status(400).send("ERROR "+error.message)
    }
})

module.exports = requestsRouter;