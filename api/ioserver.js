// var server = require('http').createServer(app);
// var io = require('socket.io').listen(server);

var roomdata = require('roomdata');
var randomColor = require('randomcolor');
var _ = require('lodash');

var io_room_controller = require('./controllers/io/rooms');
var Room = require('./models').Room;
var Game = require('./models').Game;
var User = require('./models').User;

module.exports = function(io) {
  // players connect to api (join game.),
  // game connects to api (create game)

  io.sockets.on('connection', function ( socket ) {
    console.log('client connected ', socket.id);
    socket.emit('connect');
    // Globals set in join that will be available to
    // the other handlers defined on this connection
    var _room, _id, _player;

    _id = socket.id;

    // GENERAL COMMANDS

// player cmmand : join room (do not also create) (duplicate join)
    socket.on('joinRoom', function(data) {
      console.log('join', data);
      if((data.name || data.type == 'game') && data.roomCode) {
      //  io_room_controller.join(io.sockets, socket, data);
        Room.findOne({where: {roomCode: data.roomCode}}).then(function(room) {
          if(room) {
              roomdata.joinRoom(socket, data.roomCode); // use same id as the api room id.

              var players = roomdata.get(socket, "players");
              // room is not yet initialized.
              if(!players) {
                roomdata.set(socket, "players", []);
                roomdata.set(socket, "score", 0);
                roomdata.set(socket, "state", 0);
                roomdata.set(socket, "roomCode", room.roomCode);
              }

              var players = roomdata.get(socket, "players");
              var state = roomdata.get(socket, "state");
              var score = roomdata.get(socket, "score");
              var roomCode = roomdata.get(socket, "roomCode");

              if(data.type == 'game') {
                roomdata.set(socket, "gameSocketId", socket.id);
              } else {
                var player = {"id": socket.id, "name": data.name, "color": randomColor()};
                players.push(player);
                roomdata.set(socket, "players", players);
                socket.broadcast.to( room.roomCode ).emit('playerJoined', {roomCode: room.roomCode, player: player}); // send others that a player joien.
              }
              socket.emit('roomJoined', {roomCode: room.roomCode, players: players, player: player, state: state}); //send the joining player that he has joined.
              // console.log({room_code: rawRoom.roomCode, player: user});
          } else {
            socket.emit('joinRoomFailed', {"message": "Could not find room with roomCode " + data.roomCode});
          }
        });
      } else {
        socket.emit("joinRoomFailed", {message: "Supply the right arguments."});
      }
     // send join to game.
    });

// game command : join room.
    // socket.on('gameJoinRoom', function(data) {
    //   if(data.roomCode) {
    //   //  io_room_controller.join(io.sockets, socket, data);
    //     Room.findOne({where: {roomCode: data.roomCode}}).then(function(room) {
    //       // console.log(room);
    //       if(room) {
    //           console.log('blaa');
    //           roomdata.joinRoom(socket, room.roomCode); // use same id as the api room id
    //           var players = roomdata.get(socket, "players");
    //           var state = roomdata.get(socket, "state");
    //           roomdata.set(socket, "gameSocketId", socket.id);
    //           console.log(players, state, room.roomCode, roomdata.get(socket, "gameSocketId"));
    //           socket.emit('roomJoined', {"roomCode": room.roomCode, "players": players, "state": state}); //send the joining player that he has joined.
    //       } else {
    //         socket.emit('gameJoinRoomFailed', {"message": "Could not find room with roomCode " + data.roomCode});
    //       }
    //     });
    //   } else {
    //     socket.emit("gameJoinRoomFailed", {message: "Supply the right arguments to join a room."});
    //   }
    //  // send join to game.
    // });

// game command : create room .
    // socket.on('gameCreateRoom', function(data) {
    //   if(data.roomCode) {
    //   //  io_room_controller.join(io.sockets, socket, data);
    //     Room.create({name: data.name}).then(function(room) {
    //       // console.log(room);
    //       if(room) {
    //           roomdata.joinRoom(socket, room.roomCode); // use same id as the api room id
    //           // socket.join(data.roomCode);
    //           roomdata.set(socket, "players", []);
    //           roomdata.set(socket, "score", 0);
    //           roomdata.set(socket, "state", 0);
    //           roomdata.set(socket, "roomCode", room.roomCode);
    //           roomdata.set(socket, "gameSocketId", socket.id);
    //           // console.log(players, state);
    //           socket.emit('gameRoomCreated', {roomCode: room.roomCode, players: [], score: 0, state: 0});
    //       }
    //     });
    //   } else {
    //     socket.emit("gameCreateRoomFailed", {message: "Supply the right arguments to create a room."});
    //   }
    //  // send join to game.
    // });

// player command : create room (and join)
    socket.on('createRoom', function(data) {
      if(data.name) {
          Room.create({name: data.name}).then(function(room) {
              // roomdata.joinRoom(socket, room.roomCode); // use same id as the api room id.
              //
              // console.log(roomdata.rooms);
              // // // socket.join(data.roomCode);
              // //
              // // var player = {"id": socket.id, "name": data.name, "color": randomColor()};
              // roomdata.set(socket, "players", []);
              // roomdata.set(socket, "score", 0);
              // roomdata.set(socket, "state", 0);
              // roomdata.set(socket, "roomCode", room.roomCode);
              // if(data.type == 'game') {
              //   roomdata.set(socket, "gameSocketId", socket.id);
              // }

              socket.emit('roomCreated', {roomCode: room.roomCode}); //send the joining player that he has joined.
          })
      } else {
        socket.emit("createRoomFailed", {message: "Supply the right arguments to create a room."});
      }
    });

    socket.on('leave', function(data) {
      // leave(data);
    });

    socket.on('disconnect', function(data) {
      // leave(data);
    })

    var leave = function(data) {
      // io_room_controller.leave(io.sockets, socket, data);
      var players = roomdata.get(socket, "players");
      var roomCode = roomdata.get(socket, "roomCode");
      index = _.findIndex(players, function(player) { return player.id == socket.id });
      if(index != -1) {
        socket.broadcast.to(roomCode).emit('playerLeft', {player: player});
        var newPlayers = players.slice(index);
        roomdata.set(socket, "players", newPlayers);
      }
      socket.emit('roomLeft', {success: true});
      roomdata.leaveRoom(socket);
      //send leave to game.
    }

    socket.on('changeState', function(data) {
      // io_room_controller.changeState(io.sockets, socket, data);


      //send change state. to game.
    });

    // CLIENT COMMANDS
    // socket.on('player.input', function(data) {
    //   //send button click to game.
    //   var roomCode = roomdata.get(socket, "roomCode");
    //   socket.broadcast.to(roomCode).emit('player.input', {player: socket.id, input: data});
    // });

    socket.on('player.input', function(data) {
          //send arrow up game.
        var roomCode = roomdata.get(socket, "roomCode");
        var gameSocketId = roomdata.get(socket, "gameSocketId");
        if(gameSocketId && io.sockets.connected[gameSocketId]!=null) {
          io.sockets.connected[gameSocketId].emit('player.input', {player: socket.id, input: data});
        } else {
          // socket.broadcast.to(roomCode).emit('playerMoveLeft', {player: socket.id});
            socket.broadcast.to(roomCode).emit('error', {message: "Please open the game / lobby."});
        }
    });

    socket.on('game.layout', function(data) {
      var roomCode = roomdata.get(socket, "roomCode");
      socket.broadcast.to(roomCode).emit('game.layout', {layout: data});
    })
    //
    // socket.on('player.arrowLeft', function(data) {
    //   var roomCode = roomdata.get(socket, "roomCode");
    //
    //   // send to game socket if exists.
    //   var gameSocketId = roomdata.get(socket, "gameSocketId");
    //   console.log(gameSocketId,  io.sockets.connected[gameSocketId], roomCode);
    //   if(gameSocketId && io.sockets.connected[gameSocketId]!=null) {
    //     io.sockets.connected[gameSocketId].emit('playerMoveLeft', {player: socket.id});
    //   } else {
    //     // socket.broadcast.to(roomCode).emit('playerMoveLeft', {player: socket.id});
    //       socket.broadcast.to(roomCode).emit('error', {message: "Please open the game / lobby."});
    //   }
    // });
    //
    // socket.on('player.arrowRight', function(data) {
    //     var roomCode = roomdata.get(socket, "roomCode");
    //     socket.broadcast.to(roomCode).emit('playerMoveRight', {player: socket.id});
    // });
    //
    // socket.on('player.arrowUp', function(data) {
    //     var roomCode = roomdata.get(socket, "roomCode");
    //     socket.broadcast.to(roomCode).emit('playerMoveUp', {player: socket.id});
    // });
    //
    // // GAME COMMANDS
    // socket.on('game', function(data) {
    //     // sets this socket to be the game! roomdata?
    //
    //
    // });
    //  function ( data ) {

       // data roomnumber, name


        // Static helper to lookup of a game based on the room
        // Game.findByRoom( data.room, function( err, game ) {
        //
        //    var pcnt = 0, pidx;
        //
        //    if ( game ) {
        //
        //       // Remember this for later
        //       _id = game._id;
        //       _room = game.room;
        //       _player = data.player;
        //
        //       // Another helper to find player by ID in the
        //       // players array.  They should already be there
        //       // since the API functions will have set it up.
        //       pidx = game.findPlayer( _player );
        //
        //       if ( pidx !== false ) {
        //
        //          // Join the room.
        //          socket.join( _room );
        //
        //          // Now emit messages to everyone else in this room.  If other
        //          // players in this game are connected, only those clients
        //          // will receive the message
        //          io.sockets.in( _room ).emit( 'joined' );
        //
        //          // Now, check if everyone is here
        //          game.players.forEach(function( p ) {
        //             if ( p.status == 'joined' )
        //                pcnt++;
        //          });
        //
        //          // If so, update statuses, initialize
        //          // and notify everyone the game can begin
        //          if ( pcnt == game.numPlayers ) {
        //
        //             game.save(function( err, game ) {
        //                io.sockets.in( _room ).emit( 'ready' );
        //             });
        //
        //          }
        //
        //       }
          //  }
        // });
    //  });
  });
  return io;
}
