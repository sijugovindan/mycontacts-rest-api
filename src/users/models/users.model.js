var mongoose = require ('mongoose');
var bcrypt = require ('bcrypt');

const Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    email_verified: {
        type:Boolean,
        default:false,
        required:true
    },
    hashpwd: {
        type: String,
        required: true
    },
    role: { 
        type: Number,
        default:1,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now 
     }
}, { collection : 'Users' });
module.exports = mongoose.model('Users', UserSchema) 
 