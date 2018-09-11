# Mongo with Express Basics
- **Node**: a runtime environment that allows Javascript to be run outside of the browser
- **Express**: a framework for Node for handling HTTP requests 

## Examples 
- [Mongo Express User App](https://github.com/mlizchap/mongo-express-user-app)
- [Recipe App Backend](https://github.com/mlizchap/recipe-app-backend)

## TOC
- [Folder Structure](#folder-structure)
- [Setup](#setup)
    - [Install Modules](#install-express-and-other-modules)
    - [Application Setup](#the-application-setup)
    - [Server Setup](#server-setup)
    - [Controller Setup](#set-up-the-controller)
    - [Route Setup](#route-setup)
    - [Linking the App and Routes](#linking-the-routes-to-the-app)
    - [Database Setup](#set-up-the-db)
    - [Creating the Model](#models)
- [CRUD functionality](#crud-functionality-of-data)
    - [CREATE](#creating-data)
    - [READ](#getting-data)
    - [UPDATE](#editing-data) 
    - [DESTROY](#deleting-data)
- [Middleware](#middleware)
    - [Error Handling](#error-handling-middleware)
    - [CORS](#cors)

## Folder Structure 
- **index.js** - point of entry for the app, where the app is imported and the server is started.
- **app.js** - the express app is created and started here, the db cofig and middleware are also setup here.
- **controllers** - an object with various methods to handle endpointes are here.
- **router.js** - functions for dealing with enpoints are here, the controllers are used within the request methods.
- **models** - where the schema for the data is created and exported
- **package.json** - contains the packages and scripts, among other things, for the application.

## Setup 
### Install Express and Other Modules 
- create an express application
    ```javascript
    $ npm install express mongoose body-parser mongo --save
    ```

### The Application Setup
- this is the file where our express application is configured
- set up the express application 
- in `app.js`
    ```javascript
    const express = require('express');    
    
    const app = express();
    
    module.exports = app;
    ```
    - `app` is an object that is able to take requests from the server and run code 
    
    
### Server Setup
- runs application on a server 
- in `index.js`
    ```javascript
    const app = require('./app');

    app.listen(3050, () => {
        console.log('Running on port 3050');
    })
    ```
    
 *at this point when you run node index.js the server should run and you should see the log in the console*
    
### Set up the controller
- the functions that will run when a certain route is reached
- in `controllers/<controllerName>.js`
    ```javascript
    module.exports = {
        greeting(req, res) {
            res.send({ hi: 'there!!' });
        },
    ```

### Route setup
- exports functions that takes an arg of app and runs certain controller functions on the app depending on the endpoint hit
- follows this pattern: `app.<method>(<route>, controller funtion)`
- in `router.js`
    ```javascript
    const controller = require('../controllers/users_controller');

    module.exports = (app) => {
        app.get('/api', controller.greeting);
    }
    ```    

### Linking the Routes to the App
- wire up the routes to the app, the functions in router will use the application as the arg
- the `router.js` file 
- in `router.js`
    ```javascript
    const router = require('./router');

    routes(app);
    ```
    
*at this point you should be able to go to the api endpoint and seee the greeting returned from the greeting controller* 

### Set up the DB     
- set up the database connection
- in `app.js`
    ```javascript
    const mongoose = require('mongoose');
    
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/users_practice');
    mongoose.connection 
        .once('open',() => { console.log('db open'); })
        .on('error', () => (error) => console.warn('Warning', error))
    ```
*to make sure db was created via terminal: 
    $ mongo somewhere.mongolayer.com:10011/my_database -u username -p password 
    > show collections (your db should appear) 
    
### Models 
- the model determines how data can be stored organized and manipulated 
- the `schema` describes the orgnazination of the data
- in models/<ModelName>.js 
    ```java
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    const UserSchema = new Schema({
        name: String,
        password: String 
    });

    const User = mongoose.model('user', UserSchema);

    module.exports = User;
    ```

## CRUD Functionality of Data
### Creating Data
- install and use bodyParser to parse the body of requests
- in `app.js`
    ```javascript
    const bodyParser = require('body-parser')

    app.use(bodyParser.json());
    ```
- in the controller file: import the model and create the function 
- in `controllers/<controllerName>/js`
    ```javascript
    const Recipe = require('../models/Recipe');
    
    create(req, res) {
        const recipeProps = req.body;

        Recipe.create(recipeProps)
            .then(recipe => res.send(recipe))
    },
    ```
- wire up the controller with the `post()` method
- in `router.js`
   ```javascript
   app.post('/api/new', controller.create)
   ```
*to test out 
- use post man, create a body and use the post request method
- in terminal:
> show dbs
> use <db name>
> show collections
> db.<collectionName>.find(); (the data you have just created should be here)
    
### Getting Data
- create a controller called index that uses the `find()` method (`.find({})` finds all the data)
- in `controllers/<controllerName>/js`
    ```javsacript
    index(req, res) {
        User.find({})
            .then(users => res.send(users))    
    }
    ```
- wire up the controller in the router file with the `get()` method
- in `router.js`
    ```javascript
    app.get('/api', controller.index);
    ```
*should be able to go to /api and see the data*

### Deleting Data
- create the delete controller with the `delete()` method
- in `controllers/<controllerName>/js`
    ```javascript
    delete(req, res) {
        const id = req.params.id;

        Recipe.findByIdAndRemove({ _id: id })
            .then(recipe => res.send(recipe))
    }
    ```
 - wire up the controller in the router file
 - in `router.js`
     ```javascript
     app.delete('/api/users/:id', UsersController.delete);
     ```
     
 *you should be able to go to api/users/<id#> and then when you do the get request it is no longer there*
 
 ### Editing Data 
 - create the controller with the `put()` method
 - in `controllers/<controllerName.js`
    ```javascript
    edit(req, res) {
        const id = req.params.id;
        const recipeProps = req.body;

    Recipe.findOneAndUpdate({ _id: id }, recipeProps)
        .then(() => Recipe.findById({ _id: id}))
        .then(recipe => res.send(recipe))
    }
    ```
 - wire up the controller in the router file
 - in `router.js`
     ```javascript
     app.put('/api/:id', controller.edit)
     ```
 *to try out:
 - as a put request in postman - go to api/<id#>
 - change the body to what you want to change
 - when you send and do a get index request the updated data should show 
 
 ## Middleware
 ### Error Handling Middleware 
  - Currently, if an id for the delete and edit functions are not found it gets stuck.  Error handling lets the user know there was an error instead of pausing the application
 - Middleware will have access to the request and response object, the `next` function, and the error object 
    - **error object**: will be defined if the previous middleware throws an error
    - **next**: a function that when run, goes to the next middleware
    ```java
    /****/
    routes(app);
    
    app.use((err, req, res, next) => {
        res.status(422).send({ error: err.message});
    })
    ```
 - use the `next()` function in the controllers, if theres an error the `catch` block will run with `next`, allowing the code to go to the middleware (`app.use`)
     ```javascript
     edit(req, res, next) {
        const userId = req.params.id;
        const userProps = req.body;

        User.findOneAndUpdate({ _id: userId }, userProps)
            .then(() => User.findById({ _id: userId }))
            .then(user => res.send(user))
            .catch(next)
    },
    
    delete(req, res, next) {
        const userId = req.params.id;

        User.findByIdAndRemove({ _id: userId }) 
            .then(user => res.send(user))
            catch(next);
    }
     ```

 *now if you go in postman and try to delete or edit an id that doesn't exist, an error message will be the response*
    
    
### CORS
- allows for cross origin resource sharing
    ```javascript
    const cors = require('cors')

    app.use(cors())
    ```




