var express = require('express')
var router = express.Router()
var games_controller = require('../controllers/games');

router.get('/', function(req, res, next) {
	return games_controller.get(req, res, next);
//	res.send('Rooms')
})

// Car models page
router.get('/:id', function(req, res, next) {
	return games_controller.getOne(req, res, next);
})

router.post('/', function(req, res, next) {
	return games_controller.create(req, res, next);
})

module.exports = router
