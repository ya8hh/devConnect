const express = require('express');
const { userAuth } = require('../middlewares/auth');
const requestsRouter = express.Router();

requestsRouter.post("/sendConnectionRequest",userAuth,async (req,res)=>{
    const user =req.user
    console.log("Sending a connection request")
    res.send(user.firstName +" sent the connect requesrt")
})

module.exports = requestsRouter;