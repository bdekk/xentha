/* Inspired by the roomdata plugin for socket.io */

exports.Debug = false;

exports.rooms = {};

/*
  Returns if the room exists.
*/
exports.exists = function(room) {
	if(!this.rooms[room]) return false;
	return true;
};

/*
  Returns true if the socket is in a room (socket.room is true)
  @parameter: socket
  @parameter: room (optional room id)
*/
exports.inRoom = function(socket, room) {
  var room = room || socket.room;
  if(!room) {
    return false;
  } else if(this.exists(room)) {
    return true;
  } else {
    console.error('Socket variable set but room does not exist anymore?');
    return false;
  }
}

exports.isHost = function(socket, room) {
    var room = room || socket.room;
    return this.rooms[room].host === socket.id;
}

/* Creates a room.
   Note: make sure that this room name is unique
	 @param socket socket that creates this room.
	 @param room name of the room.
	 @param opts { boolean autoHost identifies if the socket that creates this room is also added to the room. }
*/
exports.create = function(socket, room, opts) {
  var opts = opts || {autoHost: true};
  if(exports.Debug) console.log(socket.id+": Creating Room: "+room);
  if(this.exists(room)) { console.log('! overriding room with id ' + room); };
  var host = opts.autoHost ? socket.id : undefined;
  this.rooms[room] = {host: host, sockets:[], variables: {}};
  socket.room = room;
}

/* Set variable on room */
exports.set = function(socket, id, data) {
	if(exports.Debug) console.log(socket.id+": Creating variable: "+id+" with data: "+data);
	if(!this.inRoom(socket) && !this.isHost(socket)) {
		console.error("Socket" + socket + " is not in any room.");
		return false;
	}
	this.rooms[socket.room].variables[id] = data;
}

exports.get = function(socket, variable, content) {
	if(exports.Debug) console.log(socket.id+": Getting variable: "+variable);

    if(!this.inRoom(socket)) {
	       console.error("Could not get variable. Socket" + socket + " is not in any room.");
           return undefined;
    }
	if(variable == "room"){
		if(!socket.room) return undefined;
		return socket.room;
	}

    // standard room variables.
	if(variable == "host") return this.rooms[socket.room].host;
	if(variable == "sockets") return this.rooms[socket.room].sockets;
	if(variable == "hostAndSockets") return this.rooms[socket.room].sockets.concat(this.rooms[socket.room].host);

    return this.rooms[socket.room].variables[variable];
}

exports.join = function(socket, room, opts) {
  var opts = opts || {autoCreate: false};
	if(exports.Debug) console.log(socket.id+": Joining room: "+room);
	// if(socket.room) this.leaveRoom(socket, room);
	if(opts.autoCreate && !this.exists(socket, room)) {
        this.create(socket, room, {autoHost: true});
    }
    if(!this.rooms[room].host && this.rooms[room].sockets.length == 0) {
        // nobody joined the room yet and the host is not set (autohost was false on creation)
        this.rooms[room].host = socket.id;
    }
	this.rooms[room].sockets.push(socket.id);
	socket.room = room;
};

exports.clear = function(room) {
	delete this.rooms[room];
};

exports.leave = function(socket) {
	var room = socket.room;
	if(socket.room==undefined) throw new Error("socket id:" + socket.id + " is not in a room!");
	if(exports.Debug) console.log(socket.id+": Leaving room: "+socket.room);
	var i = this.rooms[socket.room].users.indexOf(socket.id);
	if(i != -1) this.rooms[socket.room].users.splice(i, 1);
	// socket.leave(socket.roomdata_room);
	if(this.rooms[room].users.length == 0) {
		this.clearRoom(room);
	}
}
