require('dotenv').config();
const express =require('express');
const app = express();
const connectDb = require('./config/database')
const User =require("./models/user.model")
app.use(express.json());
app.post("/signup",async(req,res)=>{
    const {firstName,lastName,emailId,password,age,gender}=req.body;
    const user = new User({
        firstName,
        lastName,
        emailId,
        password,
        age,
        gender
    })
    try{
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
    const user= await User.findOne({emailId:email})
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
        const users = await User.find({});
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













connectDb().then(()=>{console.log("db connected")
    app.listen(3000,(req,res)=>{
        console.log(`server listening at${3000}`);
    })    
})
.catch((err)=>{console.log("db not connected",err.message)})

