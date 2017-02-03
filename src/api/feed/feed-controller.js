var FeedApi = require('../../components/feedApi');

var FeedController = function() {}

FeedController.prototype.index = function(req, res) {
	var feedApi = new FeedApi();
	var feedUrl = 'http://feeds.feedburner.com/TechCrunch?fmt=xml';

	feedApi.getFeed(feedUrl).then(function (feedResponse) {
		res.status(200).json(feedResponse);
	}).catch(function(error) {
		res.status(500).send({error: error});
	});
}

module.exports = new FeedController();