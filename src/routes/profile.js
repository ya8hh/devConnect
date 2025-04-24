const express = require('express')
const profileRouter =express.Router();
const { userAuth } = require('../middlewares/auth');
const {validateEditFields} =require("../utils/validation")

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


module.exports =profileRouter;