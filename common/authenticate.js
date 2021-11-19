const jwt = require("jsonwebtoken");
const Model = require("../model");
const bcrypt = require("bcryptjs");

module.exports.getToken = (data) => jwt.sign(data, process.env.SECRET_KEY, { expiresIn:'30d'});

module.exports.verifyToken = (token) => jwt.verify(token, process.env.SECRET_KEY);


module.exports.verifyUser = async (req, res, next) => {
    try {
        const token = String(req.headers.authorization || "")
            .replace(/bearer|jwt/i, "")
            .replace(/^\s+|\s+$/g, "");
        console.log(token)
        const decoded = this.verifyToken(token);
         
        const userObj = await Model.User.findOne({ _id: decoded._id }).lean();
        if (!userObj){
           return res.json({
                statusCode: 200,
                message: "INVALID_TOKEN",       
               
            })
        }
        if (userObj.accessToken !== token) {
           return res.json({
                statusCode: 200,
                message: "INVALID_TOKEN",       
               
            })
        } 
        req.user = userObj;

        next();
    } catch (error) {
      return res.json({
        statusCode: 401,
        message: "UNAUTHORIZED_ACCESS",       
       
    })
    }
};