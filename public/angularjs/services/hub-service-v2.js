angular.module('myApp').factory('hubServiceV2', function ($resource, host) {
    return $resource(host + '/api/v2/hub/:id', {}, {
        get: {
            method: 'GET',
            params: {'filter[occupant]': sessionStorage.user}
        },
        update: {
            method: 'PUT'
        }
    });
});