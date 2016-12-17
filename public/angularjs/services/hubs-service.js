angular.module('myApp').factory('hubsService', function ($resource, host) {
    return $resource(host + '/api/v1/hubs/:id', {}, {});
});