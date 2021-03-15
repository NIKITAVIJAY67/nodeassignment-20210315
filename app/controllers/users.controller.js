const User = require('../models/users.model.js');

// Create and Save a new Note
// Create and Save a new Note                                                                                                                                              
var bcrypt = require('bcrypt')   ;
exports.create = (req, res) => {
    // Validate request
    // if(!req.body.username) {
    //     return res.status(400).send({
    //         message: "username can not be empty"
    //     });
    // }
    // if(!req.body.firstname) {
    //     return res.status(400).send({
    //         message: "firstname can not be empty"
    //     });
    // }
    // if(!req.body.lastname) {
    //     return res.status(400).send({
    //         message: "lastname can not be empty"
    //     });
    // }
    // if(!req.body.phone) {
    //     return res.status(400).send({
    //         message: "phone can not be empty"
    //     });
    // }
    // if(!req.body.email) {
    //     return res.status(400).send({
    //         message: "email can not be empty"
    //     });
    // }
    // if(!req.body.password) {
    //     return res.status(400).send({
    //         message: "password can not be empty"
    //     });
    // }

        const passwordencrypted = bcrypt.hashSync(req.body.password, 10);
    // Create a Note
    const user = new User({
        username: req.body.username, 
        firstname: req.body.firstname, 
        lastname: req.body.lastname, 
        phone: req.body.phone, 
        email: req.body.email, 
        state: req.body.state, 
        password: passwordencrypted, 
    });
    console.log(user);console.log(214564);
    // Save Note in the database
    user.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
        });
    });
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    var stategrp = req.params.stategrp;
    // if(stategrp)
        if (!stategrp) {
            User.find({ _id: { $ne: req.user.id}})
            .then(users => {console.log(users);
                res.json({users:users});
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving users."
                });
            });
        }else{console.log(req.user.id);
            User.aggregate([
                 { "$match": {_id: { $ne: req.user.id}}},
                {
                    // "$filter": { _id: { $ne: req.user.id}},
                    "$group" : {
                                _id:"$state",
                                "usersbystate":{$push:"$$ROOT"}
                            },
                },
                // { $unwind: "$state"}
            ])
            .then(users => {
                res.json({users:users});
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving users."
                });
            });
        }
};

// Retrieve and return all users from the database.
exports.addAddress = (req, res) => {

    // Validate request
    if(!req.body.address || (req.body.address && req.body.address == '')) {
        console.log('nik'+req.body.address);
        return res.status(400).send({
            message: "Please enter address"
        });
    }
    User.updateOne(
        { _id: req.user.id }, 
        { $push: { address: req.body.address } },
        // done
    )


    // User.find({ _id: { $ne: req.user.id}})
    .then(users => {
        res.send({ message: 'Address added succesfully!!' });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};
