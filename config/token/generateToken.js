const jwt = require("jsonwebtoken");

const generateToken = id =>{
    //generate token and assign to user
    return jwt.sign({id}, process.env.JWT_KEY, {expiresIn: "20d"});
}

module.exports = generateToken;