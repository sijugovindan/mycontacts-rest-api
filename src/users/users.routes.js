const 
usrCntrl = require('./controllers/users.controller.js'); 

//Resource : users
//REST API Endpoints: http url/resource/{optional resource id}
//Routes calls to register

exports.routes = function (app) { 


//Step 1: New user: Register with email and password
app.post('/users',[
    usrCntrl.hasValidRegisterInputs,
    usrCntrl.register
]);


} //end routes()

