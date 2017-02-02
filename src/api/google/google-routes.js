var express = require('express');
var router = express.Router();

var birthdayRoutes = require('./birthday/birthday-routes');

router.use('/birthday', birthdayRoutes);

module.exports = router;