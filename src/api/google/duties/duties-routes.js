var express = require('express');
var router = express.Router();
var dutiesController = require('./duties-controller.js');
var AuthAndGetMiddleware = require('../../../middleware/authAndGetMiddleware.js')

var authAndGetMiddleware = new AuthAndGetMiddleware();

router.get('/', dutiesController.index);

module.exports = router;