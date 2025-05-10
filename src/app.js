require('dotenv').config();
const express =require('express');
const app = express();
const connectDb = require('./config/database')
const User =require("./models/user.model")
const cookieParser = require("cookie-parser");
const cors = require('cors')
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//importing routers
const profileRouter =require("./routes/profile");
const requestsRouter =require("./routes/requests");
const authRouter = require('./routes/auth');
// const feedRouter = require('./routes/feed');
const userRouter = require('./routes/userRoutes');
app.use("/",authRouter);
app.use("/",requestsRouter);
app.use("/",profileRouter);
// app.use("/",feedRouter);
app.use("/",userRouter);



connectDb().then(()=>{console.log("db connected")
    app.listen(3000,(req,res)=>{
        console.log(`server listening at${3000}`);
    })    
})
.catch((err)=>{console.log("db not connected",err.message)})

