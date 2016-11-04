var dutyModule = angular.module('app', ['ngSanitize']);

dutyModule.controller('mainController', ['$interval', '$scope', 'DutyData', 'GetFeed', function($interval, $scope, DutyData, GetFeed) {

    GetFeed.getFeedData('http://feeds.feedburner.com/TechCrunch/').then(function(res){
        console.log(res.data);
        $scope.feeds = res.data.responseData.feed.entries;
    });

    DutyData.getDutyData();
    updateDuty = $interval(function() {
        DutyData.getDutyData();
        console.log('Updated');
    }, 36000000);

}]);

dutyModule.factory('DutyData', ['$rootScope', '$http', function($scope, $http) {
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

dutyModule.factory('GetFeed', ['$rootScope', '$http', function($scope, $http) {
    return {
        getFeedData : function(url) {
            return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
        }
    }
}]);