var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors')

require('dotenv').config();

var index = require('./routes/index')

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())


app.use('/', index);

app.listen(3000, function () {
  console.log('StickStack is listening on port 3000!')
})

module.exports = app;
