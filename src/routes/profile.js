const express = require('express')
const profileRouter =express.Router();
const { userAuth } = require('../middlewares/auth');
const {validateEditFields} =require("../utils/validation");
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

//profile
profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try{
    const user =req.user;
    if(!user){
        throw new Error("lno user")
    }
    res.send(user)
    }catch(err){
        res.status(400).send("User Not Athorizedu " + err.message);
    }

})
// patch -update profile
profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try {
    if ( !validateEditFields(req)){
        throw new Error("edit not allowed");
    }
    const LoggedInUser =req.user;
    Object.keys(req.body).forEach((key)=>LoggedInUser[key]=req.body[key]);
    console.log(LoggedInUser);
    await LoggedInUser.save();
    res.send("Edit Done")
    } catch (error) {
        res.send("try again, "+error.message);
    }
})
//password edit
profileRouter.patch("/profile/edit/password",userAuth,async (req,res)=>{
   try {
    const {oldPass,newPass}=req.body;
    const user = await User.findById(req.user._id).select("+password");
    const isTrue = await bcrypt.compare(oldPass,user.password);
    if(!isTrue){
        throw new Error("credentials not correct");
    }
    const passwordHash = await bcrypt.hash(newPass,10)
    user.password =passwordHash;
    await user.save();
    res.status(200).send("Password Updated");
   } catch (error) {
        res.status(400).send("Cant update "+error.message);
   }
})

module.exports =profileRouter;