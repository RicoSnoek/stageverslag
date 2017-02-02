//  Not used

var express = require('express');
var router = express.Router();

var GoogleApi = require('../components/googleApi');

var AuthAndGetMiddleware = function() {}

AuthAndGetMiddleware.prototype.getMiddleware = function(target, type) {
	router.use(function(req, res, next) {
		var googleApi = new GoogleApi();
		if(type == 'sheet') {
			googleApi.authAndGetSheet(target).then(function(googleResponse) {
				req.googleResponse = googleResponse;
				next();
			}).catch(function(error) {
				res.status(500).send({error: error});
			});
		} else if(type == 'event') {
			googleApi.authAndGetEvent(target).then(function(googleResponse) {
				req.googleResponse = googleResponse;
				next();
			}).catch(function(error) {
				next(error);
			});
		}	
	});

	return router;
}

module.exports = AuthAndGetMiddleware;