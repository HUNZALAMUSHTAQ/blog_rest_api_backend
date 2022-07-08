const jwt = require("jsonwebtoken")

checkAuth = (req, res, next) =>{

    try{
        const token  = req.headers.authorization.split(" ")[1]
        console.log(req.headers.authorization)
        const decodedToken = jwt.verify(token, "secret")
        console.log(decodedToken)
        req.user = decodedToken
        next()

    }catch(err){
        console.log(err)
        return res.status(401).json({
            "message": "Invalid or Expire token",
            "error": err
        })
    }
}

module.exports = {
    checkAuth: checkAuth
}