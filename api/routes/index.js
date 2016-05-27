var express = require('express')
  , router = express.Router()

router.use('/rooms', require('./rooms'));
router.use('/users', require('./users'));
//router.use('/users', require('./users'))

router.get('/', function(req, res) {
  res.render('index')
})

module.exports = router
