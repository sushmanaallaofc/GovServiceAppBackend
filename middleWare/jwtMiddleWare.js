const jwt = require('jsonwebtoken');

var jwtSEC = 'ajflbsilfjmerfuuwrngwnrguywrghwgenrgojhrbgvwrgyrgurgfrfghuorigyh'

const checkLogin = async  (req,res,next) => {
// checking header
let authHeader = req.header('Authorization')

console.log(authHeader,"authhh")
if (!authHeader) {
    return res.status (400).send({ message: "Token is missing." })
    }
// verify Token
const token = req.headers.authorization.split(' ')[1];
jwt.verify(token,jwtSEC, function(err, decoded) {
    console.log(err,"errorssss")
    if(err) res.status(401).send({message:'Session Expired, please login again'})
    console.log(decoded,"decoded data")
    req.body.userData = decoded;
    next();
})

}

const checkCoordinatorLogin = async  (req,res,next) => {
    // checking header
    let authHeader = req.header('Authorization')
    
    console.log(authHeader,"authhh")
    if (!authHeader) {
        return res.status (400).send({ message: "Token is missing." })
        }
    // verify Token
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token,jwtSEC, function(err, decoded) {
        console.log(err,"errorssss")
        if(err) res.status(401).send({message:'Session Expired, please login again'})
        console.log(decoded,"decoded data")
        req.body.userData = decoded;
        next();
    })
    
    }

module.exports = {checkLogin,checkCoordinatorLogin}