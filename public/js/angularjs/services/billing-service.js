angular.module('myApp').factory('billingService', function ($resource, host) {
    return $resource(host + '/api/v1/billing/:id', {}, {})
});