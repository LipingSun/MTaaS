angular.module('myApp').factory('devicePoolService', function ($resource, host) {
    return $resource(host + '/api/v2/device/:id', {}, {
        findAllAvailable: {
            method: 'GET',
            params: {'filter[status]': 'available'}
        },
        findAllByOccupant: {
            method: 'GET',
            params: {'filter[status]': 'occupied', 'filter[occupant]': sessionStorage.user}
        },
        update: {
            method: 'PUT'
        }
    });
});