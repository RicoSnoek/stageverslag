var express = require('express');
var router = express.Router();
var feedController = require('./feed-controller.js');

router.get('/', feedController.index);

module.exports = router;