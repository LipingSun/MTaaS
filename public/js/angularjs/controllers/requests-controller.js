angular.module('myApp').controller('RequestsController', function (requestsService) {
    var ctrl = this;
    ctrl.requests = requestsService.query();
});