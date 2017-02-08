dashboard.controller('mainController', ['$interval', '$scope', 'DutyData', 'GetFeed', 'GetSheet','GetBirthdays', 'GoogleCalendar', function($interval, $scope, DutyData, GetFeed, GetSheet,GetBirthdays, GoogleCalendar) {

    var getAllFeedData = function() {
        GetFeed.getFeedData().then(function(res){
            console.log(res.data);
             $scope.feeds = res.data;
        }).catch(function(err) {
            console.log(err);
        });
    }
    var getAllSheetData = function() {
        GetSheet.getSheetData().then(function(res) {
            console.log(res);
            $scope.sheet = res;
        }).catch(function(err) {
            console.log(err);
        });
    }
    var getAllCalendarData = function() {
        GoogleCalendar.getCalendarData().then(function(data) {
            console.log(data);
            $scope.events = data.data;
            $scope.visitors = data.visitors;
        }).catch(function(err) {
            console.log(err);
        });
    }
    var getAllDutyData = function(){
        DutyData.getDutyData().then(function(duty) {
            console.log(duty);
            $scope.duty = duty;
        }).catch(function(err) {
            console.log(err);
        });
    }

    var getAllBirthdayData = function() {
        GetBirthdays.getBirthdayData().then(function(birthdays) {
            if(birthdays != null) {
                $scope.birthdays = birthdays; 
            }
        }).catch(function(err) {
            console.log(err);
        });
    }

    getAllFeedData();
    getAllSheetData();
    getAllCalendarData();
    getAllDutyData();
    getAllBirthdayData();

    updateData = $interval(function() {
        getAllFeedData();
        getAllSheetData();
        getAllCalendarData();
        getAllDutyData();
        getAllBirthdayData();
    }, 600 * 1000);

}]);