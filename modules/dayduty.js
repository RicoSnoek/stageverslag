var exports = module.exports = {};

exports.mailPersonDuty = function() {
	var nodemailer = require('nodemailer'),
		schedule = require('node-schedule'),
		request = require("request"),
		rule = new schedule.RecurrenceRule();
	rule.dayOfWeek = [0, new schedule.Range(1, 5)];
	rule.hour = 9;
	rule.minute = 0;

	var url = "http://localhost:3000/javascripts/temp.json";
	var transporter = nodemailer.createTransport('smtps://qelpkeuken@gmail.com:d4shbo4rd@smtp.gmail.com');
	var mailOptions = {
	    from: '"Automated Duty Message" <qelpkeuken@gmail.com>',
	    to: '',
	    subject: 'Kitchen duty!',
	    text: 'Hello name, today is your day to do kitchen duty. Keep that in mind.'
	};

	var duty = schedule.scheduleJob(rule, function(){

		var now = new Date();
		var today = new Date( now.getFullYear(), now.getMonth(), now.getDate());

		request({
		    url: url,
		    json: true
		}, function (error, response, body) {

		    if (!error && response.statusCode === 200) {
		        var dutiesArray = body;

	        for(var i = 0; i < dutiesArray.length; i++) {
			    var duty = dutiesArray[i];
			    duty.date = new Date(duty.date);
			    if (today.valueOf() == duty.date.valueOf()) {
			    	mailOptions.to = duty.e-mail;

			    	transporter.sendMail(mailOptions, function(error, info){
					    if(error){
					        return console.log(error);
					    }
					    console.log('Message sent: ' + info.response);
					});
	        	}
			}
		    }
		});
	});
}