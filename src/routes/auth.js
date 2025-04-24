const express =require('express');
const authRouter = express.Router();
const User =require("../models/user.model")
const bcrypt = require('bcrypt')
const {validateSignUpData} =require("../utils/validation")
const { userAuth } = require('../middlewares/auth');
//signup
authRouter.post("/signup",async(req,res)=>{
    
    const {firstName,lastName,emailId,password}=req.body;
     
    try{

        validateSignUpData(req);
        const emailClean = emailId.trim().toLowerCase();
        const passwordHash = await bcrypt.hash(password,10)
        const user = new User({
            firstName,
            lastName,
            emailId :emailClean,
            password:passwordHash,
        })
        await user.save();
        res.send("User Added Sucessfull")
    }catch(err){
        res.status(400).send("User Not Added" + err.message);
    }
})
//login 
authRouter.post("/login", async(req,res)=>{
    // console.log(req.body)
    const {emailId,password} = req.body;
    // console.log(emailId);
   
    try{
        const emailClean = emailId.trim().toLowerCase();
        // console.log(emailClean)
            const user = await User.findOne({emailId:emailClean});
        
        // console.log(user)
        if(!user){
            throw new Error("Email is not registered")
        }
         const isPasswordValid = await user.getValidate(password);
        if(isPasswordValid){
        const token = await user.getJWT(); 
        console.log(token)


            //cookie send
            res.cookie("token",token);
            res.send("Login Sucessfully")
        }else{
            throw new Error("Password is not correct");
        }

    }catch(err){
        res.status(400).send("User Not Login " + err.message);
    }

})
//logout
authRouter.get("/logout",userAuth,(req,res)=>{
    try {
        res.clearCookie('token').status(200).send("User Logged Out");
    } catch (error) {
        res.send("Something went wrong "+error.message);
    }
})



module.exports =authRouter;
//21,29,3,10,14,17