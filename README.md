# mycontacts-rest-api
REST APIs for managing contacts

set the intial configurations in config.init.js under src/common/config

-server port
-mongoDB (Atlas) connection string
-JWT secret

To install dependencies:
=========================
#npm install

To start server:
========================

#npm start

Testing
=========================
API end points:


Register User - /users

Login user(auth) - /auth

Create a contact - /contacts 

Update a contact - /contacts/:contactId

get list of all his/her contacts by page - /contacts
( set body query strings 'limit' and 'page' )

other REST API calls not supported now

Authentication implemented by JWT

Refresh token and Access control not implemented




