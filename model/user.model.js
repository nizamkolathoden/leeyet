const mongoose = require("mongoose")
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,'please enter your name'],
        maxlength:[40,'name should be under 40 char']
    },
    email:{
        type:String,
        require:[true,'plz enter email'],
        validate:[validator.isEmail,"please enter valid email"],
        unique:true
    },
    password:{
        type:String,
        require:[true,'plz enter password'],
        select:false
     
    },
  
   
   
    createdAt:{
        type:Date,
        default:Date.now
    }


})
userSchema.pre('save',async function (next){
    try {
        if(!this.isModified('password'))    
            return next()
        this.password = await bcrypt.hash(this.password,10)
    } catch (err) {
        console.log(err);
    }
})

//validate password 
userSchema.methods.isValidpassword = async function (userPassword){
   
    return await bcrypt.compare(userPassword,this.password)
}

//create jwt

userSchema.methods.getJwtToken  =  function (){
    
    return  jwt.sign({id:this._id},process.env.JWT_SECERT,{
        expiresIn:process.env.JWT_EXPIRY
    })
}



module.exports = mongoose.model('user',userSchema)