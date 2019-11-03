const 
mongoose = require('mongoose'),
bcrypt = require('bcrypt'),
modelusr = require('../../users/models/users.model.js'),
Users = mongoose.model('Users', modelusr.UserSchema);


//checks whether user with email exists
//Else creates a unique userId
exports.register = (req, res) => {
    Users.findOne({email: req.body.email}, (err, user) => {

        if (err) {
            throw err;
        }
        if (user) {
            res.status(401).json({ message: 'Registration failed. Email exists!'});
        } else {
            const newUser = new Users(req.body);
            newUser.hashpwd = bcrypt.hashSync(req.body.password, 10);
            newUser.save((err, user) => {
                if (err) {
                    return res.status(400).send({message: err});
                } else {
                    user.hashpwd = undefined;
                    return res.status(201).json(user);
                    //return res.status(201).json({id:user._id, username: user.username,email: user.email});
                }
            })
        }
    });
}

exports.hasToken = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized user!'});
    }
}

exports.hasValidRegisterInputs = (req, res, next) => {
    let errors = [];

    if (req.body) {
        if (!req.body.email) {
            errors.push('Missing email field');
        }
        if (!req.body.password) {
            errors.push('Missing password field');
        }
        if (!req.body.username) {
            errors.push('Missing username field');
        }
        if (errors.length) {
            return res.status(400).send({errors: errors.join(',')});
        } else {
            return next();
        }
    } else {
        return res.status(400).send({errors: 'Missing username, email and password fields'});
    }
}
 