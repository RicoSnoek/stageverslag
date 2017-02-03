var express = require('express');
var router = express.Router();
var request = require('request');
var parseString = require('xml2js').parseString;

// router.get('/api/techcrunch', function(req, res) {
// 	request.get('http://feeds.feedburner.com/TechCrunch?fmt=xml', function(err, data) {
// 		parseString(data.body, {trim: true}, function (err, result) {
// 		    res.json(result.rss.channel);			
// 		});
// 	})
// });

router.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});

module.exports = router;
