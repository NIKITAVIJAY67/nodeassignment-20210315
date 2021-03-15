module.exports = (app) => {
    const users = require('../controllers/users.controller.js');
    const User = require('../models/users.model.js');
    const { check, validationResult} = require("express-validator/check");
    const bcrypt = require("bcrypt");
    const jwt = require("jsonwebtoken");
    // const encodepswd = require('../middleware/encodepswd.middleware.js');
    const auth = require('../middleware/auth.middleware.js');

    // Create a new User
    app.post('/register', users.create);

    // Retrieve all users
    app.get('/getusers/:stategrp?', auth, users.findAll);
    // Retrieve all users
    app.post('/addaddress', auth, users.addAddress);

    app.post('/login',
                [
                    check("email", "Please enter a valid email").isEmail(),
                    // check("password", "Please enter a valid password").isLength({
                    //   min: 4
                    // })
                ],
                async (req, res) => {
                    const errors = validationResult(req);

                    if (!errors.isEmpty()) {console.log('nikita');
                      return res.status(400).json({
                        errors: errors.array()
                      });
                    }

                    const { email, password } = req.body;
                    try {
                      let user = await User.findOne({
                        email
                      });
                      if (!user)
                        return res.status(400).json({
                          message: "User Not Exist"
                        });

                      const isMatch = await bcrypt.compare(password, user.password);
                      if (!isMatch)
                        return res.status(400).json({
                          message: "Incorrect Password !"
                        });

                      const payload = {
                        user: {
                          id: user.id,
                          phone: user.phone,
                          email: user.email,
                          username: user.username,
                        }
                      };

                      jwt.sign(
                        payload,
                        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                        {
                          expiresIn: 3600
                        },
                        (err, token) => {
                          if (err) throw err;
                            User.findByIdAndUpdate(user.id, {
                                token: token
                            }, {new: true})
                            .then(user => {
                                if(!user) {
                                    return res.status(404).send({
                                        message: "User not found with id " + user.id
                                    });
                                }
                              res.status(200).json({
                                token
                              });
                                
                            }).catch(err => {
                                if(err.kind === 'ObjectId') {
                                    return res.status(404).send({
                                        message: "User not found with id " + user.id
                                    });                
                                }
                                return res.status(500).send({
                                    message: "Error updating user with id " + user.id
                                });
                            });
                        }
                      );
                    } catch (e) {
                      console.error(e);
                      res.status(500).json({
                        message: "Server Error"
                      });
                    }
                }
            );
        app.get("/myprofile", auth, async (req, res) => {
          try {
            // request.user is getting fetched from Middleware after token authentication
            User.find({ _id: req.user.id , token: req.header("token") }, function (err, userdata) { 
                if (err){ 
                    res.send({ message: err }); 
                } 
                else{ 
                    res.json(userdata);
                } 
            }); 
            // const user = await User.findById(req.user.id);
            // res.json(user);
          } catch (e) {
            res.send({ message: "Error in Fetching user" });
          }
        });
}
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjA0ZGVlMzFhMGY5NjQwYTA4NzY4MDFiIiwicGhvbmUiOiI5ODA5NzUzNDU2IiwiZW1haWwiOiJuaWt2akBtYWlsaW5hdG9yLmNvbSIsInVzZXJuYW1lIjoiTmlraXRhVmoifSwiaWF0IjoxNjE1NzIwMTk1LCJleHAiOjE2MTU3MjM3OTV9.52bx1plFeNJmvW_ubNivHhgHJqYZa2Z9K3Yh4ayvAgg
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjA0ZGVlMzFhMGY5NjQwYTA4NzY4MDFiIiwicGhvbmUiOiI5ODA5NzUzNDU2IiwiZW1haWwiOiJuaWt2akBtYWlsaW5hdG9yLmNvbSIsInVzZXJuYW1lIjoiTmlraXRhVmoifSwiaWF0IjoxNjE1NzIwMDUyLCJleHAiOjE2MTU3MjM2NTJ9.mCystH6paBv32qf6vCkkURbLiV_MMbvqLaDhJSxAfys