var express = require('express');
var router = express.Router();


var activitiesRoutes = require('./activities/activities-routes');
var birthdaysRoutes  = require('./birthdays/birthdays-routes');
var calendarRoutes   = require('./calendar/calendar-routes');
var dutiesRoutes     = require('./duties/duties-routes');

router.use('/activities', activitiesRoutes);
router.use('/birthdays',  birthdaysRoutes);
router.use('/calendar',   calendarRoutes);
router.use('/duties',     dutiesRoutes);

module.exports = router;