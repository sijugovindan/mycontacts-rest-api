const 
phbCntrl = require('./controllers/contacts.controller.js'),
usrCntrl = require('../users/controllers/users.controller.js');


//REST API Endpoints: http url/resource/{optional resource id}
//Resource : Contacts
//Routes calls to get contacts, create new contact, update a new contact

exports.routes = function (app) { 

/* All the following API calls need token authentication */
/* Access control by role, not implemented */

// List all contacts - supports paginations by query params

app.get('/contacts',[
    usrCntrl.hasToken,
    phbCntrl.get
]);

//Create a contact with a new ID 
app.post('/contacts', [
    usrCntrl.hasToken,
    phbCntrl.create
]);

// Update the data or add new property for an existing contactId in his/her contacts.
app.patch('/contacts/:id',[
    usrCntrl.hasToken, 
    phbCntrl.hasValidContactId,
    phbCntrl.hasValidModifyContactInputs,
    phbCntrl.modify
]);



/*
 * For any undefined routes, return a 404.
 */
app.get("*", (req, res) => {
    res.status(404).json({error:"Not Supported", error_code:404})
 });

 app.post("*", (req, res) => {
    res.status(404).json({error:"Not Supported", error_code:404})
 });

 app.put("*", (req, res) => {
    res.status(404).json({error:"Not Supported", error_code:404})
 });

 app.patch("*", (req, res) => {
    res.status(404).json({error:"Not Supported", error_code:404})
 });

 app.post("*", (req, res) => {
    res.status(404).json({error:"Not Supported", error_code:404})
 });

 app.delete("*", (req, res) => {
    res.status(404).json({error:"Not Supported",  params: req.params, error_code:404})
 });

} 

