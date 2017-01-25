var dashboard = angular.module('app', ['ngSanitize']);

dashboard.controller('mainController', ['$interval', '$scope', 'DutyData', 'GetFeed', 'GetSheet','GetBirthdays', 'GoogleCalendar', function($interval, $scope, DutyData, GetFeed, GetSheet,GetBirthdays, GoogleCalendar) {

    GetFeed.getFeedData().then(function(res){
        console.log(res.data);
         $scope.feeds = res.data;
    }).catch(function(res){
        console.log(res);
    });
    GetSheet.getSheetData().then(function(res) {
        console.log(res);
        $scope.sheet = res;
    }).catch(function(res) {
        console.log(res);
    })

    GoogleCalendar.getCalendarData().then(function(data) {
        console.log(data.data);
        $scope.events = data.data;
    }).catch(function(err) {
        console.log(err);
    });
    DutyData.getDutyData().then(function(duty) {
        console.log(duty);
        $scope.duty = duty;
    }).catch(function() {
        console.log('Error');
    });

    GetBirthdays.getBirthdayData().then(function(birthdays) {
        if(birthdays != null) {
            $scope.birthdays = birthdays; 
        }

    }).catch(function(err) {
        console.log(err);
    });

    // updateDuty = $interval(function() {
    //     DutyData.getDutyData();
    //     console.log('Updated');
    // }, 36000000);


}]);

dashboard.factory('GetFeed', ['$http', function($http) {
    return {
        getFeedData : function(url) {
            return $http.get('/api/techcrunch');

        }
    }
}]);

dashboard.factory('GetSheet', ['$http', '$q',  function($http, $q) {
    return {
        getSheetData : function(url) {
            var deferred = $q.defer();
            $http.get('/api/sheet')
            .success(function(data) {
                var now = new Date();
                var today = new Date( now.getFullYear(), now.getMonth(), now.getDate());
                var miscData = [];

                for (var i = 0; i < data.length; i++) {
                    data[i].date = new Date(data[i].date);
                    if(data[i].date.valueOf() == today.valueOf()) {
                         miscData.push(data[i]);
                    }
                }
                deferred.resolve(miscData);
            })
            return deferred.promise;
        }
    }
}]);

dashboard.factory('GetBirthdays', ['$http', '$q', function($http, $q) {
    return {
        getBirthdayData : function() {
            var deferred = $q.defer();
            $http.get('/api/birthdays')
            .success(function(data) {
                var now = new Date();
                var today = new Date( now.getFullYear(), now.getMonth(), now.getDate());
                var toDayMonth = today.getMonth() + '/' + today.getDate();
                var birthdayList = [];

                for(var i = 0; i < data.length; i++) {
                    var birthdate = data[i];
                    birthdate.date = new Date(birthdate.date);
                    var birthday = birthdate.date.getMonth() + '/' + birthdate.date.getDate();
                    if (toDayMonth == birthday) {
                        birthdayList.push(data[i]);
                    }
                }
                deferred.resolve(birthdayList);
            })
            .error(function(data) {
                console.log('Rejected');
                deferred.reject(data);
            });
            return deferred.promise;
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

dashboard.factory('GoogleCalendar', ['$http', function($http){
    // TODO: Show displayName if not available email instead
    return {
        getCalendarData : function() {
            return $http.get('/api/events');
        },
        getDisplayName: function(attendee) {
            return attendee.displayName ? attendee.displayName : attendee.email;
        }
    }
}]);
dashboard.factory('DutyData', ['$http', '$q', function($http, $q) {
    return {
        getDutyData : function() {
            var deferred = $q.defer();
            $http.get('/api/drive')
            .success(function(data) {
                var now = new Date();
                var today = new Date( now.getFullYear(), now.getMonth(), now.getDate());
                var activeDuty = new Object();

                for (var i = 0; i < data.length; i++) {
                    var duty = data[i];
                    duty.date = new Date(duty.date);
                    if (today.valueOf() == duty.date.valueOf()) {
                        var dutyTomorrow = data[i+1];
                        var dutyArray = [];
                        activeDuty.today = duty;
                        activeDuty.tomorrow = dutyTomorrow;
                    } else {
                        if (today.getDay() == 6 || today.getDay() == 0) {
                            var weekendNotice = ' enjoy your weekend';
                            activeDuty.today = weekendNotice;

                            var tempDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                            if (today.getDay() == 6) {
                                tempDate.setDate(today.getDate() + 2);
                            } else if (today.getDay() == 0) {
                                tempDate.setDate(today.getDate() + 1);
                            }
                            if (tempDate.valueOf() == duty.date.valueOf()){
                                activeDuty.tomorrow = data[i];
                            }
                        }
                    }
                }
                deferred.resolve(activeDuty);
            })
            .error(function(data, status, headers, config) {
                console.log('Error: ' + data);
                deferred.reject("Data fail");
            });
            return deferred.promise;
        }
    }
}]);

