angular.module('myApp').factory('billingService', function ($resource, host) {
    return $resource(host + '/billing/:id', {}, {})
});