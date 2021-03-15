const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

const DB = 'mongodb+srv://NikVj:NikitaVijay@cluster0.auyu3.mongodb.net/nodetest?retryWrites=true&w=majority';
// middleware = (req,res,next) =>{
// 	console.log('in Middleware');
// }

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});
require('./app/routes/users.routes.js')(app);

// listen for requests
app.listen(7270, () => {
    console.log("Server has been started on localhost:7270");
});

// Configuring the database
// const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
// mongoose.connect(dbConfig.url, {
mongoose.connect(DB, {
    useNewUrlParser: true,useCreateIndex:true,useUnifiedTopology: true,useFindAndModify: false,
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});