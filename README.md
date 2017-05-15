# Kitchen Dashboard Application

Setup and Google API 

Note: ``modules/dayduty.js`` is currently commented out to prevent emails from flying out

## Setup

After pulling run ``npm install`` to get all required modules
Then run ``npm start`` or any equivalent to start the server

## Google API

Lots of functions in this application require information from google to get data, these steps will help get started

### Actual connecting to the API

1. Go to the Google Developers page via this URL: (http://console.developers.google.com)
2. Create a new Project
   1. Go to the Credentials page in the API Manager
   2. Click the 'OAuth consent screen' tab
   3. Select the right email address, and fill in a name (Other stuff is optional)
   4. Save your changes
3. Generate credentials
   1. Go to the main tab on the Credentials page
   2. Click on 'Create credentials' and choose 'OAuth client ID'
   3. Select other on the new page you're directed to and give a name example:'Dashboard API credentials'
   4. Click create
   5. Download the credentials you just Created on the main Credentials page
   6. Save the file in the root(currently) folder and rename it 'client_secret.json'
4. Activate needed API's
   1. Go to the API manager
   2. Click on the Library page
   3. Search for API (Currently: Drive API, Calendar API, Sheets API and the Google+ API)
   4. click ENABLE next to title
   5. Do this for all of them

## Sheets and Apps scripts

At the moment the spreadsheet has three sheets currently, Duties, Birthdays and Activities, to get data from these sheets the Api calls a function in Google Apps Scripts. But you need to link this to the appropriate spreadsheet, here is how.

1. Open your google spreadsheet or create it first
   1. Add the right sheets if you need to
2. Go to Tools > 'Script editor', this will open another page
3. In the editor create a new project via File > New > Project
4. Replace the code in Code.gs with the code in the 'google_apps_scripts.js' file
5. After press the save icon or Cmd + S/Ctrl + S
6. Then go to Publish > 'Deploy as API executable'
   1. The Current API ID is the ID that used in ``src/components/googleApi.js`` as the scriptId variable
7. Fill in a version and press Update
8. Should work as expected now
