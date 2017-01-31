dashboard.factory('DutyData', ['$http', '$q', function($http, $q) {
    return {
        getDutyData : function() {
            var deferred = $q.defer();
            $http.get('/api/duties')
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