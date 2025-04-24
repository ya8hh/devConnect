const validator = require('validator')
const validateSignUpData =(req)=>{
    const {firstName,lastName,emailId,password} =req.body;
    if(!firstName||!lastName){
        throw new Error(" Name is not valid");
    }else if(!validator.isEmail(emailId)){
        throw new Error(" not valid email");
    }else if(!validator.isStrongPassword(password)){
        throw new Error(" password not strong enough");
    }     
}
const validateEditFields=(req)=>{
    const allowedField =["firstName","lastName","emailId","age","gender","skills","about","photoUrl"]

   const isEditAllowed = Object.keys(req.body).every(field=>allowedField.includes(field))
    return isEditAllowed;
}
   
module.exports={
    validateSignUpData,
 validateEditFields

}