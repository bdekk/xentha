var express = require('express')
var router = express.Router()
var room_controller = require('../controllers/rooms');

router.get('/', function(req, res, next) {
	return room_controller.get(req, res, next);
//	res.send('Rooms')
})

router.get('/:roomId', function(req, res, next) {
	return room_controller.getOne(req, res, next);
})

// Car models page
router.post('/', function(req, res, next) {
	return room_controller.create(req, res, next);
})

router.put('/:roomId/state', function(req, res, next) {
	return room_controller.changeState(req, res, next);
})

router.post('/join/:roomId', function(req, res, next) {
	return room_controller.join(req, res, next);
})

// views
router.get('/server/:roomId/lobby', function(req, res, next) {
	return room_controller.serverLobby(req, res, next);
})

router.get('/:roomId/lobby', function(req, res, next) {
	return room_controller.clientLobby(req, res, next);
})


module.exports = router
