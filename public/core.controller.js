dashboard.controller('mainController', ['$interval', '$scope', 'DutyData', 'GetFeed', 'GetSheet','GetBirthdays', 'GoogleCalendar', function($interval, $scope, DutyData, GetFeed, GetSheet,GetBirthdays, GoogleCalendar) {

    GetFeed.getFeedData().then(function(res){
        console.log(res.data);
         $scope.feeds = res.data;
    }).catch(function(err) {
        console.log(err);
    });
    GetSheet.getSheetData().then(function(res) {
        console.log(res);
        $scope.sheet = res;
    }).catch(function(err) {
        console.log(err);
    });

    GoogleCalendar.getCalendarData().then(function(data) {
        console.log(data);
        $scope.events = data.data;
        $scope.visitors = data.visitors;
    }).catch(function(err) {
        console.log(err);
    });
    DutyData.getDutyData().then(function(duty) {
        console.log(duty);
        $scope.duty = duty;
    }).catch(function(err) {
        console.log(err);
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