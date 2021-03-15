const User = require('../models/users.model.js');
const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const token = req.header("token");
  if (!token) return res.status(401).json({ message: "Auth Error" });

  try {
    const decoded = jwt.verify(token, "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    req.user = decoded.user;

     User.find({ _id: req.user.id , token: req.header("token") }, function (err, userdata) { 
                if (err || (userdata && userdata.length == 0)){ 
                     res.status(500).send({ message: "Token Expired!!" });
                } 
                else{ 
                    next();
                } 
            }); 

    
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token" });
  }
};