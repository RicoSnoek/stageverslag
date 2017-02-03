dashboard.factory('GetFeed', ['$http', function($http) {
    return {
        getFeedData : function(url) {
            return $http.get('/api/feed');
        }
    }
}]);