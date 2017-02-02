var express = require('express');
var router = express.Router();
var activitiesController = require('./activities-controller.js');
var AuthAndGetMiddleware = require('../../../middleware/authAndGetMiddleware.js')

var authAndGetMiddleware = new AuthAndGetMiddleware();


router.get('/', activitiesController.index);

module.exports = router;