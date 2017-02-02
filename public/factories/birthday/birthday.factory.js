dashboard.factory('GetBirthdays', ['$http', '$q', function($http, $q) {
    return {
        getBirthdayData : function() {
            var deferred = $q.defer();
            $http.get('/api/google/birthdays')
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
                deferred.reject(data);
            });
            return deferred.promise;
        }
    }
}]);
