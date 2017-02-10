var Promise = require('bluebird');
var fs = require('fs');
var googleAuth = require('google-auth-library');
var readline = require('readline');
var google = require('googleapis');

var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
	process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

// This is the Script ID needed for Google App scripts
var scriptId = 'MmkF7nOhnoTYjpNZb7M2yyj1bVHqDmvVD';
// THis is the function Google App Scripts should run in the callAppsScript function
var scriptFunction = 'exportSheetForApi';

var GoogleApi = function () {
}

GoogleApi.prototype.listEvents = function (oauth2Client, calendarId) {
	return new Promise(function (resolve, reject) {
	  var calendar = google.calendar('v3');
	  calendar.events.list({
	    auth: oauth2Client,
	    calendarId: calendarId,
	    timeMin: (new Date()).toISOString(),
	    maxResults: 5,
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
				resolve(eventArray);
		    }
		}
	  })
	})	
}

GoogleApi.prototype.callAppsScript = function (oauth2Client, targetedSheet) {
	return new Promise(function (resolve, reject) {
		var script = google.script('v1');
		script.scripts.run({
			auth: oauth2Client,
			resource: {
				function: scriptFunction,
				parameters: [
					targetedSheet
				]
			},
			scriptId: scriptId
		}, function (err, resp) {
			if (err) {
				reject(err);
			}
			else if (resp.error) {
				var error = resp.error.details[0];
				console.log('Script error message: ' + error.errorMessage);
				console.log('Script error stacktrace:');

				if (error.scriptStackTraceElements) {
					for (var i = 0; i < error.scriptStackTraceElements.length; i++) {
						var trace = error.scriptStackTraceElements[i];
						console.log('\t%s: %s', trace.function, trace.lineNumber);
					}
				}
			}
			else {
				var sheetData = JSON.parse(resp.response.result);
				resolve(sheetData);
			}
		})
	});
}
//
GoogleApi.prototype.authAndGet = function () {
	var file = fs.readFileSync(process.cwd()+'/client_secret.json');

	if (!file) {
		console.log('Error loading client secret file: ' + err);
	} else {
		return this.authorize(JSON.parse(file));
	}
}

GoogleApi.prototype.authAndGetEvent = function (target) {
	var that = this;

	return new Promise(function (resolve, reject) {
		that.authAndGet()
			.then(function (oauth2Client) {
				return that.listEvents(oauth2Client, target)
			})
			.then(function (googleResponse) {
				resolve(googleResponse);
			})
			.catch(function (err) {
				reject(err);
			})
	})
}

GoogleApi.prototype.authAndGetSheet = function (target) {
	var that = this;
	return new Promise(function (resolve, reject) {
		that.authAndGet()
			.then(function (oauth2Client) {
				return that.callAppsScript(oauth2Client, target);
			})
			.then(function (googleResponse) {
				resolve(googleResponse);
			})
			.catch(function (err) {
				console.log('catch', err)
				reject(err);
			})
	});
}

GoogleApi.prototype.authorize = function (credentials) {
	return new Promise(function (resolve, reject) {
		var clientSecret = credentials.installed.client_secret;
		var clientId = credentials.installed.client_id;
		var redirectUrl = credentials.installed.redirect_uris[0];
		var auth = new googleAuth();
		var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

		// Check if we have previously stored a token.
		fs.readFile(TOKEN_PATH, function (err, token) {
			if (err) {
				this.getNewToken(oauth2Client).then(function (oauth2Client) {
					oauth2Client.credentials = JSON.parse(token);
				})
					.then(function (oauth2Client) {
						resolve(oauth2Client);
					})
					.catch(function (err) {
						reject(err);
					})
			} else {
				oauth2Client.credentials = JSON.parse(token);
				resolve(oauth2Client);
			}
		})
	})
}

GoogleApi.prototype.getNewToken = function (oauth2Client) {
	return new Promise(function (resolve, reject) {
		var authUrl = oauth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: SCOPES
		});
		console.log('Authorize this app by visiting this url: ', authUrl);
		var rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
		rl.question('Enter the code from that page here: ', function (code) {
			rl.close();
			oauth2Client.getToken(code, function (err, token) {
				if (err) {
					console.log('Error while trying to retrieve access token', err);
					return;
				}
				oauth2Client.credentials = token;
				this.storeToken(token).then(function (oauth2Client) {
					resolve(oauth2Client);
				});
			});
		});
	})
}

GoogleApi.prototype.storeToken = function (token) {
	return new Promise(function (resolve, reject) {
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

module.exports = GoogleApi