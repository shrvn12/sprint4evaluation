const jwt = require("jsonwebtoken");
require("dotenv").config()
const authenticator = (req,res,next)=>{
    let token = req.headers.authorization;
    if(token){
        jwt.verify(token, process.env.key, function(err, decoded) {
            if(err){
                res.send({msg:"you are not authorised"})
            }
            else{
                next();
            }
        });
    }
    else{
        res.send({msg:"you are not logged in"});
    }

}

module.exports = {
    authenticator
}