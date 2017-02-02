var express = require('express');
var router = express.Router();

var googleRoutes = require('./google/google-routes');

router.use('/google', googleRoutes);

module.exports = router;