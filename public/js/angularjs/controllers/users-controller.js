angular.module('myApp').controller('UsersController', function (usersService) {
    var ctrl = this;
    ctrl.users = usersService.query();
});