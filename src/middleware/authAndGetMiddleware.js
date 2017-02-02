var express = require('express');
var router = express.Router();

var GoogleApi = require('../components/googleApi');

var AuthAndGetMiddleware = function() {}



AuthAndGetMiddleware.prototype.getMiddleware = function(target, type) {
	return router.use(function(req, res, next) {
		var googleAPi = new GoogleApi();

		if(type == 'sheet') {
			googleApi.authAndGetSheet(target).then(function(googleResponse) {
				req.googleResponse = googleResponse;
				next();
			})
		}
		if(type == 'event') {
			googleApi.authAndGetEvent(target).then(function(googleResponse) {
				req.googleResponse = googleResponse;
				next();
			})	
		}	
	});
}

module.exports = new AuthAndGetMiddleware();