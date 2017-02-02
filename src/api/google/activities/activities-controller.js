var GoogleApi = require('../../../components/googleApi');

var ActivitiesController = function() {}

ActivitiesController.prototype.index = function(req, res) {
	var googleApi = new GoogleApi();
	
	googleApi.authAndGetSheet('Activities').then(function(googleResponse) {
			res.status(200).json(googleResponse);
		}).catch(function(error) {
			res.status(500).send({error: error});
		});
}

module.exports = new ActivitiesController();