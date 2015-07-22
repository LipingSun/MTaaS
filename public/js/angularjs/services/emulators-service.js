angular.module('myApp').factory('emulatorsService', function ($resource, host) {
    return $resource(host + '/emulators/:id', {}, {})
});