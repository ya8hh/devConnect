const jwt =require("jsonwebtoken")
const User =require("../models/user.model")
const userAuth=async(req,res,next)=>{
   try{
    const {token}= req.cookies;
    if(!token){
        throw new Error("token is no valid")
    }
    const decodedObj = await jwt.verify(token,process.env.SECRET);
    const{_id} =decodedObj;
    const user =await User.findById(_id).select("-password");
    if(!user){
        throw new Error("User Not Found")
    }
    req.user=user;
    next();
   }catch(err){
    res.status(400).send("User Not Valid" + err.message);
}

}
module.exports={
    userAuth
}