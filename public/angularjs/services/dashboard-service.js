angular.module('myApp').factory('dashboardService', function ($resource, host) {
    return $resource(host + '/api/v1/dashboard/:id', {}, {})
});