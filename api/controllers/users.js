var methods = {};
var User = require('../models').User;
var Room = require('../models').Room;

methods.get = function(req, res, next) {
	User.findAll().then(function(users) {
		return res.send({users: users});
	});
}


methods.getOne = function(req, res, next) {
	User.findOne({where: {id: req.params.id}}).then(function(user) {
		return res.send({user: user});
	});
}

methods.create = function(req, res, next) {
	var user = req.body.user;
	if(user && user.username && user.password) {
		User.create(user).then(function(user) {
			return res.send({user: user});
		});
	} else {
		return res.send(400, {error: "supply data"});
	}
}

methods.login = function(req, res, next) {
  if(req.body.user) {
  	User.findOne({where: {username: req.body.user.username}})
		.then(function (user) {
			if (!user) {
				// wrong username
				return res.status(401).json({
					error: "wrong emailaddress"
				});
			} else if (!User.checkPassword(req.body.user.password, user.password)) {
				// wrong password
				return res.status(401).json({
					error: "wrong password"
				});
			} else if (user) {
				user.password = undefined; //remove password.
				res.status(200).json({user: user});
			} else {
				// errror
				res.status(400).json({
					error: 'Something went wrong.'
				});
			}
		});
  }
}

module.exports = methods
