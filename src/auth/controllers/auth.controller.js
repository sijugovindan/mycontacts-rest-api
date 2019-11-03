const 
mongoose = require('mongoose'),
bcrypt = require('bcrypt'),
jwtoken = require('jsonwebtoken'),
modelusr = require('../../users/models/users.model.js'),
JWT_SECRET = require('../../common/config/config.init.js').jwt_secret,
Users = mongoose.model('Users', modelusr.UserSchema);


exports.login = (req, res) => {

    Users.findOne({email: req.body.email}, (err, user) => {
        if (err) throw err;
        if (!user) {
            res.status(401).json({ message: 'Authentication failed. No user found with the email!'});
        } else if (user) {
            if (!comparePassword(req.body.password, user.hashpwd)) {
                 res.status(401).json({ message: 'Authentication failed. Wrong password!'});
        } else {
            console.log(user.id)
            return res.json({token: jwtoken.sign({ email: user.email, username: user.username, _id: user.id}, JWT_SECRET)});
        }
     }
    }); 
}

const comparePassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword);
};

exports.hasValidAuthInputs = (req, res, next) => {
    let errors = [];

    if (req.body) {
        if (!req.body.email) {
            errors.push('Missing email field');
        }
        if (!req.body.password) {
            errors.push('Missing password field');
        }

        if (errors.length) {
            return res.status(400).send({errors: errors.join(',')});
        } else {
            return next();
        }
    } else {
        return res.status(400).send({errors: 'Missing email and password fields'});
    }
};


