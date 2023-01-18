//for avoid try catch all time
module.exports = func=>(req,res,next)=>{
    Promise.resolve(func(req,res,next)).catch(next)
}