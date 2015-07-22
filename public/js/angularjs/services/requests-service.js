angular.module('myApp').factory('requestsService', function ($resource, host) {
    return $resource(host + '/requests/:id', {}, {})
});