require('dotenv').config();
const express =require('express');
require('./config/database')
const app = express();



app.listen(3000,(req,res)=>{
    console.log(`server listening at${3000}`);
})
