angular.module('myApp').factory('testServiceV2', function ($resource, host) {
    return $resource(host + '/api/v2/test/:id', {}, {
        get: {
            method: 'GET',
            params: {'filter[occupant]': sessionStorage.user, 'filter[status]': 'occupied'}
        },
        update: {
            method: 'PUT'
        },
        findAvailable: {
            method: 'GET',
            params: {'filter[status]': 'available'}
        }
    });
});