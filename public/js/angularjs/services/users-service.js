angular.module('myApp').factory('usersService', function ($resource, host) {
    return $resource(host + '/users/:id', {}, {})
});