const mongoose = require('mongoose')
require('dotenv').config();
const connectDb =async()=>{
    await mongoose.connect(process.env.MONGO)
}
connectDb().then(()=>{console.log("db connected")})
.catch((err)=>{console.log("db not connected",err.message)})
