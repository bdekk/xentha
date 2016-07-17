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
    var user = req.body.user;
    // NEED TO SALT THE PASSWORD :D
  	User.findOne({where: {username: user.username, password: user.password}}).then(function(user) {
  		return res.send({user: user});
  	});
  }
}

module.exports = methods
