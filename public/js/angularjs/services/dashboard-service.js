angular.module('myApp').factory('dashboardService', function ($resource, host) {
    return $resource(host + '/dashboard/:id', {}, {})
});