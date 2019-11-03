const
mongoose = require ('mongoose'),
Schema = mongoose.Schema;

ObjectId = Schema.ObjectId;

var ContactSchema = new Schema({
    
    ref_userid: {
        // references objectID in User Schema
        type:ObjectId,  
        required: true,
        //select:false
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now 
     }
}, { collection : 'Contacts' });
  
module.exports = mongoose.model('Contacts', ContactSchema) 
