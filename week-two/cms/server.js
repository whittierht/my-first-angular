var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var index = require('./server/routes/app');
var documents = require('./server/routes/documents');
var messages = require('./server/routes/messages');
var contacts = require('./server/routes/contacts');

var app = express();

mongoose.connect('mongodb://localhost:27017/cms')
  .then(function() {
    console.log('Connected to database!');
  })
  .catch(function(err) {
    console.log('Connection failed: ' + err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger('dev'));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use(express.static(path.join(__dirname, 'dist/cms/browser')));

app.use('/', index);
app.use('/documents', documents);
app.use('/messages', messages);
app.use('/contacts', contacts);

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/cms/browser/index.html'));
});

var port = process.env.PORT || '3000';
app.set('port', port);

var server = http.createServer(app);

server.listen(port, function() {
  console.log('API running on localhost: ' + port);
});
