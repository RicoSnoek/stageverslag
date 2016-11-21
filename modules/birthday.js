var exports = module.exports = {};

exports.getBirthday = function(app, mongoose) {
	var Birthday = mongoose.model('Birthday', {
		text : String,
		date : String
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
	app.post('/api/birthdays', function(req, res) {
		Birthday.create({
			text : req.body.text,
			date : req.body.date
		}, function(err, birthday) {
			if (err) {
				res.send(err);
			} else {
				Birthday.find(function(err, birthdays) {
					if (err) {
						res.send(err)
					} else {
						res.json(birthdays)
					}
				});
			}
		})
	})
};