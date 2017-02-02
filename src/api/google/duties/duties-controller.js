var GoogleApi = require('../../../components/googleApi');

var DutiesController = function() {}

DutiesController.prototype.index = function(req, res) {
	var googleApi = new GoogleApi();
	
	googleApi.authAndGetSheet('Duties').then(function(googleResponse) {
			res.status(200).json(googleResponse);
		}).catch(function(error) {
			res.status(500).send({error: error});
		});
	
}

module.exports = new DutiesController();