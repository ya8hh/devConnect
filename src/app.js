require('dotenv').config();
const express =require('express');
const connectDb = require('./config/database')
const app = express();
connectDb().then(()=>{console.log("db connected")
    app.listen(3000,(req,res)=>{
        console.log(`server listening at${3000}`);
    })    
})
.catch((err)=>{console.log("db not connected",err.message)})

