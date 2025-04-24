const express = require('express')
const profileRouter =express.Router();
const { userAuth } = require('../middlewares/auth');

//profile
profileRouter.get("/profile",userAuth,async(req,res)=>{
    try{
    //     const cookie =req.cookies;
    // const {token} = cookie;
    // if(!token){
    //     throw new Error("Invalid Crediantials")
    // }
    // // console.log(token); 
    // //validate
    // const decoded = await jwt.verify(token,process.env.SECRET);
    // const { _id }= decoded;
    // // console.log("Logged In User is:" +_id);
    // const user = await User.findById(_id).select(["-password","-_id"]);
    const user =req.user;
    if(!user){
        throw new Error("lno user")
    }
    res.send(user)
    }catch(err){
        res.status(400).send("User Not Athorizedu " + err.message);
    }

})



module.exports =profileRouter;