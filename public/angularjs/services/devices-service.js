angular.module('myApp').factory('devicesService', function ($resource, host) {
    return $resource(host + '/api/v1/devices/:id', {}, {})
});