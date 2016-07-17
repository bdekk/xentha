var methods = {};
var User = require('../models').User;
var Room = require('../models').Room;

methods.get = function(req, res, next) {
	User.find().then(function(users) {
		return res.send({users: users});
	});
}


methods.getOne = function(req, res, next) {
	User.findOne({where: {id: req.params.id}}).then(function(user) {
		return res.send({user: user});
	});
}

methods.create = function(req, res, next) {
	if(req.body.user) {
		User.create(req.body.user).then(function(user) {
			return res.send({user: user});
		});
	} else {
		return res.send(400, {error: "supply data"});
	}
}

module.exports = methods
