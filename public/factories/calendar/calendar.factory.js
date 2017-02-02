dashboard.factory('GoogleCalendar', ['$http', '$q',  function($http, $q) {
    return {
        getCalendarData : function() {
            var deferred = $q.defer();
            $http.get('/api/events')
            .success(function(data) {
                var doubleData = [];
                var visitorArray = [];
                var date = new Date();
                var toDayMonth = date.getMonth() + '/' + date.getDate();

                for(var i = 0; i < data.length; i++) {
                    var attendees = data[i].attendees;
                    var calendarStart = new Date(data[i].start.dateTime);
                    var calendarDay = calendarStart.getMonth() + '/' + calendarStart.getDate();

                    if(toDayMonth.valueOf() == calendarDay.valueOf()) {
                        if(attendees != ''){
                            for(var j = 0; j < attendees.length; j++) {
                                if(attendees[j].email.indexOf('qelp') == 0) {
                                    visitorArray.push(attendees[j]);
                                }
                            }
                        }
                    } 
                }
                doubleData['visitors'] = visitorArray;
                doubleData['data'] = data;
                deferred.resolve(doubleData);
            });
            return deferred.promise;
        }
    }
}]);