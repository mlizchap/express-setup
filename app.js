const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express(); // app = an object that takes requests, and runs code inside our app 
const routes = require('./router/routes');

//DB CONNECTION
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/users_practice');
mongoose.connection 
    .once('open',() => { console.log('db open'); })
    .on('error', () => (error) => console.warn('Warning', error))

app.use(bodyParser.json());

routes(app); 

app.use((err, req, res, next) => {
     // err: error object -> will be defined if prev middleware throws an error
    // next: a fn that when run -> goes to the next middleware
    res.status(422).send({ error: err.message});
})

module.exports = app;