angular.module('myApp').factory('emulatorsService', function ($resource, host) {
    return $resource(host + '/api/v1/emulator/:id', {}, {});
});