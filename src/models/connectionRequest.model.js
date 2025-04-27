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
            values:["ignored", "intrested", "accepted", "rejected"],
            message:`{VALUE} is not valid`
        },
        required:true
    }

},{timestamps:true})

module.exports = mongoose.model('connectionRequest',connectionSchema)