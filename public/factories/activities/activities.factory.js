dashboard.factory('GetSheet', ['$http', '$q',  function($http, $q) {
    return {
        getSheetData : function(url) {
            var deferred = $q.defer();
            $http.get('/api/google/activities')
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