
dashboard.factory('GetBirthdays', ['$http', '$q', function($http, $q) {
    return {
        getBirthdayData : function() {
            var deferred = $q.defer();
            $http.get('/google/api/birthdays')
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
