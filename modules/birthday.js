var exports = module.exports = {};

exports.getBirthday = function() {

	var Birthday = mongoose.model('Birthday', {
		text : String,
		date : Date
	});

	app.get('/api/birthdays', function(req, res) {
		Birthday.find(function(err, birthdays) {
			if (err) {
				res.send(err)
			} else {
				res.json(birthdays)
			}
		});
	});
};