var exports = module.exports = {};

exports.connectGoogleCalendar = function(app) {
	var Promise = require('bluebird');
	var fs = require('fs');
	var readline = require('readline');
	var google = require('googleapis');
	var googleAuth = require('google-auth-library');

	// If modifying these scopes, delete your previously saved credentials
	// at ~/.credentials/calendar-nodejs-quickstart.json
	var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
	var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
	    process.env.USERPROFILE) + '/.credentials/';
	var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

	app.get('/api/events', function(req, nres) {
		fs.readFile('client_secret.json', function(err, content) {
			if (err) {
		    	console.log('Error loading client secret file: ' + err);
		    	return;
			}

			authorize(JSON.parse(content))
				.then(function(oauth2Client) {
					return listEvents(oauth2Client, 'primary')
				})
				.then(function(eventArray) {
					nres.status(200).json(eventArray);
				})
				.catch(function(err) {
					console.log(err);
				})
		});
	});

	function authorize(credentials) {
		return new Promise(function(resolve, reject) {
			var clientSecret = credentials.installed.client_secret;
			var clientId = credentials.installed.client_id;
			var redirectUrl = credentials.installed.redirect_uris[0];
			var auth = new googleAuth();
			var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

			// Check if we have previously stored a token.
			fs.readFile(TOKEN_PATH, function(err, token) {
			    if (err) {
			    	getNewToken(oauth2Client).then(function(oauth2Client) {
			    		oauth2Client.credentials = JSON.parse(token);
						resolve(oauth2Client);
			    	}).catch(function(err) {
			    		reject(err);
			    	})
			    } else {
	    			oauth2Client.credentials = JSON.parse(token);
					resolve(oauth2Client);
		    	}
			})
		})
	}

	function getNewToken(oauth2Client) {
		return new Promise(function(resolve, reject) {	
			var authUrl = oauth2Client.generateAuthUrl({
		    	access_type: 'offline',
		    	scope: SCOPES
			});
			console.log('Authorize this app by visiting this url: ', authUrl);
			var rl = readline.createInterface({
		    	input: process.stdin,
		    	output: process.stdout
			});
			rl.question('Enter the code from that page here: ', function(code) {
		    	rl.close();
		    	oauth2Client.getToken(code, function(err, token) {
		    		if (err) {
		    		    console.log('Error while trying to retrieve access token', err);
		    		    return;
		    		}
		    		oauth2Client.credentials = token;
		    		storeToken(token).then(function(oauth2Client) {
		    			resolve(oauth2Client);
		    		});
		    	});
			});
		})  
	}

	function storeToken(token) {
		return new Promise(function(resolve, reject) {
			try {
			    fs.mkdirSync(TOKEN_DIR);
			} catch (err) {
			    if (err.code != 'EEXIST') {
				    throw err;
			    }
			}
			fs.writeFile(TOKEN_PATH, JSON.stringify(token));
			console.log('Token stored to ' + TOKEN_PATH);
		})
	}

	function listEvents(oauth2Client, calendarId) {
		return new Promise(function(resolve, reject) {
		  var calendar = google.calendar('v3');
		  calendar.events.list({
		    auth: oauth2Client,
		    calendarId: calendarId,
		    timeMin: (new Date()).toISOString(),
		    maxResults: 10,
		    singleEvents: true,
		    orderBy: 'startTime'
		  }, function(err, response) {
		    if (err) {
		      reject(err);
		    } else {
			    var events = response.items;
			    if (events.length == 0) {
			      console.log('No upcoming events found.');
			    } else {
			      var eventArray = [];
			      for (var i = 0; i < events.length; i++) {
			        var event = events[i];
			        eventArray.push(event);
			      }
					//callback(eventArray);
					resolve(eventArray);
			    }
			}
		  })
		})
	}
}
