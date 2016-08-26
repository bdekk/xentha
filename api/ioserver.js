// var server = require('http').createServer(app);
// var io = require('socket.io').listen(server);

// var roomdata = require('roomdata');
var roomdata = require('./wsroom');
var randomstring = require('randomstring');
var randomColor = require('randomcolor');
var _ = require('lodash');

// var io_room_controller = require('./controllers/io/rooms');
var Room = require('./models').Room;
var Game = require('./models').Game;
var User = require('./models').User;
var Achievement = require('./models').Achievement;

var connections = {}; //id and socket.

var messages = {}

// connection sockets rewrite.
// create rooms and share variables.

module.exports = function(wss) {



  wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      client.send(data);
    });
  };

  wss.on('close', function() {
    console.log('Client #%d disconnected.');
  });

  wss.on('error', function(e) {
    console.log('Client #%d error: %s', e.message);
  });

  wss.on('connection', function ( socket ) {
    var userId = randomstring.generate(5);
    connections[userId] = socket;
    socket.id = userId;

    socket.sendData = function sendData(id, data) {
      console.log('sendData');
      socket.send(JSON.stringify({id: id, data: data}));
    }
    // socket["sendData"] = function sendData(id, data) {
    //   console.log(id, data);
    //   socket.send(JSON.stringify({id: id, data: data}));
    // }

    socket.on('message', function incoming(event) {
      console.log('received: %s' , event);
      var data = JSON.parse(event);
      if(!data.id || !data.data) {
        console.error('Could not get id or data.')
        return;
      }
      messages[data.id].call(this, data.data);
    });

    console.log('socket connected ', socket.id);

    messages['ping'] = function(data) {
        socket.sendData('pong', new Date());
    }.bind(this);

    // initializeRoomVariables = function(socket, room) {
    //   var players = roomdata.get(socket, "players");
    //   // room is not yet initialized.
    //   if(!players) {
    //     roomdata.set(socket, "players", []);
    //     roomdata.set(socket, "score", 0);
    //     roomdata.set(socket, "state", 0);
    //     roomdata.set(socket, "roomCode", room.roomCode);
    //     roomdata.set(socket, "host", null);
    //   }
    // }
    messages['room.join'] = function(data) {
      console.log('join', data);
      if(data.roomCode) {
      //  io_room_controller.join(io.sockets, socket, data);
        Room.findOne({where: {roomCode: data.roomCode}}).then(function(room) {
          if(room) {
              roomdata.join(socket, data.roomCode); // use same id as the api room id.

              // initializeRoomVariables(socket, room);

              var players = roomdata.get(socket, "players");
              var state = roomdata.get(socket, "state");
              var score = roomdata.get(socket, "score");
              var roomCode = roomdata.get(socket, "roomCode");
              var host = roomdata.get(socket, "host");

              if(data.type == 'game') {
                Game.findOne({where: {apiKey: data.apiKey}}).then(function(game) {
                  if(game) {
                    roomdata.set(socket, "gameData", {socket: socket.id, name: game.name, id: game.id});
                  }
                });
              } else {
                if(!host) {
                  roomdata.set(socket, "host", socket.id);
                  host = socket.id;
                }
                var name = (data.user) ? data.user.username : 'player ' + players.length + 1; //if the player did not fill in a name, make one up.
                var player = {"id": socket.id, "name": name, "color": randomColor(), "host": host == socket.id};
                players.push(player);
                roomdata.set(socket, "players", players);
                console.log(room.roomCode, player);
                socket.broadcast.to( room.roomCode ).sendData('player.joined', {roomCode: room.roomCode, player: player}); // send others that a player joien.
              }
              socket.sendData('room.joined', {roomCode: room.roomCode, players: players, player: player, state: state}); //send the joining player that he has joined.
              // console.log({room_code: rawRoom.roomCode, player: user});
          } else {
            socket.sendData('room.joined.error', {"message": "Could not find room with roomCode " + data.roomCode});
          }
        });
      } else {
        socket.sendData("room.joined.error", {message: "Supply the right arguments."});
      }
     // send join to game.
   }.bind(this);

   /** room create, usually done by the website. Upon gaming there will be a client host that is the one that decides (boss) **/
    messages['room.create'] = function(data) {
      Room.create({name: data.name}).then(function(room) {
          roomdata.create(socket, data.roomCode);
          socket.sendData('room.created', {roomCode: room.roomCode}); //send the joining player that he has joined.
      })
    }.bind(this);

    socket.on('leave', function(data) {
      // leave(data);
    });

    socket.on('game.disconnect', function(data) {
      io.sockets.connected[data.id].sendData('game.disconnect', data);
    });

    // send by the game to one player
    socket.on('game.score', function(data) {
      io.sockets.connected[data.id].sendData('game.score', {score: data.score});
    });

    // send by the game to players
    socket.on('game.die', function(data) {
      io.sockets.connected[data.id].sendData('game.die', {die: true});
    });

    socket.on('game.achievement', function(data) {
        var gameData = roomdata.get(socket, "gameData");
        if(gameData) {
          // create an achievement for player with id :) .. First check id.
          io.sockets.connected[data.id].sendData('game.achievement', data.achievement);
        }
    });

    // send by the game to players
    socket.on('game.end', function(data) {
      var roomCode = roomdata.get(socket, "roomCode");
      socket.broadcast.to(roomCode).sendData('game.end', {
        time: data.time,
        players: data.players,
        score: data.score
      });
    });

    // send custom event to player(s).
    socket.on('game.send', function(obj) {
      var roomCode = roomdata.get(socket, "roomCode");
      if(obj.event && obj.data && obj.player) {
        io.sockets.connected[obj.player].sendData(obj.event, obj.data);
      } else if(obj.event && obj.data) {
        socket.broadcast.to(roomCode).sendData(obj.event, obj.data);
      } else {
        console.log('could not send custom even to player.');
      }
    });

    // send custom event to game.
    socket.on('player.send', function(obj) {
      var gameSocketId = roomdata.get(socket, "gameData").socket;
      if(gameSocketId && io.sockets.connected[gameSocketId]!=null) {
        if(obj.event && obj.data) {
          io.sockets.connected[gameSocketId].sendData(obj.event, obj.data);
        } else {
          console.log('could not send custom even to player.');
        }
      }
    });

    // send by the game to players
    socket.on('game.start', function(data) {
      var roomCode = roomdata.get(socket, "roomCode");
      socket.broadcast.to(roomCode).sendData('game.start', {
        players: data.players
      });
    });

    socket.on('player.restart', function(data) {
      //send arrow up game.
      var roomCode = roomdata.get(socket, "roomCode");
      var gameSocketId = roomdata.get(socket, "gameData").socket;
      if(gameSocketId && io.sockets.connected[gameSocketId]!=null) {
        io.sockets.connected[gameSocketId].sendData('player.restart', {player: socket.id, restart: true});
      } else {
        // socket.broadcast.to(roomCode).sendData('playerMoveLeft', {player: socket.id});
          socket.broadcast.to(roomCode).sendData('game.error', {message: "Please open the game / lobby."});
      }
    })

    socket.on('disconnect', function(data) {
      var roomCode = roomdata.get(socket, "roomCode");

      // remove socket from connections.
      delete connections[socket.id];



      // var gameData = roomdata.get(socket, "gameData");
      // var gameSocketId = (gameData) ? gameData.socket : null;
      // var players = roomdata.get(socket, "players");
      //
      // if(gameSocketId && gameSocketId == socket.id) {
      //   socket.broadcast.to(roomCode).sendData('game.disconnect', {});
      //   socket.broadcast.to(roomCode).sendData('game.error', {message: "Please open the game."});
      // } else {
      //   index = _.findIndex(players, function(player) { return player.id == socket.id });
      //   if(index != -1) {
      //     socket.broadcast.to(roomCode).sendData('player.left', {player: players[index]});
      //     var newPlayers = players.slice(index);
      //     // our leaving player was the host :(
      //     if(players[index].host && newPlayers.length > 0) {
      //       newPlayers[0].host = true;
      //     }
      //     roomdata.set(socket, "players", newPlayers);
      //   }
      // }
      // socket.sendData('roomLeft', {success: true});
      // roomdata.leaveRoom(socket); // automatically when disconnecting.
    })

    socket.on('player.input', function(data) {
          //send arrow up game.
        var roomCode = roomdata.get(socket, "roomCode");
        var gameSocketId = roomdata.get(socket, "gameData").socket;
        if(gameSocketId && io.sockets.connected[gameSocketId]!=null) {
          io.sockets.connected[gameSocketId].sendData('player.input', {player: socket.id, input: data});
        } else {
          // socket.broadcast.to(roomCode).sendData('playerMoveLeft', {player: socket.id});
            socket.broadcast.to(roomCode).sendData('game.error', {message: "Please open the game / lobby."});
        }
    });

    socket.on('game.layout', function(data) {
      var roomCode = roomdata.get(socket, "roomCode");
      socket.broadcast.to(roomCode).sendData('game.layout', {layout: data});
    })
  });
  return wss;
}
