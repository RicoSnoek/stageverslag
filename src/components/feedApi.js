var Promise = require('bluebird');
var request = require('request');
var parseString = require('xml2js').parseString;

var FeedApi = function() {}

FeedApi.prototype.getFeed = function(url) {
	return new Promise(function (resolve, reject) {
		request.get(url , function(err, data) {
			parseString(data.body, {trim: true}, function (err, result) {
			    if(result) {
			    	resolve(result.rss.channel);	
				} else if(error) {
					reject(error);
				} else {
					reject('Unknown error');
				}
		    		
			});
		})
	})	
}

FeedApi.prototype.testFunction = function() {
	return new Promise(function (resolve, reject) {
		var test = 'Oke';
		resolve(test);
	});
}

module.exports = FeedApi;