const jwt = require('jsonwebtoken')
const User = require("../model/user.model")
const BigPromise = require('./BigPromise')

exports.isloggedIn =BigPromise(async(req,res,next)=>{
    const token = req.cookies?.token||req.header('authorization')?.replace("Bearer ", "")
    if(!token)
        return res.status(401).json({error:"Login first"})
    
    const decode = jwt.verify(token,process.env.JWT_SECERT)

    req.user= await User.findById(decode.id)
    next()
    
})