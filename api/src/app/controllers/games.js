var methods = {};
var Game = require('../models').Game;
var Achievement = require('../models').Achievement;

methods.get = function(req, res, next) {
	Game.findAll().then(function(games) {
		return res.send({games: games});
	});
}

/**
 * Get one game by id.
 * @param {req} the request object.
 * @returns {res} the res object.
 */
methods.getOne = function(req, res, next) {
	Game.findOne({where: {id: req.params.id}}).then(function(game) {
		return res.send({game: game});
	});
}

/**
 * Create one game by passing a JSON game object.
 * @param {req} the request object.
 * @returns {res} the res object.
 */
methods.create = function(req, res, next) {
	if(req.body.game) {
		Game.create(req.body.game).then(function(game) {
			return res.send({game: game});
		});
	} else {
		return res.send(400, {error: "supply data"});
	}
}


/**
 * Add an image to an existing game.
 * @param {req} the request object.
 * @returns {res} the res object.
 */
methods.addImage = function(req, res, next) {
	if(req.params.id && req.file) {
		var filepath = req.file.path.replace('public','');
		Game.update({
    	image: filepath
	  }, {
	    where: { id : req.params.id }
		})
	  .then(function (result) {
			return res.send({image: filepath});
	  }, function(rejectedPromiseError){
					return res.send(400, {error: "Could not update game model."});
	  });
	} else {
		return res.send(400, {error: "Could not upload file"});
	}
}

methods.getAchievements = function(req, res, next) {
  if(req.params.gameId) {
  	Achievement.findAll({where: {gameId: req.params.gameId}}).then(function(achievements) {
  		return res.send({achievements: achievements});
  	});
	} else {
		return res.sendStatus(400);
	}
}

methods.createAchievementByGame = function(req, res, next) {
	if(req.body.achievement && req.params.gameId) {
    var achievement = req.body.achievement;
    achievement['gameId'] = req.params.gameId;
		Achievement.create(achievement).then(function(achievement) {
			return res.send({achievement: achievement});
		});
	} else {
		return res.send(400, {error: "supply data"});
	}
}

methods.delete = function(req, res, next) {
	if(req.params.gameId) {
		Game.destroy({
		   where: {
		      id: req.params.gameId
		   }
		}).then(function(rowDeleted) {
		  if(rowDeleted === 1){
		     res.send({success: true});
		   } else {
				 res.send(404, {error: "Could not find game."});
			 }
		}, function(err) {
		    res.send(400, {"error": err});
		});
	} else {
		return res.send(400, {error: "supply data"});
	}
}

module.exports = methods
