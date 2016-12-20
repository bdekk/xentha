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

    wss.on('connection', function (socket) {
      
        wss.on('close', function (socket) {
            console.log('Client #%d disconnected.');
            var game = roomdata.get(socket, 'game');
            if(!game || game.socket !== socket.id) {
              socket.broadcastToRoom('game.disconnect', {});
            } else {
              // socket.broadcastToRoom('player.disconnect', {'player': socket.id});
              socket.broadcastToRoom('room.player.left', {'player': socket.id});
              socket.broadcastToRoom('player.left', {'player': socket.id});
            }
        });

        wss.on('error', function (e) {
            console.log('Client error.', e.message);
        });

        var userId = randomstring.generate(5);
        connections[userId] = socket;
        socket.id = userId;
        console.log('Socket connected. ', socket.id);

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
            console.log(opts.exclude, ' exclude.');
            if (opts.exclude) {
                socketIdsInRoom = socketIdsInRoom.filter(function (obj) {
                    return obj !== socket.id;
                });
            }

            var hostInRoom = roomdata.get(this, 'host');
            if(!opts.exclude || hostInRoom != socket.id) {
                socketIdsInRoom.push(hostInRoom);
            }

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
                console.log('send data to game from player ', socket.id);
                var roomCode = roomdata.get(socket, "roomCode");
                var gameData = roomdata.get(socket, "game");
                if (!gameData) {
                    // we need to send feedback to the player that he needs to open the game.
                    socket.sendData('game.error', {"message": "Please open the game / lobby."});
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
                console.log('send data to players from game ', socket.id);
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
                            console.log(data);
                            var name = data.name || 'player ' + (+players.length + +1); //if the player did not fill in a name, make one up.
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

        /**
          Removes the socket from the room and removes the player data related to the socket.
          Sends a room.left response to the calling socsket and a room.player.left response to the rest of the room.
        **/
        messages['room.leave'] = function (data) {
            let players = roomdata.get(socket, "players");
            let playersWithoutLeaver = players.filter(player => player.id !== socket.id);
            if(playersWithoutLeaver.length !== players.length) { //we found the player (and removed other likies if bugged.)
              roomdata.set(socket, "players", playersWithoutLeaver);
              socket.broadcastToRoom('room.player.left', {"player": {"id": socket.id}}, {exclude: true});
              roomdata.leave(socket);
              socket.sendData('room.left', {}); //explicit leave response to the client.
            } else {
              socket.sendData("error", "Could not find player in room.");
            }
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

        messages['game.disconnect'] = function (data) {
            roomdata.set(socket, "gameData", undefined);
            socket.broadcastToRoom('game.disconnect', {});
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


        /** player events **/

        messages['player.disconnect'] = function (data) {
            socket.broadcastToRoom('player.disconnect', {}, {
                exclude: true
            });
        }.bind(this);
    });
    return wss;
}
