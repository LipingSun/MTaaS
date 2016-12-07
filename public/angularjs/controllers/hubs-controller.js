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
        hub.status = 'processing';
        ctrl.hubs.push(hub);
        hub.$save(function (data) {
            hub = data;
        });
    };

    ctrl.delete = function (hub) {
        hub.$delete({id: hub.id});
        ctrl.hubs = ctrl.hubs.filter(function (item) {
            return item !== hub;
        });
    };

    ctrl.getAll();

}]);