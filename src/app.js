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













connectDb().then(()=>{console.log("db connected")
    app.listen(3000,(req,res)=>{
        console.log(`server listening at${3000}`);
    })    
})
.catch((err)=>{console.log("db not connected",err.message)})

