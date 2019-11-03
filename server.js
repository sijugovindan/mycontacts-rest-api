const 
express = require('express'),
mongoose = require('mongoose'),
bodyParser = require('body-parser'),
jsonwebtoken = require('jsonwebtoken'),

userRouter = require('./src/users/users.routes.js'),
authRouter = require('./src/auth/auth.routes.js'),
contactRouter = require('./src/contacts/contacts.routes.js'),

SERVER_PORT = require('./src/common/config/config.init.js').server_port ,
MONGODB_CONNECTION_STRING = require('./src/common/config/config.init.js').mongodb_connection_url ,
JWT_SECRET = require('./src/common/config/config.init.js').jwt_secret ;

// mongoose connection
// test database
mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true , useUnifiedTopology: true})
.then(() => console.log('Connected to DB!'))
.catch(err => {
console.log(`DB Connection Error: ${err.message}`);
});

const app = express()

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.status(200);
    } else {
        return next();
    }
});

// bodyparser setup
// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
// support parsing of application/json type post data
app.use(bodyParser.json());


app.use((req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
       jsonwebtoken.verify(req.headers.authorization.split(' ')[1], JWT_SECRET, (err, decode) => {
           if (err) 
           {
               console.log(err)
               req.user = undefined;
           }
           req.user = decode;
           next();
       }); 
    } else {
        req.user = undefined;
        next();
    }
});

userRouter.routes(app);
authRouter.routes(app);
contactRouter.routes(app); 

var server = app.listen(SERVER_PORT, () => {
	console.log(`Server listening on port`, server.address().port)
})

 