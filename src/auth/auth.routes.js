const 
authCntrl = require('../auth/controllers/auth.controller.js'); 

//Resource : auth (token)
//REST API Endpoints: http url/resource/{optional resource id}
//Routes calls to login

exports.routes = function (app) { 

//Step 2: Registered user : Login
//creates and return tokens

app.post('/auth', [
    authCntrl.hasValidAuthInputs,
    authCntrl.login
]);

} //end routes()

