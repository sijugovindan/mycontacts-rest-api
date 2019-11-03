const mongoose = require('mongoose'),
modelsch = require('../models/contacts.model'),
Contact = mongoose.model('Contacts', modelsch.ContactSchema);

//Pagination limit
const MAX_ITEMS_PER_PAGE = 50
const MAX_LIMIT_ITEMS_PER_PAGE = 10

//get list of user's contacts by page
//implements GET list
 exports.get= (req, res) => {
    let limit = MAX_ITEMS_PER_PAGE;
    let pageid = 0;
    if (req.query) {
        if(req.query.limit)
        {
            if(parseInt(req.query.limit) <=0 )
                return res.status(400).send({errors: 'Page query limit need to be greater than or equal to 1'});
                
            limit = req.query.limit && req.query.limit <= MAX_ITEMS_PER_PAGE ? parseInt(req.query.limit) : MAX_ITEMS_PER_PAGE;
        
        }
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            pageid = Number.isInteger(req.query.page) ? req.query.page : 0;
            if (pageid <=0)
                return res.status(400).send({errors: 'Page number need to be greater than or equal to 1'});
        }
        else
            return res.status(400).send({errors: 'Page number required'})
    }
    else
        return res.status(400).send({errors: 'Page number query required'});
    getContacts(req, res, limit, pageid);
}

//helper or db function for getlist. 
//supports pagination
const getContacts = (req, res, perPage, page) =>{

    Contact.find({ref_userid: req.user._id})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec((err, contact) => {

        Contact.find({ref_userid: req.user._id})
        .countDocuments()
        .exec((err, count) => {

            if (err) return next(err)

            let  rem = (Math.ceil(count / perPage) - page);
            let  remItems = count - (page*perPage)
            if (remItems <=0) {
             remItems = 0;
            }
            if (rem <=0) {
             rem = 0;
            }
            res.status(200).json({contact,max_items_perPage:perPage,currentPage:page, 
            num_remaining_pages:rem,num_remaining_items:remItems});
        })
    })
}

// Create a new contact 
// Return new contact ID (REST resource ID)
// Simply inserts a new entry in phoneBook even if same name and/or same phone exists
// implements POST 
exports.create = (req, res) => {
    let newContact = new Contact(req.body);
    console.log(req.user);
    newContact.ref_userid = req.user._id;
    newContact.save((err, contact) => {
        if (err) {
            res.send(err);
        }
        console.log(contact)
        res.status(201).json({id:contact._id});
    });
};


//Expects a existing contact ID (REST resource ID)
//Modify any property or add a new property in the existing contact
//implements PATCH
exports.modify = (req, res) => {

    //check req.body mot undefined and has atleast one of data fields, ensure params not undefined
    //check whether the contactid passed belongs to users contact list
    //Contact.update({_id :req.params.id},{$set : {: "value"}}
        Contact.findOneAndUpdate({ _id: req.params.id}, req.body, { new: true, useFindAndModify: false }, (err, contact) => {
            if (err) {
                console.log(err)
                res.send(err);
            }
            res.json({Success:'204'})
        })
}

exports.hasValidModifyContactInputs = (req, res, next) => {
    let errors = [];
    
    if (req.body) {
        console.log(req.body);
        if (!req.body.name && !req.body.phone && !req.body.company) {

            errors.push('Missing updatable ,,,,,fields');
        }
        if (errors.length) {
            return res.status(400).send({errors: errors.join(',')});
        } else {
            return next();
        }
    } else {
        return res.status(400).send({errors: 'Missing body'});
    }
};

exports.hasValidContactId = (req, res, next) => {
    
    Contact.findById({_id: req.params.id}, (err, contact) => {

    if (err) {
        return res.status(400).send({errors:"Inavlid contactID"});
    }
    else 
    if (isEmptyObject(contact)) {
        return res.status(400).send({errors:"Cannot find contactID"});
    }
    else 
    if( contact.ref_userid != req.user._id)
    {
           return res.status(400).send({errors:"Not permitted"});
    }
    next();
    })
}

function isEmptyObject(obj) {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  }




