if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config(); // environment variables, used for hiding secrets
}
var express = require('express'); // making apis, a webserver
var expressJWT = require('express-jwt'); // jsonwebtoken for express, allow us to limit access to certain routes
var cors = require('cors'); // only used for dev, but helps to avoid angry browsers
var bodyParser = require('body-parser');  // lets us get fields and values from the body of a JSON POST request
var Sequelize = require('sequelize'); // ORM (object relational mapper), fancy way of saying it maps objects to our database
var jwt = require('jsonwebtoken'); // Allows us to decrypt tokens, useful for getting info about if the user signed up using Twitter or Facebook, etc.
var auth0 = require('auth0'); // Allows us to use the result of the decrypted token to get extended profile information about the user.

// Our HTTP backend must be able to connect back to auth0's
// user management API in the background in order to get
// extended user information like names, profile images.
//
var ManagementClient = auth0.ManagementClient;
var management = new ManagementClient({
  // The auth0 management token with read users and read users
  // metadata permissions. You can generate this on the left
  // hand side of this website (see Token Generator):
  // https://auth0.com/docs/api/management/v2
  //
  token: process.env.AUTH0USERMANAGEMENTTOKEN,
  domain: process.env.AUTH0DOMAIN // Your auth0 domain
});

// This is how we connect to our database where we'll store data
//
var sequelize = new Sequelize(process.env.DATABASE_URL);

// We need to define models. A model describes the structure of
// something that we want to store in the database. On each model
// we define each of the fields on that model. We can also decide
// to have different internal and external field names. Internal
// fields would be the column names in the database, external are
// what you would use in your code.
//
var Person = sequelize.define('person', {
  firstName: {
    type: Sequelize.STRING,
    
    // Will result in an attribute that is firstName when contact facing but first_name in the database
    //
    field: 'first_name'
  },
  lastName: {
    type: Sequelize.STRING
  },
  createdBy: {
    type: Sequelize.STRING
  }
}, {
  // Model tableName will be the same as the model name
  //
  freezeTableName: true
});

// THIS IS THE DON'T GET FIRED CLAUSE
// Seeding (or preloading) your database gives it dummy data
// so that development isn't a graveyard. In production we
// probably don't want to delete the entire database :)
//
if(process.env.NODE_ENV !== 'production') {
  
  // Remove all people from the database when the server starts
  //
  Person.sync({force: true}).then(function () {
    
    // Some sample people
    //
    var people = [
      {
        firstName: 'James',
        lastName: 'Cummins (Twitter)',
        createdBy: 'twitter|12895692'
      },
      {
        firstName: 'Jim',
        lastName: 'Cummins (FB)',
        createdBy: 'facebook|10103835198194040'
      },
    ];
    
    // Actually insert all of the people
    //
    return people.map((person) => {
      return Person.create(person)
    });
    
  });
}

// Create a new express app
//
var app = express()

// Teach express how to parse requests of type application/json
//
app.use(bodyParser.json());

// Teach express how to parse requests of type application/x-www-form-urlencoded
//
app.use(bodyParser.urlencoded({ extended: true }));

// Tell epress to allow CORS in development
//
if(process.env.NODE_ENV !== 'production') {
  app.use(cors());
}

// Create a check so that we can deny access to routes if
// the front end forgets to send an auth0 token
//
var jwtCheck = expressJWT({
  secret: process.env.AUTH0SECRET,
  audience: process.env.AUTH0CLIENTID
});

// BOILERPLATE: Get the encrypted token envelope off of the http request.
//
function getJWTToken(req)
{
  var parts = req.headers.authorization.split(' ');
  if (parts.length === 2) {
    var scheme = parts[0];
    var credentials = parts[1];
    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    }
  }
  return false;
}

// A basic route with no functionality and no security protection
app.get('/api', (req, res) => {
  res.send('Hello World!')
})

// A more advanced route that will return a 401 unauthorized if
// the front end does not pass a token in the headers. This is
// accomplished thanks to putting the jwtCheck middleware here.
app.get('/api/contacts', jwtCheck, (req, res) => {
  
  // Get the encrypted token out of the request
  var token = getJWTToken(req);
  
  // Verify a token, getting the decrypted envelope
  jwt.verify(token, process.env.AUTH0SECRET, function(err, decodedToken) {
    
    // Find all people/contacts created by the currently logged in user
    Person.findAll({
      where: {
        createdBy: {
          $eq: decodedToken.sub // get the user id from the decrypted envelope
        }
      }
    }).then((people) => {
      res.json(people);
    })
  });
})

// Create a new contact, make sure the current user has authenticated
app.post('/api/contacts', jwtCheck, (req, res) => {
  
  // Get the token off of the http request
  var token = getJWTToken(req);
  
  // Verify a token, getting the decrypted envelope
  jwt.verify(token, process.env.AUTH0SECRET, function(err, decodedToken) {
    
    // Connect to auth0's user management API to get all the users
    // but filter out any that we don't care about.
    management
      .getUsers()
      .then((users) => {
        var matchedUsers = users.filter((user) => {
          // console.log(decodedToken.sub, user.user_id);
          return user.user_id === decodedToken.sub;
        })
        // console.log(matchedUsers);
        
        // Create a new contact and associate its createdBy field
        // with the currently logged in user
        return Person.create({
          firstName: req.body.first,
          lastName: req.body.last,
          createdBy: matchedUsers[0].user_id
        })
        .then(() => {
          res.send('Hello World!');
        });
      })
      .catch(function (err) {
        // Handle error.
        console.error(err);
      });
    });

})

// Delete a contact
//
app.delete('/api/contacts/:contactId', jwtCheck, (req,res) => {
  // Get the encrypted token out of the request
  var token = getJWTToken(req);
  
  // Verify a token, getting the decrypted envelope
  jwt.verify(token, process.env.AUTH0SECRET, function(err, decodedToken) {
    
    // Destroy any contacts matching that id where the currently logged in user also created them.
    Person.destroy({
      where: {
        id: req.params.contactId,
        createdBy: {
          $eq: decodedToken.sub
        }
      },
    }).then(()=>{
      res.send('deleted')
    });
  });
})
var port = process.env.PORT ? process.env.PORT : 3001
app.listen(port, () => {
  console.log('Example app listening on port ' + port + '!')
})
