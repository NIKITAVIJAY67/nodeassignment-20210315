const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema({
    username: {type: String,required: true,unique: true,index: true},
    firstname: String,
    lastname: String,
    password: String,
    email: {type: String,required: true,unique: true,index: true},
    phone: String,
    token: String,
    state: String,
    address: {type:Array,default:[]}
}, {
    timestamps: true
});
module.exports = mongoose.model('Users', UsersSchema);