//Not used
var exports = module.exports = {};

	var Promise = require('bluebird');
	var fs = require('fs');
	var readline = require('readline');
	var google = require('googleapis');
	var googleAuth = require('google-auth-library');
	var authAndGetMiddleware = require('../src/middleware/AuthAndGetMiddleware');
	
	// If modifying these scopes, delete your previously saved credentials
	// at ~/.credentials/calendar-nodejs-quickstart.json
	var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets'];
	var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
	    process.env.USERPROFILE) + '/.credentials/';
	var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';


exports.connectGoogleCalendar = function(app) {
	app.get('/api/events', function(req, nres) {
		authAndGet('primary', 'events')
			.then(function(googleResponse) {
				console.log(googleResponse);
				nres.status(200).json(googleResponse);
			})
			.catch(function(err) {
				console.log(err);
			});	
	});
}

exports.getsheetsData = function(app) {

	app.get('/api/duties/', function(req, nres) {	
		authAndGet('Duties', 'sheet')
			.then(function(googleResponse) {
				nres.status(200).json(googleResponse);
			})
			.catch(function(err) {
				console.log(err);
			});		
	});

	app.get('/api/sheet/', function(req, nres) {	
		authAndGet('Activities', 'sheet')
			.then(function(googleResponse) {
				nres.status(200).json(googleResponse);
			})
			.catch(function(err) {
				console.log(err);
			});			
	});

	app.get('/api/birthdays/', authAndGetMiddleware.getMiddleware('Birthdays', 'sheet'), function(req, nres) {	
		nres.status(200).json(req.googleResponse);
		// authAndGet('Birthdays', 'sheet')
		// 	.then(function(googleResponse) {
				//nres.status(200).json(googleResponse);
			// })
			// .catch(function(err) {
			// 	console.log(err);
			// });		
	});
}

exports.sheetData = function() {
	return new Promise(function(resolve, reject) {
		authAndGet('Duties', 'sheet')
			.then(function(googleResponse) {
				resolve(googleResponse);
			})
			.catch(function(err) {
				console.log(err);
			});				
	})
};


/*
* Authorizes and get chosen sheet/events from api
*/
function authAndGet(target ,type) {
	return new Promise(function(resolve, reject) {
		fs.readFile('client_secret.json', function(err, content) {
			if (err) {
		    	console.log('Error loading client secret file: ' + err);
		    	return;
			}
		
			authorize(JSON.parse(content))
				.then(function(oauth2Client) {
					if(type == 'events'){
						return listEvents(oauth2Client, target)
					} else if(type == 'sheet') {
						return callAppsScript(oauth2Client, target);
					}
				})
				.then(function(googleResponse) {
					resolve(googleResponse);
				})
				.catch(function(err) {
					reject(err);
				})
		});
	})		
}


/*
* Authorizes Google api token
*/
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
		    	})
		    	.then(function(oauth2Client) {
		    		resolve(oauth2Client);
		    	})
		    	.catch(function(err) {
		    		reject(err);
		    	})
		    } else {
    			oauth2Client.credentials = JSON.parse(token);
				resolve(oauth2Client);
	    	}
		})
	})
}

/*
* Generate a new token for Google api credentials
*/
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

/*
* Stores the token in credentials file
*/
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

/*
* Lists events in a get request from a google calendar
*/
function listEvents(oauth2Client, calendarId) {
	return new Promise(function(resolve, reject) {
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

/*
* Runs chosen function from GoogleAppScripts
*/
function callAppsScript(oauth2Client, targetedSheet) {
	return new Promise(function(resolve, reject) {
		var scriptId = 'MmkF7nOhnoTYjpNZb7M2yyj1bVHqDmvVD';
		var script = google.script('v1');
		script.scripts.run({
			auth: oauth2Client,
			resource: {
				function: 'exportSheetForApi',
				parameters: [
					targetedSheet
				]
			},
			scriptId: scriptId
		}, function(err, resp) {
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