angular.module('myApp').factory('emulatorServiceV2', function ($resource, host) {
    return $resource(host + '/api/v2/emulator/:id', {}, {
        get: {
            method: 'GET',
            params: {'filter[occupant]': sessionStorage.user}
        },
        update: {
            method: 'PUT'
        }
    });
});