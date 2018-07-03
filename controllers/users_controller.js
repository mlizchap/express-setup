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