var app = require('./app');
var models = require("./models");

//http server with sockets.
//var ioserver = require('./ioserver');
var server = require('http').Server(app);
var io = require('socket.io')(server, {'pingInterval': 45000});

// io.sockets.on('connection', function ( socket ) {
//   console.log('client connected ', socket.id);
// });
io = require('./ioserver')(io);

models.sequelize.sync().then(function () {
  server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
  });
});

// server.listen(app.get('ioport'),function() {
// 	console.log('HTTPServer with websockets is listening on port ' + app.get('ioport'));
// });
