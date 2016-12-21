angular.module('myApp').factory('deviceServiceV2', function ($resource, host) {
    return $resource(host + '/api/v2/device/:id', {}, {
        findAllAvailable: {
            method: 'GET',
            params: {'filter[status]': 'available'}
        },
        findAllByOccupant: {
            method: 'GET',
            params: {'filter[status]': 'occupied', 'filter[occupant]': sessionStorage.user, 'populate': 'hub'}
        },
        update: {
            method: 'PUT'
        },
        attachToHub: {
            method: 'PUT',
            url: '/api/v2/device/:id/hub'
        }
    });
});