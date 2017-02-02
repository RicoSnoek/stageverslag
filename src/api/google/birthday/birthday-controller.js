var BirthdayController = function() {}

BirthdayController.prototype.index = function(req, res) {
	res.status(200).json(req.googleResponse);
}

module.exports = new BirthdayController();