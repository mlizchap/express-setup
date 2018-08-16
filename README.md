# Express with Mongo Basics
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
- [Error Handling Middleware](#error-handling-middleware)

## Folder Structure 
- **index.js** - point of entry for the app, where the app is imported and the server is started.
- **app.js** - the express app is created and started here, the db cofig and middleware are also setup here.
- **controllers** - an object with various methods to handle endpointes are here.
- **route** - functions for dealing with enpoints are here, the controllers are used within the request methods.
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
    ```javascript
    /* in app.js */
    const express = require('express');    
    
    const app = express();
    ```
    - `app` is an object that is able to take requests from the server and run code 
    
    
### Server Setup
- runs application on a server 
    ```javascript
    /* in index.js */
    const app = require('./app');

    app.listen(3050, () => {
        console.log('Running on port 3050');
    })
    ```
    
### Set up the controller
- the functions that will run when a certain route is reached
    ```javascript
    module.exports = {
        greeting(req, res) {
            res.send({ hi: 'there!!' });
        },
    ```

### Route setup
- the routes file will export functions that run when certain endpoints are hit 
- follows this pattern: `app.<method>(<route>, controller funtion)`
    ```javascript
    const UsersController = require('../controllers/users_controller');

    module.exports = (app) => {
        app.get('/api', test.greeting);
    }
    ```    

### Linking the Routes to the App
- wire up the routes to the app
    - the `routes` file will exports a functions that run when certain endpoints are hit 
    ```javascript
    routes(app);
    ```

### Set up the DB     
- set up the database connection
    ```javascript
    const mongoose = require('mongoose');
    
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/users_practice');
    mongoose.connection 
        .once('open',() => { console.log('db open'); })
        .on('error', () => (error) => console.warn('Warning', error))
    ```
    
### Models 
- the model determines how data can be stored organized and manipulated 
- the `schema` describes the orgnazination of the data
    ```java
    /* in models/<modelName> folder */ 
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
- in the *app file:, use bodyParser to parse the body of requests
    ```javascript
    const bodyParser = require('body-parser')

    app.use(bodyParser.json());
    ```
- in the controller file: import the model and create the function 
    ```javascript
    create(req, res) {
        const recipeProps = req.body;

        Recipe.create(recipeProps)
            .then(recipe => res.send(recipe))
    },
    ```

- in the routes file: wire up the controller with the `post()` method
   ```javascript
   app.post('/api/new', controller.create)
   ```
- *to test*: use post man, create a body and use the post request method.  
    
### Getting Data
- create a controller called index that uses the `find()` method (`.find({})` finds all the data)
    ```javsacript
    index(req, res) {
        User.find({})
            .then(users => res.send(users))    
    }
    ```
- wire up the controller in the router file with the `get()` method
```javascript
app.get('/api', controller.index);
```

### Deleting Data
- create the delete controller with the `delete()` method
    ```javascript
    delete(req, res) {
        const id = req.params.id;

        Recipe.findByIdAndRemove({ _id: id })
            .then(recipe => res.send(recipe))
    }
    ```
 - wire up the controller in the router file
 
 ### Editing Data 
 - create the controller with the `put()` method
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
     ```javascript
     app.put('/api/:id', controller.edit)
     ```
 
 ## Error Handling Middleware 
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
            <span style="color:yellow">catch(next)</span>
    }
     ```

 - now if you run the edit/delete methods in postman with incorrect ids, instead of pasing the application like it did previously, the middleware will run (`app.use`) and respond with an error message.
    
    
    
    




