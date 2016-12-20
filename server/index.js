var express = require('express')
var jwt = require('express-jwt')
var cors = require('cors')

var app = express()

app.use(cors());

var jwtCheck = jwt({
  secret: process.env.AUTH0SECRET,
  audience: process.env.AUTH0CLIENTID
});

app.get('/api', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/users', jwtCheck, (req, res) => {
  res.json([{
    name: 'Jim Cummins',
    email: 'jimthedev@gmail.com'
  }])
})

app.listen(3001, () => {
  console.log('Example app listening on port 3001!')
})
