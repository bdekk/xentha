var methods = {};
var Room = require('../../models').Room;
var _ = require('lodash');

methods.join = function(iosockets, socket, data) {
  if(!data.room_code || !data.player_id) return;
  console.log(data);
  Room.findOne({where: {roomCode: data.room_code}}).then(function(room) {
      room.getUsers().then(function(users) {
        //get users of room.
        var rawUsers = users.map(function(user){ return user.toJSON() });
        var rawRoom = room.toJSON();
        var user = _.find(rawUsers, function(obj) {
            return obj.id === data.player_id;
        });
        // var user = _.where(users, {"id": data.player_id});
        if(user) {
          socket.join( rawRoom.roomCode ); // use same id as the api room id.
          socket.emit('roomJoined', {room_code: rawRoom.roomCode, player: user}); //send the joining player that he has joined.
          console.log({room_code: rawRoom.roomCode, player: user});
          socket.broadcast.to( rawRoom.roomCode ).emit('playerJoined', {room_code: rawRoom.roomCode, player: user}); // send others that a player joien.
        } else {
          socket.emit('error', {error: "User could not be found in the room data of the database."});
        }
      });
  });
}

methods.leave = function(iosockets, socket, data) {
  if(!data.room_code || !data.player_id) return;
  socket.emit('playerLeft', {player: data.player_id});
  //delete room from database,
  // remove socket from room.

}

methods.changeState = function(iosockets, socket, data) {
  if(!data.room_code || !data.state) return;
  // Room.findOne({where: {id: data.room_code}}).then(function(room) {
  Room.findOne({where: {id: data.room_code}}).then(function(room) {
    if(room) {
      iosockets.in( room.id ).emit('stateChanged', {state: data.state});
    } else {
      socket.emit('error', {error: "State change is not send to other users."});
    }
  });
}

module.exports = methods
