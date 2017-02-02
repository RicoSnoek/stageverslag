var express = require('express');
var router = express.Router();

var birthdayRoutes = require('./birthday/birthday-routes');

router.get('/', function(req, res) {
	res.send('Google');
})

router.use('/birthday', birthdayRoutes);

module.exports = router;