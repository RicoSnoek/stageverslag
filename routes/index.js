var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});

// var dayDuty = require('../modules/dayduty');	
// dayDuty.getTodaysDuty(function(data) {
// 	console.log(data);
// 	router.get('/', function(req, res, next) {
// 		res.render('index', { title: 'Dashboard', date: '14/10/2016', name: data[0].name, nameTomorrow: data[1].name });
// 	});	
// })

module.exports = router;