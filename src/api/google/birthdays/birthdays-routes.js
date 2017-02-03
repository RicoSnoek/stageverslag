var express = require('express');
var router = express.Router();
var birthdaysController = require('./birthdays-controller.js');
// var AuthAndGetMiddleware = require('../../../middleware/authAndGetMiddleware.js')

// var authAndGetMiddleware = new AuthAndGetMiddleware();


router.get('/', birthdaysController.index);

module.exports = router;