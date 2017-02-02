var express = require('express');
var router = express.Router();

var googleRoutes = require('./google/google-routes');

router.get('/', function(req, res) {
	res.send('Api');
})

router.use('/google', googleRoutes);

module.exports = router;