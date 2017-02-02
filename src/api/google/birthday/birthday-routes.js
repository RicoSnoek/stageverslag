var express = require('express');
var router = express.Router();
var birthdayController = require('./birthday-controller.js');
var authAndGetMiddleware = require('../../../middleware/authAndGetMiddleware.js')


router.get('/', authAndGetMiddleware.getMiddleware('Birthdays', 'sheet'), birthdayController.index);

module.exports = router;