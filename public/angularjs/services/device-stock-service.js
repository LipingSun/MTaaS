angular.module('myApp').factory('deviceStockService', function ($resource, host) {
    return $resource(host + '/api/v1/devices-in-stock/:id', {}, {})
});