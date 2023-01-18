const Bigpromise = require("../middleware/Bigpromise")
const mongoose = require("mongoose")
const User = require("../model/user.model")
require('dotenv').config()

//DB connection and Port
const DB = require('../config/Db')()

 const seed = Bigpromise(async()=>{
    await User.deleteMany()
    const user = await new User({
        name:"admin",
        password:"admin",
        email:"admin@sample.com"
    }).save()
    // if(!user){
    //     console.log("error in seed section");
    // }
    console.log(user);
    mongoose.disconnect()
})
seed()



