var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);

app.set('views', __dirname + '/views')
app.engine('jade', require('jade').__express)
app.set('view engine', 'jade')
// app.use(require('favicon'));
// app.get('/client/*', function(req, res) {
//   res.sendFile(__dirname + 'public/client/index.html');
// });
//
// app.get('/server/*', function(req, res) {
//   res.sendFile(__dirname + '/public/server/index.html');
// });

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api', require('./routes'))

module.exports = app
