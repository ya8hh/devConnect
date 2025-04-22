const mongoose = require('mongoose')
const validator = require("validator")

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50
    },lastName:{
        type:String
    },
    emailId:{
        type:String,
        unique:true,
        required:true,
        lower:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address")
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Invalid email address")
            }
        }
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender is not valid")
            }
        }
    },photoUrl:{
        type:String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid email address")
            }
        }
    },about:{
        type:String ,
        default:"default bio"
    },skills:{
        type:[String ],
    }
},{timestamps:true}) 

const User  =mongoose.model('User',userSchema)
module.exports =User;