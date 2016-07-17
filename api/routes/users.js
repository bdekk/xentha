var express = require('express')
var router = express.Router()
var user_controller = require('../controllers/users');

router.get('/', function(req, res, next) {
	return user_controller.get(req, res, next);
//	res.send('Rooms')
})

// Car models page
router.get('/:id', function(req, res, next) {
	return user_controller.getOne(req, res, next);
})

router.post('/', function(req, res, next) {
	return user_controller.create(req, res, next);
})

module.exports = router
