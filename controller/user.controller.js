const Bigpromise = require("../middleware/Bigpromise");
const User = require("../model/user.model");
const cookieToken = require("../util/cookieToken");
module.exports={
    login:Bigpromise(async(req,res)=>{
            const { email, password } = req.body;
            if (!email || !password)
              return res.status(400).json({ error: "Enter Email/Password" });
          
            const userFound = await User.findOne({ email }).select("+password");
          
            if (!userFound)
              return res.status(400).json({ error: "Invalid Email/Password" });
          
            const isValidpassword = await userFound.isValidpassword(password);
          
            if (!isValidpassword)
              return res.status(400).json({ error: "Invalid Email/Password" });
          
            cookieToken(userFound, res);
    })
}