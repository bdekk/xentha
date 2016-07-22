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

  io.sockets.on('connection', function ( socket ) {

    socket.on('ping', function(data) {
        socket.emit('pong', new Date());
    });

    socket.on('joinRoom', function(data) {
      console.log('join', data);
      if(data.roomCode) {
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
                roomdata.set(socket, "host", null);
              }

              var players = roomdata.get(socket, "players");
              var state = roomdata.get(socket, "state");
              var score = roomdata.get(socket, "score");
              var roomCode = roomdata.get(socket, "roomCode");
              var host = roomdata.get(socket, "host");

              if(data.type == 'game') {
                roomdata.set(socket, "gameSocketId", socket.id);
              } else {
                if(!host) {
                  roomdata.set(socket, "host", socket.id);
                  host = socket.id;
                }
                if(data.user) { // user is logged in :)

                }
                var name = (data.user) ? data.user.username : 'player ' + players.length + 1; //if the player did not fill in a name, make one up.
                var player = {"id": socket.id, "name": name, "color": randomColor(), "host": host == socket.id};
                players.push(player);
                roomdata.set(socket, "players", players);
                console.log(room.roomCode, player);
                socket.broadcast.to( room.roomCode ).emit('player.joined', {roomCode: room.roomCode, player: player}); // send others that a player joien.
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

    socket.on('createRoom', function(data) {
      Room.create({name: data.name}).then(function(room) {
          socket.emit('roomCreated', {roomCode: room.roomCode}); //send the joining player that he has joined.
      })
    });

    socket.on('leave', function(data) {
      // leave(data);
    });

    socket.on('game.disconnect', function(data) {
      io.sockets.connected[data.id].emit('game.disconnect', data);
    });

    // send by the game to one player
    socket.on('game.score', function(data) {
      io.sockets.connected[data.id].emit('game.score', {score: data.score});
    });

    // send by the game to players
    socket.on('game.die', function(data) {
      io.sockets.connected[data.id].emit('game.die', {die: true});
    });

    // send by the game to players
    socket.on('game.end', function(data) {
      var roomCode = roomdata.get(socket, "roomCode");
      socket.broadcast.to(roomCode).emit('game.end', {
        time: data.time,
        players: data.players,
        score: data.score
      });
    });

    // send custom event to player(s).
    socket.on('game.send', function(obj) {
      var roomCode = roomdata.get(socket, "roomCode");
      if(obj.event && obj.data && obj.player) {
        io.sockets.connected[obj.player].emit(obj.event, obj.data);
      } else if(obj.event && obj.data) {
        socket.broadcast.to(roomCode).emit(obj.event, obj.data);
      } else {
        console.log('could not send custom even to player.');
      }
    });

    // send custom event to game.
    socket.on('player.send', function(obj) {
      var gameSocketId = roomdata.get(socket, "gameSocketId");
      if(gameSocketId && io.sockets.connected[gameSocketId]!=null) {
        if(obj.event && obj.data) {
          io.sockets.connected[gameSocketId].emit(obj.event, obj.data);
        } else {
          console.log('could not send custom even to player.');
        }
      }
    });

    // send by the game to players
    socket.on('game.start', function(data) {
      var roomCode = roomdata.get(socket, "roomCode");
      socket.broadcast.to(roomCode).emit('game.start', {
        players: data.players
      });
    });

    socket.on('player.restart', function(data) {
      //send arrow up game.
      var roomCode = roomdata.get(socket, "roomCode");
      var gameSocketId = roomdata.get(socket, "gameSocketId");
      if(gameSocketId && io.sockets.connected[gameSocketId]!=null) {
        io.sockets.connected[gameSocketId].emit('player.restart', {player: socket.id, restart: true});
      } else {
        // socket.broadcast.to(roomCode).emit('playerMoveLeft', {player: socket.id});
          socket.broadcast.to(roomCode).emit('game.error', {message: "Please open the game / lobby."});
      }
    })

    socket.on('disconnect', function(data) {
      var roomCode = roomdata.get(socket, "roomCode");
      var gameSocketId = roomdata.get(socket, "gameSocketId");
      var players = roomdata.get(socket, "players");

      if(gameSocketId && gameSocketId == socket.id) {
        socket.broadcast.to(roomCode).emit('game.disconnect', {});
        socket.broadcast.to(roomCode).emit('game.error', {message: "Please open the game."});
      } else {
        index = _.findIndex(players, function(player) { return player.id == socket.id });
        if(index != -1) {
          socket.broadcast.to(roomCode).emit('player.left', {player: players[index]});
          var newPlayers = players.slice(index);
          // our leaving player was the host :(
          if(players[index].host && newPlayers.length > 0) {
            newPlayers[0].host = true;
          }
          roomdata.set(socket, "players", newPlayers);
        }
      }
      socket.emit('roomLeft', {success: true});
      // roomdata.leaveRoom(socket); // automatically when disconnecting.
    })

    socket.on('player.input', function(data) {
          //send arrow up game.
        var roomCode = roomdata.get(socket, "roomCode");
        var gameSocketId = roomdata.get(socket, "gameSocketId");
        if(gameSocketId && io.sockets.connected[gameSocketId]!=null) {
          io.sockets.connected[gameSocketId].emit('player.input', {player: socket.id, input: data});
        } else {
          // socket.broadcast.to(roomCode).emit('playerMoveLeft', {player: socket.id});
            socket.broadcast.to(roomCode).emit('game.error', {message: "Please open the game / lobby."});
        }
    });

    socket.on('game.layout', function(data) {
      var roomCode = roomdata.get(socket, "roomCode");
      socket.broadcast.to(roomCode).emit('game.layout', {layout: data});
    })
  });
  return io;
}
