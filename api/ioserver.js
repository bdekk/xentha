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

module.exports = function (wss) {

    wss.broadcast = function broadcast(data) {
        wss.clients.forEach(function each(client) {
            client.send(data);
        });
    };

    wss.on('close', function () {
        console.log('Client #%d disconnected.');
    });

    wss.on('error', function (e) {
        console.log('Client #%d error: %s', e.message);
    });

    wss.on('connection', function (socket) {
        var userId = randomstring.generate(5);
        connections[userId] = socket;
        socket.id = userId;

        /**
            Convenience method to send data with an identifier and data payload.
            @param id id of the message (e.g. player.joined)
            @param data object with data.
        **/
        socket.sendData = function sendData(id, data) {
            console.log('send data to', socket.id, 'id: ', id, 'data: ', data);
            socket.send(JSON.stringify({
                id: id,
                data: data
            }));
        }

        /**
            Method that sends a message to all sockets within the same room.
            @param id id of the message (e.g. player.joined)
            @param data object with data.
            @param opts options (exclude: false)
        **/
        socket.broadcastToRoom = function broadcastToRoom(id, data, opts) {
            var opts = opts || {
                exclude: false
            };
            if (!roomdata) {
                console.error('could not find roomdata module.');
                return;
            }
            var socketIdsInRoom = roomdata.get(this, 'sockets');

            // remove calling socket.
            if (opts.exclude) {
                socketIdsInRoom = socketIdsInRoom.filter(function (obj) {
                    return obj.id !== this.id;
                });
            }

            var hostInRoom = roomdata.get(this, 'host');
            socketIdsInRoom.push(hostInRoom);

            wss.clients.forEach(function each(client) {

                var inRoom = socketIdsInRoom.some(function (socketId) {
                    return socketId === client.id;
                });

                if (inRoom) {
                    client.sendData(id, data);
                }
            });
        }

        /**
            Method that sends a message to a specific socket.
            @param socketId id of the specific socket
            @param id id of the message (e.g. player.joined)
            @param data object with data
        **/
        socket.sendTo = function (socketId, id, data) {
            var hasSended = false;

            var hostSocket = wss.clients.find(function (client) {
                return client.id == socketId;
            });

            if (hostSocket) {
                hostSocket.sendData(id, data);
                return;
            }
            console.log('tried to send message to ', socketId, ' but could not be found.');
        }

        socket.on('message', function incoming(event) {
            console.log('received: %s', event);
            var data = JSON.parse(event);
            if (!data.id || !data.data) {
                console.error('Could not get id or data.')
                return;
            }

            if (data.id in messages) {
            // specific message id.
                messages[data.id].call(this, data.data);
                return;
            }

            // send a wildcard (to players or game).
            if(data.id.startsWith('player.')) {
                // send data to the game.
                var roomCode = roomdata.get(socket, "roomCode");
                var gameData = roomdata.get(socket, "game");
                if (!gameData) {
                    // we need to send feedback to the player that he needs to open the game.
                    socket.sendData('game.error', "Please open the game / lobby.");
                    return;
                }
                socket.sendTo(gameData.socket, data.id, {
                    player: socket.id,
                    data: data.data
                });

                return;
            }

            if(data.id.startsWith('game.')) {
                // send data to the player
                socket.broadcastToRoom(data.id, data.data, {
                    exclude: true
                });
                return;
            }
        });

        messages['room.join'] = function (data) {
            console.log('join', data);
            if (data.roomCode) {
                //  io_room_controller.join(io.sockets, socket, data);
                Room.findOne({
                    where: {
                        roomCode: data.roomCode
                    }
                }).then(function (room) {
                    if (room) {
                        roomdata.join(socket, room.roomCode); // use same id as the api room id.

                        // initializeRoomVariables(socket, room);

                        var players = roomdata.get(socket, "players");
                        var state = roomdata.get(socket, "state");
                        var score = roomdata.get(socket, "score");
                        var roomCode = roomdata.get(socket, "roomCode");
                        var host = roomdata.get(socket, "host");

                        var gameData = roomdata.get(socket, "gameData");

                        if (data.type === 'screen') {
                            // a game (screen) has joined. Now wait for a game start :)
                            roomdata.set(socket, "game", {
                                socket: socket.id
                            });
                            socket.broadcastToRoom('screen.joined', {
                                roomCode: room.roomCode
                            });

                        } else {
                            if (!host) {
                                roomdata.set(socket, "host", socket.id);
                                host = socket.id;
                            }
                            var name = (data.user) ? data.user.username : 'player ' + (+players.length + +1); //if the player did not fill in a name, make one up.
                            var player = {
                                "id": socket.id,
                                "name": name,
                                "color": randomColor(),
                                "host": host == socket.id
                            };
                            players.push(player);
                            roomdata.set(socket, "players", players);
                            // not used yet.
                            socket.broadcastToRoom('room.player.joined', {
                                roomCode: room.roomCode,
                                player: player
                            });
                            socket.sendData('room.joined', {
                                roomCode: room.roomCode,
                                "players": players,
                                "player": player,
                                "state": state,
                                "game": gameData
                            }); //send the joining player that he has joined.
                        }
                    } else {
                        socket.sendData('room.joined.error', {
                            "message": "Could not find room with roomCode " + data.roomCode
                        });
                    }
                });
            } else {
                socket.sendData("room.joined.error", {
                    message: "Supply the right arguments."
                });
            }
            // send join to game.
        }.bind(this);

        messages['game.init'] = function (data) {
          console.log('on message game init ', data);
          // call this method when the game is about to start (in a screen socket or itself.).
          // this method will set the game variables, name and signals the players and the game socket that we processed the initialization.
          // now the plyer and the screen can start showing the specific screens.
          Game.findOne({
              where: {
                  apiKey: data.apiKey
              }
          }).then(function (game) {
              if(!game) {
                socket.sendData('game.error', {
                  message: "Could not find game."
                });
              } else {
                roomdata.set(socket, "gameData", {
                  "name": game.name,
                  "id": game.id,
                  "url": game.url
                });

                socket.broadcastToRoom('game.start', {
                  game: game.toJSON()
                });
              }
          });
        }.bind(this);

        /** room create, usually done by the website. Upon gaming there will be a client host that is the one that decides (boss) **/
        messages['room.create'] = function (data) {
            Room.create({
                name: data.name
            }).then(function (room) {
                var jsonRoom = room.toJSON();
                roomdata.create(socket, jsonRoom.roomCode);
                roomdata.set(socket, 'players', []);
                jsonRoom.players = [];
                socket.sendData('room.created', jsonRoom); //send  the host that the room is created.
            })
        }.bind(this);

        /** client sends a control to the api. This controls needs to be send to the listening site which should handle the input. **/
        messages['client.controls'] = function (data) {
            var host = roomdata.get(socket, 'host');
            socket.sendTo(host, 'client.controls', data); //send  the host that the room is created.
        }.bind(this);

        /** game events **/

        messages['game.disconnect'] = function (data) {
            socket.broadcastToRoom('game.disconnect', {}, {
                exclude: true
            });
        }.bind(this);

        /** player events **/

        messages['player.disconnect'] = function (data) {
            socket.broadcastToRoom('player.disconnect', {}, {
                exclude: true
            });
        }.bind(this);

        // messages['player.input'] = function (data) {
        //     var roomCode = roomdata.get(socket, "roomCode");
        //     var gameData = roomdata.get(socket, "game");
        //     if (!gameData) {
        //         socket.broadcastToRoom('player.error', {
        //             message: "Please open the game / lobby."
        //         });
        //         return;
        //     }
        //
        //     socket.sendTo(gameData.socket, 'player.input', {
        //         player: socket.id,
        //         input: data
        //     });
        // }.bind(this);
        //
        // /** Send input from game to clients
        //     @param data object (add id of the player to the data object to send to specific player.)
        //  **/
        // messages['game.input'] = function (data) {
        //     var roomCode = roomdata.get(socket, "roomCode");
        //
        //     if (data.id) {
        //         // send data to a specific player.
        //         socket.sendTo(id, 'game.input', data);
        //         return;
        //     }
        //     socket.broadcastToRoom('game.input', data, {
        //         exclude: true
        //     });
        // }.bind(this);

        // socket.on('leave', function (data) {
        //     // leave(data);
        // });
        //
        // socket.on('game.disconnect', function (data) {
        //     io.sockets.connected[data.id].sendData('game.disconnect', data);
        // });
        //
        // // send by the game to one player
        // socket.on('game.score', function (data) {
        //     io.sockets.connected[data.id].sendData('game.score', {
        //         score: data.score
        //     });
        // });
        //
        // // send by the game to players
        // socket.on('player.die', function (data) {
        //     io.sockets.connected[data.id].sendData('player.die', {
        //         die: true
        //     });
        // });
        //
        // socket.on('game.achievement', function (data) {
        //     var gameData = roomdata.get(socket, "gameData");
        //     if (gameData) {
        //         // create an achievement for player with id :) .. First check id.
        //         io.sockets.connected[data.id].sendData('game.achievement', data.achievement);
        //     }
        // });
        //
        // // send by the game to players
        // socket.on('game.end', function (data) {
        //     var roomCode = roomdata.get(socket, "roomCode");
        //     socket.broadcast.to(roomCode).sendData('game.end', {
        //         time: data.time,
        //         players: data.players,
        //         score: data.score
        //     });
        // });
        //
        // // send custom event to player(s).
        // socket.on('game.send', function (obj) {
        //     var roomCode = roomdata.get(socket, "roomCode");
        //     if (obj.event && obj.data && obj.player) {
        //         io.sockets.connected[obj.player].sendData(obj.event, obj.data);
        //     } else if (obj.event && obj.data) {
        //         socket.broadcast.to(roomCode).sendData(obj.event, obj.data);
        //     } else {
        //         console.log('could not send custom even to player.');
        //     }
        // });
        //
        // // send custom event to game.
        // socket.on('player.send', function (obj) {
        //     var gameSocketId = roomdata.get(socket, "gameData").socket;
        //     if (gameSocketId && io.sockets.connected[gameSocketId] != null) {
        //         if (obj.event && obj.data) {
        //             io.sockets.connected[gameSocketId].sendData(obj.event, obj.data);
        //         } else {
        //             console.log('could not send custom even to player.');
        //         }
        //     }
        // });
        //
        // // send by the game to players
        // socket.on('game.start', function (data) {
        //     var roomCode = roomdata.get(socket, "roomCode");
        //     socket.broadcast.to(roomCode).sendData('game.start', {
        //         players: data.players
        //     });
        // });
        //
        // socket.on('player.restart', function (data) {
        //     //send arrow up game.
        //     var roomCode = roomdata.get(socket, "roomCode");
        //     var gameSocketId = roomdata.get(socket, "gameData").socket;
        //     if (gameSocketId && io.sockets.connected[gameSocketId] != null) {
        //         io.sockets.connected[gameSocketId].sendData('player.restart', {
        //             player: socket.id,
        //             restart: true
        //         });
        //     } else {
        //         // socket.broadcast.to(roomCode).sendData('playerMoveLeft', {player: socket.id});
        //         socket.broadcast.to(roomCode).sendData('game.error', {
        //             message: "Please open the game / lobby."
        //         });
        //     }
        // })

        // messages['game.disconnect'] =, function (data) {


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
        // })

        // socket.on('player.input', function (data) {
        //     //send arrow up game.
        //     var roomCode = roomdata.get(socket, "roomCode");
        //     var gameSocketId = roomdata.get(socket, "gameData").socket;
        //     if (gameSocketId && io.sockets.connected[gameSocketId] != null) {
        //         io.sockets.connected[gameSocketId].sendData('player.input', {
        //             player: socket.id,
        //             input: data
        //         });
        //     } else {
        //         // socket.broadcast.to(roomCode).sendData('playerMoveLeft', {player: socket.id});
        //         socket.broadcast.to(roomCode).sendData('game.error', {
        //             message: "Please open the game / lobby."
        //         });
        //     }
        // });

        // socket.on('game.layout', function (data) {
        //     var roomCode = roomdata.get(socket, "roomCode");
        //     socket.broadcast.to(roomCode).sendData('game.layout', {
        //         layout: data
        //     });
        // })
    });
    return wss;
}
