const mongoose = require('mongoose')

const connectionSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["ignored", "interested", "accepted", "rejected"],
            message:`{VALUE} is not valid`
        },
        required:true
    }

},{timestamps:true})
connectionSchema.index({fromUserId:1,toUserId:1});
connectionSchema.pre("save",function(next){
    const connectionRequest =this
    //check if fromUserID is saame as toUser Id
    if(connectionRequest.fromUserId.equals(this.toUserId)){
      return  next( new Error("NOt a valid request"))
    }
    next();
})
module.exports = mongoose.model('connectionRequest',connectionSchema)