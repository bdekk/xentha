var app = require('./src/app/app');
var models = require("./src/app/models");

//http server with sockets.
//var ioserver = require('./ioserver');
var server = require('http').Server(app);
// var io = require('socket.io')(server, {'pingInterval': 45000});
var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({ server: server })

// io.sockets.on('connection', function ( socket ) {
//   console.log('client connected ', socket.id);
// });
io = require('./src/app/ioserver')(wss);

models.sequelize.sync().then(function () {
  server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
  });
});

// server.listen(app.get('ioport'),function() {
// 	console.log('HTTPServer with websockets is listening on port ' + app.get('ioport'));
// });
