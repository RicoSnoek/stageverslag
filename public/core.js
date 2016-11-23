var dashboard = angular.module('app', ['ngSanitize']);

dashboard.controller('mainController', ['$interval', '$scope', 'DutyData', 'GetFeed', 'GetBirthdays', 'GoogleCalendar', function($interval, $scope, DutyData, GetFeed, GetBirthdays, GoogleCalendar) {

    GetFeed.getFeedData('http://feeds.feedburner.com/TechCrunch/').then(function(res){
        console.log(res.data);
        $scope.feeds = res.data.responseData.feed.entries;
    });

    GoogleCalendar.getCalendarData();


    //GetBirthdays.getBirthdayData();
    DutyData.getDutyData();
    updateDuty = $interval(function() {
        DutyData.getDutyData();
        console.log('Updated');
    }, 36000000);

}]);

dashboard.factory('DutyData', ['$rootScope', '$http', function($scope, $http) {
    return {
        getDutyData : function() {
            $http.get('/temp.json')
            .success(function(data, status, headers, config) {
                var now = new Date();
                console.log(now);
                var today = new Date( now.getFullYear(), now.getMonth(), now.getDate());

                for(var i = 0; i < data.length; i++) {
                    var duty = data[i];
                    duty.date = new Date(duty.date);
                    if (today.valueOf() == duty.date.valueOf()) {
                        var dutyTomorrow = data[i+1];
                        var dutyArray = [];
                        $scope.dutyToday = duty;
                        $scope.dutyTomorrow = dutyTomorrow;
                    }
                    else if(today.valueOf() != duty.date.valueOf() && today.getDay() == 6 || today.getDay() == 0) {
                        var weekendNotice = ' enjoy your weekend';
                        $scope.dutyToday = weekendNotice;

                        var tempDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        if(today.getDay() == 6) {
                            tempDate.setDate(today.getDate() + 2);
                        } else if(today.getDay() == 0) {
                            tempDate.setDate(today.getDate() + 1);
                        }
                        if(tempDate.valueOf() == duty.date.valueOf()){
                            $scope.dutyTomorrow = data[i];
                        }
                    }
                }
            })
            .error(function(data, status, headers, config) {
                console.log('Error: ' + data);
            });
        }
    }
}]);

dashboard.factory('GetFeed', ['$rootScope', '$http', function($scope, $http) {
    return {
        getFeedData : function(url) {
            return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
        }
    }
}]);

dashboard.factory('GetBirthdays', ['$rootScope', '$http', function($scope, $http) {
    return {
        getBirthdayData : function() {
            $http.get('/api/birthdays')
            .success(function(data) {
                var now = new Date();
                var today = new Date( now.getFullYear(), now.getMonth(), now.getDate());
                var toDayMonth = today.getMonth() + '/' + today.getDate();
                var happyPeople = [];

                for(var i = 0; i < data.length; i++) {
                    var birthdate = data[i];
                    birthdate.date = new Date(birthdate.date);
                    var birthday = birthdate.date.getMonth() + '/' + birthdate.date.getDate();
                    console.log(toDayMonth + ' - ' + birthday);
                    if (toDayMonth == birthday) {
                        happyPeople.push(data[i]);
                    }
                    if(i == data.length - 1) {
                        $scope.birthdays = happyPeople;
                    }
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        },
        insertBirthday : function(data) {
            $http.post('/api/birthdays', data)
            .success(function(data) {
                console.log('worked')
            })
            .error(function(data) {
                console.log('Error: ' + data);
            })

        }
    }
}]);

dashboard.factory('GoogleCalendar', ['$http', '$rootScope', function($http, $scope){
    return {
        getCalendarData : function() {
            $http.get('/api/events')
            .success(function(data) {
                console.log(data);
                $scope.events = data;

            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        }
    }
}]);
