angular.module('adminApp').factory('requestsService', function ($resource, host) {
    return $resource(host + '/api/v1/requests/:id', {}, {});
});