var express = require('express')
var router = express.Router()
var user_controller = require('../controllers/users');

router.get('/', function(req, res, next) {
	return user_controller.get(req, res, next);
})

router.get('/:id', function(req, res, next) {
	return user_controller.getOne(req, res, next);
})

router.get('/:userId/games', function(req, res, next) {
	return user_controller.getGames(req, res, next);
})

router.post('/', function(req, res, next) {
	return user_controller.create(req, res, next);
})

router.post('/login', function(req, res, next) {
	return user_controller.login(req, res, next);
})

router.delete('/:userId', function (req, res, next) {
  return user_controller.delete(req,res,next);
})

module.exports = router
