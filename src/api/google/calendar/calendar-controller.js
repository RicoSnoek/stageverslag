var GoogleApi = require('../../../components/googleApi');

var CalendarController = function() {}

CalendarController.prototype.index = function(req, res) {
	var googleApi = new GoogleApi();
	
	googleApi.authAndGetEvent('primary').then(function(googleResponse) {
			res.status(200).json(googleResponse);
		}).catch(function(error) {
			res.status(500).send({error: error});
		});
}

module.exports = new CalendarController();