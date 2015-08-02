angular.module('myApp').controller('HubsController', ['hubsService', function (hubsService) {

    var ctrl = this;

    ctrl.getAll = function () {
        ctrl.hubs = hubsService.query();
    };

    ctrl.getOne = function (id) {
        ctrl.hub = hubsService.get(id);
    };

    ctrl.create = function (newEmulator) {
        var hub = new hubsService(newEmulator);
        hub.$save();
    };

    ctrl.delete = function (hub) {
        hub.$delete({id: hub.id});
    };

    ctrl.getAll();

}]);