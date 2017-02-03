var express = require('express');
var router = express.Router();

var googleRoutes = require('./google/google-routes');
var feedRoutes = require('./feed/feed-routes');

router.use('/feed', feedRoutes);
router.use('/google', googleRoutes);

module.exports = router;