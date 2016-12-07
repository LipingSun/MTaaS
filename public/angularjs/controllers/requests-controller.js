angular.module('adminApp').controller('RequestsController', function (requestsService) {
    var ctrl = this;
    ctrl.requests = requestsService.query();
});