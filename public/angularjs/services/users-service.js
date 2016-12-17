angular.module('adminApp').factory('usersService', function ($resource, host) {
    return $resource(host + '/api/v1/users/:id', {}, {});
});