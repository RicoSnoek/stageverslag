var express = require('express');
var router = express.Router();
var calendarController = require('./calendar-controller.js');
// var AuthAndGetMiddleware = require('../../../middleware/authAndGetMiddleware.js')

// var authAndGetMiddleware = new AuthAndGetMiddleware();


router.get('/', calendarController.index);

module.exports = router;