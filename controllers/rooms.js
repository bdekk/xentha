var methods = {};
var User = require('../models').User;
var Room = require('../models').Room;

methods.get = function(req, res, next) {
	Room.find({}).then(function(rooms) {
		return res.send({rooms: rooms});
	});
}

methods.join = function(req, res, next) {
	if(!req.params.roomId && !req.body.userId) return;
	//join sockets is done through socket io (controllers/io/rooms.join)
	Room.findOne({where: {roomId: req.params.roomId}}).then(function(room) {
		User.findOne({where: {id: req.body.userId}}).then(function(user) {
			room.addUser(user).then(function(roomWithUser) {
				return res.send({room: roomWithUser});
			});

		});
	});
}

methods.getOne = function(req, res, next) {
	Room.find({where: {roomId: req.params.roomId}}).then(function(room) {
		return res.send({room: room});
	});
}

methods.create = function(req, res, next) {
	console.log(req.body);
	if(req.body.name) {
		Room.create({name: req.body.name}).then(function(room) {
			return res.send({room: room});
		});
	} else {
		return res.send(400, {error: "supply data"});
	}
}

methods.changeState = function(req, res, next) {
	Room.update({ status: req.body.status }, { where: { roomId : req.params.roomId }}).then(function (result) {
		if(result && result[0] !== 0) {
			return res.send({roomId: req.params.roomId, status: req.body.status});
		}
	}, function(rejectedPromiseError){
		console.log(rejectedPromiseError);
	});
}

//views
methods.serverLobby = function(req, res, next) {
	// //TODO: spread.
	// Room.findOne({where: {roomId: req.params.roomId}}).then(function foundRoom(room) {
	// 	if(room) {
	// 		room.getUsers().then(function (users) {
	// 			console.log(users);
	// 			if(room.status == 0) {
	// 				console.log('starting phase..');
	// 				return res.render('server/index');
	// 			} else if(room.status == 1) {
	// 					console.log('lobby.');
	// 					res.render('server/lobby', {players: users, room: room});
	// 			}
	// 		})
	// 	} else {
	// 		res.send(400, {error: 'Could not find room.'});
	// 	}
	// });
	return renderLobby(req, res, next, true);
}

var renderLobby = function(req, res, next, server) {
	var host = (server) ? 'server' : 'client';
	Room.findOne({where: {roomId: req.params.roomId}}).then(function foundRoom(room) {
		if(room) {
			room.getUsers().then(function (users) {
				// console.log(users);
				if(room.status == 0) {
					console.log('starting phase..');
					return res.render(host + '/index');
				} else if(room.status == 1) {
						console.log('lobby.');
						return res.render(host + '/lobby', {players: users, room: room});
				}
			})
		} else {
			res.send(400, {error: 'Could not find room.'});
		}
	});
}

methods.clientLobby = function(req, res, next) {
	return renderLobby(req, res, next, false);
}

module.exports = methods
