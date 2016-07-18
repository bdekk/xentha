var methods = {};
var Game = require('../models').Game;

methods.get = function(req, res, next) {
	Game.findAll().then(function(games) {
		return res.send({games: games});
	});
}


methods.getOne = function(req, res, next) {
	Game.findOne({where: {id: req.params.id}}).then(function(game) {
		return res.send({game: game});
	});
}

methods.create = function(req, res, next) {
	if(req.body.game) {
		Game.create(req.body.game).then(function(game) {
			return res.send({game: game});
		});
	} else {
		return res.send(400, {error: "supply data"});
	}
}

module.exports = methods
