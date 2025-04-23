require('dotenv').config();
const bcrypt = require('bcrypt')
const express =require('express');
const app = express();
const connectDb = require('./config/database')
const User =require("./models/user.model")
const {validateSignUpData} =require("./utils/validation")
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const jwt =require("jsonwebtoken")
const {userAuth}=require("./middlewares/auth");
//signup
app.post("/signup",async(req,res)=>{
    
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
//get single user
app.get("/user",async(req,res)=>{
    const email= req.body.emailId;
    try {
        
    console.log(email);
    const user= await User.findOne({emailId:email}).select(['-password','-_id']);
    if(!user){
        return res.status(400).send("User Not Found!")
    }
     return res.status(200).send(user)
    } catch (error) {
        res.status(400).send("Something Went Wrong");
    }
})
//feed api
app.get("/feed",async(req,res)=>{
    try {
        const users = await User.find({}).select(['-password','-_id']);
        // console.log(users);
        if(!users){
            return res.status(400).send("Something Went Wrong")
        }
         return res.status(200).send(users)
    } catch (error) {
        res.status(400).send("Something Went Wrong");
    }
    
})
//patch 
app.patch("/user/:userId",async (req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;
    const allowed =["userId","photoUrl","about","gender","age","skills"];
    const isAllowed =Objects.keys(data).every((k)=>allowed.includes(k));
    if(!isAllowed){
        res.status(400).send("Update Is Not Allowed");
    }
    try{
        const userId = req.body.userId;
        const data = req.body;
        const allowed =["userId","photoUrl","about","gender","age","skills"];
        const isAllowed =Objects.keys(data).every((k)=>allowed.includes(k));
        if(!isAllowed){
           return  res.status(400).send("Update Is Not Allowed");
        }
        if(data?.skills.length>10){
            throw new Error("Update not allowed,Skills>10");
        }
        const user = await User.findByIdAndUpdate({_id:userId},data,{
            returnDocument:"after",
            runValidators:true,
        })
    }catch (error) {
        res.status(400).send("Something Went Wrong"+ error.message );
    }
});
//login
app.post("/login", async(req,res)=>{
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
//profile
app.get("/profile",userAuth,async(req,res)=>{
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











connectDb().then(()=>{console.log("db connected")
    app.listen(3000,(req,res)=>{
        console.log(`server listening at${3000}`);
    })    
})
.catch((err)=>{console.log("db not connected",err.message)})

