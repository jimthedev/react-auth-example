var express = require('express')
var jwt = require('express-jwt')
var cors = require('cors')

var app = express()

app.use(cors());

var jwtCheck = jwt({
  secret: '',
  audience: 'DtNrgjwW8mHh5rm5rPwwL1663JVw34Fu'
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
