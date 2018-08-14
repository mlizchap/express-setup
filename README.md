# mongo-express-basic
- **Node**: a runtime environment that allows Javascript to be run outside of the browser
- **Express**: a framework for Node for handling HTTP requests 

## Examples 
[Mongo Express User App](https://github.com/mlizchap/mongo-express-user-app)

## TOC
- [Folder Structure](#folder-structure)
- [Server Setup](#server-setup)
- [Application Setup](#the-application-setup)
- [Routes](#routes)
- [Controllers](#controllers)
- [Models](#models)

## Folder Structure
- controllers
- models
- router 
- app.js
- index.js
- package.json 

## Server Setup
- runs application on a server 
    ```javascript
    /* in index.js */
    const app = require('./app');

    app.listen(3050, () => {
        console.log('Running on port 3050');
    })
    ```

## The Application Setup
- this is the file where our express application is configured
- set up the express application 
    ```javascript
    /* in app.js */
    const app = express();
    ```
    - `app` is an object that is able to take requests from the server and run code 
- set up the database connection
    ```javascript
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/users_practice');
    mongoose.connection 
        .once('open',() => { console.log('db open'); })
        .on('error', () => (error) => console.warn('Warning', error))
    ```
- body-parser allows us to parse the body of http requests 
    ```javascript
    app.use(bodyParser.json());
    ```
- wire up the routes to the app
    - the `routes` file will exports a functions that run when certain endpoints are hit 
    ```javascript
    routes(app);
    ```
- setup middleware, middleware will have access to the request and response object, the `next` function, and the error object 
    - **error object**: will be defined if the previous middleware throws an error
    - **next**: a function that when run, goes to the next middleware
    ```java
    app.use((err, req, res, next) => {
        res.status(422).send({ error: err.message});
    })
    ```
- export the app 
    ```javascript
    module.exports = app;
    ```

## Routes
- the routes file will export functions that run when certain endpoints are hit 
    ```javascript
    const UsersController = require('../controllers/users_controller');

    module.exports = (app) => {
        app.get('/api', UsersController.greeting);
        app.get('/api/users', UsersController.index);
        app.post('/api/users', UsersController.create);
        app.put('/api/users/:id', UsersController.edit);
        app.delete('/api/users/:id', UsersController.delete);
    }
    ```

## Controllers 
- the controller file exports an object that contains methods for handling routes 
    ```javascript
    const User = require('../models/user');

    module.exports = {
        greeting(req, res) {
            res.send({ hi: 'there!!' });
        },

        index(req, res) {
            User.find({})
                .then(users => res.send(users))
        },

        create(req, res) {
            const userProps = req.body;

            User.create(userProps)
                .then(driver => res.send(driver))
        },

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
                .catch(next);
        }
    }
    ```

### Models 
- the model determines how data can be stored organized and manipulated 
- the `schema` describes the orgnazination of the data
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
