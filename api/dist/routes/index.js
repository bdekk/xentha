var express = require('express'), router = express.Router();
router.use('/rooms', require('./rooms'));
router.use('/users', require('./users'));
router.use('/games', require('./games'));
//router.use('/users', require('./users'))
router.get('/', function (req, res) {
    res.render('index');
});
module.exports = router;
